import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSite } from '@/lib/db';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const s = await getSite();
  const p = s.posts.find((x) => params.slug.endsWith('-' + x.id));
  return p ? { title: `${p.title} | Keshav Kumar`, description: p.excerpt } : {};
}
export default async function Post({ params }) {
  const s = await getSite();
  const p = s.posts.find((x) => params.slug.endsWith('-' + x.id));
  if (!p) notFound();
  const blocks = String(p.content || '').split('\n').filter((l) => l.trim());
  return (
    <>
      <div className="page-top wrap">
        <span className="kicker">{p.date}</span>
        <h1 style={{ fontSize: 'clamp(28px,4.4vw,48px)', maxWidth: 820, margin: '0 auto' }}>{p.title}</h1>
      </div>
      <section className="sec" style={{ paddingTop: 30 }}>
        <div className="wrap article">
          {p.cover && <div className="cover"><img src={p.cover} alt={p.title} /></div>}
          {blocks.map((l, i) => (l.startsWith('## ') ? <h2 key={i}>{l.slice(3)}</h2> : <p key={i}>{l}</p>))}
          <div style={{ marginTop: 30 }}><Link href="/blog" className="btn ghost">← All posts</Link></div>
        </div>
      </section>
    </>
  );
}
