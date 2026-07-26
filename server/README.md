# Uniquworld API Server

Production-ready Node.js / Express backend for the Uniquworld eCommerce platform.

## Stack

- Node.js + Express.js (JavaScript)
- Supabase PostgreSQL (`pg` pool)
- JWT access + refresh tokens
- Supabase Storage + Sharp
- Nodemailer (OTP / transactional mail)
- Zod validation, Helmet, CORS, rate limiting, XSS protection
- Winston logging + Swagger (`/api/docs`)

## Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) and [docs/ER_DIAGRAM.md](./docs/ER_DIAGRAM.md).

```
Routes → Controllers → Services → Repositories → PostgreSQL
```

## Quick Start

```bash
cd server
cp .env.example .env
# Fill DATABASE_URL, JWT secrets, SMTP, Supabase keys

npm install
npm run migrate
npm run seed
npm run dev
```

- API base: `http://localhost:5000/api/v1`
- Swagger: `http://localhost:5000/api/docs`
- Health: `http://localhost:5000/api/v1/health`

## Auth Endpoints (Phase 1)

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| POST | `/auth/logout` | Public (refresh token body) |
| POST | `/auth/refresh` | Public |
| POST | `/auth/forgot-password` | Public |
| POST | `/auth/reset-password` | Public |
| POST | `/auth/verify-otp` | Public |
| POST | `/auth/resend-otp` | Public |
| POST | `/auth/google` | Public (Google-ready) |
| GET | `/auth/me` | Bearer access token |

In development, OTP codes are returned in responses / logged when SMTP is not configured.

## Database

1. Create a Supabase project
2. Copy the Postgres connection string into `DATABASE_URL`
3. Run `npm run migrate` then `npm run seed`

Seeded roles: `super_admin`, `admin`, `customer`, `corporate` plus module permissions.

## Module Roadmap

1. **Auth** ← implemented
2. Categories / Subcategories / Brands
3. Products (CRUD, filter, search, sort, pagination, featured/trending/latest)
4. Inventory
5. Cart & Wishlist
6. Orders & Payments
7. Reviews & Coupons
8. CMS / Banners / FAQ / Blogs
9. Corporate & Quotations
10. Notifications, Dashboard, Analytics, Reports
