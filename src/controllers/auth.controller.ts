import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
 
import { createUserInput } from "../schemas/user.schema";
import { ZodError } from "zod";

const prisma = new PrismaClient()
const JWT = process.env.JWT_KEY


 

export default async function register(req: Request<{},createUserInput>, res: Response) {

     
    try {
        const { name, email, password } = req.body

        const exist = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if(exist){
            return res.status(409).json({message:"user exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        return res.status(200).json({ user })

    } catch (error) {
        
        return res.status(500).json("internal server error")
    }
}


async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(400).json({ "message": "user does not exist" });
        }

        const result = await bcrypt.compare(password, user.password)

        if (!result) {
            return res.status(400).json({ "message": "wrong password" })
        }

        const token = jsonwebtoken.sign({
            userId: user.id,
            email: user.email,
            name: user.name,
        }, JWT!)

        return res.status(200).json(token)

    } catch (error) {
        return res.status(500).json(error)

    }

}

export { login }