import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ClipboardPaste, Loader2, AlertCircle } from 'lucide-react';
import { detectPlatform, isValidUrl, PLATFORM_META } from '../lib/detector';
import PlatformIcon from './PlatformIcon';
import MediaPreviewCard from './MediaPreviewCard';
import { analyzeUrl, logHistory, bumpStats } from '../lib/api';
import type { MediaResult } from '../types';

export default function DownloaderWidget({ presetPlaceholder }: { presetPlaceholder?: string }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MediaResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const platform = detectPlatform(url);

  useEffect(() => {
    setError(null);
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
      inputRef.current?.focus();
    } catch {
      setError('Clipboard access denied. Please paste manually.');
    }
  };

  const handleFetch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim()) {
      setError('Please paste a link first.');
      return;
    }
    if (!isValidUrl(url)) {
      setError('That does not look like a valid URL.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeUrl(url.trim());
      setResult(data);
      logHistory({
        platform: data.platform,
        title: data.title,
        thumbnail: data.thumbnail,
        source_url: data.sourceUrl,
        status: data.status,
      } as any);
      bumpStats('analyzed');
    } catch (err: any) {
      setError(err.message || 'Something went wrong analyzing this link.');
    } finally {
      setLoading(false);
    }
  };

  const meta = PLATFORM_META[platform];

  return (
    <div className="w-full">
      <form onSubmit={handleFetch} className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <div
            className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${meta.gradient} opacity-0 blur transition-opacity duration-300 ${
              url ? 'opacity-40' : ''
            }`}
          />
          <div className="relative flex h-16 items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1220]/90 px-4 shadow-xl backdrop-blur-xl focus-within:border-violet-400/50">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white transition-all`}>
              <PlatformIcon platform={platform} className="h-4.5 w-4.5" />
            </span>
            <input
              ref={inputRef}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={presetPlaceholder || 'Paste a YouTube, Instagram, X, WhatsApp or Facebook link...'}
              className="h-full flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none sm:text-base"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              <ClipboardPaste className="h-3.5 w-3.5" /> Paste
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-8 text-base font-bold text-white shadow-xl shadow-violet-600/30 transition hover:shadow-2xl hover:shadow-violet-600/50 disabled:opacity-60 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" /> Fetch Media
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto mt-3 flex max-w-3xl items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-4 py-10">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/30" />
            <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
          </div>
          <p className="text-sm text-white/50">Fetching metadata from {meta.name}...</p>
        </div>
      )}

      <AnimatePresence>{result && <MediaPreviewCard key={result.sourceUrl} result={result} />}</AnimatePresence>
    </div>
  );
}
