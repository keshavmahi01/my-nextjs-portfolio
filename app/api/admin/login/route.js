import { NextResponse } from 'next/server';
import { adminPassword, makeToken } from '@/lib/auth';
export async function POST(req) {
  const { password } = await req.json();
  if (password !== adminPassword()) return NextResponse.json({ ok: false }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('kk_admin', makeToken(), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === 'production' });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('kk_admin', '', { path: '/', maxAge: 0 });
  return res;
}
export async function GET() {
  const { isAdmin } = await import('@/lib/auth');
  return NextResponse.json({ admin: isAdmin() });
}
