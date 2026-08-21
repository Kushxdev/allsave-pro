import LandingPage from './LandingPage';
import { motion } from 'framer-motion';
import { Smartphone, FolderOpen, Save } from 'lucide-react';

function Guide() {
  const steps = [
    { icon: Smartphone, title: 'Open WhatsApp Status', desc: 'View the status of the contact you want to save — WhatsApp does not expose a shareable URL for statuses.' },
    { icon: FolderOpen, title: 'Enable status auto-download', desc: 'On Android, statuses are auto-saved to Internal Storage > WhatsApp > Media > .Statuses (enable "Show hidden files").' },
    { icon: Save, title: 'Save before it expires', desc: 'Statuses disappear after 24 hours — copy the file to your gallery or use our upload tool for any file you already have.' },
  ];
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-amber-200 mb-8">
        WhatsApp Status content isn't accessible via public URLs like other platforms, so there's nothing for us to "paste & fetch."
        Follow the manual steps below — or use the link box above for any other supported platform.
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600">
              <s.icon className="h-5 w-5 text-white" />
            </span>
            <h3 className="font-bold text-white">{s.title}</h3>
            <p className="mt-1 text-sm text-white/50">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function WhatsappStatusSaver() {
  return (
    <LandingPage
      platform="whatsapp"
      headline="WhatsApp Status Saver Guide"
      subheadline="WhatsApp Status has no shareable link, so saving it works differently — here's exactly how to do it, plus our downloader for every other platform."
      placeholder="Paste a YouTube, Instagram, X or Facebook link instead..."
      extra={<Guide />}
    />
  );
}
