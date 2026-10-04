'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal, { Tilt } from './Reveal';

function Pic({ src, alt, className, onClick, style }) {
  const [ok, setOk] = useState(false);
  return <img className={(className || '') + (ok ? ' ld' : ' sk')} src={src} alt={alt} loading="lazy" onLoad={() => setOk(true)} onClick={onClick} style={style} />;
}

const thumb = (id, w) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;

export default function Gallery({ items }) {
  const [i, setI] = useState(null);
  const [filter, setFilter] = useState('all');
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState('50% 50%');
  const [ready, setReady] = useState(false);
  const touch = useRef(null);
  const list = items.filter((x) => filter === 'all' || x.type === filter);
  const has = { image: items.some((x) => x.type === 'image'), video: items.some((x) => x.type === 'video') };

  const go = useCallback((d) => { setZoom(false); setReady(false); setI((x) => (x === null ? x : (x + d + list.length) % list.length)); }, [list.length]);
  useEffect(() => {
    if (i === null) return;
    const k = (e) => { if (e.key === 'Escape') setI(null); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [i, go]);

  const cur = i !== null ? list[i] : null;
  return (
    <>
      {has.image && has.video && (
        <div className="gfilter">
          {[['all', 'All'], ['image', 'Photos & designs'], ['video', 'Videos']].map(([k, t]) => (
            <button key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{t}</button>
          ))}
        </div>
      )}
      <div className="gal">
        {list.map((x, n) => (
          <Reveal key={x.id} delay={(n % 6) * 0.05} scale={0.9}>
            <Tilt className="gtilt" max={7}>
            <button className="gitem" onClick={() => { setI(n); setZoom(false); }} aria-label={x.name}>
              <Pic src={thumb(x.id, 700)} alt={x.name} />
              {x.type === 'video' && <span className="gplay"><b><svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg></b></span>}
              <span className="gcap">{x.name.replace(/\.[^.]+$/, '')}</span>
            </button>
            </Tilt>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {cur && (
          <motion.div className="lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setI(null)}>
            <button className="lb-x" onClick={() => setI(null)} aria-label="Close">✕</button>
            <button className="lb-a l" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous">←</button>
            <button className="lb-a r" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next">→</button>
            <motion.div key={cur.id} className="lb-in" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => { if (touch.current === null || zoom) return; const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); touch.current = null; }}>
              {cur.type === 'video' ? (
                <iframe src={`https://drive.google.com/file/d/${cur.id}/preview`} allow="autoplay; fullscreen" allowFullScreen title={cur.name} />
              ) : (
                <div className={'zoomer' + (zoom ? ' z' : '') + (ready ? '' : ' sk')}>
                  <img
                    src={thumb(cur.id, 2400)} alt={cur.name} onLoad={() => setReady(true)}
                    onClick={() => setZoom((z) => !z)}
                    onMouseMove={(e) => { if (!zoom) return; const r = e.currentTarget.parentElement.getBoundingClientRect(); setPos(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }}
                    style={zoom ? { transformOrigin: pos } : undefined}
                  />
                </div>
              )}
              <div className="lb-c">
                {i + 1} / {list.length}
                {cur.type !== 'video' && <span> &nbsp;·&nbsp; {zoom ? 'Click to zoom out' : 'Click photo to zoom'}</span>}
                &nbsp;·&nbsp; <a href={`https://drive.google.com/file/d/${cur.id}/view`} target="_blank" rel="noopener noreferrer">Open in Drive</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
