// Single source of truth for every place Anubhav can be found.
// Connect, /live/, stream mode and the lower third all read from this list, so
// adding a profile is one line here (plus a glyph in BrandIcon.tsx).
// Copy rules: no em dashes, sentence case, active voice.

export type ProfileId =
  | 'kick'
  | 'youtube'
  | 'twitch'
  | 'discord'
  | 'instagram'
  | 'x'
  | 'steam'
  | 'github'
  | 'linkedin';

export type ProfileGroup = 'social' | 'work';

export interface Profile {
  id: ProfileId;
  /** Set as a Title in the register. */
  name: string;
  /** Small text under or beside the name. Discord shows a call to action instead. */
  handle: string;
  href: string;
  group: ProfileGroup;
  /** Position in every list on the site. Lower comes first. */
  order: number;
  /** True for the three platforms he streams on. These rows can show a live state. */
  streams: boolean;
  /** The short redirect, as a path on the site, that a viewer can type from a screen. */
  short: string;
}

const list: Profile[] = [
  // Social: where viewers follow him, streaming platforms first.
  { id: 'kick', name: 'Kick', handle: 'anubhavkumaar', href: 'https://kick.com/anubhavkumaar', group: 'social', order: 1, streams: true, short: '/kick' },
  { id: 'youtube', name: 'YouTube', handle: '@anubhavkumaar', href: 'https://www.youtube.com/@anubhavkumaar', group: 'social', order: 2, streams: true, short: '/youtube' },
  { id: 'twitch', name: 'Twitch', handle: 'anubhavkumaar', href: 'https://www.twitch.tv/anubhavkumaar', group: 'social', order: 3, streams: true, short: '/twitch' },
  { id: 'discord', name: 'Discord', handle: 'Join the server', href: 'https://anubhavkumaar.in/discord', group: 'social', order: 4, streams: false, short: '/discord' },
  { id: 'instagram', name: 'Instagram', handle: '@theanubhavkumar', href: 'https://www.instagram.com/theanubhavkumar/', group: 'social', order: 5, streams: false, short: '/insta' },
  { id: 'x', name: 'X', handle: '@theanubhavkumar', href: 'https://x.com/theanubhavkumar', group: 'social', order: 6, streams: false, short: '/x' },
  { id: 'steam', name: 'Steam', handle: 'anubhavkumaar', href: 'https://steamcommunity.com/id/anubhavkumar', group: 'social', order: 7, streams: false, short: '/steam' },
  // Work
  { id: 'github', name: 'GitHub', handle: 'anubhavkumaar', href: 'https://github.com/anubhavkumaar', group: 'work', order: 8, streams: false, short: '/github' },
  { id: 'linkedin', name: 'LinkedIn', handle: 'in/anubhavkumaar', href: 'https://www.linkedin.com/in/anubhavkumaar/', group: 'work', order: 9, streams: false, short: '/linkedin' },
];

export const profiles: readonly Profile[] = [...list].sort((a, b) => a.order - b.order);

export const GROUPS: readonly { id: ProfileGroup; label: string }[] = [
  { id: 'social', label: 'Social' },
  { id: 'work', label: 'Work' },
];

export const SITE_HOST = 'anubhavkumaar.in';
/** The standalone page chat links point at, and what the stream QR code encodes. */
export const LIVE_URL = `https://${SITE_HOST}/live/`;
/** What a viewer types from a screen. */
export const LIVE_SHORT = `${SITE_HOST}/live`;

export const byGroup = (group: ProfileGroup): Profile[] => profiles.filter((p) => p.group === group);

export const streamIds = profiles.filter((p) => p.streams).map((p) => p.id) as ('kick' | 'youtube' | 'twitch')[];

export type StreamId = 'kick' | 'youtube' | 'twitch';

/** Query-string filter for stream mode: ?only=social | work | streams. */
export function filterProfiles(only: string | null | undefined): readonly Profile[] {
  if (only === 'social') return byGroup('social');
  if (only === 'work') return byGroup('work');
  if (only === 'streams') return profiles.filter((p) => p.streams);
  return profiles;
}

export const shortUrl = (p: Profile): string => `${SITE_HOST}${p.short}`;
