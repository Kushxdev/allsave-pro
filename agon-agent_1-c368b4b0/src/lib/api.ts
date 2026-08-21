import type { MediaResult, HistoryItem, StatsRow } from '../types';

export async function analyzeUrl(url: string): Promise<MediaResult> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to analyze link');
  return data as MediaResult;
}

export function getDownloadUrl(sourceUrl: string, formatId: string, directUrl: string | null, title: string, ext: string) {
  const params = new URLSearchParams({
    sourceUrl,
    formatId,
    title,
    ext,
  });
  if (directUrl) params.set('direct', directUrl);
  return `/api/download?${params.toString()}`;
}

export async function fetchHistory(limit = 12): Promise<HistoryItem[]> {
  const res = await fetch(`/api/history?limit=${limit}`);
  if (!res.ok) return [];
  return res.json();
}

export async function logHistory(payload: Partial<HistoryItem>): Promise<void> {
  await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function fetchStats(): Promise<StatsRow | null> {
  const res = await fetch('/api/stats');
  if (!res.ok) return null;
  return res.json();
}

export async function bumpStats(field: 'analyzed' | 'downloaded'): Promise<void> {
  await fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ field }),
  });
}
