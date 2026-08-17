import { NextResponse } from 'next/server';
import { getActiveRideTypes } from '../../../lib/ride-types';
import { finalFare } from '../../../lib/pricing';

// Public: ride types with sample fares (no auth needed)
export async function GET() {
  try {
    const types = await getActiveRideTypes();
    const withFares = types.map((t) => ({
      ...t,
      sampleFares: {
        '2 km': finalFare(t, 2),
        '3 km': finalFare(t, 3),
        '5 km': finalFare(t, 5),
        '10 km': finalFare(t, 10),
      },
    }));
    return NextResponse.json({ rideTypes: withFares });
  } catch (err) {
    console.error('[ride-types] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
