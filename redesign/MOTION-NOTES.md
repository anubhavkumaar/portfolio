# Motion notes from the design canvas

Written next to the boards while designing.

## rowLight

Light theme

## rowDark

Dark theme

## rowParts

Shared parts

## motionHome

Home background: your own light field from the live site (lib/light-field.ts), the same shader with the violet band switched to blue so it is blue smoke only. On the canvas it plays as a rendered loop of that shader (about 0.5 MB, a portrait version on phones); on the real site keep the LightField component itself, which is lighter and follows the pointer. The name rises letter by letter. The logo is your clean mark: black in light, white in dark, blue as the favicon.

## motionOrbit

Work motion: the 20 covers arrive as a sphere that spins fast (two turns in 1.5s), then every card flies into a file drawer, standing one behind another with a coloured index tab (number and name) on each, staggered like real folders. The left column lists every project by group. Hovering a name or a file lifts that file up out of the drawer with a light sheen, and the glass drawer front updates to show its number, group and title. Click opens that project's case study. 'As a list' goes to Index. Phone: the sphere spins and drops into a pile.

## motionIndex

Index is now a detailed route, not part of the main flow: reached from the 'Index ↗' button next to the view switch on both Work views. All 20 projects in 7 groups with sticky group pills, tiles that rise in, and each tile opens its own case study.

## motionAbout

About motion: your portrait (the desk illustration from the live site) wipes up into its frame, then drifts slowly. The headline rises line by line, the copy and fact cards fade up, the path line draws left to right and each milestone dot pops in turn. The 'open to roles' chip floats gently.

## motionLoader

Intro loader: a Gemini-made clip where light particles stream in from the dark, lock into a glowing neural sphere, then the camera flies into its core. No counter, just a thin progress line. Your name rises bottom left as the sphere forms, everything fades as the light fills the frame, and it hands off to Home. Plays once per visit (about 6s, skippable on click); reduced motion skips it.

## motionConnect

Connect (/connect, in the dock): contact for work only, with email, LinkedIn, GitHub and X. /streamconnect is a separate route that is not in the dock: the same page with 'Find me live.', Kick and YouTube first, then Instagram, X and Steam, then LinkedIn and GitHub, for sharing on stream. Motion on both: the headline rises letter by letter, the dot pings, tiles rise in one after another and each brand glow drifts; hover lifts a tile and nudges its arrow; Copy flips to 'Copied'.

## rowCases

Case studies, all 20 projects

## caseSystem

All 20 case studies are laid out here (the Agent backend one sits in the main rows). Every Orbit card and Index tile opens /work/<project> on the real site; on this canvas they all open the Agent backend board because the canvas can't route per project. One CaseStudy component with a 'p' prop renders each, using one of four structures: diagram over video (Agent backend), animated flow of its own steps (MCP, Network log agent, Tickets, Retrieval, Multimodal, Test harness), full-bleed cinema with a light sweep and glass panel (Streaming, Portal, Releases, Observability, RPA, Academy, Job radar, Shorts, This site), and live site in a browser frame (PitStop, HEAT, SAPR, Valo Tourney). Copy stays overview level.

## rowPhone

Phone (390 x 844), light and dark

## rowPhoneCases

Phone case studies, all 20

## phoneNote

Phone is its own layout, not a squeezed desktop. Navigation is a slim top bar (logo, page name, Menu button), because iOS 26 Safari's floating toolbar fights anything fixed at the bottom. Menu opens a sheet from the bottom with big page links in thumb reach, plus Resume and a theme switch. Home stacks the name over the smoke with the chat card at the bottom. Work keeps the spinning sphere at a smaller radius with a swipeable group row. Index is one column of big tiles with a sticky swipeable group bar. Case studies stack, end with previous and next project cards, then Back to where you came from.

## flowNote

Site flow: one scroll from top to bottom. Home hero, then a Work teaser (the sphere), then the Index of tiles with only title, year and cover, then a short About, then Connect. Nothing detailed shows on the scroll. A project's full case study only opens when its card or name is tapped, and Back or the close button returns to the same scroll position.

## motionDock

Top bar (replaces the dock on desktop): no capsule, it sits flat on the page with a soft fade behind it. Row one: your logo on the left, a 'Let's talk' button framed by four corner ticks on the right (ticks pop in, grow on hover, green live dot) that opens Connect. Row two: breadcrumb on the left (anubhavkumaar.in / Work / project name on case studies), three numbered links in the centre (Home, Work, About) with an underline that draws in on hover and stays on the current page, and a 'light / dark' text switch on the right. Phone keeps its bottom tab bar.

## motionFree

Work, freestyle: the second Work view (switch with the drawer and grid icons). All 20 covers scattered at different sizes with no grouping. Hover one: every other cover fades and greys out, the hovered one lifts slightly, and a card opens beside it with the number, year, title, one line about the project, and chips for its group and stack. Click opens the case study. Scrolling stays light: just images until you point at one.

## motionRoutes

Connected scroll (the Site boards, far left; press Play and scroll). Home, Work, About and Connect are one continuous page, no cuts and no curtain. As a section scrolls away it drifts slower than the scroll, shrinks slightly and fades while the next rises in under it. Each section replays its intro every time it comes back into view (Work spins and files into the drawer again). The top bar is the only navigation: it stays fixed, its active link and breadcrumb follow the section in view, and its links smooth-scroll to their section. Build: one Next.js page with four sections; Framer Motion useScroll + useTransform for the drift, scale and fade; useInView (once: false) to replay each section's intro; history.replaceState / router.replace so the address bar shows /, /work, /about or /connect without a reload, and opening /work directly lands on that section. Case studies, Freestyle and Index stay separate routes.
