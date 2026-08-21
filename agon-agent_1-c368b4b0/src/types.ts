export type Platform =
  | 'youtube'
  | 'instagram'
  | 'twitter'
  | 'whatsapp'
  | 'facebook'
  | 'threads'
  | 'unknown';

export interface MediaFormat {
  id: string;
  kind: 'video_audio' | 'video_only' | 'audio_only';
  label: string;
  quality: string;
  ext: string;
  url: string | null;
  filesize?: number | null;
}

export interface MediaResult {
  ok: boolean;
  platform: Platform;
  title: string;
  author: string;
  uploadDate?: string | null;
  thumbnail: string | null;
  duration?: number | null;
  sourceUrl: string;
  formats: MediaFormat[];
  status: 'ready' | 'protected' | 'partial' | 'error';
  message?: string;
}

export interface HistoryItem {
  id: number;
  platform: Platform;
  title: string;
  thumbnail: string | null;
  source_url: string;
  status: string;
  created_at: string;
}

export interface StatsRow {
  id: number;
  total_analyzed: number;
  total_downloaded: number;
  updated_at: string;
}
