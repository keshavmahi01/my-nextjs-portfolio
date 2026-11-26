'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import Icon, { Wordmark } from './Icons';
import { waLink, telLink } from '@/lib/util';
import Smooth from './Smooth';
import ThemeToggle from './ThemeToggle';

const links = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/services', 'Services'],
  ['/blog', 'Blog'],
  ['/experience', 'Experience'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export function Modal({ children, onClose, wide }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className={'modal' + (wide ? ' wide' : '')}
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="x" onClick={onClose} aria-label="Close">✕</button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function TalkModal({ s, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h3>Let&apos;s <span className="grad-text">talk</span></h3>
      <p style={{ color: 'var(--muted)' }}>Choose how you would like to reach me.</p>
      <a className="opt" href={telLink(s.phone)}>
        <span className="ic" style={{ background: 'var(--grad)' }}><Icon name="phone" /></span>
        <span><b>Call</b><small>{s.phone}</small></span>
      </a>
      <a className="opt" href={waLink(s.whatsapp, s.whatsappMessage)} target="_blank" rel="noopener noreferrer">
        <span className="ic" style={{ background: '#25d366' }}><Icon name="whatsapp" /></span>
        <span><b>WhatsApp</b><small>{s.whatsapp}</small></span>
      </a>
    </Modal>
  );
}

export default function Shell({ settings, services = [], works = [], children }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [talk, setTalk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('kk_seen') === '1'; sessionStorage.setItem('kk_seen', '1'); } catch {}
    const t = setTimeout(() => setLoading(false), seen ? 0 : 1300);
    // magnetic buttons
    const move = (e) => {
      const b = e.target.closest && e.target.closest('.btn, .soc, .plus-btn');
      if (!b || window.matchMedia('(pointer:coarse)').matches) return;
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
      b.style.transform = `translate(${dx}px, ${dy - 3}px)`;
    };
    const out = (e) => {
      const b = e.target.closest && e.target.closest('.btn, .soc, .plus-btn');
      if (b) b.style.transform = '';
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseout', out);
    return () => { clearTimeout(t); document.removeEventListener('mousemove', move); document.removeEventListener('mouseout', out); };
  }, []);

  useEffect(() => {
    const f = () => { setScrolled(window.scrollY > 20); setShowTop(window.scrollY > 700); };
    f();
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (path.startsWith('/admin')) return;
    try {
      const day = new Date().toISOString().slice(0, 10);
      const unique = localStorage.getItem('kk_day') !== day;
      if (unique) localStorage.setItem('kk_day', day);
      let ref = 'direct';
      if (document.referrer) {
        const h = new URL(document.referrer).hostname.replace(/^www\./, '');
        if (h && h !== location.hostname) ref = h;
      }
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, unique, ref }), keepalive: true });
    } catch {}
  }, [path]);

  const isAdmin = path.startsWith('/admin');
  if (isAdmin) return children;

  return (
    <>
      <Smooth />
      <motion.div className="progress" style={{ scaleX: prog }} />
      <AnimatePresence>
        {loading && (
          <motion.div className="loader" exit={{ opacity: 0, transition: { duration: 0.6 } }}>
            <motion.div initial={{ scale: 0.7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 14 }} style={{ fontSize: 44 }}><Wordmark name={settings.name} /></motion.div>
            <div className="bar"><motion.i initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.1 }} /></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-orbs">
        <div className="orb o1" /><div className="orb o2" /><div className="orb o3" /><div className="grid-bg" />
        {Array.from({ length: 16 }).map((_, i) => <span key={i} className="dust" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${-(i * 1.7) % 14}s`, animationDuration: `${12 + (i % 5) * 3}s`, width: 2 + (i % 3), height: 2 + (i % 3) }} />)}
      </div>
      <motion.header className={'hdr' + (scrolled ? ' scrolled' : '')} initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
        <div className="wrap hdr-in">
          <Link href="/" className="logo"><Wordmark name={settings.name} /></Link>
          <nav className={'nav' + (open ? ' open' : '')}>
            {links.map(([h, t]) => (
              <Link key={h} href={h} className={'nl' + (path === h ? ' on' : '')}>
                {path === h && <motion.span layoutId="navpill" className="navpill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                {t}
              </Link>
            ))}
            <ThemeToggle />
            <button className="btn sm" onClick={() => { setTalk(true); setOpen(false); }}>Let&apos;s Talk</button>
          </nav>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </motion.header>

      <main id="top">
        {children}
      </main>

      <footer className="ftr">
        <div className="wrap">
          <div className="ftr-cta">
            <div>
              <h3>Have a project in mind?</h3>
              <p>Call or message me. I usually reply the same day.</p>
            </div>
            <div className="ftr-btns">
              <a className="btn" href={waLink(settings.whatsapp, settings.whatsappMessage)} target="_blank" rel="noopener noreferrer">WhatsApp me</a>
              <a className="btn ghost" href={telLink(settings.phone)}>Call now</a>
            </div>
          </div>
          <div className="ftr-grid">
            <div>
              <Link href="/" className="logo"><Wordmark name={settings.name} /></Link>
              <p style={{ color: 'var(--muted)', marginTop: 14, maxWidth: 320 }}>
                Social media expert and digital marketing specialist. Let&apos;s build something people love.
              </p>
              <div className="socials" style={{ flexDirection: 'row', marginTop: 18, justifyContent: 'flex-start' }}>
                {['instagram', 'linkedin', 'facebook', 'youtube'].map((k) =>
                  settings.socials?.[k] ? (
                    <a key={k} className="soc" href={settings.socials[k]} target="_blank" rel="noopener noreferrer" aria-label={k}><Icon name={k} /></a>
                  ) : null
                )}
              </div>
            </div>
            <div>
              <h4>Quick links</h4>
              {links.map(([h, t]) => <Link key={h} href={h} className="fl">{t}</Link>)}
            </div>
            <div>
              <h4>Services</h4>
              {services.slice(0, 6).map((x, i) => <Link key={i} href="/services" className="fl">{x.title}</Link>)}
              {!services.length && <Link href="/services" className="fl">All services</Link>}
            </div>
            <div>
              <h4>Contact</h4>
              <a className="fl" href={telLink(settings.phone)}>{settings.phone}</a>
              <a className="fl" href={`mailto:${settings.email}`}>{settings.email}</a>
              <span className="fl">{settings.address}</span>
            </div>
          </div>
          <div className="copy">
            <span>© {new Date().getFullYear()} {settings.name}. All rights reserved. Made by Keshav.</span>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top ↑</a>
          </div>
        </div>
      </footer>

      <motion.a
        className="wa"
        href={waLink(settings.whatsapp, settings.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <Icon name="whatsapp" />
      </motion.a>

      {settings.socials?.instagram && (
        <motion.a
          className="ig-float"
          href={settings.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on Instagram"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.15, type: 'spring' }}
        >
          <Icon name="instagram-filled" />
        </motion.a>
      )}

      <AnimatePresence>
        {showTop && (
          <motion.button className="totop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>{talk && <TalkModal s={settings} onClose={() => setTalk(false)} />}</AnimatePresence>
    </>
  );
}
