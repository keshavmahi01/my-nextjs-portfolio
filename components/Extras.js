'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal, { Tilt } from './Reveal';
import { Head } from './Sections';
import { Modal } from './Shell';
import { igCode } from '@/lib/util';

function book(title) {
  window.dispatchEvent(new CustomEvent('book-service', { detail: title }));
  const el = document.getElementById('book');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  else window.location.href = '/services#book';
}

/* ---------- Case studies ---------- */
export function CaseStudies({ items }) {
  if (!items.length) return null;
  return (
    <section className="sec">
      <div className="wrap">
        <Head kicker="Results" title={<>Case <span className="grad-text">studies</span></>} sub="Real work, real results. Here is how I help brands grow." />
        <div className="cases">
          {items.map((c, i) => (
            <Reveal key={c.id} x={i % 2 ? 50 : -50} y={0}>
              <div className={'case' + (i % 2 ? ' rev' : '')}>
                <div className="cimg">
                  {c.cover ? <img src={c.cover} alt={c.title} /> : <div className="ph">Cover photo</div>}
                  {c.sample && <span className="samp">Sample</span>}
                </div>
                <div className="cbody">
                  {c.client && <span className="kicker" style={{ marginBottom: 6 }}>{c.client}</span>}
                  <h3>{c.title}</h3>
                  {c.challenge && <p><b>Challenge:</b> {c.challenge}</p>}
                  {c.work && <p><b>What I did:</b> {c.work}</p>}
                  {c.metrics?.length > 0 && (
                    <div className="metrics">
                      {c.metrics.filter((m) => m.value).map((m, j) => (
                        <div key={j} className="metric"><b className="grad-text">{m.value}</b><span>{m.label}</span></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing plans ---------- */
export function Plans({ data }) {
  if (!data.items.length) return null;
  return (
    <section className="sec">
      <div className="wrap">
        <Head kicker="Pricing" title={data.heading} sub={data.subtitle} />
        <div className="plans">
          {data.items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} y={50}>
              <Tilt className={'plan' + (p.popular ? ' pop' : '')}>
                {p.popular && <span className="popt">Most popular</span>}
                <h3>{p.name}</h3>
                <div className="pp">{p.price ? <><b>{p.price}</b>{p.note && <small> {p.note}</small>}</> : <b style={{ fontSize: 24 }}>Custom quote</b>}</div>
                <ul>
                  {String(p.features || '').split('\n').filter(Boolean).map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <button className={'btn' + (p.popular ? '' : ' ghost')} style={{ width: '100%', justifyContent: 'center' }} onClick={() => book(p.name + ' plan')}>Choose {p.name} <span>→</span></button>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function FAQ({ items }) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;
  return (
    <section className="sec">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <Head kicker="FAQ" title={<>Common <span className="grad-text">questions</span></>} />
        {items.map((f, i) => (
          <Reveal key={f.id} delay={i * 0.05}>
            <div className={'faq' + (open === i ? ' on' : '')}>
              <button className="fq" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span><i>{open === i ? '−' : '+'}</i>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} style={{ overflow: 'hidden' }}>
                    <p className="fa">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Free audit offer ---------- */
function AuditForm({ onClose }) {
  const [f, setF] = useState({ name: '', phone: '', profile: '', message: '', website: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, type: 'audit', service: 'Free social media check' }) });
      const j = await r.json();
      if (r.ok) setMsg({ ok: true, t: 'Thank you! Our team will review your page and contact you soon.' });
      else setMsg({ ok: false, t: j.error || 'Something went wrong.' });
    } catch { setMsg({ ok: false, t: 'Network error. Please try again.' }); }
    setBusy(false);
  };
  return (
    <Modal onClose={onClose}>
      <h3>Free <span className="grad-text">check</span></h3>
      <p style={{ color: 'var(--muted)', marginBottom: 18 }}>Share your page and we will send simple tips to improve it.</p>
      {msg && <div className={'note ' + (msg.ok ? 'ok' : 'err')}>{msg.t}</div>}
      {!msg?.ok && (
        <form onSubmit={submit}>
          <input className="hp" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
          <div className="field"><label>Your name</label><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="field"><label>Phone number</label><input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
          <div className="field"><label>Instagram, Facebook or website link</label><input required value={f.profile} onChange={(e) => setF({ ...f, profile: e.target.value })} placeholder="https://instagram.com/yourpage" /></div>
          <div className="field"><label>What do you want to improve? (optional)</label><textarea style={{ minHeight: 70 }} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
          <button className="btn" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>{busy ? 'Sending...' : 'Send for free check'}</button>
        </form>
      )}
    </Modal>
  );
}

export function AuditBand({ data }) {
  const [open, setOpen] = useState(false);
  if (!data?.enabled) return null;
  return (
    <div className="wrap">
      <Reveal className="audit">
        <span className="pulse-ring" />
        <div>
          <span className="kicker">Free offer</span>
          <h2>{data.heading}</h2>
          <p>{data.text}</p>
        </div>
        <button className="btn" onClick={() => setOpen(true)}>{data.button} <span>→</span></button>
      </Reveal>
      <AnimatePresence>{open && <AuditForm onClose={() => setOpen(false)} />}</AnimatePresence>
    </div>
  );
}

/* ---------- Instagram ---------- */
export function InstagramFeed({ items, link }) {
  const codes = items.map((x) => ({ id: x.id, code: igCode(x.url) })).filter((x) => x.code);
  if (!codes.length) return null;
  return (
    <section className="sec">
      <div className="wrap">
        <Head kicker="Instagram" title={<>Latest on <span className="grad-text">Instagram</span></>} sub="Fresh posts and reels from my page." />
        <div className="igs">
          {codes.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <div className="ig"><iframe src={`https://www.instagram.com/p/${c.code}/embed`} loading="lazy" title="Instagram post" allowTransparency /></div>
            </Reveal>
          ))}
        </div>
        {link && <div style={{ textAlign: 'center', marginTop: 26 }}><a className="btn ghost" href={link} target="_blank" rel="noopener noreferrer">Follow on Instagram →</a></div>}
      </div>
    </section>
  );
}
