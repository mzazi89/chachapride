// Inserts a demo user and sample rides.
// Usage: node --env-file=.env.local scripts/seed.mjs
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const passwordHash = await bcrypt.hash('password123', 10);

try {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    ['Demo Rider', 'demo@chachapride.com', passwordHash]
  );
  const userId = rows[0].id;

  await pool.query(
    `INSERT INTO rides (user_id, pickup, destination, pickup_lat, pickup_lng, destination_lat, destination_lng, ride_type, price, status)
     VALUES
       ($1, 'Downtown Singapore', 'Changi Airport', 1.29027, 103.851959, 1.36442, 103.99153, 'uberx', 18.4, 'completed'),
       ($1, 'Orchard Road', 'Sentosa Island', 1.3039, 103.8316, 1.2494, 103.8303, 'comfort', 21.6, 'completed')
     ON CONFLICT DO NOTHING`,
    [userId]
  );

  console.log('Seed complete. Demo login: demo@chachapride.com / password123');
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
