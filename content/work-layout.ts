/**
 * How the 20 projects are laid out in the Work views: the drawer, freestyle,
 * the phone sphere and the Index. Orders, geometry and labels are copied from
 * Orbit.dc.html, MWork.dc.html, Freestyle.dc.html and Index.dc.html.
 */

import { ACC, ORDER, PROJECTS, type Group, type Kind, type Project, type ProjectId } from './portfolio';

export const GROUPS: Group[] = [
  'Agents',
  'Retrieval and Search',
  'Backend and Data',
  'Frontend',
  'Quality and Delivery',
  'Automation',
  'Side Builds',
];

/** Group dot colour. The design uses the light accent in both themes. */
export const GROUP_COLOR = Object.fromEntries(GROUPS.map((g) => [g, ACC[g][0]])) as Record<Group, string>;

/** Drawer and phone sphere order: grouped, in the order the design files them. */
export const DRAWER_ORDER: ProjectId[] = [
  'agent', 'mcp', 'logs', 'tickets',
  'retrieval', 'multimodal',
  'stream', 'obs',
  'portal',
  'harness', 'releases',
  'jobradar', 'shorts', 'rpa', 'academy',
  'pitstop', 'heat', 'sapr', 'valo', 'site',
];

/** Freestyle tiles: x as % of the width, y, h in px, w as % of the width. Order is the design's. */
export const FREE_TILES: { id: ProjectId; x: number; y: number; w: number; h: number }[] = [
  { id: 'agent', x: 1.3, y: 100, w: 17, h: 200 },
  { id: 'pitstop', x: 19.37, y: 122, w: 9, h: 176 },
  { id: 'mcp', x: 29.43, y: 92, w: 12, h: 232 },
  { id: 'retrieval', x: 42.5, y: 140, w: 14, h: 150 },
  { id: 'logs', x: 57.57, y: 106, w: 11, h: 210 },
  { id: 'heat', x: 69.63, y: 130, w: 13, h: 170 },
  { id: 'stream', x: 83.7, y: 96, w: 15, h: 196 },
  { id: 'multimodal', x: 1.3, y: 374, w: 13, h: 226 },
  { id: 'tickets', x: 15.37, y: 350, w: 15, h: 170 },
  { id: 'sapr', x: 31.43, y: 390, w: 10, h: 250 },
  { id: 'portal', x: 42.5, y: 360, w: 16, h: 186 },
  { id: 'harness', x: 59.57, y: 404, w: 12, h: 150 },
  { id: 'valo', x: 72.63, y: 354, w: 9, h: 236 },
  { id: 'releases', x: 82.7, y: 386, w: 16, h: 170 },
  { id: 'obs', x: 1.3, y: 660, w: 16, h: 180 },
  { id: 'jobradar', x: 19.58, y: 684, w: 11, h: 236 },
  { id: 'shorts', x: 32.86, y: 654, w: 15, h: 160 },
  { id: 'rpa', x: 50.14, y: 696, w: 13, h: 214 },
  { id: 'academy', x: 65.42, y: 664, w: 17, h: 190 },
  { id: 'site', x: 84.7, y: 680, w: 14, h: 170 },
];

/** The Index tile label for each kind of case study. */
export const KIND_LABEL: Record<Kind, string> = { agent: 'video', flow: 'flow', cinema: 'cinema', browser: 'live site' };

/** Project number in the full list, "01" to "20". */
export const projectNumber = (id: string) => String(ORDER.indexOf(id as ProjectId) + 1).padStart(2, '0');

export const caseHref = (id: string) => `/work/${id}/`;

export const groupSlug = (g: string) => 'g-' + g.toLowerCase().replace(/[^a-z]+/g, '-');

export const projectsIn = (group: Group, ids: readonly ProjectId[] = DRAWER_ORDER): Project[] =>
  ids.map((id) => PROJECTS[id]).filter((p) => p.group === group);

export type From = 'drawer' | 'freestyle' | 'index';

/** Where a case study was opened from, so its close button and breadcrumb can return there. */
export function markFrom(from: From) {
  try {
    sessionStorage.setItem('akFrom', from);
  } catch {
    /* private mode: the close button falls back to Work */
  }
}

/** The cover the drawer, freestyle and index use for a project. */
export const coverOf = (id: string, diagram = false) =>
  diagram && id === 'agent' ? '/redesign/media/agent-diagram.jpg' : PROJECTS[id as ProjectId].cover;
