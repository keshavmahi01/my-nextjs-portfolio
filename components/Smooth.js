'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function Smooth() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const l = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (t) => { l.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); l.destroy(); };
  }, []);
  return null;
}
