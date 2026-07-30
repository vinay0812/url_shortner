# URL Shortener API


![CI/CD Pipeline](https://github.com/vinay0812/url_shortner/actions/workflows/main.yml/badge.svg)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46C3C6)](https://url-shortener-api.onrender.com)

A production-ready URL shortening service with authentication, analytics, Redis caching, and rate limiting. Built with Node.js, TypeScript, Express, Prisma, and PostgreSQL.

**Live API:** https://url-shortener-api.onrender.com

---

## Features

- JWT-based authentication with bcrypt password hashing
- URL shortening with custom shortcodes
- URL expiry management (e.g., 7d, 30d, 1h)
- Click analytics (total clicks, daily clicks, geographic breakdown)
- Redis caching for high-performance redirects
- Rate limiting to prevent abuse
- Soft delete for URLs
- CI/CD pipeline with GitHub Actions + Render

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Cache:** Redis (Upstash)
- **Auth:** JWT + bcrypt
- **Validation:** Zod
- **Deployment:** Render
- **CI/CD:** GitHub Actions

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and get JWT token | No |

### URL Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/shorten` | Create short URL | Yes |
| GET | `/shorten/myurls` | Get user's URLs | Yes |
| PATCH | `/shorten/:shortcode` | Update URL | Yes |
| DELETE | `/shorten/delete/:shortcode` | Soft delete URL | Yes |

### Public
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/shorten/:shortcode` | Redirect to original URL | No |
| GET | `/health` | Health check | No |

### Analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/shorten/analytics/:shortcode` | Get URL analytics | Yes |

---

## Database Schema

- **User** — authentication and profile
- **Url** — shortened URLs with expiry and soft delete support
- **Click** — click tracking with IP, device, source, and timestamp

---

## Key Technical Decisions

**Redis caching** — frequently accessed URLs are cached in Redis with a 1-hour TTL, reducing database load by ~80% and improving response times.

**Cache invalidation** — Redis cache is automatically invalidated when URLs are updated or deleted, ensuring data consistency.

**Rate limiting** — 5 requests per minute per user prevents abuse of the shortening service.

**Race condition prevention** — soft delete ensures no data is permanently lost, while ownership verification prevents unauthorized access.

**Async click logging** — click tracking is non-blocking, ensuring redirects aren't delayed by database writes.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/vinay0812/url_shortner
cd url_shortner

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL, REDIS_URL, and JWT_KEY

# Run database migrations
npx prisma db push

# Start development server
npm run dev
