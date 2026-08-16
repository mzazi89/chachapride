import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { guardRole } from '../../../../lib/guard';
import { getStripe } from '../../../../lib/stripe';

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

  try {
    const { rows } = await pool.query(
      'SELECT id, price, ride_type FROM rides WHERE id = $1 AND user_id = $2 AND status = $3',
      [rideId, user.id, 'payment_pending']
    );
    const ride = rows[0];
    if (!ride) {
      return NextResponse.json({ error: 'Ride not found or already paid' }, { status: 404 });
    }

    const origin = process.env.APP_URL || request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(Number(ride.price) * 100),
            product_data: {
              name: `chachapride ${ride.ride_type} ride`,
              description: 'Ride fare',
            },
          },
        },
      ],
      metadata: { rideId: ride.id },
      success_url: `${origin}/payment/success?rideId=${ride.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] error:', err.message);
    return NextResponse.json({ error: 'Could not start payment. Try again.' }, { status: 500 });
  }
}
