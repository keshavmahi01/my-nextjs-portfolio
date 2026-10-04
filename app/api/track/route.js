import { NextResponse } from 'next/server';
import { incStats } from '@/lib/db';
export async function POST(req) {
  try {
    const b = await req.json();
    const p = String(b.path || '');
    if (!p.startsWith('/') || p.length > 90 || p.startsWith('/admin') || p.startsWith('/api')) return NextResponse.json({ ok: true });
    const day = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10); // IST day
    const key = p === '/' ? 'home' : p.slice(1).replace(/[.$/]/g, '_');
    const ref = String(b.ref || 'direct').toLowerCase().replace(/[^a-z0-9.-]/g, '').replace(/\./g, '_').slice(0, 50) || 'direct';
    const f = { views: 1, [`pages.${key}`]: 1, [`refs.${ref}`]: 1 };
    if (b.unique) f.uniques = 1;
    await incStats(day, f);
  } catch {}
  return NextResponse.json({ ok: true });
}
