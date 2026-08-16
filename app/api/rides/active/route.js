import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { guardRole } from '../../../../lib/guard';
import { haversineKm } from '../../../../lib/pricing';

const ACTIVE_STATUSES = ['payment_pending', 'requested', 'accepted', 'en_route'];

export async function GET() {
  const { user, response } = await guardRole('rider');
  if (response) return response;

  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.pickup, r.destination, r.pickup_lat, r.pickup_lng, r.destination_lat, r.destination_lng,
              r.ride_type, r.price, r.status, r.driver_lat, r.driver_lng, r.driver_updated_at, r.created_at,
              d.name AS driver_name, d.phone AS driver_phone,
              dr.vehicle_model, dr.plate_number
       FROM rides r
       LEFT JOIN users d ON d.id = r.driver_id
       LEFT JOIN drivers dr ON dr.user_id = r.driver_id
       WHERE r.user_id = $1 AND r.status = ANY($2)
       ORDER BY r.created_at DESC
       LIMIT 1`,
      [user.id, ACTIVE_STATUSES]
    );

    const ride = rows[0] || null;
    if (ride) {
      ride.driver = ride.driver_name
        ? { name: ride.driver_name, phone: ride.driver_phone, vehicle_model: ride.vehicle_model, plate_number: ride.plate_number }
        : null;
      delete ride.driver_name;
      delete ride.driver_phone;
      delete ride.vehicle_model;
      delete ride.plate_number;

      if (ride.driver_lat != null && ride.pickup_lat != null) {
        const km = haversineKm(ride.driver_lat, ride.driver_lng, ride.pickup_lat, ride.pickup_lng);
        if (km !== null) ride.etaMinutes = Math.max(1, Math.round((km / 30) * 60));
      }
    }

    return NextResponse.json({ ride });
  } catch (err) {
    console.error('[rides active] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
