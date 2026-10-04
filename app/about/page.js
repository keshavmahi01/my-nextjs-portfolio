import { getSite } from '@/lib/db';
import Reveal from '@/components/Reveal';
import { Head } from '@/components/Sections';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'About | Keshav Kumar' };
export default async function About() {
  const s = await getSite();
  return (
    <>
      <div className="page-top wrap">
        <span className="wm-word">ABOUT</span>
        <span className="kicker">About</span>
        <h1>About <span className="grad-text">{s.settings.name.split(' ')[0]}</span></h1>
      </div>
      <section className="sec" style={{ paddingTop: 50 }}>
        <div className="wrap about-grid">
          <Reveal x={-40} y={0}>
            <h2 style={{ fontSize: 'clamp(26px,3.6vw,38px)', fontWeight: 800, marginBottom: 16 }}>{s.about.heading}</h2>
            <p>{s.about.text}</p>
            <div className="facts">
              <span className="fact">📍 {s.settings.address}</span>
              <span className="fact">⭐ {s.years}+ years experience</span>
              <span className="fact">🎯 Social media &amp; digital marketing</span>
            </div>
          </Reveal>
          <Reveal x={40} y={0}>
            <div className="about-photo">
              <div className="fr" />
              <div className="im">{s.about.photo ? <img src={s.about.photo} alt={s.settings.name} /> : <div className="ph">Upload a photo from the dashboard</div>}</div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <Head kicker="Milestones" title={<>My <span className="grad-text">Achievements</span></>} />
          <div className="ach">
            {s.achievements.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.07}>
                <div className="acard">
                  {a.photo && <img src={a.photo} alt={a.title} />}
                  <div className="bd">
                    <h3>{a.title}</h3>
                    {a.subtitle && <div className="st">{a.subtitle}</div>}
                    {a.text && <p>{a.text}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {!s.achievements.length && <div className="empty">Achievements will appear here once added from the dashboard.</div>}
        </div>
      </section>
    </>
  );
}
