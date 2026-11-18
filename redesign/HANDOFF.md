# Redesign handoff: anubhavkumaar.in

This folder carries the approved redesign from the Claude Design file into this repo.
Build it in phases on a branch. Read this file first, then the design source it points to.

- `redesign/design-src/*.dc.html`: the design itself. Exact markup, CSS, keyframes, timings and copy.
- `redesign/MOTION-NOTES.md`: motion notes written next to the boards.
- `redesign/RESEARCH.md`: the research behind the motion, media and flow choices.
- `public/redesign/`: every image and video the design uses, already web-sized. `public/resume.pdf` is the site-safe resume.

## Ground rules (non-negotiable)

1. Never use em dashes anywhere: copy, comments, alt text, commit messages. Use commas, colons or parentheses.
2. No location on the site (no city, no state). No streaming references in the portfolio. Leave `/live` and `/stream` routes and `BARE_ROUTE` exactly as they are.
3. Confidentiality: work projects use generic names only (supervisor, specialist agents, MCP servers, documents, services). No client, customer, system or host names, no real schemas, no uncleared metrics. The flow diagrams in the design are generic on purpose; keep them that way. Work projects carry the "Work project, details generalized" chip.
4. Keep `output: 'export'`, `trailingSlash: true` and the deploy workflow working. Every new route must prerender (use `generateStaticParams` for case studies).
5. `prefers-reduced-motion: reduce`: no spatial movement, fades are fine, videos show their poster.
6. Copy comes from the design files verbatim unless it breaks rule 1 to 3.
7. Do not delete existing components until the replacement works; remove dead code at the end of each phase.

## How to read a .dc.html file

They are design-tool components, not production code. Port them to React, Tailwind and `motion/react` (already installed).

- The HTML inside `<x-dc>` is the template. `{{name}}` holes are filled by `renderVals()` in the `<script data-dc-script>` block at the bottom.
- `<sc-for list="{{items}}" as="x">` is a map. `<sc-if value="{{flag}}">` is a conditional.
- `<dc-import name="Dock" ...>` embeds another file as a component with those props.
- `data-props` on the script tag lists each component's props and defaults.
- Inline styles and the `<style>` block in `<helmet>` hold the exact values. Keep the keyframes, durations, delays and easing curves as written.
- Files ending in `Dark` and the small `CaseXxx.dc.html` / `MCaseXxx.dc.html` wrappers were not copied: `XxxDark` is the same component with `dark`, and `CaseMcp` is `CaseStudy` with `p="mcp"`.

## Board map: design file to code

| Design file | What it is | Target in this repo |
|---|---|---|
| `Site.dc.html` | One connected page: Home, Work, About, Connect stacked in one scroller | `components/site/Home.tsx` section order and scroll behaviour |
| `Dock.dc.html` | Desktop top bar: breadcrumb pill left, glass pill (Home, Work, About, Let's talk) centre, sun/moon switch right | Replace `components/site/Nav.tsx` |
| `MDock.dc.html` | Phone top bar: logo, section label, Menu button opening a bottom sheet (links, Resume, theme) | Same Nav component below 768px |
| `Main.dc.html` | Home hero: availability chip, name, role cycler with caret, Resume link, background video with pause, ask anubhav card | Replace `Hero.tsx` |
| `MHome.dc.html` | Phone home | Responsive version of the hero |
| `Orbit.dc.html` | Work: thumbnail-sphere intro that files into a drawer; grouped list left; hover raises a file | New `components/site/WorkDrawer.tsx`, replaces `Spreads.tsx` and `SideProjects.tsx` |
| `MWork.dc.html` | Phone work: compact sphere, then a stacked fan, filter pills, link to the list | Phone branch of WorkDrawer |
| `ViewSwitch.dc.html` | Drawer / freestyle toggle plus "Index ↗" | Part of WorkDrawer; persist as `?view=drawer|freestyle` |
| `Freestyle.dc.html` | Scattered tiles; hovering one dims the rest and shows an info card | `components/site/WorkFreestyle.tsx` |
| `Index.dc.html`, `MIndex.dc.html` | Full sortable list of all 20 projects | `app/work/index/page.tsx` |
| `CaseStudy.dc.html`, `MCase.dc.html` | One template for all 20 case studies: 4 hero kinds (agent, flow, cinema, browser), 3 layouts (stacked, split, full), summary chips, "How it flows" strip, prev/next | `app/work/[slug]/page.tsx` + `components/site/CaseStudy.tsx` |
| `About.dc.html`, `MAbout.dc.html` | About | Replace `About.tsx` |
| `Connect.dc.html`, `MConnect.dc.html` | Connect with copy-email button, toast, `aria-live` announcement | Replace `Connect.tsx` |
| `NotFound.dc.html`, `MNotFound.dc.html` | 404 with searchlight orb and three suggested projects | `app/not-found.tsx` |
| `Loader.dc.html` | Intro loader, 2.8 s, Skip link | `components/site/Loader.tsx` (rules below) |
| `OgCard.dc.html` | 1200x630 share card for home and each project | Build-time OG images (phase 6) |

## Data

Create `content/portfolio.ts` from the `D` object in `CaseStudy.dc.html` (20 projects, same order as `order`). Per project: `id`, `title`, `group`, `year`, `kind`, `layout`, `cover`, `lede`, `blocks` (label + text), `stack`, optional `steps` + `hot` (flow kind), optional `live` (browser kind).

Also copy, from the same file:

- `WORK` (which projects are work projects), `STATUS` (status chip text, only where set), `MINI` (the small "How it flows" strip for cinema projects).
- `ACC`: accent colour per group, light and dark.
- Slugs: use the ids (`agent`, `mcp`, `logs`, ...). Case study URLs are `/work/<id>/`.

Keep `content/work.ts` (the long-form problem / constraint / decision / cost write-ups). Later it can become a "Read the full write-up" section under the matching case studies; it is not part of this redesign.

## Behaviour to reproduce exactly

**Connected scroll (Site.dc.html).**
- Sections flow into each other with no curtain or overlay.
- As each section scrolls into view, the URL updates with `history.replaceState` (never `router.replace`): `/`, `/work/`, `/about/`, `/connect/`. Scrolling back up goes back.
- Each section's intro replays every time it re-enters, not just once. Use the visibility thresholds from `Site.dc.html`: enter above 30% visible, leave below 5% (below 20% for sections above the current one).
- There is no progress bar, side rail or URL chip.
- The existing `/work`, `/about` and `/connect` pages keep rendering `Home` and jumping, which `JumpTo` already does.

**Top bar links.**
- On the one-page site, Home, Work, About and Let's talk smooth-scroll to their section.
- From a case study or Index they navigate to the route instead.

**Work intro (Orbit.dc.html).**
- About 20 small thumbnails, always facing the viewer, gather into a sphere around a small "Work" label. "Anubhav Kumar" sits at the left and "20 projects, 7 kinds" at the right.
- The sphere turns slowly, then files into the drawer. The whole intro takes about 3 s.
- The per-card keyframes (`akF0` to `akF19`) are generated from a Fibonacci sphere. Regenerate them in TS with the same formula. The design generated them in Python:

  ```
  y0 = i*(2/N) - 1 + 1/N; lat = asin(y0); lon = (i*137.508) % 360
  pose(L, r, s) = translate3d(-317px,-236px,0) rotateY(L) rotateX(lat) translateZ(r) rotateX(-lat) rotateY(-L) rotateX(18deg) scale(s)
  0%  { opacity 0; pose(lon-30, 620, .16) }
  12% { opacity 1 }
  36% { pose(lon+20, 240, .26) }
  64% { pose(lon+75, 240, .26) }
  then to the card's rest transform
  ```

  The card animation is `2.9s linear`, with a start delay of `0.1 + i*0.012 s`. The phone uses R = 320 then 125, scale .12 then .34, and `rotateX(12deg)`.
- Hovering a list item raises its file in the drawer.
- Opening a project records where it was opened from (drawer, freestyle or index) in `sessionStorage` key `akFrom`. The case study's close button and breadcrumb return there.

**Case studies.**
- The page opens with the hero zooming out from a card-sized inset: `clip-path: inset(14% 20% round 22px)` plus `scale(.96)`, going to full over 0.9 s with `cubic-bezier(.16,1,.3,1)`.
- The summary chips sit under the lede. The "How it flows" strip shows on cinema projects.
- Prev/next cycle through all 20. The arrow keys should do the same.

**Loader.**
- Show it at most once per session (`sessionStorage`), and never on a deep link (any path other than `/`), under reduced motion, or with `navigator.connection.saveData`.
- It always has a visible "Skip intro" link, and the top bar renders from the first frame.

**Hero background video.**
- Dark theme uses `/redesign/media/smoke-dark.mp4` and light uses `smoke-light.mp4`. Phones use the `-phone` versions.
- Add `playsInline muted loop autoPlay preload="metadata"` and a poster.
- `play().catch()` falls back to the poster, because iOS Low Power Mode blocks autoplay.
- The Pause/Play background button swaps the video for its poster (WCAG 2.2.2).
- Optional dark-theme alternative: `/redesign/media/sphere-hero.mp4`, a 7 s seamless Veo loop. It sits right of centre behind the ask anubhav card, with the scrim `linear-gradient(90deg, rgba(7,11,22,.6) 0%, rgba(7,11,22,.2) 50%, transparent 100%)`. Keep the small "Veo" mark visible, do not crop it out. A footer line "Some visuals generated with Google Veo" is a good idea.

**Theme.** Keep the existing `data-theme` + `localStorage('theme')` mechanism from `app/layout.tsx`. The top bar switch toggles it.

## Assets

| Path | Use |
|---|---|
| `/redesign/covers/<id>.jpg` | Cover for each of the 20 projects |
| `/redesign/media/smoke-{dark,light}{,-phone}.{mp4,jpg}` | Home and Connect background loops and posters |
| `/redesign/media/sphere-hero.{mp4,jpg}` | Optional dark hero loop (Veo) and poster |
| `/redesign/media/agent-diagram.{mp4,jpg}` | Backdrop behind the agent architecture SVG |
| `/redesign/media/loader.{mp4,jpg}` | Intro loader |
| `/redesign/brand/logo-on-{light,dark}.png`, `favicon.png` | Logo marks |
| `/resume.pdf` | Resume behind every Resume button (no phone, no city) |
| `/about.jpg` | Already in the repo; the About portrait |

## Phases (one commit per phase, on branch `redesign`)

1. **Foundation.**
   - `content/portfolio.ts`, plus the colour tokens from the `t` objects (light/dark) as CSS variables in `globals.css`.
   - The new top bar (desktop + phone sheet).
   - `public/resume.pdf` wired to the Resume buttons.
2. **Home and connected scroll.**
   - Hero, section order, `replaceState` URLs and replay-on-re-entry.
   - Replace Lenis-driven scroll-linked code only where the design needs it. Keep Lenis desktop-only, as now.
3. **Work.**
   - Drawer with the sphere intro, Freestyle, the view switch (`?view=`) and the Index route.
   - Phone versions.
4. **Case studies.**
   - `app/work/[slug]/page.tsx` with `generateStaticParams`, all four kinds and three layouts, chips, flow strips, prev/next, back-to-origin.
   - Phone layout from `MCase.dc.html`.
5. **About, Connect, 404, Loader.**
6. **Polish.**
   - OG images from `OgCard.dc.html`, `metadata` per route, focus rings and skip link.
   - A reduced-motion pass and a 390px pass.
   - Remove dead components.

## Checks before each phase is done

- `npm run build` passes and `out/` contains every route (including `/work/<id>/index.html` for all 20).
- `npm run dev`: compare each section side by side with its design file at 1440x900 and 390x844.
- Keyboard: every drawer item, tile and list row opens with Enter. Escape closes the phone sheet and returns focus to Menu.
- Reduced motion on: nothing moves, nothing stuck at opacity 0.
- `grep -rnP "\x{2014}" app components content` returns nothing (no em dashes).
- Lighthouse on `/` (mobile): LCP under 2.5 s, CLS under 0.1.
