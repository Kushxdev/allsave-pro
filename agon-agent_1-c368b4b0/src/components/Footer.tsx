import { Link } from 'react-router-dom';
import { Sparkles, ShieldAlert } from 'lucide-react';

const LINKS = [
  { to: '/instagram-reels-downloader', label: 'Instagram Reels Downloader' },
  { to: '/youtube-shorts-downloader', label: 'YouTube Shorts Downloader' },
  { to: '/x-video-downloader', label: 'X Video Downloader' },
  { to: '/whatsapp-status-saver', label: 'WhatsApp Status Saver' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="text-base font-extrabold text-white">OmniSave Pro</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/40">
              The all-in-one downloader for YouTube, Instagram, X, WhatsApp, Facebook &amp; Threads.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/60">Popular Tools</h4>
            <ul className="space-y-2">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/40 hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/60">Legal Disclaimer</h4>
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-white/40">
              <ShieldAlert className="h-8 w-8 shrink-0 text-amber-400/70" />
              <p>
                OmniSave Pro does not host, store, or distribute copyrighted media on its servers. All content is fetched directly
                from the original public source at the user's request. Users are solely responsible for ensuring they have the
                right to download and use any content (DMCA / Fair Use).
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} OmniSave Pro. Built for personal, non-infringing use only.
        </div>
      </div>
    </footer>
  );
}
