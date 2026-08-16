import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { guardRole } from '../../../lib/guard';
import { getActiveRideTypes, getRideType } from '../../../lib/ride-types';
import { haversineKm, estimatePrice, commissionFor } from '../../../lib/pricing';
import { dispatchRide } from '../../../lib/dispatch';

export async function GET(request) {
  const { user, response } = await guardRole('rider');
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const toNum = (v) => (typeof v === 'string' && v !== '' && Number.isFinite(Number(v)) ? Number(v) : null);
    const km = haversineKm(
      toNum(searchParams.get('fromLat')),
      toNum(searchParams.get('fromLng')),
      toNum(searchParams.get('toLat')),
      toNum(searchParams.get('toLng'))
    );
    const rideTypes = (await getActiveRideTypes()).map((t) => ({
      ...t,
      price: estimatePrice(t, km),
    }));

    const { rows } = await pool.query(
      'SELECT id, pickup, destination, ride_type, price, status, created_at FROM rides WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    );

    return NextResponse.json({ rideTypes, rides: rows });
  } catch (err) {
    console.error('[rides GET] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}

export async function POST(request) {
  const { user, response } = await guardRole('rider');
  if (response) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const pickup = String(body.pickup ?? '').trim();
  const destination = String(body.destination ?? '').trim();
  const rideType = await getRideType(String(body.rideType ?? ''));
  const paymentMethod = body.paymentMethod === 'cash' ? 'cash' : 'online';

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
  const commission = commissionFor(price);
  const status = paymentMethod === 'cash' ? 'requested' : 'payment_pending';

  try {
    const { rows } = await pool.query(
      `INSERT INTO rides (user_id, pickup, destination, pickup_lat, pickup_lng, destination_lat, destination_lng, ride_type, price, status, payment_method, commission)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, pickup, destination, ride_type, price, status, payment_method, commission, created_at`,
      [user.id, pickup, destination, pickupLat, pickupLng, destinationLat, destinationLng, rideType.id, price, status, paymentMethod, commission]
    );

    const ride = rows[0];

    // Cash rides are live immediately — match the nearest available driver now
    let assignment = null;
    if (status === 'requested') {
      assignment = await dispatchRide(ride.id);
    }

    return NextResponse.json({ ride, assignment }, { status: 201 });
  } catch (err) {
    console.error('[rides POST] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
