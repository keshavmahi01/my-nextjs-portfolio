import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getStats } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json(await getStats());
}
