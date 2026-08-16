import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import { guardRole } from '../../../../../lib/guard';

export async function POST(request, { params }) {
  const { user, response } = await guardRole('rider');
  if (response) return response;

  const { id } = params;

  try {
    const { rows } = await pool.query(
      `UPDATE rides SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2 AND status = 'requested'
       RETURNING id, status`,
      [id, user.id]
    );
    if (rows.length === 0) {
      const { rows: existing } = await pool.query('SELECT status FROM rides WHERE id = $1', [id]);
      if (existing.length === 0) {
        return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Ride can only be cancelled while waiting for a driver' }, { status: 400 });
    }
    return NextResponse.json({ ride: rows[0] });
  } catch (err) {
    console.error('[cancel] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
