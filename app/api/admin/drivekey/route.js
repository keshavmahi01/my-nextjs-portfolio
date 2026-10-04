import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getKV, setKV } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const k = (await getKV('drivekey', '')) || '';
  return NextResponse.json({ set: !!k || !!process.env.GOOGLE_API_KEY, env: !!process.env.GOOGLE_API_KEY, preview: k ? k.slice(0, 6) + '...' : '' });
}
export async function PUT(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { key } = await req.json();
  await setKV('drivekey', String(key || '').trim());
  return NextResponse.json({ ok: true });
}
