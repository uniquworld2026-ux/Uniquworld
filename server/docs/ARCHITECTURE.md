# Uniquworld Backend — Architecture

## Overview

Production-ready Node.js / Express REST API for the Uniquworld eCommerce platform.

| Layer | Responsibility |
|-------|----------------|
| **Routes** | HTTP path binding, OpenAPI docs, middleware chain |
| **Controllers** | Request/response shaping only |
| **Validators** | Zod schemas for body/query/params |
| **Services** | Business rules, transactions, orchestration |
| **Repositories** | Parameterized SQL against Supabase PostgreSQL |
| **Middlewares** | Auth, RBAC, rate limit, sanitize, errors |
| **Config / Utils** | Env, DB pool, JWT, mail, logger, storage |

```
Client → Routes → Middleware → Controller → Service → Repository → PostgreSQL
                                         ↘ Email / Storage / Sharp
```

## Folder Structure

```
server/
├── docs/                  # Architecture, ER diagram, API notes
├── logs/                  # Winston log files
├── uploads/               # Local temp uploads (Sharp → Supabase Storage)
├── src/
│   ├── config/            # Env, DB, Supabase, Swagger
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/            # Domain shapes / JSDoc models
│   ├── middlewares/
│   ├── routes/v1/
│   ├── validators/
│   ├── utils/
│   ├── types/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Design Principles

1. **MVC + Repository + Service** — Controllers stay thin; SQL lives only in repositories.
2. **Parameterized queries** — All SQL uses `$1…$n` bindings (SQL injection protection).
3. **Transactions** — Multi-table writes (orders, payments, inventory) use `BEGIN/COMMIT`.
4. **RBAC** — Roles → Permissions → `authorize('products.manage')` middleware.
5. **JWT + Refresh** — Short-lived access tokens; refresh tokens hashed at rest.
6. **Soft deletes** — Users/products use `deleted_at` where appropriate.
7. **Module-by-module delivery** — Auth first; catalog, cart, orders follow.

## Security Stack

- Helmet, CORS allowlist, compression
- Rate limiting (global + auth-specific)
- `xss-clean` + Zod validation
- bcrypt password hashing
- JWT access/refresh with rotation-ready refresh store
- RBAC permission checks

## Auth Module (this phase)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register + send OTP |
| POST | `/api/v1/auth/login` | Email/password login |
| POST | `/api/v1/auth/logout` | Revoke refresh token |
| POST | `/api/v1/auth/refresh` | Rotate access token |
| POST | `/api/v1/auth/forgot-password` | Send reset OTP |
| POST | `/api/v1/auth/reset-password` | Reset with OTP |
| POST | `/api/v1/auth/verify-otp` | Email / reset OTP verify |
| POST | `/api/v1/auth/resend-otp` | Resend OTP |
| POST | `/api/v1/auth/google` | Google ID-token login (ready) |
| GET | `/api/v1/auth/me` | Current user profile |

## Next Modules (planned order)

1. Categories / Subcategories / Brands
2. Products (+ images, variants, attributes)
3. Inventory
4. Cart & Wishlist
5. Orders & Payments
6. Reviews & Coupons
7. CMS / Banners / FAQ / Blogs
8. Corporate & Quotations
9. Notifications, Dashboard, Analytics, Reports
