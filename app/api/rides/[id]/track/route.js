import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import { guardRole } from '../../../../../lib/guard';

export async function GET(request, { params }) {
  const { user, response } = await guardRole('rider', 'driver', 'owner');
  if (response) return response;

  const { id } = params;

  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.user_id, r.driver_id, r.pickup, r.destination, r.pickup_lat, r.pickup_lng,
              r.destination_lat, r.destination_lng, r.ride_type, r.price, r.status,
              r.driver_lat, r.driver_lng, r.driver_updated_at,
              d.name AS driver_name, d.phone AS driver_phone, dr.vehicle_model, dr.plate_number
       FROM rides r
       LEFT JOIN users d ON d.id = r.driver_id
       LEFT JOIN drivers dr ON dr.user_id = r.driver_id
       WHERE r.id = $1`,
      [id]
    );

    const ride = rows[0];
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    const isRider = ride.user_id === user.id;
    const isDriver = ride.driver_id === user.id;
    const isOwner = user.role === 'owner';
    if (!isRider && !isDriver && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      status: ride.status,
      ride_type: ride.ride_type,
      price: ride.price,
      pickup: ride.pickup,
      destination: ride.destination,
      pickupCoords: ride.pickup_lat ? { lat: ride.pickup_lat, lng: ride.pickup_lng } : null,
      destinationCoords: ride.destination_lat ? { lat: ride.destination_lat, lng: ride.destination_lng } : null,
      driver: ride.driver_name
        ? {
            name: ride.driver_name,
            phone: ride.driver_phone,
            vehicle_model: ride.vehicle_model,
            plate_number: ride.plate_number,
          }
        : null,
      driverLocation: ride.driver_lat ? { lat: ride.driver_lat, lng: ride.driver_lng } : null,
      driverUpdatedAt: ride.driver_updated_at,
    });
  } catch (err) {
    console.error('[track] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
