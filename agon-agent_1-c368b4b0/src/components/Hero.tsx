import { motion } from 'framer-motion';
import DownloaderWidget from './DownloaderWidget';

export default function Hero() {
  return (
    <section className="relative pt-16 pb-10 sm:pt-24 sm:pb-16">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Trusted by creators worldwide • 100% Free
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl"
        >
          Download Videos, Reels &amp; Status
          <br />
          in <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Ultra HD</span> — Fast &amp; Free.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-base text-white/50 sm:text-lg"
        >
          One platform for YouTube, Instagram, X, WhatsApp Status, Facebook &amp; Threads. Paste a link, pick a resolution, download instantly — no watermark, no sign-up.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mt-10">
          <DownloaderWidget />
        </motion.div>
      </div>
    </section>
  );
}
