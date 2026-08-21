import { Youtube, Instagram, Twitter, MessageCircle, Facebook, AtSign, Link2 } from 'lucide-react';
import type { Platform } from '../types';

export default function PlatformIcon({ platform, className = 'w-5 h-5' }: { platform: Platform; className?: string }) {
  switch (platform) {
    case 'youtube':
      return <Youtube className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'twitter':
      return <Twitter className={className} />;
    case 'whatsapp':
      return <MessageCircle className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'threads':
      return <AtSign className={className} />;
    default:
      return <Link2 className={className} />;
  }
}
