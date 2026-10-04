'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, useInView } from 'framer-motion';
import Reveal, { Tilt } from './Reveal';
import { Modal } from './Shell';
import { ytId } from '@/lib/util';

export function Head({ kicker, title, sub }) {
  return (
    <Reveal className="sec-head">
      {kicker && <span className="kicker">{kicker}</span>}
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </Reveal>
  );
}

function Counter({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const n = parseInt(to) || 0;
    const c = animate(0, n, { duration: 1.6, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <b ref={ref} className="grad-text">{v}</b>;
}

export function Intro({ intro, years, worksCount }) {
  const id = ytId(intro.youtube);
  return (
    <section className="sec" id="intro">
      <div className="wrap intro-grid">
        <Reveal x={-40} y={0}>
          <span className="kicker">Meet myself</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 16 }}>{intro.heading}</h2>
          <p>{intro.text}</p>
          <div className="big-stats">
            <div className="big-stat"><div className="stat"><div className="num"><Counter to={years} /><b className="grad-text">+</b></div></div><span>Years experience</span></div>
            <div className="big-stat"><div className="stat"><div className="num"><Counter to={worksCount} /></div></div><span>Work categories</span></div>
          </div>
        </Reveal>
        <Reveal x={40} y={0}>
          <div className="video-box">
            {id ? (
              <iframe src={`https://www.youtube.com/embed/${id}`} title="Intro video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen />
            ) : (
              <div className="ph">Add a YouTube link from the dashboard to show your video here</div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TextBand({ items }) {
  const base = items.length ? items : ['Social Media', 'Video Editing', 'Graphic Design'];
  let list = [...base];
  while (list.length < 8) list = list.concat(base);
  return (
    <div className="band">
      <div className="marq-track">
        {[...list, ...list].map((t, i) => (<span key={i}>{t}<em>✦</em></span>))}
      </div>
    </div>
  );
}

const FILTERS = [['all', 'All'], ['video', 'Video'], ['design', 'Design'], ['shoot', 'Shoot']];

function WorkCard({ w, i }) {
  const [hov, setHov] = useState(false);
  return (
    <Tilt className="wcard glass" href={w.link ? `/work/${w.id}` : undefined} onEnter={() => setHov(true)} onLeave={() => setHov(false)}>
      <span className="num">{String(i + 1).padStart(2, '0')}</span>
      {w.type && <span className="wtype">{w.type}</span>}
      <span className="arr"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg></span>
      <div className="cov">
        {w.cover ? <img src={w.cover} alt={w.title} loading="lazy" /> : w.title.slice(0, 2).toUpperCase()}
        {w.preview && hov && <video className="pv-vid" src={w.preview} autoPlay muted loop playsInline />}
      </div>
      <div className="bd">
        <h3>{w.title}</h3>
        <span className="go">{w.link ? 'View gallery' : 'Coming soon'} <i>→</i></span>
      </div>
    </Tilt>
  );
}

export function WorkGrid({ works, limit, filters = true }) {
  const [f, setF] = useState('all');
  const base = limit ? works.slice(0, limit) : works;
  const list = base.filter((w) => f === 'all' || w.type === f);
  const present = FILTERS.filter(([k]) => k === 'all' || base.some((w) => w.type === k));
  return (
    <>
      {filters && present.length > 2 && (
        <div className="gfilter">
          {present.map(([k, t]) => <button key={k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>{t}</button>)}
        </div>
      )}
      <div className="works">
        {list.map((w, i) => (
          <Reveal key={w.id} delay={(i % 6) * 0.06}>
            <WorkCard w={w} i={i} />
          </Reveal>
        ))}
        {!list.length && <div className="empty">No work in this category yet.</div>}
      </div>
    </>
  );
}

export function Chip({ s }) {
  const [bad, setBad] = useState(false);
  const short = s.short || s.name.slice(0, 2);
  return (
    <div className="chip">
      <span className="lg" style={{ background: bad || !s.logo ? s.color || 'var(--a)' : (s.color || '#222') + '33' }}>
        {s.logo && !bad ? <img src={s.logo} alt={s.name} onError={() => setBad(true)} /> : short}
      </span>
      <b>{s.name}</b>
    </div>
  );
}

function Row({ items, rev }) {
  if (!items.length) return null;
  let base = [...items];
  while (base.length < 8) base = base.concat(items);
  return (
    <div className={'marq' + (rev ? ' rev' : '')}>
      <div className="marq-track">
        {[...base, ...base].map((s, i) => <Chip key={s.id + '-' + i} s={s} />)}
      </div>
    </div>
  );
}

export function Software({ software }) {
  const design = software.filter((s) => s.group !== 'tech');
  const tech = software.filter((s) => s.group === 'tech');
  return (
    <section className="sec">
      <div className="wrap">
        <Head kicker="Toolbox" title={<>Software <span className="grad-text">I work on</span></>} sub="The tools I use every day to design, edit, create and build." />
      </div>
      <Reveal>
        <p className="soft-title">Design &amp; AI software</p>
        <Row items={design} />
        {tech.length > 0 && (<><p className="soft-title" style={{ marginTop: 26 }}>Technology</p><Row items={tech} rev /></>)}
      </Reveal>
    </section>
  );
}

export function VideoTestimonials({ videos }) {
  const [play, setPlay] = useState(null);
  if (!videos.length) return null;
  return (
    <section className="sec">
      <div className="wrap">
        <Head kicker="Watch" title={<>Video <span className="grad-text">testimonials</span></>} sub="Hear it directly from the people I have worked with." />
        <div className="vids">
          {videos.map((v, i) => {
            const id = ytId(v.url);
            if (!id) return null;
            return (
              <Reveal key={v.id} delay={i * 0.06}>
                <div className="vth" onClick={() => setPlay(id)}>
                  <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt={v.title || 'Video testimonial'} />
                  <div className="play"><b><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg></b></div>
                </div>
                {v.title && <div className="vt">{v.title}</div>}
              </Reveal>
            );
          })}
        </div>
      </div>
      <AnimatePresence>
        {play && (
          <Modal wide onClose={() => setPlay(null)}>
            <div className="video-box" style={{ marginTop: 28 }}>
              <iframe src={`https://www.youtube.com/embed/${play}?autoplay=1`} title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}

function AddTestimonial({ onClose }) {
  const [f, setF] = useState({ name: '', role: '', rating: 5, text: '', website: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const r = await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
    const j = await r.json();
    setBusy(false);
    if (r.ok) setMsg({ ok: true, t: 'Thank you! Your testimonial will appear on the website after approval.' });
    else setMsg({ ok: false, t: j.error || 'Something went wrong.' });
  };
  return (
    <Modal onClose={onClose}>
      <h3>Add <span className="grad-text">testimonial</span></h3>
      <p style={{ color: 'var(--muted)', marginBottom: 18 }}>Worked with Keshav? Share your experience.</p>
      {msg && <div className={'note ' + (msg.ok ? 'ok' : 'err')}>{msg.t}</div>}
      {!msg?.ok && (
        <form onSubmit={submit}>
          <input className="hp" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
          <div className="field"><label>Your name</label><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="field"><label>Company or role (optional)</label><input value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} /></div>
          <div className="field"><label>Rating</label>
            <select value={f.rating} onChange={(e) => setF({ ...f, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
            </select>
          </div>
          <div className="field"><label>Your testimonial</label><textarea required maxLength={600} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} /></div>
          <button className="btn" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>{busy ? 'Sending...' : 'Submit testimonial'}</button>
        </form>
      )}
    </Modal>
  );
}

export function Testimonials({ items }) {
  const [i, setI] = useState(0);
  const [per, setPer] = useState(3);
  const [add, setAdd] = useState(false);
  useEffect(() => {
    const f = () => setPer(window.innerWidth < 640 ? 1 : window.innerWidth < 980 ? 2 : 3);
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  const max = Math.max(0, items.length - per);
  const go = useCallback((d) => setI((x) => (x + d > max ? 0 : x + d < 0 ? max : x + d)), [max]);
  useEffect(() => {
    const t = setInterval(() => go(1), 5500);
    return () => clearInterval(t);
  }, [go]);
  useEffect(() => { if (i > max) setI(max); }, [max, i]);

  return (
    <section className="sec">
      <div className="wrap">
        <Head kicker="Kind words" title={<>Client <span className="grad-text">testimonials</span></>} sub="What people say about working with me." />
        <div className="tslider">
          <div className="tviewport">
            <div className="ttrack" style={{ transform: `translateX(-${i * (100 / per)}%)` }}>
              {items.map((t) => (
                <div className="tslide" key={t.id}>
                  <div className="tcard">
                    {t.sample && <span className="samp">Sample</span>}
                    <div className="q">“</div>
                    <div className="stars">{'★'.repeat(t.rating)}<span style={{ opacity: 0.3 }}>{'★'.repeat(5 - t.rating)}</span></div>
                    <p>{t.text}</p>
                    <div className="who">
                      <span className="av">{(t.name || '?')[0]}</span>
                      <div><b>{t.name}</b><small>{t.role}</small></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="tctl">
            <button className="arrow" onClick={() => go(-1)} aria-label="Previous">←</button>
            <button className="plus-btn" onClick={() => setAdd(true)} aria-label="Add testimonial" title="Add testimonial">+</button>
            <button className="arrow" onClick={() => go(1)} aria-label="Next">→</button>
          </div>
        </div>
      </div>
      <AnimatePresence>{add && <AddTestimonial onClose={() => setAdd(false)} />}</AnimatePresence>
    </section>
  );
}

export function CTA({ title = "Let's create something amazing together", text = 'Have a project in mind? Tell me about it.' }) {
  return (
    <div className="wrap">
      <Reveal className="cta-band">
        <h2>{title}</h2>
        <p>{text}</p>
        <Link href="/contact" className="btn">Get in touch <span>→</span></Link>
      </Reveal>
    </div>
  );
}

export function WorkRows({ works }) {
  return (
    <div className="wrows">
      {works.map((w, i) => (
        <Reveal key={w.id} delay={i * 0.05} x={-40} y={0}>
          <a className="wrow" href={w.link ? `/work/${w.id}` : undefined}>
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{w.title}</h3>
            <span className="go">{w.link ? 'View gallery →' : 'Coming soon'}</span>
            <span className="th">{w.cover ? <img src={w.cover} alt={w.title} /> : w.title.slice(0, 2).toUpperCase()}</span>
          </a>
        </Reveal>
      ))}
      {!works.length && <div className="empty">No work added yet.</div>}
    </div>
  );
}
