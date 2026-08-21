import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Github, HelpCircle, Menu, X, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import PlatformIcon from './PlatformIcon';
import type { Platform } from '../types';

const FILTERS: { key: Platform | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'twitter', label: 'X' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'facebook', label: 'Facebook' },
];

export default function Header({
  activeFilter,
  onFilterChange,
}: {
  activeFilter?: Platform | 'all';
  onFilterChange?: (p: Platform | 'all') => void;
}) {
  const { theme, toggle } = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F17]/70 backdrop-blur-xl dark:bg-[#0B0F17]/70 light:bg-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <motion.div
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-lg shadow-violet-500/30"
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Omni<span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Save</span>{' '}
              <span className="text-xs font-semibold text-white/40 align-top">PRO</span>
            </span>
          </Link>

          {onFilterChange && (
            <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => onFilterChange(f.key)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                    activeFilter === f.key
                      ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-md shadow-violet-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {f.key !== 'all' && <PlatformIcon platform={f.key} className="h-3.5 w-3.5" />}
                  {f.label}
                </button>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHelpOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <HelpCircle className="h-4 w-4" /> Help
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <Github className="h-4 w-4" />
            </a>
            <button
              onClick={toggle}
              className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {onFilterChange && (
              <button className="lg:hidden flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70" onClick={() => setMobileOpen((v) => !v)}>
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
        {onFilterChange && mobileOpen && (
          <div className="lg:hidden flex flex-wrap gap-2 px-4 pb-3">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  onFilterChange(f.key);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  activeFilter === f.key
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
                    : 'text-white/60 bg-white/5'
                }`}
              >
                {f.key !== 'all' && <PlatformIcon platform={f.key} className="h-3 w-3" />}
                {f.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setHelpOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full rounded-2xl border border-white/10 bg-[#111827]/95 p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white mb-2">How to use OmniSave Pro</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-white/70">
              <li>Copy the link of any video, reel, story or post.</li>
              <li>Paste it into the input bar on the homepage.</li>
              <li>Click "Fetch Media" and pick your favorite quality.</li>
              <li>Hit "Download Now" — that's it!</li>
            </ol>
            <p className="mt-4 text-xs text-white/40">Some platforms (Instagram/Facebook/Threads) restrict public access to media — when that happens we'll clearly tell you instead of faking a download.</p>
            <button onClick={() => setHelpOpen(false)} className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 py-2.5 text-sm font-semibold text-white">
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
