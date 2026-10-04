'use client';
import { useEffect, useRef, useState } from 'react';
import Reveal, { Tilt } from './Reveal';
import { Head } from './Sections';

function bookNow(title) {
  window.dispatchEvent(new CustomEvent('book-service', { detail: title }));
  document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function Price({ price }) {
  if (!price) return <span />;
  return <span className="price"><small>Starting from</small>{price}</span>;
}

export function ServiceGrid({ data }) {
  return (
    <section className="sec" style={{ paddingTop: 50 }}>
      <div className="wrap">
        <Head kicker="What I do" title={data.heading} sub={data.subtitle} />
        <div className="svc">
          {data.items.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.08}>
              <Tilt className="scard">
                <span className="ico" />
                <span className="no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <div className="ft">
                  <Price price={s.price} />
                  <button className="bk" onClick={() => bookNow(s.title)}>Book now <i>→</i></button>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
        {!data.items.length && <div className="empty">No services added yet.</div>}
      </div>
    </section>
  );
}

export function ShootSection({ data }) {
  return (
    <section className="shoot">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="rec"><i /> Rec · Shoot</span>
          <h2>{data.heading}</h2>
          {data.subtitle && <p>{data.subtitle}</p>}
        </Reveal>
        {data.items.map((s, i) => (
          <Reveal key={s.id} x={i % 2 ? 60 : -60} y={0}>
            <div className="spanel">
              <div className="big">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              <div className="act">
                <Price price={s.price} />
                <button className="btn sm" onClick={() => bookNow(s.title)}>Book this shoot <span>→</span></button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function BookForm({ options }) {
  const [f, setF] = useState({ name: '', phone: '', email: '', service: '', message: '', website: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => setF((x) => ({ ...x, service: e.detail }));
    window.addEventListener('book-service', h);
    return () => window.removeEventListener('book-service', h);
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, type: 'booking' }) });
      const j = await r.json();
      if (r.ok) {
        setMsg({ ok: true, t: 'Thank you! Our team will contact you very soon.' });
        setF({ name: '', phone: '', email: '', service: '', message: '', website: '' });
      } else setMsg({ ok: false, t: j.error || 'Something went wrong.' });
    } catch {
      setMsg({ ok: false, t: 'Network error. Please try again.' });
    }
    setBusy(false);
  };
  return (
    <section className="sec" id="book" ref={ref}>
      <div className="wrap bookwrap">
        <Head kicker="Book a service" title={<>Ready to <span className="grad-text">get started?</span></>} sub="Choose the service you need and share your details. Our team will contact you soon." />
        <Reveal>
          <div className="panel">
            {msg && <div className={'note ' + (msg.ok ? 'ok' : 'err')}>{msg.t}</div>}
            <form onSubmit={submit}>
              <input className="hp" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
              <div className="row2">
                <div className="field"><label>Your name</label><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
                <div className="field"><label>Phone number</label><input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
              </div>
              <div className="field"><label>Email (optional)</label><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
              <div className="field"><label>Which service do you want to book?</label>
                <select required value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })}>
                  <option value="">Select a service</option>
                  {options.map((g) => (
                    <optgroup key={g.label} label={g.label}>{g.items.map((t) => <option key={t} value={t}>{t}</option>)}</optgroup>
                  ))}
                </select>
              </div>
              <div className="field"><label>Anything to add? (optional)</label><textarea style={{ minHeight: 80 }} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
              <button className="btn" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>{busy ? 'Booking...' : 'Book service'} <span>→</span></button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
