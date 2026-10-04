import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';
import { defaultSite } from './defaults';

const uri = process.env.MONGODB_URI;
const filePath = path.join(process.cwd(), 'data', 'db.json');

let clientPromise;
function getClient() {
  if (!clientPromise) clientPromise = new MongoClient(uri).connect();
  return clientPromise;
}

async function col() {
  const c = await getClient();
  return c.db().collection('kv');
}

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

export async function getKV(key, fallback) {
  if (uri) {
    const doc = await (await col()).findOne({ _id: key });
    return doc ? doc.value : fallback;
  }
  const all = readFile();
  return key in all ? all[key] : fallback;
}

export async function setKV(key, value) {
  if (uri) {
    await (await col()).updateOne({ _id: key }, { $set: { value } }, { upsert: true });
    return;
  }
  const all = readFile();
  all[key] = value;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(all));
}

function merge(base, over) {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over || {})) {
    out[k] = k in base ? merge(base[k], over[k]) : over[k];
  }
  return out;
}

export async function getSite() {
  const saved = await getKV('site', null);
  return saved ? merge(defaultSite, saved) : defaultSite;
}

export async function saveSite(site) {
  await setKV('site', site);
}

function setPath(obj, keys, add) {
  let o = obj;
  keys.slice(0, -1).forEach((k) => { o[k] = o[k] || {}; o = o[k]; });
  const last = keys[keys.length - 1];
  o[last] = (o[last] || 0) + add;
}

export async function incStats(day, fields) {
  if (uri) {
    const inc = {};
    for (const [k, v] of Object.entries(fields)) inc[`value.days.${day}.${k}`] = v;
    await (await col()).updateOne({ _id: 'stats' }, { $inc: inc }, { upsert: true });
    return;
  }
  const all = readFile();
  all.stats = all.stats || {};
  all.stats.days = all.stats.days || {};
  for (const [k, v] of Object.entries(fields)) setPath(all.stats.days, [day, ...k.split('.')], v);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(all));
}

export async function getStats() {
  return (await getKV('stats', { days: {} })) || { days: {} };
}
