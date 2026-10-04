'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { uid } from '@/lib/util';

/* ---------- helpers ---------- */
function resize(file, max, type) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = rej;
    fr.onload = () => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        res(type === 'png' ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.85));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

function Field({ label, children }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}
function Text({ label, value, onChange, area, placeholder }) {
  return (
    <Field label={label}>
      {area ? <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /> : <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />}
    </Field>
  );
}
function Img({ label, value, onChange, max = 1400, type = 'jpg' }) {
  const pick = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { onChange(await resize(f, max, type)); } catch { alert('Could not read this image.'); }
    e.target.value = '';
  };
  return (
    <Field label={label}>
      <div className="imgf">
        <div className="pv">{value ? <img src={value} alt="" /> : 'No image'}</div>
        <div className="acts">
          <label className="btn sm lbl">Upload<input type="file" accept="image/*" hidden onChange={pick} /></label>
          {value && <button type="button" className="btn sm ghost" onClick={() => onChange('')}>Remove</button>}
        </div>
      </div>
    </Field>
  );
}
function Items({ list, onChange, blank, render, title, addLabel }) {
  const set = (i, patch) => onChange(list.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const del = (i) => confirm('Remove this item?') && onChange(list.filter((_, j) => j !== i));
  const move = (i, d) => {
    const a = [...list]; const j = i + d;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
    onChange(a);
  };
  return (
    <>
      {list.map((it, i) => (
        <div className="box" key={it.id}>
          <div className="item-h">
            <span>{title(it, i)}</span>
            <span style={{ display: 'flex', gap: 6 }}>
              <button className="btn sm ghost" onClick={() => move(i, -1)}>↑</button>
              <button className="btn sm ghost" onClick={() => move(i, 1)}>↓</button>
              <button className="btn sm red" onClick={() => del(i)}>Remove</button>
            </span>
          </div>
          {render(it, (p) => set(i, p))}
        </div>
      ))}
      <button className="btn" onClick={() => onChange([...list, { id: uid(), ...blank }])}>+ {addLabel}</button>
    </>
  );
}

/* ---------- tabs ---------- */
const TABS = [
  ['hero', 'Hero'],
  ['intro', 'Introduction'],
  ['works', 'My Work'],
  ['services', 'Services'],
  ['shoots', 'Shoot services'],
  ['software', 'Software'],
  ['plans', 'Pricing packages'],
  ['cases', 'Case studies'],
  ['blog', 'Blog'],
  ['faqs', 'FAQ'],
  ['instagram', 'Instagram posts'],
  ['audit', 'Free offer'],
  ['stats', 'Visitors'],
  ['videos', 'Video testimonials'],
  ['testimonials', 'Testimonials'],
  ['experience', 'Experience'],
  ['about', 'About & Achievements'],
  ['settings', 'Contact & Social'],
  ['messages', 'Messages'],
];

export default function Admin() {
  const [auth, setAuth] = useState(null);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [site, setSite] = useState(null);
  const [tab, setTab] = useState('hero');
  const [pending, setPending] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [dk, setDk] = useState({ set: false, preview: '', val: '', msg: '' });
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [bgBusy, setBgBusy] = useState(false);
  const removeBg = async () => {
    setBgBusy(true);
    try {
      const { removeBackground } = await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm');
      const blob = await removeBackground(site.hero.photo);
      const url = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const k = Math.min(1, 1600 / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      upd('hero.photo', c.toDataURL('image/png'));
      upd('hero.cutout', true);
    } catch (e) { alert('Could not remove the background here. Please upload a PNG with a transparent background instead.'); }
    setBgBusy(false);
  };

  const load = useCallback(async () => {
    const [a, b, c] = await Promise.all([fetch('/api/admin/content'), fetch('/api/admin/pending'), fetch('/api/admin/messages')]);
    if (a.status === 401) return setAuth(false);
    setSite(await a.json());
    setPending(await b.json());
    setMessages(await c.json());
    fetch('/api/admin/drivekey').then((r) => r.json()).then((d) => setDk((x) => ({ ...x, set: d.set, preview: d.preview }))).catch(() => {});
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats).catch(() => {});
    setAuth(true);
  }, []);
  useEffect(() => { load(); }, [load]);

  const login = async (e) => {
    e.preventDefault();
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { setErr(''); load(); } else setErr('Wrong password');
  };
  const logout = async () => { await fetch('/api/admin/login', { method: 'DELETE' }); setAuth(false); setSite(null); };

  const upd = (path, val) => {
    setSite((s) => {
      const n = structuredClone(s);
      const keys = path.split('.');
      let o = n;
      keys.slice(0, -1).forEach((k) => (o = o[k]));
      o[keys[keys.length - 1]] = val;
      return n;
    });
    setDirty(true);
  };
  const save = async () => {
    setSaving(true); setNote(null);
    const r = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(site) });
    setSaving(false);
    if (r.ok) { setNote({ ok: true, t: 'Saved. Website updated.' }); setDirty(false); }
    else { const j = await r.json().catch(() => ({})); setNote({ ok: false, t: 'Save failed. ' + (j.error || '') }); }
  };
  const decide = async (id, action) => {
    await fetch('/api/admin/pending', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) });
    load();
  };
  const delMsg = async (id) => {
    await fetch('/api/admin/messages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  if (auth === null) return <div className="login">Loading...</div>;
  if (auth === false)
    return (
      <div className="login">
        <form className="modal" onSubmit={login} style={{ position: 'static' }}>
          <h3>Admin <span className="grad-text">login</span></h3>
          <p style={{ color: 'var(--muted)', marginBottom: 18 }}>Enter your dashboard password.</p>
          {err && <div className="note err">{err}</div>}
          <Field label="Password"><input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
          <button className="btn" style={{ width: '100%', justifyContent: 'center' }}>Login</button>
        </form>
      </div>
    );
  if (!site) return <div className="login">Loading...</div>;

  const s = site;
  return (
    <div className="adm">
      <aside className="adm-side">
        <h2>Dashboard</h2>
        {TABS.map(([k, t]) => (
          <button key={k} className={'tb' + (tab === k ? ' on' : '')} onClick={() => setTab(k)}>
            {t}
            {k === 'testimonials' && pending.length > 0 && <span className="badge">{pending.length}</span>}
            {k === 'messages' && messages.length > 0 && <span className="badge">{messages.length}</span>}
          </button>
        ))}
        <div style={{ marginTop: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/" target="_blank" className="btn sm ghost">View site</Link>
          <button className="btn sm ghost" onClick={logout}>Logout</button>
        </div>
      </aside>

      <div className="adm-main">
        {tab === 'hero' && (<>
          <h1>Hero section</h1><p className="hint">The first screen of your home page.</p>
          <div className="box">
            <Img label="Your photo (shown in the middle)" value={s.hero.photo} max={1600} type={s.hero.cutout ? 'png' : 'jpg'} onChange={(v) => upd('hero.photo', v)} />
            <div className="field">
              <label><input type="checkbox" checked={!!s.hero.cutout} onChange={(e) => upd('hero.cutout', e.target.checked)} style={{ width: 'auto', marginRight: 8 }} />Magazine style (photo without background, standing in front of colour shapes)</label>
              <small style={{ color: 'var(--muted)' }}>For this style the photo must have a transparent background. Upload a PNG cut-out or press the button below.</small>
              {s.hero.photo && (
                <div style={{ marginTop: 10 }}>
                  <button type="button" className="btn sm" disabled={bgBusy} onClick={removeBg}>{bgBusy ? 'Removing background... (first time takes about a minute)' : 'Remove background from this photo'}</button>
                </div>
              )}
            </div>
            <Text label="Background video link (optional, direct .mp4 link)" value={s.hero.bgVideo} onChange={(v) => upd('hero.bgVideo', v)} placeholder="Leave empty for the moving gradient" />
            <Text label="Title" value={s.hero.title} onChange={(v) => upd('hero.title', v)} />
            <Text label="Sub title" area value={s.hero.subtitle} onChange={(v) => upd('hero.subtitle', v)} />
            <div className="row2">
              <Text label="Button text" value={s.hero.ctaText} onChange={(v) => upd('hero.ctaText', v)} />
              <Text label="Button link" value={s.hero.ctaLink} onChange={(v) => upd('hero.ctaLink', v)} placeholder="/contact" />
            </div>
            <Text label="Your name (shown in logo, footer and page titles)" value={s.settings.name} onChange={(v) => upd('settings.name', v)} />
          </div>
        </>)}

        {tab === 'intro' && (<>
          <h1>Introduction</h1><p className="hint">Text on the left and a YouTube video on the right.</p>
          <div className="box">
            <Text label="Heading" value={s.intro.heading} onChange={(v) => upd('intro.heading', v)} />
            <Text label="About you (introduction text)" area value={s.intro.text} onChange={(v) => upd('intro.text', v)} />
            <Text label="Years of experience (number)" value={s.years} onChange={(v) => upd('years', v)} />
            <Text label="YouTube video link" value={s.intro.youtube} onChange={(v) => upd('intro.youtube', v)} placeholder="https://www.youtube.com/watch?v=..." />
          </div>
        </>)}

        {tab === 'works' && (<>
          <h1>My Work</h1><p className="hint">Each item becomes a box. Clicking it opens a gallery page on your website that shows the photos and videos from the Google Drive folder. Keep the folder set to &quot;Anyone with the link can view&quot;.</p>
          <div className="box">
            <div className="item-h"><span>Google Drive connection {dk.set ? '✓ connected' : '(optional but recommended)'}</span></div>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 10 }}>Paste a free Google API key here so photos and videos show in a clean gallery with a lightbox. Without a key, the Drive folder is shown inside a simple frame.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input className="inp" style={{ flex: 1, minWidth: 220 }} placeholder={dk.preview ? 'Saved key: ' + dk.preview : 'Google API key'} value={dk.val} onChange={(e) => setDk({ ...dk, val: e.target.value })} />
              <button className="btn sm" onClick={async () => { await fetch('/api/admin/drivekey', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: dk.val }) }); setDk({ ...dk, val: '', set: !!dk.val, preview: dk.val.slice(0, 6) + '...', msg: 'Saved' }); }}>Save key</button>
            </div>
            {dk.msg && <small style={{ color: '#6ee7b7' }}>{dk.msg}</small>}
          </div>
          <Items list={s.works} onChange={(v) => upd('works', v)} blank={{ title: 'New work', cover: '', link: '', type: '', preview: '' }} addLabel="Add work" title={(w) => w.title || 'Work'}
            render={(w, set) => (<>
              <Text label="Title" value={w.title} onChange={(v) => set({ title: v })} />
              <Img label="Box photo" value={w.cover} onChange={(v) => set({ cover: v })} />
              <Field label="Category (used by the filter buttons)">
                <select className="inp" value={w.type || ''} onChange={(e) => set({ type: e.target.value })}>
                  <option value="">Other</option><option value="video">Video</option><option value="design">Design</option><option value="shoot">Shoot</option>
                </select>
              </Field>
              <Text label="Hover preview video (optional, direct .mp4 link)" value={w.preview} onChange={(v) => set({ preview: v })} placeholder="Short silent clip. Not a Drive link." />
              <Text label="Google Drive link" value={w.link} onChange={(v) => set({ link: v })} placeholder="https://drive.google.com/drive/folders/..." />
            </>)} />
        </>)}


        {(tab === 'services' || tab === 'shoots') && (() => {
          const k = tab;
          const d = s[k];
          return (<>
            <h1>{k === 'services' ? 'Services page' : 'Shoot services'}</h1>
            <p className="hint">{k === 'services' ? 'Shown on the Services page (not on the home page). ' : 'Shown in the separate Shoot section on the Services page. '}Price is optional. Leave it empty to hide the price.</p>
            <div className="box">
              <Text label="Headline" value={d.heading} onChange={(v) => upd(k + '.heading', v)} />
              <Text label="Sub title" area value={d.subtitle} onChange={(v) => upd(k + '.subtitle', v)} />
            </div>
            <Items list={d.items} onChange={(v) => upd(k + '.items', v)} blank={{ title: '', text: '', price: '' }} addLabel={k === 'services' ? 'Add service' : 'Add shoot'} title={(x) => x.title || 'New item'}
              render={(x, set) => (<>
                <Text label="Title" value={x.title} onChange={(v) => set({ title: v })} />
                <Text label="Short description" area value={x.text} onChange={(v) => set({ text: v })} />
                <Text label="Price (optional, e.g. Rs 5,000)" value={x.price} onChange={(v) => set({ price: v })} placeholder="Leave empty to hide" />
              </>)} />
          </>);
        })()}


        {tab === 'plans' && (<>
          <h1>Pricing packages</h1><p className="hint">Shown on the Services page. Leave price empty to show &quot;Custom quote&quot;. Write one feature per line.</p>
          <div className="box">
            <Text label="Headline" value={s.plans.heading} onChange={(v) => upd('plans.heading', v)} />
            <Text label="Sub title" value={s.plans.subtitle} onChange={(v) => upd('plans.subtitle', v)} />
          </div>
          <Items list={s.plans.items} onChange={(v) => upd('plans.items', v)} blank={{ name: '', price: '', note: '', popular: false, features: '' }} addLabel="Add plan" title={(x) => x.name || 'Plan'}
            render={(x, set) => (<>
              <div className="row2">
                <Text label="Plan name" value={x.name} onChange={(v) => set({ name: v })} />
                <Text label="Price (optional)" value={x.price} onChange={(v) => set({ price: v })} placeholder="Rs 9,999" />
              </div>
              <Text label="Price note (optional)" value={x.note} onChange={(v) => set({ note: v })} placeholder="per month" />
              <Text label="Features (one per line)" area value={x.features} onChange={(v) => set({ features: v })} />
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--muted)', fontSize: 14 }}>
                <input type="checkbox" checked={!!x.popular} onChange={(e) => set({ popular: e.target.checked })} /> Mark as &quot;Most popular&quot;
              </label>
            </>)} />
        </>)}

        {tab === 'cases' && (<>
          <h1>Case studies</h1><p className="hint">Shown on the Work page. Add real results only. Untick &quot;Sample&quot; once you add a real one.</p>
          <Items list={s.caseStudies} onChange={(v) => upd('caseStudies', v)} blank={{ title: '', client: '', cover: '', challenge: '', work: '', metrics: [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }], sample: false }} addLabel="Add case study" title={(x) => x.title || 'Case study'}
            render={(x, set) => (<>
              <div className="row2">
                <Text label="Title" value={x.title} onChange={(v) => set({ title: v })} />
                <Text label="Client name" value={x.client} onChange={(v) => set({ client: v })} />
              </div>
              <Img label="Cover photo" value={x.cover} onChange={(v) => set({ cover: v })} />
              <Text label="Challenge (what the client needed)" area value={x.challenge} onChange={(v) => set({ challenge: v })} />
              <Text label="What you did" area value={x.work} onChange={(v) => set({ work: v })} />
              <label style={{ fontSize: 13, color: 'var(--muted)' }}>Results (up to 3)</label>
              {(x.metrics || []).map((m, j) => (
                <div className="row2" key={j} style={{ marginTop: 8 }}>
                  <Text label="Label" value={m.label} onChange={(v) => set({ metrics: x.metrics.map((y, k) => (k === j ? { ...y, label: v } : y)) })} placeholder="Reach" />
                  <Text label="Value" value={m.value} onChange={(v) => set({ metrics: x.metrics.map((y, k) => (k === j ? { ...y, value: v } : y)) })} placeholder="+120%" />
                </div>
              ))}
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--muted)', fontSize: 14 }}>
                <input type="checkbox" checked={!!x.sample} onChange={(e) => set({ sample: e.target.checked })} /> Show &quot;Sample&quot; label
              </label>
            </>)} />
        </>)}

        {tab === 'blog' && (<>
          <h1>Blog</h1><p className="hint">Write tips and articles. In the content box, start a line with ## to make a heading. Blank lines make new paragraphs.</p>
          <Items list={s.posts} onChange={(v) => upd('posts', v)} blank={{ title: '', excerpt: '', cover: '', date: new Date().toISOString().slice(0, 10), content: '', sample: false }} addLabel="Add post" title={(x) => x.title || 'New post'}
            render={(x, set) => (<>
              <Text label="Title" value={x.title} onChange={(v) => set({ title: v })} />
              <Text label="Short summary (shown on the blog list)" area value={x.excerpt} onChange={(v) => set({ excerpt: v })} />
              <div className="row2">
                <Field label="Date"><input type="date" value={x.date} onChange={(e) => set({ date: e.target.value })} /></Field>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--muted)', fontSize: 14, marginTop: 24 }}>
                  <input type="checkbox" checked={!!x.sample} onChange={(e) => set({ sample: e.target.checked })} /> Show &quot;Sample&quot; label
                </label>
              </div>
              <Img label="Cover photo" value={x.cover} onChange={(v) => set({ cover: v })} />
              <Field label="Content"><textarea style={{ minHeight: 260 }} value={x.content} onChange={(e) => set({ content: e.target.value })} /></Field>
            </>)} />
        </>)}

        {tab === 'faqs' && (<>
          <h1>FAQ</h1><p className="hint">Questions and answers shown on the Home and Services pages.</p>
          <Items list={s.faqs} onChange={(v) => upd('faqs', v)} blank={{ q: '', a: '' }} addLabel="Add question" title={(x) => x.q || 'Question'}
            render={(x, set) => (<>
              <Text label="Question" value={x.q} onChange={(v) => set({ q: v })} />
              <Text label="Answer" area value={x.a} onChange={(v) => set({ a: v })} />
            </>)} />
        </>)}

        {tab === 'instagram' && (<>
          <h1>Instagram posts</h1><p className="hint">Paste links of your Instagram posts or reels (like instagram.com/p/xxxx or instagram.com/reel/xxxx). They show on the Home page. The post must be public.</p>
          <Items list={s.instagram} onChange={(v) => upd('instagram', v)} blank={{ url: '' }} addLabel="Add post link" title={(x, i) => x.url || 'Post ' + (i + 1)}
            render={(x, set) => <Text label="Instagram post or reel link" value={x.url} onChange={(v) => set({ url: v })} placeholder="https://www.instagram.com/p/..." />} />
        </>)}

        {tab === 'audit' && (<>
          <h1>Free offer</h1><p className="hint">A banner on the Home and Services pages. Visitors send their page link and you get it in Messages.</p>
          <div className="box">
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
              <input type="checkbox" checked={!!s.audit.enabled} onChange={(e) => upd('audit.enabled', e.target.checked)} /> Show this banner on the website
            </label>
            <Text label="Headline" value={s.audit.heading} onChange={(v) => upd('audit.heading', v)} />
            <Text label="Text" area value={s.audit.text} onChange={(v) => upd('audit.text', v)} />
            <Text label="Button text" value={s.audit.button} onChange={(v) => upd('audit.button', v)} />
          </div>
        </>)}

        {tab === 'stats' && (() => {
          const days = (stats && stats.days) || {};
          const keys = Object.keys(days).sort();
          const today = new Date(Date.now() + 5.5 * 3600 * 1000);
          const last = (n) => Array.from({ length: n }, (_, i) => new Date(today.getTime() - (n - 1 - i) * 86400000).toISOString().slice(0, 10));
          const d14 = last(14);
          const sum = (arr, f) => arr.reduce((a, k) => a + ((days[k] && days[k][f]) || 0), 0);
          const max = Math.max(1, ...d14.map((k) => (days[k] && days[k].views) || 0));
          const agg = (f, arr) => { const o = {}; arr.forEach((k) => Object.entries((days[k] && days[k][f]) || {}).forEach(([n, v]) => (o[n] = (o[n] || 0) + v))); return Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 8); };
          const d30 = last(30);
          const card = (t, v) => (<div className="box" style={{ marginBottom: 0 }}><div style={{ color: 'var(--muted)', fontSize: 13 }}>{t}</div><div style={{ fontSize: 30, fontWeight: 800 }}>{v}</div></div>);
          return (<>
            <h1>Visitors</h1><p className="hint">Simple visitor counts. No personal data is stored. Admin pages are not counted.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 16 }}>
              {card('Today (views)', sum(last(1), 'views'))}
              {card('Last 7 days (views)', sum(last(7), 'views'))}
              {card('Last 30 days (views)', sum(d30, 'views'))}
              {card('Last 30 days (visitors)', sum(d30, 'uniques'))}
              {card('All time (views)', sum(keys, 'views'))}
            </div>
            <div className="box">
              <div className="item-h"><span>Last 14 days</span><small style={{ color: 'var(--muted)' }}>Page views</small></div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 150 }}>
                {d14.map((k) => { const v = (days[k] && days[k].views) || 0; return (
                  <div key={k} title={k + ': ' + v} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 4 }}>
                    <small style={{ color: 'var(--muted)', fontSize: 10 }}>{v || ''}</small>
                    <div style={{ width: '100%', height: Math.max(3, (v / max) * 110), borderRadius: 6, background: 'var(--grad)' }} />
                    <small style={{ color: 'var(--muted)', fontSize: 10 }}>{k.slice(8)}</small>
                  </div>); })}
              </div>
            </div>
            <div className="row2">
              <div className="box"><div className="item-h"><span>Top pages (30 days)</span></div>
                {agg('pages', d30).map(([n, v]) => <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)' }}><span>{n === 'home' ? 'Home' : '/' + n.replace(/_/g, '/')}</span><b>{v}</b></div>)}
                {!agg('pages', d30).length && <p style={{ color: 'var(--muted)' }}>No data yet.</p>}
              </div>
              <div className="box"><div className="item-h"><span>Where visitors come from</span></div>
                {agg('refs', d30).map(([n, v]) => <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)' }}><span>{n === 'direct' ? 'Direct or unknown' : n.replace(/_/g, '.')}</span><b>{v}</b></div>)}
                {!agg('refs', d30).length && <p style={{ color: 'var(--muted)' }}>No data yet.</p>}
              </div>
            </div>
            <button className="btn sm ghost" onClick={load}>Refresh</button>
          </>);
        })()}

        {tab === 'software' && (<>
          <h1>Software</h1><p className="hint">Tools shown as moving logos. Add name and logo. If no logo is uploaded, a coloured badge is shown.</p>
          <Items list={s.software} onChange={(v) => upd('software', v)} blank={{ name: '', logo: '', color: '#3b82f6', group: 'design' }} addLabel="Add software" title={(x) => x.name || 'Software'}
            render={(x, set) => (<>
              <div className="row2">
                <Text label="Name" value={x.name} onChange={(v) => set({ name: v })} />
                <Field label="Group">
                  <select value={x.group} onChange={(e) => set({ group: e.target.value })}>
                    <option value="design">Design and AI software</option>
                    <option value="tech">Technology</option>
                  </select>
                </Field>
              </div>
              <Img label="Logo (square, PNG works best)" type="png" max={300} value={x.logo} onChange={(v) => set({ logo: v })} />
              <Field label="Badge colour (used when no logo)"><input type="color" value={x.color || '#3b82f6'} onChange={(e) => set({ color: e.target.value })} style={{ height: 44, padding: 4 }} /></Field>
            </>)} />
        </>)}

        {tab === 'videos' && (<>
          <h1>Video testimonials</h1><p className="hint">Paste YouTube links. Small thumbnails are shown and the video plays on click.</p>
          <Items list={s.videos} onChange={(v) => upd('videos', v)} blank={{ title: '', url: '' }} addLabel="Add video" title={(x, i) => x.title || 'Video ' + (i + 1)}
            render={(x, set) => (<>
              <Text label="Title (optional)" value={x.title} onChange={(v) => set({ title: v })} />
              <Text label="YouTube link" value={x.url} onChange={(v) => set({ url: v })} placeholder="https://www.youtube.com/watch?v=..." />
            </>)} />
        </>)}

        {tab === 'testimonials' && (<>
          <h1>Testimonials</h1><p className="hint">Testimonials sent from the website wait here. They go live only after you approve.</p>
          {pending.length > 0 && <h3 style={{ margin: '10px 0' }}>Waiting for approval ({pending.length})</h3>}
          {pending.map((p) => (
            <div className="box" key={p.id} style={{ borderColor: 'var(--c)' }}>
              <div className="item-h"><span>{p.name} {p.role && <small style={{ color: 'var(--muted)' }}>· {p.role}</small>}</span><span style={{ color: '#fbbf24' }}>{'★'.repeat(p.rating)}</span></div>
              <p style={{ color: 'var(--muted)', marginBottom: 14 }}>{p.text}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn sm grn" onClick={() => decide(p.id, 'approve')}>Approve</button>
                <button className="btn sm red" onClick={() => decide(p.id, 'reject')}>Reject</button>
              </div>
            </div>
          ))}
          <h3 style={{ margin: '20px 0 10px' }}>Live testimonials</h3>
          <p className="hint">Note: approving reloads the list from the server. Save any other changes first.</p>
          <Items list={s.testimonials} onChange={(v) => upd('testimonials', v)} blank={{ name: '', role: '', rating: 5, text: '' }} addLabel="Add testimonial" title={(x) => x.name || 'Testimonial'}
            render={(x, set) => (<>
              <div className="row2">
                <Text label="Client name" value={x.name} onChange={(v) => set({ name: v })} />
                <Text label="Company or role" value={x.role} onChange={(v) => set({ role: v })} />
              </div>
              <Field label="Rating">
                <select value={x.rating} onChange={(e) => set({ rating: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                </select>
              </Field>
              <Text label="Testimonial" area value={x.text} onChange={(v) => set({ text: v })} />
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--muted)', fontSize: 14 }}>
                <input type="checkbox" checked={!!x.sample} onChange={(e) => set({ sample: e.target.checked })} /> Show &quot;Sample&quot; label (tick for placeholder text, untick for real reviews)
              </label>
            </>)} />
        </>)}

        {tab === 'experience' && (<>
          <h1>Experience</h1><p className="hint">Companies you have worked with. Shown on the Experience page.</p>
          <div className="box"><Text label="Total years of experience" value={s.years} onChange={(v) => upd('years', v)} /></div>
          <Items list={s.experience} onChange={(v) => upd('experience', v)} blank={{ company: '', role: '', period: '', detail: '', logo: '' }} addLabel="Add company" title={(x) => x.company || 'Company'}
            render={(x, set) => (<>
              <div className="row2">
                <Text label="Company name" value={x.company} onChange={(v) => set({ company: v })} />
                <Text label="Your role" value={x.role} onChange={(v) => set({ role: v })} />
              </div>
              <Text label="Period" value={x.period} onChange={(v) => set({ period: v })} placeholder="2023 - 2024" />
              <Text label="What you did (short)" area value={x.detail} onChange={(v) => set({ detail: v })} />
              <Img label="Company logo (optional)" type="png" max={300} value={x.logo} onChange={(v) => set({ logo: v })} />
            </>)} />
        </>)}

        {tab === 'about' && (<>
          <h1>About page</h1><p className="hint">Your journey on the left, photo on the right, achievements below.</p>
          <div className="box">
            <Text label="Heading" value={s.about.heading} onChange={(v) => upd('about.heading', v)} />
            <Text label="About text" area value={s.about.text} onChange={(v) => upd('about.text', v)} />
            <Img label="Photo" value={s.about.photo} onChange={(v) => upd('about.photo', v)} />
          </div>
          <h3 style={{ margin: '20px 0 10px' }}>Achievements</h3>
          <Items list={s.achievements} onChange={(v) => upd('achievements', v)} blank={{ title: '', subtitle: '', text: '', photo: '' }} addLabel="Add achievement" title={(x) => x.title || 'Achievement'}
            render={(x, set) => (<>
              <Img label="Photo" value={x.photo} onChange={(v) => set({ photo: v })} />
              <Text label="Title (highlighted)" value={x.title} onChange={(v) => set({ title: v })} />
              <Text label="Sub title" value={x.subtitle} onChange={(v) => set({ subtitle: v })} />
              <Text label="Text" area value={x.text} onChange={(v) => set({ text: v })} />
            </>)} />
        </>)}

        {tab === 'settings' && (<>
          <h1>Contact and social links</h1><p className="hint">Change your phone, WhatsApp and social links. The website updates everywhere.</p>
          <div className="box">
            <div className="row2">
              <Text label="Phone (for the Call button)" value={s.settings.phone} onChange={(v) => upd('settings.phone', v)} />
              <Text label="WhatsApp number (for the WhatsApp button)" value={s.settings.whatsapp} onChange={(v) => upd('settings.whatsapp', v)} />
            </div>
            <Text label="WhatsApp starting message" value={s.settings.whatsappMessage} onChange={(v) => upd('settings.whatsappMessage', v)} />
            <div className="row2">
              <Text label="Email" value={s.settings.email} onChange={(v) => upd('settings.email', v)} />
              <Text label="Address" value={s.settings.address} onChange={(v) => upd('settings.address', v)} />
            </div>
          </div>
          <div className="box">
            <Text label="Instagram link" value={s.settings.socials.instagram} onChange={(v) => upd('settings.socials.instagram', v)} />
            <Text label="LinkedIn link" value={s.settings.socials.linkedin} onChange={(v) => upd('settings.socials.linkedin', v)} />
            <Text label="Facebook link" value={s.settings.socials.facebook} onChange={(v) => upd('settings.socials.facebook', v)} />
            <Text label="YouTube link" value={s.settings.socials.youtube} onChange={(v) => upd('settings.socials.youtube', v)} />
          </div>
        </>)}

        {tab === 'messages' && (<>
          <h1>Messages</h1><p className="hint">Contact form messages and service bookings.</p>
          {messages.map((m) => (
            <div className="box" key={m.id}>
              <div className="item-h"><span>{m.name} <small style={{ color: 'var(--muted)' }}>{m.email && '· ' + m.email}</small></span><small style={{ color: 'var(--muted)' }}>{new Date(m.date).toLocaleString()}</small></div>
              {m.type === 'booking' && <p style={{ color: 'var(--c)', fontSize: 13, letterSpacing: 1 }}>SERVICE BOOKING</p>}
              {m.type === 'audit' && <p style={{ color: 'var(--c)', fontSize: 13, letterSpacing: 1 }}>FREE CHECK REQUEST</p>}
              {m.profile && <p style={{ fontSize: 14 }}>Page link: <a href={m.profile} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--b)' }}>{m.profile}</a></p>}
              {m.phone && <p style={{ fontSize: 14 }}>Phone: <a href={'tel:' + m.phone} style={{ color: 'var(--b)' }}>{m.phone}</a></p>}
              {m.service && <p style={{ color: 'var(--b)', fontSize: 14 }}>Service: {m.service}</p>}
              <p style={{ margin: '6px 0 12px', whiteSpace: 'pre-wrap' }}>{m.message}</p>
              <button className="btn sm red" onClick={() => delMsg(m.id)}>Delete</button>
            </div>
          ))}
          {!messages.length && <div className="empty">No messages yet.</div>}
        </>)}

        {!['messages', 'stats'].includes(tab) && (
          <div className="savebar">
            <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
            {dirty && <span style={{ color: '#fbbf24', fontSize: 14 }}>Unsaved changes</span>}
            {note && <span className={'note ' + (note.ok ? 'ok' : 'err')} style={{ margin: 0 }}>{note.t}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
