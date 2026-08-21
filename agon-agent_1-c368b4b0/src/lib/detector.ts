import type { Platform } from '../types';

export function detectPlatform(url: string): Platform {
  const u = url.trim();
  if (!u) return 'unknown';
  if (/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)/i.test(u)) return 'youtube';
  if (/^(https?:\/\/)?(www\.)?(instagram\.com)/i.test(u)) return 'instagram';
  if (/^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)/i.test(u)) return 'twitter';
  if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)/i.test(u)) return 'facebook';
  if (/^(https?:\/\/)?(www\.)?(threads\.net)/i.test(u)) return 'threads';
  if (/whatsapp/i.test(u)) return 'whatsapp';
  return 'unknown';
}

export const PLATFORM_META: Record<Platform, { name: string; color: string; gradient: string }> = {
  youtube: { name: 'YouTube', color: '#FF0033', gradient: 'from-red-500 to-rose-600' },
  instagram: { name: 'Instagram', color: '#E1306C', gradient: 'from-fuchsia-500 via-pink-500 to-amber-400' },
  twitter: { name: 'X / Twitter', color: '#1D9BF0', gradient: 'from-sky-400 to-blue-600' },
  whatsapp: { name: 'WhatsApp', color: '#25D366', gradient: 'from-emerald-400 to-green-600' },
  facebook: { name: 'Facebook', color: '#1877F2', gradient: 'from-blue-500 to-indigo-600' },
  threads: { name: 'Threads', color: '#ffffff', gradient: 'from-slate-400 to-slate-700' },
  unknown: { name: 'Unknown', color: '#8888aa', gradient: 'from-violet-500 to-cyan-500' },
};

export function isValidUrl(url: string): boolean {
  try {
    const withProto = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    new URL(withProto);
    return true;
  } catch {
    return false;
  }
}
