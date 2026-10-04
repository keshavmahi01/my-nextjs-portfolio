import Link from 'next/link';
import { getSite } from '@/lib/db';
import Reveal from '@/components/Reveal';
import { slugify } from '@/lib/util';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blog | Keshav Kumar', description: 'Tips on social media, video and digital marketing.' };
export default async function Blog() {
  const s = await getSite();
  const posts = [...s.posts].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return (
    <>
      <div className="page-top wrap">
        <span className="wm-word">BLOG</span>
        <span className="kicker">Blog</span>
        <h1>Tips &amp; <span className="grad-text">Ideas</span></h1>
        <p>Simple advice on social media, video and digital marketing.</p>
      </div>
      <section className="sec" style={{ paddingTop: 50 }}>
        <div className="wrap posts">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <Link href={`/blog/${slugify(p.title)}-${p.id}`} className="post">
                <div className="pc">{p.cover ? <img src={p.cover} alt={p.title} /> : p.title.slice(0, 2).toUpperCase()}</div>
                <div className="pb">
                  <small>{p.date}{p.sample ? ' · Sample' : ''}</small>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {!posts.length && <div className="wrap"><div className="empty">No posts yet.</div></div>}
      </section>
    </>
  );
}
