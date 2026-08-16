# chachapride

A real ride-hailing web app built with Next.js 14 — sign up, log in, geocode your trip, pick a ride, and store every booking in a Neon Postgres database.

## Features

- 🔐 Real authentication: signup, login, logout (bcrypt password hashing + signed JWT in an httpOnly cookie)
- 🗄️ Neon Postgres storage: users and ride history persisted in the cloud
- 🗺️ Real map: Leaflet with **Streets / Satellite / Terrain layer switcher**, markers, and OSRM route drawing
- 📍 Real geocoding: location suggestions and reverse geocoding via Nominatim
- 📡 Live tracking: driver GPS reported every few seconds, moving car marker + driver card with **call button** (driver phone number)
- 🔐 Role-based auth: riders, drivers (owner-approved), and owner
- 💰 Distance-based pricing computed server-side
- 📱 Fully responsive (map visible on mobile too)
- 📜 Ride history page for logged-in users

## Platform

This repo is the **rider app**. The full platform also includes:

- [chachapride-driver](https://github.com/mzazi89/chachapride-driver) — driver work app (accept rides, GPS reporting, earnings). Drivers sign up with vehicle details + phone; the **owner can log in with owner credentials and drive directly**.
- [chachapride-owner](https://github.com/mzazi89/chachapride-owner) — owner dashboard (stats, ride management, driver approvals, live map).

All three share the same Neon database and JWT secret.

## Tech Stack

- Next.js 14 (App Router)
- React 18, Tailwind CSS
- PostgreSQL on [Neon](https://neon.tech) via `pg`
- `bcryptjs` for password hashing, `jose` for JWT sessions
- Leaflet / react-leaflet, OpenStreetMap, Nominatim, OSRM

## Setup

1. Clone and install:

```bash
git clone <your-repo-url>
cd chachapride
npm install
```

2. Create a Neon Postgres database and copy its connection string.

3. Configure environment:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
JWT_SECRET="<generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\">"

# Owner account credentials (used to provision / reset the owner login)
OWNER_EMAIL="owner@chachapride.com"
OWNER_PASSWORD="<strong password, min 8 chars>"
# Optional vehicle details when the owner drives (driver app)
OWNER_VEHICLE="Owner Vehicle"
OWNER_PLATE="OWNER-01"
```

> `.env.local` is gitignored — never commit real credentials. Set the same `DATABASE_URL`, `JWT_SECRET`, and owner vars in every deployment (Vercel etc.).

4. Create the tables and provision the owner:

```bash
npm run db:setup    # apply schema (incl. default ride types)
npm run db:owner    # create/update owner from OWNER_EMAIL / OWNER_PASSWORD
```

5. Run:

```bash
npm run dev
```

Open http://localhost:3000

## API

| Method | Route            | Auth | Description                                   |
| ------ | ---------------- | ---- | --------------------------------------------- |
| POST   | /api/auth/signup | No   | Create account, sets session cookie           |
| POST   | /api/auth/login  | No   | Log in, sets session cookie                   |
| POST   | /api/auth/logout | No   | Clears session cookie                         |
| GET    | /api/auth/me     | Yes  | Current user                                  |
| GET    | /api/rides       | Yes  | Ride types (with prices) + user's ride history |
| POST   | /api/rides       | Yes  | Create a ride booking                          |

## Database Schema

```sql
users (id uuid, name text, email text unique, password_hash text, created_at timestamptz)
rides (id uuid, user_id uuid FK, pickup text, destination text,
       pickup_lat/lng, destination_lat/lng double precision,
       ride_type text, price numeric, status text, created_at timestamptz)
```

## Notes

- Map tiles, geocoding, and routing use free public services (OSM, Nominatim, OSRM); for production traffic, switch to a commercial provider or self-hosted tiles.
- Ride prices are estimated from straight-line distance (haversine) + a per-type rate.
