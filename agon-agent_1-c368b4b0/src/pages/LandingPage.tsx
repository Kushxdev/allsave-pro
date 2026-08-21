import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundBlobs from '../components/BackgroundBlobs';
import DownloaderWidget from '../components/DownloaderWidget';
import FeaturesGrid from '../components/FeaturesGrid';
import FAQ from '../components/FAQ';
import { motion } from 'framer-motion';
import type { Platform } from '../types';
import { PLATFORM_META } from '../lib/detector';
import PlatformIcon from '../components/PlatformIcon';

interface LandingPageProps {
  platform: Platform;
  headline: string;
  subheadline: string;
  placeholder: string;
  steps?: { title: string; desc: string }[];
  extra?: React.ReactNode;
}

export default function LandingPage({ platform, headline, subheadline, placeholder, steps, extra }: LandingPageProps) {
  const meta = PLATFORM_META[platform];
  return (
    <div className="min-h-screen text-white">
      <BackgroundBlobs />
      <Header />
      <section className="pt-16 pb-10 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} shadow-xl`}
          >
            <PlatformIcon platform={platform} className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {headline}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mx-auto mt-4 max-w-xl text-white/50">
            {subheadline}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mt-10">
            <DownloaderWidget presetPlaceholder={placeholder} />
          </motion.div>
        </div>
      </section>

      {steps && (
        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-white/50">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {extra}

      <FeaturesGrid />
      <FAQ />
      <Footer />
    </div>
  );
}
