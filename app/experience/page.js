import { getSite } from '@/lib/db';
import Reveal from '@/components/Reveal';
import { Testimonials } from '@/components/Sections';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Experience | Keshav Kumar' };
export default async function Experience() {
  const s = await getSite();
  return (
    <>
      <div className="page-top wrap">
        <span className="wm-word">EXPERIENCE</span>
        <span className="kicker">Experience</span>
        <h1>{s.years}+ years of <span className="grad-text">real work</span></h1>
        <p>Brands and companies I have worked with.</p>
      </div>
      <section className="sec" style={{ paddingTop: 50 }}>
        <div className="wrap">
          <div className="timeline">
            {s.experience.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.05} x={-30} y={0}>
                <div className="tl">
                  <div className="cl">{e.logo ? <img src={e.logo} alt={e.company} /> : e.company[0]}</div>
                  <div>
                    <h3>{e.company}</h3>
                    <div className="per">{[e.role, e.period].filter(Boolean).join(' · ')}</div>
                    {e.detail && <p>{e.detail}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
            {!s.experience.length && <div className="empty">Companies will appear here once added from the dashboard.</div>}
          </div>
        </div>
      </section>
      <Testimonials items={s.testimonials} />
    </>
  );
}
