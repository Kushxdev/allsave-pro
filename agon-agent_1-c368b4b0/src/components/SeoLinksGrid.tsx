import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PlatformIcon from './PlatformIcon';
import type { Platform } from '../types';
import { PLATFORM_META } from '../lib/detector';

const PAGES: { to: string; platform: Platform; title: string; desc: string }[] = [
  { to: '/youtube-shorts-downloader', platform: 'youtube', title: 'YouTube Shorts Downloader', desc: 'Save Shorts & videos up to 1080p60 in one click.' },
  { to: '/instagram-reels-downloader', platform: 'instagram', title: 'Instagram Reels Downloader', desc: 'Download Reels, Stories & Posts without watermark.' },
  { to: '/x-video-downloader', platform: 'twitter', title: 'X Video Downloader', desc: 'Grab any video or GIF posted on X (Twitter).' },
  { to: '/whatsapp-status-saver', platform: 'whatsapp', title: 'WhatsApp Status Saver', desc: 'Learn how to save WhatsApp Status photos & videos.' },
];

export default function SeoLinksGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PAGES.map((p, i) => {
          const meta = PLATFORM_META[p.platform];
          return (
            <motion.div key={p.to} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link
                to={p.to}
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 hover:bg-white/[0.06] transition"
              >
                <div>
                  <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient}`}>
                    <PlatformIcon platform={p.platform} className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="font-bold text-white">{p.title}</h3>
                  <p className="mt-1 text-xs text-white/40">{p.desc}</p>
                </div>
                <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-300 group-hover:gap-2 transition-all">
                  Try it now <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
