import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getKV, setKV, getSite, saveSite } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json(await getKV('pending', []));
}
export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id, action } = await req.json();
  const list = await getKV('pending', []);
  const item = list.find((x) => x.id === id);
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (action === 'approve') {
    const site = await getSite();
    site.testimonials = [{ id: item.id, name: item.name, role: item.role, text: item.text, rating: item.rating }, ...site.testimonials];
    await saveSite(site);
  }
  await setKV('pending', list.filter((x) => x.id !== id));
  return NextResponse.json({ ok: true });
}
