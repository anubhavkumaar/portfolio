// Side projects. Kept deliberately quiet and honest about what they are.
// They exist on the site for one reason: they are live, clickable, and mine.
// The case studies carry the argument.

export type Project = {
  name: string;
  blurb: string;
  href: string;
  repo?: string;
  year: string;
  /** Explicit, because the file names do not all follow from the titles. */
  preview: string;
};

export const projectsNote =
  'Four sites I built for a GTA V roleplay community. React and Firebase, all live.';

export const projects: Project[] = [
  {
    name: 'PitStop',
    preview: '/previews/pitstop.jpg',
    blurb: 'Auto services: bookings, job logs, crew management.',
    href: 'https://pitstop-services.web.app',
    repo: 'https://github.com/anubhavkumaar/pitstop',
    year: '2025',
  },
  {
    name: 'HEAT',
    preview: '/previews/heat.jpg',
    blurb: 'Highway enforcement unit: procedures, roles, vehicle specs.',
    href: 'https://sasp-heat.web.app',
    repo: 'https://github.com/anubhavkumaar/saspheat',
    year: '2025',
  },
  {
    name: 'SAPR',
    preview: '/previews/sapr.jpg',
    blurb: 'Department hierarchy, procedures, role based access.',
    href: 'https://saspsapr.web.app',
    repo: 'https://github.com/anubhavkumaar/saspsapr',
    year: '2025',
  },
  {
    name: 'Valo Tourney',
    preview: '/previews/soulcity.jpg',
    blurb: 'Valorant tournaments: brackets, match tracking, registration.',
    href: 'https://soulcityvalo.web.app',
    repo: 'https://github.com/anubhavkumaar/SoulCity-Valo-Tourney',
    year: '2024',
  },
];
