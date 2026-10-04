import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSite } from '@/lib/db';
import { folderId, listFolder } from '@/lib/drive';
import Gallery from '@/components/Gallery';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const s = await getSite();
  const w = s.works.find((x) => x.id === params.id);
  return w ? { title: `${w.title} | Keshav Kumar` } : {};
}
export default async function WorkGallery({ params }) {
  const s = await getSite();
  const w = s.works.find((x) => x.id === params.id);
  if (!w) notFound();
  const fid = folderId(w.link);
  const res = fid ? await listFolder(fid) : { items: [] };
  return (
    <>
      <div className="page-top wrap">
        <span className="wm-word">{w.title.split(' ')[0].toUpperCase()}</span>
        <span className="kicker">Portfolio</span>
        <h1>{w.title}</h1>
        <p><Link href="/work" style={{ color: 'var(--b)' }}>← All work</Link>{w.link && <> &nbsp;·&nbsp; <a href={w.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>Open in Google Drive</a></>}</p>
      </div>
      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap">
          {!fid && <div className="empty">No Drive link added for this work yet.</div>}
          {fid && res.noKey && (
            <div className="dframe"><iframe src={`https://drive.google.com/embeddedfolderview?id=${fid}#grid`} title={w.title} /></div>
          )}
          {fid && res.error && <div className="empty">{res.error} Make sure the folder is shared as &quot;Anyone with the link can view&quot;.</div>}
          {fid && !res.noKey && !res.error && !res.items.length && <div className="empty">No photos or videos in this folder yet.</div>}
          {res.items.length > 0 && <Gallery items={res.items} />}
        </div>
      </section>
    </>
  );
}
