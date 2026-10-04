'use client';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import Icon from './Icons';
import TypeLine from './TypeLine';

export default function Hero({ hero, settings, years, words: typed = [] }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 14 });
  const sy = useSpring(my, { stiffness: 70, damping: 14 });
    const phX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const bgX = useTransform(sx, [-0.5, 0.5], [18, -18]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 700], [0, -70]);
  const yPhoto = useTransform(scrollY, [0, 700], [0, 90]);
  const yShapes = useTransform(scrollY, [0, 700], [0, 160]);
  const yBg = useTransform(scrollY, [0, 700], [0, 120]);
  const cut = !!hero.cutout && !!hero.photo;
  const words = hero.title.split(' ');

  return (
    <section className={'hero' + (cut ? ' mag' : '')} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="hero-bg" style={{ y: yBg }} aria-hidden="true">
        {hero.bgVideo ? <video src={hero.bgVideo} autoPlay muted loop playsInline /> : <div className="mesh" />}
        <div className="veil" />
      </motion.div>
      <div className="wrap hero-grid">
        <motion.div style={{ y: yText }}>
          <motion.span className="tag" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <i /> Available for new projects
          </motion.span>
          <h1>
            {words.map((w, i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block', marginRight: '0.28em' }}
                className={i >= Math.ceil(words.length / 2) ? 'grad-text' : ''}
                initial={{ opacity: 0, y: 40, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.35 + i * 0.09, duration: 0.6 }}
              >
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p className="sub" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            {hero.subtitle}
          </motion.p>
          {typed.length > 0 && <TypeLine words={typed} />}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'inherit' }}>
            <Link href={hero.ctaLink || '/contact'} className="btn">{hero.ctaText || "Let's Collaborate"} <span>→</span></Link>
            <Link href="/work" className="btn ghost">View My Work</Link>
          </motion.div>
        </motion.div>

        <motion.div className="stage" style={{ perspective: 1000, y: yPhoto }}>
          <motion.div style={{ x: bgX, position: 'absolute', inset: 0 }}>
            <div className="orbit"><i /></div>
            <div className="orbit o2"><i /></div>
          </motion.div>

          {cut && (
            <motion.div className="shapes" style={{ y: yShapes, x: bgX }}>
              <i className="sh s1" /><i className="sh s2" /><i className="sh s3" /><i className="sh s4" />
              <b className="mag-word">{settings.name.split(' ')[0]}</b>
            </motion.div>
          )}
          {cut ? (
            <motion.img className="cutout" src={hero.photo} alt={settings.name} style={{ x: phX }} initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1 }} />
          ) : (
          <motion.div className="photo-frame" style={{ x: phX }} initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1 }}>
            <div className="in">
              {hero.photo ? (
                <img src={hero.photo} alt={settings.name} />
              ) : (
                <div className="ph"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>Upload your photo from the dashboard</div>
              )}
            </div>
          </motion.div>
          )}

          <motion.div className="fbadge fb1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 }}>
            <span className="d">★</span><span><b>{years}+ Years</b><small>Experience</small></span>
          </motion.div>
          <motion.div className="fbadge fb2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}>
            <span className="d">▶</span><span><b>Video &amp; AI</b><small>Content creator</small></span>
          </motion.div>
          <motion.div className="fbadge fb3" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
            <span className="d">↗</span><span><b>Growth</b><small>Social &amp; Ads</small></span>
          </motion.div>
        </motion.div>

        <motion.div className="socials" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}>
          {['instagram', 'linkedin', 'facebook', 'youtube'].map((k) =>
            settings.socials?.[k] ? (
              <a key={k} className="soc" href={settings.socials[k]} target="_blank" rel="noopener noreferrer" aria-label={k}><Icon name={k} /></a>
            ) : (
              <span key={k} className="soc" style={{ opacity: 0.5 }} title="Add link from dashboard"><Icon name={k} /></span>
            )
          )}
        </motion.div>
      </div>
      <div className="scroll-dot" />
    </section>
  );
}
