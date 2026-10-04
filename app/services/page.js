import { getSite } from '@/lib/db';
import { Plans, FAQ } from '@/components/Extras';
import { ServiceGrid, ShootSection, BookForm } from '@/components/Services';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Services | Keshav Kumar' };
export default async function Services() {
  const s = await getSite();
  const options = [
    { label: 'Packages', items: s.plans.items.map((x) => x.name + ' plan') },
    { label: 'Services', items: s.services.items.map((x) => x.title) },
    { label: 'Shoots', items: s.shoots.items.map((x) => x.title) },
  ].filter((g) => g.items.length);
  return (
    <>
      <div className="page-top wrap">
        <span className="wm-word">SERVICES</span>
        <span className="kicker">Services</span>
        <h1>Services &amp; <span className="grad-text">Shoots</span></h1>
        <p>Digital marketing, creative and shoot services to help your brand grow.</p>
      </div>
      <ServiceGrid data={s.services} />
      <ShootSection data={s.shoots} />
      <Plans data={s.plans} />
      <BookForm options={options} />
      <FAQ items={s.faqs} />
    </>
  );
}
