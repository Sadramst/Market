# Appilico Market

**Multi-brand marketplace ecosystem for Perth, Western Australia.**

| Domain | App | Description |
|--------|-----|-------------|
| beauty.appilico.com.au | Beauty | Beauty & wellness marketplace |
| service.appilico.com.au | Services | IT & tech services marketplace |
| admin.appilico.com.au | Admin | Platform management dashboard |
| api.appilico.com.au | API | .NET 8 REST API |

## Tech Stack

**Backend**: .NET 8, ASP.NET Core, Entity Framework Core, PostgreSQL 16, JWT Auth  
**Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Turborepo  
**Deployment**: Vercel (frontend), Docker + Nginx + Certbot (backend on Vultr VPS)

## Quick Start

### Backend

```bash
cd backend
dotnet restore
dotnet build

# Start PostgreSQL (Docker)
docker compose up postgres -d

# Run API
cd src/Appilico.Market.Api
dotnet run
# API: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Beauty: http://localhost:3000
# Services: http://localhost:3001
# Admin: http://localhost:3002
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── Appilico.Market.Domain/        # Entities, value objects
│   │   ├── Appilico.Market.Infrastructure/ # EF Core, services
│   │   ├── Appilico.Market.Application/    # DTOs, business logic
│   │   └── Appilico.Market.Api/            # Controllers, middleware
│   ├── tests/
│   └── Dockerfile
├── frontend/
│   ├── apps/
│   │   ├── beauty/     # Consumer-facing beauty marketplace
│   │   ├── services/   # IT services marketplace
│   │   └── admin/      # Admin dashboard
│   └── packages/
│       ├── shared/     # Types, API client, utils
│       └── ui/         # Shared UI components
├── nginx/              # Reverse proxy config
├── scripts/            # Deployment scripts
├── docs/               # Architecture & deployment docs
├── docker-compose.yml           # Development
└── docker-compose.production.yml # Production
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh JWT |
| GET | /api/providers | Search/list providers |
| GET | /api/providers/slug/{slug} | Get provider by slug |
| POST | /api/providers | Create provider (auth) |
| GET | /api/categories/beauty | Beauty categories |
| GET | /api/categories/it | IT categories |
| GET | /api/reviews/provider/{id} | Provider reviews |
| GET | /api/locations/suburbs | List suburbs |
| GET | /health | Health check |

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full deployment guide.

## Default Credentials (Development)

- **Admin**: admin@appilico.com / Admin@123!
- **Moderator**: moderator@appilico.com / Mod@12345!

## TODO — Analytics Setup

Before go-live, set up analytics by adding these environment variables in **Vercel → Project Settings → Environment Variables**:

| Variable | Where to Get | Format |
|----------|-------------|--------|
| `NEXT_PUBLIC_GA_ID` | [Google Analytics 4](https://analytics.google.com/) → Admin → Data Streams → Measurement ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_CLARITY_ID` | [Microsoft Clarity](https://clarity.microsoft.com/) → Settings → Installation → Project ID | alphanumeric string |

**Steps:**
1. Create a GA4 property for `beauty.appilico.com.au`
2. Create a Clarity project for `beauty.appilico.com.au`
3. Add both env vars in Vercel for the beauty project (Production environment)
4. Redeploy — analytics will activate automatically

## License

Proprietary — All rights reserved.
