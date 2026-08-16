import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { guardRole } from '../../../../lib/guard';
import { getStripe } from '../../../../lib/stripe';
import { dispatchRide } from '../../../../lib/dispatch';

export async function POST(request) {
  const { user, response } = await guardRole('rider');
  if (response) return response;

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: 'Payments are not configured yet (STRIPE_SECRET_KEY missing on the server).' },
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
  const sessionId = String(body.sessionId ?? '');

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment has not been completed' }, { status: 400 });
    }
    if (session.metadata?.rideId !== rideId) {
      return NextResponse.json({ error: 'Payment does not match this ride' }, { status: 400 });
    }
  } catch (err) {
    console.error('[payment confirm] stripe error:', err.message);
    return NextResponse.json({ error: 'Could not verify payment.' }, { status: 500 });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE rides SET status = 'requested'
       WHERE id = $1 AND user_id = $2 AND status = 'payment_pending'
       RETURNING id, status`,
      [rideId, user.id]
    );
    const ride = rows[0];
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found or already active' }, { status: 404 });
    }

    // Real dispatch: assign the nearest available driver instantly
    const assignment = await dispatchRide(ride.id);

    return NextResponse.json({ ride, assignment });
  } catch (err) {
    console.error('[payment confirm] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
