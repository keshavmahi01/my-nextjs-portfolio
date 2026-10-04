'use client';
import { useEffect, useState } from 'react';

export default function TypeLine({ words }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i % words.length] || '';
    let t;
    if (!del && n < w.length) t = setTimeout(() => setN(n + 1), 90);
    else if (!del && n === w.length) t = setTimeout(() => setDel(true), 1300);
    else if (del && n > 0) t = setTimeout(() => setN(n - 1), 45);
    else { setDel(false); setI((x) => (x + 1) % words.length); }
    return () => clearTimeout(t);
  }, [n, del, i, words]);
  const w = words[i % words.length] || '';
  return (
    <p className="typeline">I do <b className="grad-text">{w.slice(0, n)}</b><i className="caret" /></p>
  );
}
