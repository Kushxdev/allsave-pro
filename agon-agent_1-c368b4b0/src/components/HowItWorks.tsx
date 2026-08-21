import { motion } from 'framer-motion';
import { Link2, ListChecks, DownloadCloud, ArrowRight } from 'lucide-react';

const STEPS = [
  { icon: Link2, title: 'Copy Link', desc: 'Grab the share link from YouTube, Instagram, X, Facebook or WhatsApp.' },
  { icon: ListChecks, title: 'Paste & Select Format', desc: 'Drop it into OmniSave and pick your ideal resolution or MP3 audio.' },
  { icon: DownloadCloud, title: 'Direct HD Download', desc: 'Click download and get your file instantly, no watermark attached.' },
];

export default function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">How it works</h2>
        <p className="mt-3 text-white/50">Three simple steps to save any media in seconds.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative flex flex-col items-center text-center"
          >
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 backdrop-blur">
              <span className="absolute -top-2.5 -left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold text-white shadow-lg">
                {i + 1}
              </span>
              <s.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">{s.title}</h3>
            <p className="mt-1.5 max-w-xs text-sm text-white/50">{s.desc}</p>
            {i < STEPS.length - 1 && (
              <ArrowRight className="absolute -right-4 top-8 hidden h-6 w-6 text-white/20 sm:block" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
