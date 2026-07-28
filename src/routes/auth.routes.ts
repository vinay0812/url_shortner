import { Response, Router } from "express";
import register, { login } from "../controllers/auth.controller";
import validateBody from "../middlewares/validate.middleware";
import {  userSchema } from "../schemas/user.schema";

const authRouter = Router()
 
authRouter.post('/register',validateBody(userSchema),register)
authRouter.post('/login',login)

export default authRouter;