import { Zap, ShieldCheck, Lock, Infinity as InfinityIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon: Zap, title: 'Lightning Speed', desc: 'Optimized pipelines fetch and prepare your media in seconds, not minutes.', color: 'from-amber-400 to-orange-500' },
  { icon: ShieldCheck, title: 'No Watermark', desc: 'Get clean, original-quality files exactly as uploaded — zero branding added.', color: 'from-cyan-400 to-blue-500' },
  { icon: Lock, title: '100% Privacy Protected', desc: 'We never store your downloaded media or track what you save.', color: 'from-violet-400 to-fuchsia-500' },
  { icon: InfinityIcon, title: 'Unlimited Downloads', desc: 'No daily caps, no premium paywalls. Download as much as you need.', color: 'from-emerald-400 to-teal-500' },
];

export default function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Why creators choose OmniSave Pro</h2>
        <p className="mt-3 text-white/50">Built for speed, privacy, and simplicity — everything a modern downloader should be.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-1"
          >
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${f.color} opacity-20 blur-2xl transition group-hover:opacity-40`} />
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}>
              <f.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm text-white/50">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
