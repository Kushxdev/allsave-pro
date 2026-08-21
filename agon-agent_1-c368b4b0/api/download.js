import { Readable } from 'stream';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { direct, title, ext } = req.query;
    if (!direct) return res.status(400).json({ error: 'Missing direct media URL.' });

    const directUrl = Array.isArray(direct) ? direct[0] : direct;
    const safeTitle = (Array.isArray(title) ? title[0] : title || 'omnisave-media')
      .toString()
      .replace(/[^a-z0-9\-_ ]/gi, '_')
      .slice(0, 60);
    const fileExt = (Array.isArray(ext) ? ext[0] : ext || 'mp4').toString().replace(/[^a-z0-9]/gi, '');

    const upstream = await fetch(directUrl, {
      headers: { 'User-Agent': UA, Referer: new URL(directUrl).origin },
    });

    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({ error: 'Could not fetch the media from its source. It may have expired.' });
    }

    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${fileExt}"`);
    const len = upstream.headers.get('content-length');
    if (len) res.setHeader('Content-Length', len);

    Readable.fromWeb(upstream.body).pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Download failed.' });
    } else {
      res.end();
    }
  }
}
