// Identity and contact. Copy rules: no em dashes, sentence case, active voice.
// The /live/ page reads the email from here. The redesigned About and Connect
// carry their own copy from the design files, and no location is kept anywhere.

export const profile = {
  name: 'Anubhav Kumar',
  initials: 'AK',
  role: 'Full Stack Developer and GenAI Engineer',
  email: 'work@anubhavkumaar.in',

  links: [
    { label: 'GitHub', href: 'https://github.com/anubhavkumaar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anubhavkumaar/' },
  ],
} as const;
