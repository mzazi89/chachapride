import { NextResponse } from 'next/server';
import { getActiveRideTypes } from '../../../lib/ride-types';

// Public: ride types with sample fares (no auth needed)
export async function GET() {
  try {
    const types = await getActiveRideTypes();
    const withFares = types.map((t) => ({
      ...t,
      sampleFares: {
        '5 km': Math.round((t.basePrice + t.perKm * 5) * 100) / 100,
        '10 km': Math.round((t.basePrice + t.perKm * 10) * 100) / 100,
        '20 km': Math.round((t.basePrice + t.perKm * 20) * 100) / 100,
      },
    }));
    return NextResponse.json({ rideTypes: withFares });
  } catch (err) {
    console.error('[ride-types] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
