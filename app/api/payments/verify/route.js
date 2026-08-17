import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { guardRole } from '../../../../lib/guard';
import { paystackRequest, getPaystackKey } from '../../../../lib/paystack';

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
  const reference = String(body.reference ?? '');

  try {
    const result = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
    if (!result.status || result.data?.status !== 'success') {
      return NextResponse.json({ error: 'Payment has not been completed' }, { status: 400 });
    }
    if (result.data?.metadata?.rideId !== rideId) {
      return NextResponse.json({ error: 'Payment does not match this ride' }, { status: 400 });
    }
  } catch (err) {
    console.error('[paystack verify] error:', err.message);
    return NextResponse.json({ error: 'Could not verify payment.' }, { status: 500 });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE rides SET status = 'requested', paystack_reference = $1
       WHERE id = $2 AND user_id = $3 AND status = 'payment_pending'
       RETURNING id, status`,
      [reference, rideId, user.id]
    );
    const ride = rows[0];
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found or already active' }, { status: 404 });
    }

    // Ride stays 'requested' — nearby online drivers ring and the first to accept takes it.
    return NextResponse.json({ ride });
  } catch (err) {
    console.error('[paystack verify] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
