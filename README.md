# chachapride

A real ride-hailing web app built with Next.js 14 — sign up, log in, geocode your trip, pick a ride, and store every booking in a Neon Postgres database.

## Features

- 🔐 Real authentication: signup, login, logout (bcrypt password hashing + signed JWT in an httpOnly cookie)
- 🗄️ Neon Postgres storage: users and ride history persisted in the cloud
- 🗺️ Real map: Leaflet + OpenStreetMap tiles, markers, and OSRM route drawing
- 📍 Real geocoding: location suggestions and reverse geocoding via Nominatim
- 💰 Distance-based pricing computed server-side
- 📱 Fully responsive (map visible on mobile too)
- 📜 Ride history page for logged-in users

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
```

> `.env.local` is gitignored — never commit real credentials.

4. Create the tables and (optionally) seed a demo user:

```bash
node --env-file=.env.local scripts/setup-db.mjs
node --env-file=.env.local scripts/seed.mjs
```

Demo login: `demo@chachapride.com` / `password123`

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
