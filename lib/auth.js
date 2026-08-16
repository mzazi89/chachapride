import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import pool from './db';

const COOKIE_NAME = 'session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export async function createSession(userId) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function getSessionUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const { rows } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [payload.sub]
    );
    return rows[0] || null;
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
