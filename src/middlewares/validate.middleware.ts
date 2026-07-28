import { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";

export default function validateBody<T extends z.ZodTypeAny>(schema:T){
    return(req:Request,res:Response,next:NextFunction)=>{

        try {
            req.body  = schema.parse(req.body);
            next()
            
        } catch (error) {
            if(error instanceof ZodError){
                return res.status(400).json({
                    message:"validation errors",
                    error:error.flatten().fieldErrors
                })
            }
            
        }
    }
}