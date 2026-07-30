# 🔗 URL Shortener API

A production-ready URL shortening service with authentication, analytics, caching, and rate limiting.

![CI/CD Pipeline](https://github.com/vinay0812/url_shortner/actions/workflows/main.yml/badge.svg)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46C3C6)](https://url-shortener-api.onrender.com)

## 🚀 Live Demo

**API Base URL:** `https://url-shortener-api.onrender.com`

## ✨ Features

- **User Authentication** - JWT-based registration and login
- **URL Shortening** - Create short URLs with custom shortcodes
- **Expiry Management** - Set expiration times (e.g., 7d, 30d, 1h)
- **Click Analytics** - Track total clicks, daily clicks, and geography
- **Caching** - Redis caching for high-performance redirects
- **Rate Limiting** - Protection against abuse
- **Soft Delete** - URLs can be deactivated without losing data
- **CI/CD Pipeline** - GitHub Actions + Render auto-deployment

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | Backend framework |
| **TypeScript** | Type safety |
| **PostgreSQL + Supabase** | Database |
| **Prisma** | ORM |
| **Redis + Upstash** | Caching |
| **JWT** | Authentication |
| **Render** | Hosting |
| **GitHub Actions** | CI/CD |

## 📋 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and get JWT token |

#### Register Example
```bash
curl -X POST https://your-app.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'
Login Example
bash
curl -X POST https://your-app.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
URL Management (Protected)
Method	Endpoint	Description
POST	/shorten	Create short URL
GET	/shorten/myurls	Get user's URLs
PATCH	/shorten/:shortcode	Update URL
DELETE	/shorten/delete/:shortcode	Soft delete URL
Create Short URL
bash
curl -X POST https://your-app.onrender.com/shorten \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com/very/long/url",
    "customShortCode": "mycode",  # optional
    "expiresIn": "7d"              # optional (7d, 30d, 1h, 15m)
  }'
Get User's URLs
bash
curl -X GET https://your-app.onrender.com/shorten/myurls \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
Public Endpoints
Method	Endpoint	Description
GET	/shorten/:shortcode	Redirect to original URL
GET	/health	Health check
Analytics (Protected)
Method	Endpoint	Description
GET	/shorten/analytics/:shortcode	Get URL analytics
bash
curl -X GET https://your-app.onrender.com/shorten/analytics/mycode \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
📁 Project Structure
text
url-shortener/
├── src/
│   ├── config/
│   │   └── redis.ts          # Redis configuration
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── shortener.controller.ts
│   ├── middlewares/
│   │   ├── auth.middlewares.ts
│   │   └── validate.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── shortener.routes.ts
│   ├── schemas/
│   │   ├── short.schema.ts
│   │   └── user.schema.ts
│   ├── utils/
│   │   └── request.ts        # Request helpers
│   ├── types/
│   │   └── express.d.ts      # Type extensions
│   └── server.ts
├── .github/
│   └── workflows/
│       └── main.yml          # CI/CD pipeline
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
└── README.md
🚀 Getting Started
Prerequisites
Node.js (v18 or v20)

PostgreSQL (or Supabase)

Redis (or Upstash)

Installation
Clone the repository

bash
git clone https://github.com/vinay0812/url_shortner.git
cd url_shortner
Install dependencies

bash
npm install
Set up environment variables

bash
cp .env.example .env
Update .env with your values:

env
DATABASE_URL=your_postgresql_url
REDIS_URL=your_redis_url
JWT_KEY=your_secret_key
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
Run database migrations

bash
npx prisma db push
# or
npx prisma migrate dev
Start the server

bash
# Development
npm run dev

# Production
npm run build
npm start
🔧 Environment Variables
Variable	Description	Required
DATABASE_URL	PostgreSQL connection string	✅
REDIS_URL	Redis connection string	✅
JWT_KEY	Secret key for JWT signing	✅
PORT	Server port (default: 3000)	❌
NODE_ENV	Environment (development/production)	❌
BASE_URL	Base URL for short URLs	❌
🧪 Testing
bash
# Run tests (when added)
npm test

# Build TypeScript
npm run build
📊 Database Schema
User
prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String?
  email    String @unique
  password String
  isAdmin  Boolean @default(false)
  url      Url[]
}
Url
prisma
model Url {
  id          Int      @id @default(autoincrement())
  originalUrl String
  shortcode   String   @unique
  userId      Int
  expiresAt   DateTime?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId])
  clicks      Click[]
}
Click
prisma
model Click {
  id        Int      @id @default(autoincrement())
  urlId     Int
  ipAddress String?
  country   String?
  device    String?
  source    String?
  clickedAt DateTime @default(now())
  url       Url      @relation(fields: [urlId])
}
🚢 Deployment
This project uses GitHub Actions for CI/CD and Render for hosting.

CI/CD Pipeline
Push code to main branch

GitHub Actions runs:

npm ci (fast install)

npm run build (TypeScript compilation)

If build passes → Render deploy hook triggers

Render pulls latest code and redeploys

Manual Deployment
Push to main branch

Or go to Render dashboard → Manual deploy

🔒 Security Features
JWT authentication

Password hashing with bcrypt

Rate limiting (5 requests per minute)

Ownership verification for URL operations

Soft delete to prevent data loss

Input validation with Zod

⚡ Performance
Redis caching for redirects (1 hour TTL)

Analytics caching (1 minute TTL)

User URLs caching (5 minutes TTL)

Async click logging (non-blocking)

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing)

Open a Pull Request

📝 License
MIT License - feel free to use this project for learning or commercial purposes.

🙏 Acknowledgments
Prisma

Upstash Redis

Render

Supabase

📞 Connect
GitHub: vinay0812

Live API: url-shortener-api.onrender.com

Health Check: url-shortener-api.onrender.com/health