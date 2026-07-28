import Redis from "ioredis";

// for local (docker redis)

// const redis = new Redis({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: parseInt(process.env.REDIS_PORT || '6379'),
//     ...(process.env.REDIS_PASSWORD
//     ? { password: process.env.REDIS_PASSWORD }
//     : {}),
// })

const redis = new Redis(process.env.REDIS_URL);


redis.on('connect',()=> console.log('redis connected'))
redis.on('error',(err)=>console.log('Redis error: ',err))

export default redis