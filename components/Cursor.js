'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf;
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px)`;
      const t = e.target.closest ? e.target.closest('a,button,.gitem,.wcard,input,select,textarea,label') : null;
      ring.current && ring.current.classList.toggle('big', !!t);
    };
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move);
    loop();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); document.documentElement.classList.remove('has-cursor'); };
  }, []);
  return (<><div ref={ring} className="cur-ring" /><div ref={dot} className="cur-dot" /></>);
}
