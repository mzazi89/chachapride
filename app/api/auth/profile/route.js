import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { guardRole } from '../../../../lib/guard';

export async function PUT(request) {
  const { user, response } = await guardRole('rider', 'driver', 'owner');
  if (response) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = body.name !== undefined ? String(body.name).trim() : null;
  const phone = body.phone !== undefined ? String(body.phone).trim() || null : null;

  if (name !== null && name.length < 2) {
    return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users SET
         name = COALESCE($1, name),
         phone = COALESCE($2, phone)
       WHERE id = $3
       RETURNING id, name, email, role, phone, created_at`,
      [name, phone, user.id]
    );
    return NextResponse.json({ user: rows[0] });
  } catch (err) {
    console.error('[profile] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
