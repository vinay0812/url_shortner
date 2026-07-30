declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REDIS_URL: string;
            DATABASE_URL: string;
            JWT_KEY: string;
            PORT: string;
            BASE_URL:string;
        }
    }
}

export {};