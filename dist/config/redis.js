"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
// for local (docker redis)
// const redis = new Redis({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: parseInt(process.env.REDIS_PORT || '6379'),
//     ...(process.env.REDIS_PASSWORD
//     ? { password: process.env.REDIS_PASSWORD }
//     : {}),
// })
const redis = new ioredis_1.default(process.env.REDIS_URL);
redis.on('connect', () => console.log('redis connected'));
redis.on('error', (err) => console.log('Redis error: ', err));
exports.default = redis;
//# sourceMappingURL=redis.js.map