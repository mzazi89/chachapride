import { NextResponse } from 'next/server';

// Mock ride data
const rides = [
  { id: 1, type: 'UberX', price: 8, time: 2, capacity: 4 },
  { id: 2, type: 'UberXL', price: 14, time: 5, capacity: 6 },
  { id: 3, type: 'Uber Comfort', price: 18, time: 8, capacity: 4 },
  { id: 4, type: 'Uber Green', price: 10, time: 10, capacity: 4 },
];

export async function GET(request) {
  return NextResponse.json({ rides });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { pickup, destination } = body;
    
    // Mock price estimation
    const estimatedPrice = Math.floor(Math.random() * 15) + 5;
    
    return NextResponse.json({
      success: true,
      estimatedPrice,
      message: 'Ride requested successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to request ride' },
      { status: 400 }
    );
  }
}
