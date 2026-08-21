import supabase from './db-client.js';
import ytdl from '@distube/ytdl-core';

export const config = { maxDuration: 30 };

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function detectPlatform(url) {
  const u = url.trim();
  if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)/i.test(u)) return 'youtube';
  if (/^(https?:\/\/)?(www\.)?(instagram\.com)/i.test(u)) return 'instagram';
  if (/^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)/i.test(u)) return 'twitter';
  if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)/i.test(u)) return 'facebook';
  if (/^(https?:\/\/)?(www\.)?(threads\.net)/i.test(u)) return 'threads';
  if (/whatsapp/i.test(u)) return 'whatsapp';
  return 'unknown';
}

function normalizeUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    },
  });
  return res.text();
}

function extractMeta(html, prop) {
  const re1 = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i');
  const re3 = new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i');
  const m = html.match(re1) || html.match(re2) || html.match(re3);
  return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"') : null;
}

async function analyzeYoutube(url) {
  const videoId = ytdl.getURLVideoID ? safeCall(() => ytdl.getURLVideoID(url)) : null;
  let title = null,
    author = null,
    thumbnail = null,
    duration = null,
    formats = [];

  try {
    const info = await ytdl.getInfo(url);
    const vd = info.videoDetails;
    title = vd.title;
    author = vd.author?.name || 'Unknown';
    thumbnail = vd.thumbnails?.[vd.thumbnails.length - 1]?.url || null;
    duration = parseInt(vd.lengthSeconds, 10) || null;

    const withAudioVideo = info.formats.filter((f) => f.hasVideo && f.hasAudio);
    const videoOnly = info.formats.filter((f) => f.hasVideo && !f.hasAudio);
    const audioOnly = info.formats.filter((f) => !f.hasVideo && f.hasAudio);

    const pickBest = (arr, keyFn, limit) => {
      const seen = new Set();
      return arr
        .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))
        .filter((f) => {
          const k = keyFn(f);
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        })
        .slice(0, limit);
    };

    pickBest(withAudioVideo, (f) => f.qualityLabel, 6).forEach((f) => {
      formats.push({
        id: `va-${f.itag}`,
        kind: 'video_audio',
        label: `MP4 ${f.qualityLabel || f.quality || ''}`.trim(),
        quality: f.qualityLabel || f.quality || 'auto',
        ext: 'mp4',
        url: f.url,
      });
    });

    pickBest(videoOnly, (f) => f.qualityLabel, 6).forEach((f) => {
      formats.push({
        id: `vo-${f.itag}`,
        kind: 'video_only',
        label: `${f.container || 'mp4'} ${f.qualityLabel || ''} (no audio)`.trim(),
        quality: f.qualityLabel || 'auto',
        ext: f.container || 'mp4',
        url: f.url,
      });
    });

    pickBest(audioOnly, (f) => f.audioBitrate, 4).forEach((f) => {
      formats.push({
        id: `ao-${f.itag}`,
        kind: 'audio_only',
        label: `${f.container || 'm4a'} audio ${f.audioBitrate || ''}kbps`.trim(),
        quality: `${f.audioBitrate || 128}kbps`,
        ext: 'mp3',
        url: f.url,
      });
    });

    if (formats.length === 0) throw new Error('no formats resolved');

    return {
      ok: true,
      platform: 'youtube',
      title,
      author,
      uploadDate: vd.uploadDate || null,
      thumbnail,
      duration,
      sourceUrl: url,
      formats,
      status: 'ready',
    };
  } catch (err) {
    // fallback to oEmbed for metadata only
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        return {
          ok: true,
          platform: 'youtube',
          title: oembed.title,
          author: oembed.author_name,
          uploadDate: null,
          thumbnail: oembed.thumbnail_url,
          duration: null,
          sourceUrl: url,
          formats: [],
          status: 'protected',
          message:
            'YouTube is currently throttling direct format extraction on this server. Metadata loaded, but no direct download links could be resolved right now.',
        };
      }
    } catch {}
    return {
      ok: false,
      platform: 'youtube',
      title: 'Unknown video',
      author: 'Unknown',
      thumbnail: null,
      sourceUrl: url,
      formats: [],
      status: 'error',
      message: 'Could not fetch this YouTube video. It may be private, age-restricted, or unavailable.',
    };
  }
}

function safeCall(fn) {
  try {
    return fn();
  } catch {
    return null;
  }
}

function getTweetId(url) {
  const m = url.match(/status(?:es)?\/(\d+)/);
  return m ? m[1] : null;
}

function computeSyndicationToken(id) {
  try {
    const n = (Number(id) / 1e15) * Math.PI;
    return n.toString(36).replace(/(0+|\.)/g, '');
  } catch {
    return '0';
  }
}

async function analyzeTwitter(url) {
  const tweetId = getTweetId(url);
  if (!tweetId) {
    return {
      ok: false,
      platform: 'twitter',
      title: 'Invalid link',
      author: 'Unknown',
      thumbnail: null,
      sourceUrl: url,
      formats: [],
      status: 'error',
      message: 'Could not find a tweet/post ID in this URL.',
    };
  }
  try {
    const token = computeSyndicationToken(tweetId);
    const apiUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&token=${token}`;
    const res = await fetch(apiUrl, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error('syndication fetch failed');
    const data = await res.json();

    const author = data.user?.name || data.user?.screen_name || 'Unknown';
    const title = (data.text || 'X Post').slice(0, 140);
    const media = data.mediaDetails || data.video || null;

    let formats = [];
    let thumbnail = null;
    let duration = null;

    if (data.video?.variants?.length) {
      thumbnail = data.video.poster || null;
      duration = data.video.durationMs ? Math.round(data.video.durationMs / 1000) : null;
      const mp4s = data.video.variants.filter((v) => v.type === 'video/mp4' && v.src);
      mp4s
        .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))
        .forEach((v, i) => {
          const resMatch = v.src.match(/\/(\d+)x(\d+)\//);
          const label = resMatch ? `${resMatch[2]}p` : `variant ${i + 1}`;
          formats.push({
            id: `tv-${i}`,
            kind: 'video_audio',
            label: `MP4 ${label}`,
            quality: label,
            ext: 'mp4',
            url: v.src,
          });
        });
    } else if (Array.isArray(data.mediaDetails)) {
      const photo = data.mediaDetails.find((m) => m.type === 'photo');
      if (photo) {
        thumbnail = photo.media_url_https;
        formats.push({
          id: 'photo-0',
          kind: 'video_audio',
          label: 'Original Image',
          quality: 'HD',
          ext: 'jpg',
          url: photo.media_url_https,
        });
      }
    }

    if (!thumbnail && data.photos?.length) thumbnail = data.photos[0].url;

    return {
      ok: true,
      platform: 'twitter',
      title,
      author,
      uploadDate: data.created_at || null,
      thumbnail,
      duration,
      sourceUrl: url,
      formats,
      status: formats.length ? 'ready' : 'protected',
      message: formats.length
        ? undefined
        : 'This post has no downloadable media, or the source blocked access.',
    };
  } catch (err) {
    return {
      ok: false,
      platform: 'twitter',
      title: 'Unavailable post',
      author: 'Unknown',
      thumbnail: null,
      sourceUrl: url,
      formats: [],
      status: 'error',
      message: 'Could not resolve this X/Twitter post. It may be private, deleted, or age-restricted.',
    };
  }
}

async function analyzeMetaScrape(url, platform) {
  try {
    const html = await fetchHtml(url);
    const title = extractMeta(html, 'og:title') || 'Untitled';
    const author = extractMeta(html, 'og:site_name') || platform;
    const thumbnail = extractMeta(html, 'og:image');
    const videoUrl = extractMeta(html, 'og:video:secure_url') || extractMeta(html, 'og:video') || extractMeta(html, 'og:video:url');

    const formats = [];
    if (videoUrl) {
      formats.push({
        id: 'meta-video',
        kind: 'video_audio',
        label: 'Original Quality MP4',
        quality: 'HD',
        ext: 'mp4',
        url: videoUrl,
      });
    } else if (thumbnail) {
      formats.push({
        id: 'meta-image',
        kind: 'video_audio',
        label: 'Original Image',
        quality: 'HD',
        ext: 'jpg',
        url: thumbnail,
      });
    }

    return {
      ok: true,
      platform,
      title,
      author,
      uploadDate: null,
      thumbnail,
      duration: null,
      sourceUrl: url,
      formats,
      status: formats.length && videoUrl ? 'ready' : formats.length ? 'partial' : 'protected',
      message: !formats.length
        ? `${platform[0].toUpperCase() + platform.slice(1)} requires login for most content, so we could not resolve a direct downloadable file for this link. Try a fully public post.`
        : !videoUrl
        ? 'Only a preview image could be resolved for this link \u2014 the source may require login for full video access.'
        : undefined,
    };
  } catch (err) {
    return {
      ok: false,
      platform,
      title: 'Unavailable content',
      author: 'Unknown',
      thumbnail: null,
      sourceUrl: url,
      formats: [],
      status: 'error',
      message: `Could not reach ${platform}. The link may be invalid, private, or the platform blocked our request.`,
    };
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { url: rawUrl } = req.body || {};
    if (!rawUrl || typeof rawUrl !== 'string') {
      return res.status(400).json({ error: 'A URL is required.' });
    }
    const url = normalizeUrl(rawUrl.trim());
    const platform = detectPlatform(url);

    if (platform === 'unknown') {
      return res.status(400).json({ error: 'Unsupported or unrecognized link. Try YouTube, Instagram, X, Facebook or Threads.' });
    }
    if (platform === 'whatsapp') {
      return res.status(400).json({ error: 'WhatsApp Status has no public URL to fetch \u2014 see our WhatsApp guide page instead.' });
    }

    let result;
    if (platform === 'youtube') {
      result = await analyzeYoutube(url);
    } else if (platform === 'twitter') {
      result = await analyzeTwitter(url);
    } else {
      result = await analyzeMetaScrape(url, platform);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('Analyze error:', err);
    return res.status(500).json({ error: err.message || 'Internal error analyzing link.' });
  }
}
