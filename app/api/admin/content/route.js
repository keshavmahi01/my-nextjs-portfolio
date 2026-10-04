import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getSite, saveSite } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json(await getSite());
}
export async function PUT(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    await saveSite(await req.json());
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
