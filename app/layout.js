import './globals.css';
import Shell from '@/components/Shell';
import { getSite } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Keshav Kumar | Social Media Expert & Digital Marketing Specialist',
  description: 'Portfolio of Keshav Kumar, social media expert and digital marketing specialist based in Zirakpur, Punjab.',
};

export default async function RootLayout({ children }) {
  const site = await getSite();
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('kk_theme');if(t)document.documentElement.dataset.theme=t}catch(e){}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Shell settings={site.settings} services={site.services.items}>{children}</Shell>
      </body>
    </html>
  );
}
