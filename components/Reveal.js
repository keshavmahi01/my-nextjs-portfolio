'use client';
import { motion } from 'framer-motion';

export default function Reveal({ children, delay = 0, y = 40, x = 0, className, as = 'div', scale = 1 }) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, x, scale: scale === 1 ? 1 : 0.92 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.8, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

export function Tilt({ children, className, href, target, rel, onEnter, onLeave, max = 10 }) {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--mx', ((px + 0.5) * 100) + '%');
    el.style.setProperty('--my', ((py + 0.5) * 100) + '%');
    el.style.transform = `perspective(800px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-6px)`;
  };
  const reset = (e) => { e.currentTarget.style.transform = ''; onLeave && onLeave(); };
  const props = { className, onMouseMove: onMove, onMouseLeave: reset, onMouseEnter: () => onEnter && onEnter(), style: { transition: 'transform .25s ease, border-color .3s, box-shadow .3s' } };
  if (href) return <a href={href} target={target} rel={rel} {...props}>{children}</a>;
  return <div {...props}>{children}</div>;
}
