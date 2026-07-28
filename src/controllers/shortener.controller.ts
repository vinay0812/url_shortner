import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { PrismaClient } from "@prisma/client"
import { createShortUrl } from "../schemas/short.schema";

import redis from "../config/redis";


const prisma = new PrismaClient()

// short the url
export default async function short(req: Request, res: Response) {
    try {

        // return res.send(req.user.userId)

        const { userId, name, email } = req.user

        const { originalUrl, customShortCode, expiresIn } = req.body



        // for custom url 
        let shortcode = customShortCode

        const reservedWords = ['myurls', 'analytics', 'delete']
        if (reservedWords.includes(shortcode)) {
            return res.status(400).json({ message: "this shortcode is reserved" })
        }


        if (shortcode) {
            const exist = await prisma.url.findUnique({
                where: {
                    shortcode: shortcode
                }
            })

            if (exist) {
                return res.status(400).json({ "message": "this shortcode already taken" })
            }

        } else {
            shortcode = nanoid(10);
        }

        let expiresAt: Date | null = null
        // for expiresat
        if (expiresIn) {
            const duration = expiresIn
            const value = parseInt(duration.slice(0, -1))
            const unit = duration.slice(-1)

            expiresAt = new Date()

            switch (unit) {


                case ('w'): expiresAt.setDate(expiresAt.getDate() + value * 7); break
                case ('d'): expiresAt.setDate(expiresAt.getDate() + value); break
                case ('h'): expiresAt.setHours(expiresAt.getHours() + value); break
                case ('m'): expiresAt.setMinutes(expiresAt.getMinutes() + value); break
                default: expiresAt = null

            }
        }

        const shorturl = await prisma.url.create({
            data: {
                originalUrl,
                shortcode: shortcode,
                userId,
                expiresAt: expiresAt
            }
        })

        // userurl cache invalidation
        await redis.unlink(`userurl:${userId}`)
        // return res.send(originalUrl)

        return res.status(201).json({
            shorturl: `http://localhost:3000/shorten/${shortcode}`,
            originalUrl
        })
    } catch (error) {
        return res.status(500).json({ message: error })
    }

}

// redirect and click
async function geturl(req: Request, res: Response) {

    try {
        const shortCode = req.params.shortcode

        // check redis

        const cached = await redis.get(`url:${shortCode}`)
        if (cached) {
            const data = JSON.parse(cached)

            if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
                await redis.unlink(`url:${shortCode}`);
                return res.status(404).json({ message: "shortcode expired" })
            }
            res.redirect(data.originalUrl)

            logClick(data.id, req).catch(console.error);

            return;
            // return res.send('cached')

        }

        const shortUrl = await prisma.url.findUnique({
            where: {
                shortcode: shortCode,

                isActive: true
            }

        })

        if (!shortUrl) {
            return res.status(404).json({ message: "shortcode not found" })
        }

        // expiresat check

        if (shortUrl.expiresAt !== null && shortUrl.expiresAt < new Date()) {
            return res.status(404).json({ message: "shortcode is expired" })

        }

        // set cache

        // await redis.setex(`url:${shortCode}`, 3600, JSON.stringify({
        //     originalUrl: shortUrl.originalUrl,
        //     id: shortUrl.id
        // }))

        try {
            await redis.set(`url:${shortCode}`, JSON.stringify({
                originalUrl: shortUrl.originalUrl,
                id: shortUrl.id,
                expiresAt: shortUrl.expiresAt
            }), "EX", 3600)

        } catch (error) {
            console.log('redis error: ', error)
        }

        const click = await logClick(shortUrl.id, req).catch(console.error);
        res.redirect(shortUrl.originalUrl)
        // return res.send(cached)

        return;
    } catch (error) {
        return res.status(500).json({ message: error })

    }
}

// helper function for adding the clicks
async function logClick(urlId: number, req: Request) {
    return prisma.click.create({
        data: {
            urlId,
            ipAddress: req.ip,
            source: req.headers.referer || "direct",
            device: req.headers["user-agent"] as string,
        }
    });
}



// analytics

async function analytics(req: Request, res: Response) {

    try {
        const { userId } = req.user

        const shortCode = req.params.shortcode

        // checking cache first
        const cached = await redis.get(`analytics:${shortCode}`)
        if (cached) {
            const data = JSON.parse(cached)

            return res.status(200).json(data);

        }

        // check if exists
        const shortUrl = await prisma.url.findUnique({
            where: {
                shortcode: shortCode,
                userId: userId
            }

        })

        if (!shortUrl) {
            return res.status(404).json({
                message: "URL not found or you don't have access"
            })
        }


        // total clicks
        const totalClicks = await prisma.click.count({
            where: {
                urlId: shortUrl.id
            }
        })


        const clicksPerDay = await prisma.$queryRaw`
            SELECT 
                DATE("clickedAt") as date,
                COUNT(*)::int as clicks
            FROM "Click"
            WHERE "urlId" = ${shortUrl.id}
            GROUP BY DATE("clickedAt")
            ORDER BY date DESC
        `;

        const clicksPerCountry = await prisma.click.groupBy({
            by: ['country'],
            _count: { country: true },
        });

        // adding cache
        try {
            await redis.set(`analytics:${shortCode}`, JSON.stringify({
                totalClicks, clicksPerDay, clicksPerCountry
            }), 'EX', 60)
        } catch (error) {
            console.log('redis error: ', error)
        }

        return res.status(200).json({ totalClicks, clicksPerDay, clicksPerCountry })

    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }

}

// my urls

async function getUserUrls(req: Request, res: Response) {

    try {

        const { name, email, userId } = req.user
        const isUserExist = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!isUserExist) {
            return res.status(400).json({ "message": "user does not exist" })
        }

        const cached = await redis.get(`userurl:${userId}`)
        if (cached) {
            return res.status(200).json(JSON.parse(cached))
        }

        const urls = await prisma.url.findMany({
            where: {
                userId: userId
            },
            include: {
                _count: {
                    select: { clicks: true }
                }
                // Includes all click 
            },

        })

        if (!urls) {
            return res.status(400).json({ "message": "user does not have shorturls" })

        }

        try {

            await redis.set(`userurl:${userId}`, JSON.stringify(urls), 'EX', 300)
        } catch (error) {
            console.log('redis error: ', error)
        }

        return res.status(200).json(urls)
    } catch (error) {
        return res.status(500).json({ error })
    }

}

// update url 

async function updateUrl(req: Request, res: Response) {
    try {

        const { name, email, userId } = req.user
        const { originalUrl, expiresIn, isActive } = req.body


        const shortCode = req.params.shortcode

        const url = await prisma.url.findUnique({
            where: {
                shortcode: shortCode
            }
        })

        if (!url) {
            return res.status(400).json({ "error": "shortcode does not exist" })
        }

        if (url.userId !== userId) {
            return res.status(403).json({ "error": "you are not authorized" })

        }

        // invalidated cache

        // url 
        await redis.unlink(`url:${shortCode}`)

        // userurl
        await redis.unlink(`userurl:${userId}`)

        const data: any = {};

        if (originalUrl !== undefined) data.originalUrl = originalUrl

        if (isActive !== undefined) data.isActive = isActive

        let expiresAt: Date | null = null

        // for expiresat
        if (expiresIn) {
            const duration = expiresIn
            const value = parseInt(duration.slice(0, -1))
            const unit = duration.slice(-1)

            expiresAt = new Date()

            switch (unit) {


                case ('w'): expiresAt.setDate(expiresAt.getDate() + value * 7); break
                case ('d'): expiresAt.setDate(expiresAt.getDate() + value); break
                case ('h'): expiresAt.setHours(expiresAt.getHours() + value); break
                case ('m'): expiresAt.setMinutes(expiresAt.getMinutes() + value); break
                default: expiresAt = null

            }
        }

        if (expiresIn !== undefined) data.expiresAt = expiresAt

        // return res.json({prevurl,prevexpires,prevactive})

        const updated = await prisma.url.update({
            where: {
                shortcode: shortCode
            },
            data: data
        })

        return res.status(203).json({ 'message': "update" })

    } catch (error) {
        return res.status(400).json(error)

    }

}

// delete particular url

async function deleteUrl(req: Request, res: Response) {

    try {

        // return res.send(req.user);

        const { name, email, userId } = req.user

        const shortCode = req.params.shortcode

        const url = await prisma.url.findFirst({
            where: {
                shortcode: shortCode
            }
        })

        if (!url) {
            return res.status(400).json({ "error": "shortcode does not exist" })
        }

        if (url.userId !== userId) {
            return res.status(400).json({ "error": "you are not authorized" })

        }

        await prisma.url.update({
            where: {
                shortcode: shortCode
            },
            data: {
                isActive: false
            }
        })

        // cache invalidation

        await redis.unlink(`url:${shortCode}`)
        // userurl
        await redis.unlink(`userurl:${userId}`)


        return res.status(200).json({ "message": "shortcode deleted" })

    } catch (error) {
        return res.status(400).json(error)

    }
}

export { geturl, analytics, getUserUrls, deleteUrl, updateUrl }