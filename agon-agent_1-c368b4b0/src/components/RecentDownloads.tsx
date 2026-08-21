import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { fetchHistory } from '../lib/api';
import type { HistoryItem } from '../types';
import { PLATFORM_META } from '../lib/detector';
import PlatformIcon from './PlatformIcon';

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function RecentDownloads() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetchHistory(8)
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-6 flex items-center gap-2">
        <Clock className="h-5 w-5 text-violet-400" />
        <h2 className="text-xl font-bold text-white">Recently Analyzed</h2>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 ml-1" />
        <span className="text-xs text-white/30">live</span>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item, i) => {
            const meta = PLATFORM_META[item.platform] || PLATFORM_META.unknown;
            return (
              <motion.a
                key={item.id}
                href={item.source_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/20 transition"
              >
                <div className="aspect-video w-full overflow-hidden bg-black/40">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/10">
                      <PlatformIcon platform={item.platform} className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="line-clamp-1 text-xs font-semibold text-white">{item.title}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className={`flex items-center gap-1 rounded bg-gradient-to-r ${meta.gradient} px-1.5 py-0.5 text-[10px] font-bold text-white`}>
                      <PlatformIcon platform={item.platform} className="h-2.5 w-2.5" /> {meta.name}
                    </span>
                    <span className="text-[10px] text-white/30">{timeAgo(item.created_at)}</span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      )}
    </section>
  );
}
