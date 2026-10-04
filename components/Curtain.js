'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Curtain() {
  const path = usePathname();
  const first = useRef(true);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setShow(true);
    const t = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(t);
  }, [path]);
  return (
    <AnimatePresence>
      {show && (
        <div className="curtain" key={path}>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.i key={i} initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.76, 0, 0.24, 1] }} style={{ transformOrigin: 'top' }} />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
