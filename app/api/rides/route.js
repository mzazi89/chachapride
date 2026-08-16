import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { getSessionUser } from '../../../lib/auth';
import { RIDE_TYPES, getRideType } from '../../../lib/ride-types';
import { haversineKm, estimatePrice } from '../../../lib/pricing';

export async function GET(request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const toNum = (v) => (typeof v === 'string' && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null);
  const km = haversineKm(
    toNum(searchParams.get('fromLat')),
    toNum(searchParams.get('fromLng')),
    toNum(searchParams.get('toLat')),
    toNum(searchParams.get('toLng'))
  );
  const rideTypes = RIDE_TYPES.map((t) => ({ ...t, price: estimatePrice(t, km) }));

  const { rows } = await pool.query(
    'SELECT id, pickup, destination, ride_type, price, status, created_at FROM rides WHERE user_id = $1 ORDER BY created_at DESC',
    [user.id]
  );

  return NextResponse.json({ rideTypes, rides: rows });
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const pickup = String(body.pickup ?? '').trim();
  const destination = String(body.destination ?? '').trim();
  const rideType = getRideType(String(body.rideType ?? ''));

  if (!pickup || !destination) {
    return NextResponse.json({ error: 'Pickup and destination are required' }, { status: 400 });
  }
  if (!rideType) {
    return NextResponse.json({ error: 'Invalid ride type' }, { status: 400 });
  }

  const toNum = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  const pickupLat = toNum(body.pickupLat);
  const pickupLng = toNum(body.pickupLng);
  const destinationLat = toNum(body.destinationLat);
  const destinationLng = toNum(body.destinationLng);

  const km = haversineKm(pickupLat, pickupLng, destinationLat, destinationLng);
  const price = estimatePrice(rideType, km);

  const { rows } = await pool.query(
    `INSERT INTO rides (user_id, pickup, destination, pickup_lat, pickup_lng, destination_lat, destination_lng, ride_type, price, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'confirmed')
     RETURNING id, pickup, destination, ride_type, price, status, created_at`,
    [user.id, pickup, destination, pickupLat, pickupLng, destinationLat, destinationLng, rideType.id, price]
  );

  return NextResponse.json({ ride: rows[0] }, { status: 201 });
}
