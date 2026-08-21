import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  { q: 'Is OmniSave Pro really free to use?', a: 'Yes. Analyzing links and downloading media is completely free with no hidden fees or subscriptions.' },
  { q: 'Do you store the videos I download?', a: 'No. We never store copies of downloaded media on our servers. Files are fetched and streamed directly to your device.' },
  { q: 'Why does Instagram / Facebook sometimes fail?', a: 'These platforms increasingly restrict public, unauthenticated access to media. When we cannot resolve a direct file, we tell you clearly instead of faking a result.' },
  { q: 'What video qualities are supported?', a: 'Depending on the source, you can choose up to 1080p60 video, 720p, 480p, or extract 320kbps MP3 audio.' },
  { q: 'Is this legal?', a: 'OmniSave Pro is intended for downloading content you own or have explicit permission to save (e.g. personal backups, fair use). Please respect copyright law and platform terms of service.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="mb-10 text-center text-3xl font-extrabold text-white sm:text-4xl">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-white">{f.q}</span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-white/50 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-white/50">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
