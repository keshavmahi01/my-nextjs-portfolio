import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getKV, setKV } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json(await getKV('messages', []));
}
export async function DELETE(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const list = await getKV('messages', []);
  await setKV('messages', list.filter((x) => x.id !== id));
  return NextResponse.json({ ok: true });
}
