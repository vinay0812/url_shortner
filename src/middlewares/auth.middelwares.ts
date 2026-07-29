import { Request, Response, NextFunction } from "express";
import jsonwebtoken from 'jsonwebtoken'
import { JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_KEY

// extend jwtpayload to include user data
interface UserPayLoad extends JwtPayload {
    userId: number
    name: string
    email: string
}


export default async function auth(req: Request, res: Response, next: NextFunction) {

    try {

        const token = req.header("Authorization")?.replace('Bearer ', '')

        if (!token) {
            throw new Error()
        }
        // return res.send(token)
        const decode = jsonwebtoken.verify(token, secret!) as UserPayLoad
        req.user = decode;
        next()
    } catch (error) {
        return res.status(401).send('authentication failed')
    }

}