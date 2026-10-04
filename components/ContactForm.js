'use client';
import { useState } from 'react';

export default function ContactForm({ services }) {
  const [f, setF] = useState({ name: '', email: '', service: '', message: '', website: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const j = await r.json();
      if (r.ok) {
        setMsg({ ok: true, t: 'Thank you! Your message has been sent. I will get back to you soon.' });
        setF({ name: '', email: '', service: '', message: '', website: '' });
      } else setMsg({ ok: false, t: j.error || 'Something went wrong.' });
    } catch {
      setMsg({ ok: false, t: 'Network error. Please try again.' });
    }
    setBusy(false);
  };
  return (
    <form onSubmit={submit}>
      {msg && <div className={'note ' + (msg.ok ? 'ok' : 'err')}>{msg.t}</div>}
      <input className="hp" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
      <div className="field"><label>Your name</label><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="John Doe" /></div>
      <div className="field"><label>Email</label><input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" /></div>
      <div className="field"><label>Service you need</label>
        <select value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })}>
          <option value="">Select a service</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="field"><label>Your query</label><textarea required value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="Tell me about your project or question..." /></div>
      <button className="btn" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>{busy ? 'Sending...' : 'Send message'} <span>→</span></button>
    </form>
  );
}
