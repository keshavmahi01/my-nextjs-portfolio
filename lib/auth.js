import crypto from 'crypto';
import { cookies } from 'next/headers';

const secret = () => process.env.AUTH_SECRET || 'dev-secret-change-me';
export const adminPassword = () => process.env.ADMIN_PASSWORD || 'admin123';

export function makeToken() {
  return crypto.createHmac('sha256', secret()).update('keshav-admin').digest('hex');
}

export function isAdmin() {
  const c = cookies().get('kk_admin');
  if (!c) return false;
  const a = Buffer.from(c.value);
  const b = Buffer.from(makeToken());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
