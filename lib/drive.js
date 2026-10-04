import { getKV } from './db';

export function folderId(url = '') {
  const m = String(url).match(/folders\/([A-Za-z0-9_-]+)/) || String(url).match(/[?&]id=([A-Za-z0-9_-]+)/);
  return m ? m[1] : '';
}

export async function getDriveKey() {
  return process.env.GOOGLE_API_KEY || (await getKV('drivekey', '')) || '';
}

export async function listFolder(id) {
  const key = await getDriveKey();
  if (!key) return { noKey: true, items: [] };
  try {
    const q = encodeURIComponent(`'${id}' in parents and trashed=false and (mimeType contains 'image/' or mimeType contains 'video/')`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType)&pageSize=200&orderBy=createdTime%20desc&key=${key}`;
    const r = await fetch(url, { next: { revalidate: 120 } });
    const j = await r.json();
    if (!r.ok) return { error: j?.error?.message || 'Could not read the Drive folder.', items: [] };
    return {
      items: (j.files || []).map((f) => ({
        id: f.id,
        name: f.name,
        type: f.mimeType.startsWith('video/') ? 'video' : 'image',
      })),
    };
  } catch (e) {
    return { error: 'Could not reach Google Drive.', items: [] };
  }
}
