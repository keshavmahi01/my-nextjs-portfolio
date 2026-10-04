import { getSite } from '@/lib/db';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icons';
import ContactForm from '@/components/ContactForm';
import { telLink, waLink } from '@/lib/util';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Contact | Keshav Kumar' };
export default async function Contact() {
  const s = await getSite();
  const st = s.settings;
  return (
    <>
      <div className="page-top wrap">
        <span className="wm-word">CONTACT</span>
        <span className="kicker">Contact</span>
        <h1>Let&apos;s <span className="grad-text">connect</span></h1>
        <p>Have a project or a question? Send a message and I will reply as soon as I can.</p>
      </div>
      <section className="sec" style={{ paddingTop: 50 }}>
        <div className="wrap">
          <Reveal className="quick">
            <a className="qcard" href={telLink(st.phone)}><span className="ic"><Icon name="phone" /></span><span><small>Call me</small><b>{st.phone}</b></span></a>
            <a className="qcard" href={waLink(st.whatsapp, st.whatsappMessage)} target="_blank" rel="noopener noreferrer"><span className="ic"><Icon name="whatsapp" /></span><span><small>WhatsApp</small><b>Chat now</b></span></a>
            <a className="qcard" href={`mailto:${st.email}`}><span className="ic"><Icon name="mail" /></span><span><small>Email</small><b>Write to me</b></span></a>
          </Reveal>
        </div>
        <div className="wrap contact-grid">
          <Reveal x={-40} y={0} className="panel">
            <h3 style={{ marginBottom: 18, fontSize: 22 }}>Send a message</h3>
            <ContactForm services={[...s.services.items, ...s.shoots.items].map((w) => w.title)} />
          </Reveal>
          <Reveal x={40} y={0} className="panel">
            <h3 style={{ marginBottom: 6, fontSize: 22 }}>Contact details</h3>
            <a className="cinfo" href={telLink(st.phone)}><span className="ic"><Icon name="phone" /></span><span><small>Phone / WhatsApp</small>{st.phone}</span></a>
            <a className="cinfo" href={`mailto:${st.email}`}><span className="ic"><Icon name="mail" /></span><span><small>Email</small>{st.email}</span></a>
            <div className="cinfo"><span className="ic"><Icon name="pin" /></span><span><small>Address</small>{st.address}</span></div>
            <div className="map">
              <iframe title="Map" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(st.address)}&output=embed`} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
