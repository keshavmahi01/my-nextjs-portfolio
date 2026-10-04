import { getSite } from '@/lib/db';
import { CaseStudies } from '@/components/Extras';
import { WorkRows, Software } from '@/components/Sections';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'My Work | Keshav Kumar' };
export default async function Work() {
  const s = await getSite();
  return (
    <>
      <div className="page-top wrap">
        <span className="wm-word">WORK</span>
        <span className="kicker">Portfolio</span>
        <h1>My <span className="grad-text">Work</span></h1>
        <p>Everything I create, from graphic design and video editing to AI videos, shoots and podcasts.</p>
      </div>
      <section className="sec" style={{ paddingTop: 50 }}>
        <div className="wrap"><WorkRows works={s.works} /></div>
      </section>
      <CaseStudies items={s.caseStudies} />
      <Software software={s.software} />
    </>
  );
}
