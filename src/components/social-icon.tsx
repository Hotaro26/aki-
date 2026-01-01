import { Github, Twitter, Youtube, Instagram } from 'lucide-react';
import { PinterestIcon, SpotifyIcon, DiscordIcon, OthersIcon, PortfolioIcon, SettingsIcon } from './icons';

interface SocialIconProps {
  platform: string;
  className?: string;
}

export function SocialIcon({ platform, className }: SocialIconProps) {
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github className={className} />;
    case 'pinterest':
      return <PinterestIcon className={className} />;
    case 'spotify':
      return <SpotifyIcon className={className} />;
    case 'discord':
      return <DiscordIcon className={className} />;
    case 'twitter':
        return <Twitter className={className} />;
    case 'youtube':
        return <Youtube className={className} />;
    case 'instagram':
        return <Instagram className={className} />;
    case 'portfolio':
        return <PortfolioIcon className={className} />;
    case 'others':
        return <OthersIcon className={className} />;
    case 'settings':
        return <SettingsIcon className={className} />;
    default:
      return null;
  }
}
