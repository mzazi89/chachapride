import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { guardRole } from '../../../lib/guard';
import { getActiveRideTypes, getRideType } from '../../../lib/ride-types';
import { haversineKm, finalFare, commissionFor } from '../../../lib/pricing';

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
      price: finalFare(t, km),
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
  const phone = String(body.phone ?? '').trim() || null;

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
  const price = finalFare(rideType, km);
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

    // Save the phone so the assigned driver can call the rider
    if (phone) {
      await pool.query('UPDATE users SET phone = $1 WHERE id = $2', [phone, user.id]);
    }

    // Ride stays 'requested' — nearby online drivers are notified and ring.
    // The first driver to accept takes the ride.
    return NextResponse.json({ ride }, { status: 201 });
  } catch (err) {
    console.error('[rides POST] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
