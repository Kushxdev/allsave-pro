import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Globe2, Users } from 'lucide-react';
import { fetchStats } from '../lib/api';
import type { StatsRow } from '../types';

export default function StatsBanner() {
  const [stats, setStats] = useState<StatsRow | null>(null);

  useEffect(() => {
    fetchStats().then(setStats);
    const iv = setInterval(() => fetchStats().then(setStats), 10000);
    return () => clearInterval(iv);
  }, []);

  const items = [
    { icon: Globe2, label: 'Platforms Supported', value: '6' },
    { icon: Search, label: 'Links Analyzed', value: stats ? stats.total_analyzed.toLocaleString() : '—' },
    { icon: Download, label: 'Downloads Processed', value: stats ? stats.total_downloaded.toLocaleString() : '—' },
    { icon: Users, label: 'Happy Users', value: '50K+' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-4">
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:grid-cols-4 sm:p-7">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex flex-col items-center text-center gap-1.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
              <it.icon className="h-4.5 w-4.5 text-violet-300" />
            </span>
            <div>
              <div className="text-lg font-extrabold text-white leading-none">{it.value}</div>
              <div className="text-[11px] text-white/40 mt-1">{it.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
