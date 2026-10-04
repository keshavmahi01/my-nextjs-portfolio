import { NextResponse } from 'next/server';
import { getKV, setKV } from '@/lib/db';
import { uid } from '@/lib/util';
export async function POST(req) {
  const b = await req.json();
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const name = String(b.name || '').trim().slice(0, 80);
  const text = String(b.text || '').trim().slice(0, 600);
  const role = String(b.role || '').trim().slice(0, 80);
  const rating = Math.min(5, Math.max(1, parseInt(b.rating) || 5));
  if (!name || !text) return NextResponse.json({ error: 'Name and testimonial are required.' }, { status: 400 });
  const list = await getKV('pending', []);
  list.unshift({ id: uid(), name, role, text, rating, date: new Date().toISOString() });
  await setKV('pending', list.slice(0, 200));
  return NextResponse.json({ ok: true });
}
