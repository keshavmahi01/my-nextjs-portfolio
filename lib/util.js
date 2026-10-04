export function ytId(url = '') {
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : '';
}
export function waLink(number, message) {
  let n = String(number || '').replace(/\D/g, '');
  if (n.length === 10) n = '91' + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(message || '')}`;
}
export function telLink(number) {
  let n = String(number || '').replace(/[^\d+]/g, '');
  if (n.length === 10) n = '+91' + n;
  return `tel:${n}`;
}
export const uid = () => Math.random().toString(36).slice(2, 9);

export function slugify(t = '') {
  return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'post';
}
export function igCode(url = '') {
  const m = String(url).match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : '';
}
