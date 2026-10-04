import { getSite } from '@/lib/db';
import Hero from '@/components/Hero';
import { CaseStudies, FAQ, InstagramFeed } from '@/components/Extras';
import { TextBand, Intro, WorkGrid, Software, VideoTestimonials, Testimonials, Head } from '@/components/Sections';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const s = await getSite();
  return (
    <>
      <Hero hero={s.hero} settings={s.settings} years={s.years} words={s.works.map((w) => w.title)} />
      <TextBand items={s.works.map((w) => w.title)} />
      <Intro intro={s.intro} years={s.years} worksCount={s.works.length} />
      <section className="sec">
        <div className="wrap">
          <Head kicker="Portfolio" title={<>My <span className="grad-text">Work</span></>} sub="From design to video, ads and shoots. Pick a category to see the work." />
          <WorkGrid works={s.works} />
        </div>
      </section>
      <Software software={s.software} />
      <InstagramFeed items={s.instagram} link={s.settings.socials.instagram} />
      <VideoTestimonials videos={s.videos} />
      <Testimonials items={s.testimonials} />
      <FAQ items={s.faqs} />
    </>
  );
}
