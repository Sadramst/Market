# Appilico Market – Project Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Beauty App   │  │ Services App │  │ Admin Panel  │          │
│  │ :3000        │  │ :3001        │  │ :3002        │          │
│  │ Next.js 15   │  │ Next.js 15   │  │ Next.js 15   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
          └────────────┬────┘─────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (VPS 149.28.166.75)                   │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────┐            │
│  │  Nginx   │──▶│  .NET 8 API  │──▶│  PostgreSQL  │            │
│  │  :80/443 │   │  :5000       │   │  :5432       │            │
│  └──────────┘   └──────────────┘   └──────────────┘            │
│  ┌──────────┐                                                   │
│  │ Certbot  │  (SSL certificates)                               │
│  └──────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## URLs

| App | Local | Production |
|-----|-------|------------|
| Beauty | http://localhost:3000 | https://beauty.appilico.com.au |
| Services | http://localhost:3001 | https://service.appilico.com.au |
| Admin | http://localhost:3002 | https://admin.appilico.com.au |
| API | http://localhost:5000 | https://api.appilico.com.au |

## Tech Stack

- **Backend**: .NET 8, ASP.NET Core, Entity Framework Core, PostgreSQL
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, TypeScript
- **Auth**: JWT (access + refresh tokens), ASP.NET Core Identity
- **Hosting**: Vercel (frontends), Vultr VPS (backend + DB)
- **Testing**: Playwright (E2E), Vitest (unit)

## Project Structure

```
Market/
├── backend/
│   └── src/
│       ├── Appilico.Market.Api/          # ASP.NET Core Web API
│       ├── Appilico.Market.Application/  # Business logic, DTOs, services
│       └── Appilico.Market.Domain/       # Entities, enums
├── frontend/
│   └── apps/
│       ├── beauty/    # Consumer marketplace (Beauty)
│       ├── services/  # Consumer marketplace (IT Services)
│       └── admin/     # Admin dashboard
├── e2e/               # Playwright E2E tests
│   ├── beauty/        # Beauty app tests
│   ├── admin/         # Admin panel tests
│   └── services/      # Services app tests
├── docs/              # Documentation
└── docker-compose.production.yml
```

## Database

- **DB Name**: `appilico_market`
- **User**: `appilico_user`
- **Provider**: PostgreSQL (in Docker on VPS)
- **Migrations**: EF Core Code-First

## Roles

| Role | Access |
|------|--------|
| SuperAdmin | Full admin panel access |
| Moderator | Admin panel (read-only settings) |
| Provider | Business dashboard in beauty app |
| Customer | Browse, review, enquire |
