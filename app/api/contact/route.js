import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getKV, setKV, getSite } from '@/lib/db';
import { uid } from '@/lib/util';
export async function POST(req) {
  const b = await req.json();
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const msg = {
    id: uid(),
    name: String(b.name || '').slice(0, 100),
    email: String(b.email || '').slice(0, 120),
    phone: String(b.phone || '').slice(0, 30),
    type: ['booking', 'audit'].includes(b.type) ? b.type : 'enquiry',
    profile: String(b.profile || '').slice(0, 300),
    service: String(b.service || '').slice(0, 100),
    message: String(b.message || '').slice(0, 2000),
    date: new Date().toISOString(),
  };
  if (msg.type === 'audit') {
    if (!msg.name || !msg.phone || !msg.profile)
      return NextResponse.json({ error: 'Please fill name, phone and your page link.' }, { status: 400 });
  } else if (msg.type === 'booking') {
    if (!msg.name || !msg.phone || !msg.service)
      return NextResponse.json({ error: 'Please fill name, phone and service.' }, { status: 400 });
  } else if (!msg.name || !msg.email || !msg.message)
    return NextResponse.json({ error: 'Please fill name, email and message.' }, { status: 400 });

  const list = await getKV('messages', []);
  list.unshift(msg);
  await setKV('messages', list.slice(0, 500));

  let emailed = false;
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const site = await getSite();
      const t = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: Number(process.env.SMTP_PORT || 465) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await t.sendMail({
        from: `"Website" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO || site.settings.email,
        replyTo: msg.email || undefined,
        subject: `${msg.type === 'booking' ? 'New BOOKING' : msg.type === 'audit' ? 'FREE CHECK request' : 'New enquiry'}: ${msg.service || 'General'} from ${msg.name}`,
        text: `Name: ${msg.name}\nPhone: ${msg.phone}\nEmail: ${msg.email}\nService: ${msg.service}\nPage link: ${msg.profile}\n\n${msg.message}`,
      });
      emailed = true;
    } catch (e) {
      console.error('mail failed', e.message);
    }
  }
  return NextResponse.json({ ok: true, emailed });
}
