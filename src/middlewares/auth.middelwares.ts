import { Request, Response,NextFunction } from "express";
import jsonwebtoken from 'jsonwebtoken'

const secret = process.env.JWT_KEY
export default async function auth(req:Request,res:Response,next:NextFunction) {

    try {
        
        const token = req.header("Authorization")?.replace('Bearer ','')
        
        if(!token ){
            throw new Error()
        }
        // return res.send(token)
        const decode = jsonwebtoken.verify(token,secret!)
        req.user = decode;
        next()
    } catch (error) {
        return res.status(401).send('authentication failed')
    }
    
}