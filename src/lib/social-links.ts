export type SocialLink = {
  platform: string;
  url: string;
  text: string;
  funnyText?: string;
};

export const socialLinks: SocialLink[] = [
  {
    platform: 'github',
    url: 'https://github.com/Hotaro26',
    text: 'GitHub',
    funnyText: "The only place where I'm not a complete mess.",
  },
  {
    platform: 'pinterest',
    url: 'https://pin.it/5grD7azdG',
    text: 'Pinterest',
    funnyText: 'My collection of things I\'ll never buy.',
  },
  {
    platform: 'spotify',
    url: 'https://open.spotify.com/user/31lx3m76madtoolhoyrmy7d474ym?si=730d7f454b484ac6',
    text: 'Spotify',
    funnyText: 'My carefully curated collection of sad songs.',
  },
  {
    platform: 'discord',
    url: 'hotaro', // Discord Username
    text: 'Discord',
    funnyText: 'Click to copy my username!',
  },
];

export const otherSocialLinks: SocialLink[] = [
  {
    platform: 'youtube',
    url: 'https://www.youtube.com/@oi.hotaro',
    text: 'YouTube',
  },
  {
    platform: 'instagram',
    url: '#',
    text: 'Instagram',
  },
  {
    platform: 'twitter',
    url: '#',
    text: 'Twitter / X',
  },
  {
    platform: 'portfolio',
    url: 'https://hotaro101.vercel.app/',
    text: 'Personal Portfolio',
  },
];

    