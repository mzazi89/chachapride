import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const message = String(body.message ?? '').trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Please enter your name' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: 'Message must be at least 10 characters' }, { status: 400 });
  }

  try {
    await pool.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[contact] database error:', err.message);
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
