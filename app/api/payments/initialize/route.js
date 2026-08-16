import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { guardRole } from '../../../../lib/guard';
import { paystackRequest, getPaystackKey, getPaystackCurrency } from '../../../../lib/paystack';

export async function POST(request) {
  const { user, response } = await guardRole('rider');
  if (response) return response;

  if (!getPaystackKey()) {
    return NextResponse.json(
      { error: 'Payments are not configured yet (PAYSTACK_SECRET_KEY missing on the server).' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const rideId = String(body.rideId ?? '');

  try {
    const { rows } = await pool.query(
      'SELECT id, price, ride_type FROM rides WHERE id = $1 AND user_id = $2 AND status = $3',
      [rideId, user.id, 'payment_pending']
    );
    const ride = rows[0];
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found or already paid' }, { status: 404 });
    }

    const reference = `chacha-${ride.id.slice(0, 8)}-${Date.now()}`;
    const origin = process.env.APP_URL || request.nextUrl.origin;

    const result = await paystackRequest('/transaction/initialize', {
      method: 'POST',
      body: {
        amount: Math.round(Number(ride.price) * 100),
        currency: getPaystackCurrency(),
        email: user.email,
        reference,
        callback_url: `${origin}/payment/callback?rideId=${ride.id}&reference=${reference}`,
        metadata: { rideId: ride.id },
      },
    });

    if (!result.status || !result.data?.authorization_url) {
      console.error('[paystack initialize] error:', result.message || 'unknown');
      return NextResponse.json({ error: 'Could not start payment. Try again.' }, { status: 500 });
    }

    await pool.query('UPDATE rides SET paystack_reference = $1 WHERE id = $2', [reference, ride.id]);

    return NextResponse.json({ url: result.data.authorization_url });
  } catch (err) {
    console.error('[paystack initialize] error:', err.message);
    return NextResponse.json({ error: 'Could not start payment. Try again.' }, { status: 500 });
  }
}
