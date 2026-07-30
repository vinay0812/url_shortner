import express from "express";
import shortenerRouter from "./routes/shortener.routes";
import authRouter from "./routes/auth.routes";
 
import rateLimit from "express-rate-limit";
import "./config/redis";

const app = express()

app.set("trust proxy", 1);

const port = process.env.PORT || 3000

// for rate limmiting
const rateLimiter = rateLimit({
    windowMs:60000,
    limit:5,
    message:'Too Many requests, try again after some time'
})

// app.use(rateLimiter);

app.use(express.json())

app.get('/health',(req,res)=>{
    
    return  res.status(200).json("ok")
})

app.use('/auth',rateLimiter,authRouter)
app.use('/shorten',shortenerRouter)

app.listen(port,()=>{
    console.log(`server is running at port ${port}`)
})
