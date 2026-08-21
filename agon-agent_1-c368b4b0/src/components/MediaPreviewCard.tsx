import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Download, Music, Video, Film, Clock, User, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { MediaResult } from '../types';
import { PLATFORM_META } from '../lib/detector';
import PlatformIcon from './PlatformIcon';
import { getDownloadUrl, bumpStats } from '../lib/api';

function formatDuration(sec?: number | null) {
  if (!sec && sec !== 0) return null;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type Tab = 'video_audio' | 'video_only' | 'audio_only';

export default function MediaPreviewCard({ result }: { result: MediaResult }) {
  const meta = PLATFORM_META[result.platform];
  const [tab, setTab] = useState<Tab>('video_audio');
  const [showModal, setShowModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState<string | null>(null);

  const tabs = useMemo(() => {
    const available = new Set(result.formats.map((f) => f.kind));
    return (['video_audio', 'video_only', 'audio_only'] as Tab[]).filter((t) => available.has(t));
  }, [result.formats]);

  useMemo(() => {
    if (tabs.length && !tabs.includes(tab)) setTab(tabs[0]);
  }, [tabs]);

  const visibleFormats = result.formats.filter((f) => f.kind === tab);

  const handleDownload = async (formatId: string, url: string | null, ext: string) => {
    if (!url) return;
    setDownloadingId(formatId);
    setProgress(0);
    setSuccess(null);
    const iv = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 18 : p));
    }, 220);
    try {
      const dlUrl = getDownloadUrl(result.sourceUrl, formatId, url, result.title, ext);
      const link = document.createElement('a');
      link.href = dlUrl;
      link.download = `${result.title.slice(0, 60).replace(/[^a-z0-9]+/gi, '_')}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise((r) => setTimeout(r, 900));
      setProgress(100);
      setSuccess(formatId);
      bumpStats('downloaded');
    } finally {
      clearInterval(iv);
      setTimeout(() => {
        setDownloadingId(null);
        setProgress(0);
      }, 1400);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative mx-auto mt-8 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.gradient}`} />
      <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[280px_1fr]">
        {/* Thumbnail */}
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            {result.thumbnail ? (
              <img src={result.thumbnail} alt={result.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/20">
                <Film className="h-10 w-10" />
              </div>
            )}
            {result.thumbnail && (
              <button
                onClick={() => setShowModal(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-xl">
                  <Play className="h-6 w-6 ml-1" fill="currentColor" />
                </span>
              </button>
            )}
            {result.duration ? (
              <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatDuration(result.duration)}
              </span>
            ) : null}
            <span className={`absolute top-2 left-2 flex items-center gap-1 rounded-md bg-gradient-to-r ${meta.gradient} px-2 py-0.5 text-xs font-semibold text-white shadow`}>
              <PlatformIcon platform={result.platform} className="h-3 w-3" /> {meta.name}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h3 title={result.title} className="line-clamp-2 text-lg font-bold text-white sm:text-xl">
            {result.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-white/50">
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {result.author}</span>
            {result.uploadDate && <span>{result.uploadDate}</span>}
          </div>

          {result.status === 'protected' && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{result.message || 'This source restricts public access. We could not fetch a direct downloadable file.'}</span>
            </div>
          )}

          {tabs.length > 0 && (
            <div className="mt-4 flex gap-1 rounded-full border border-white/10 bg-white/5 p-1 w-fit">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    tab === t ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t === 'audio_only' ? <Music className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
                  {t === 'video_audio' ? 'Video + Audio' : t === 'video_only' ? 'Video Only' : 'Audio / MP3'}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1" style={{ maxHeight: 220 }}>
            <AnimatePresence mode="popLayout">
              {visibleFormats.length === 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white/40 py-4">
                  No formats available for this option.
                </motion.p>
              )}
              {visibleFormats.map((f) => (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-white/20 hover:bg-white/[0.06] transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-xs font-bold text-white">{f.quality}</span>
                    <span className="truncate text-sm text-white/70">{f.label}</span>
                  </div>
                  <button
                    disabled={!f.url || downloadingId === f.id}
                    onClick={() => handleDownload(f.id, f.url, f.ext)}
                    className="relative flex shrink-0 items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-violet-500/20 transition hover:shadow-lg hover:shadow-violet-500/40 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {downloadingId === f.id ? (
                      success === f.id ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Done!
                        </motion.span>
                      ) : (
                        <span>{Math.min(99, Math.round(progress))}%</span>
                      )
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" /> Download
                      </>
                    )}
                    {downloadingId === f.id && success !== f.id && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/70" style={{ width: `${progress}%` }} />
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && result.thumbnail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden border border-white/10"
            >
              <button onClick={() => setShowModal(false)} className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white">
                <X className="h-4 w-4" />
              </button>
              <img src={result.thumbnail} alt={result.title} className="w-full object-contain max-h-[80vh]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
