# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers and recruiters screening for GenAI, AI, or backend engineering roles at the 2 to 6 year level, in India or visa-sponsored abroad. They arrive from a resume, a LinkedIn profile, or a referral, usually on a laptop between other candidates, and decide within about 30 seconds whether Anubhav is worth a call. A second audience is the engineer on the panel who opens the source to see whether the site itself is competent work.

## Product Purpose

Anubhav Kumar's personal portfolio. It exists to convert a 30 second visit into an interview request. Success is a recruiter reaching for the email link, or an engineer nodding at the case studies. Because his degree is Mechanical Engineering rather than CS, the work has to carry the argument on its own; the site is also a work sample, so a templated look argues against him.

## Positioning

At Deloitte USI since July 2023, building the backend of an internal multi-tenant GenAI product platform licensed to external customers. Data Engineer I since June 2026, GenAI Developer before that, and a Data Analyst on an RPA automation programme from October 2023 to October 2024. A good share of his week goes on code review, unblocking the team, and writing the design documents the work gets built from. He built the platform's retrieval layer twice (from scratch, then on managed infrastructure) specifically to understand its failure modes. Title on the site: **Full Stack Developer and GenAI Engineer**. Employment reads as one continuous Deloitte entry from July 2023 with grade progression named inside it, not three separate jobs.

## Operating Context

Next.js 14 App Router, TypeScript, Tailwind, `output: 'export'`, deployed as static files by FTP to `htdocs/` on InfinityFree via `.github/workflows/deploy.yml`. `public/.htaccess` rewrites clean URLs to `index.html` and 301s `/discord`, `/insta`, `/youtube`. Dark and light themes both work; the toggle is a control, not a feature. Dev and production build write to separate directories (`.next` and `.next-build`) so a build never disturbs a running dev server. Fonts: Bricolage Grotesque (display) and Manrope (text) are the incumbent faces. Unrelated live route `/monitoroptions` (a monitor buying guide) shares the repo and is out of scope.

## Capabilities and Constraints

- **Confidentiality.** The platform is an internal Deloitte product licensed to external customers. Describe capability, decisions, and tradeoffs. No internal architecture diagrams, no client names, no product screenshots, no metrics beyond the cleared list, and do not name the four enterprise backends behind the MCP tool layer. Frame it as product engineering, never client project work. Do not name the customer category anywhere on the site or in this repo (his call, 2026-09-14): no sector, no user role that implies it. "Customers", "tenants", "portals" and "users" are the words.
- **Numbers allowed on the site (his profile sheet, 2026-09-14; nothing else):** zero critical findings at HIPAA and FIPS security review; roughly 40% drop in support tickets after his internal tooling; over 69,000 manual hours a year saved by the RPA programme he validated; 20+ internal APIs and tools; SSE refactor across 16 React components and roughly 10,000 lines; two Applause Awards. No hardcoded years-of-experience counter: the console computes tenure from July 2023 at ask time.
- **Case studies, four beats each (problem, constraint, decision, cost):** retrieval layer built twice, plus a RAG file management system (S3 documents, ingest jobs, list, delete; his detail, 2026-09-15); a multi-agent system (RAG, portal tools, ticket, log and pod agents, with an orchestrator) over an MCP tool layer built with FastMCP for four backends, every agent step traced in Langfuse (his detail, 2026-09-14); the end-to-end test framework as the CI merge gate plus releases on a sprint cadence (his pick, 2026-09-15; the earlier multi-tenant backend framing was a reconstruction and is gone). The framework drives the real deployed app like a user (sign in, open the chat, ask it something), reads the SSE stream back and times it (time to first event, total response time), and checks the answer by semantic matching for an ordinary answer or keyword checking when the answer carries live, changing data (his detail, 2026-09-15). The HIPAA and FIPS review is not listed as a case study (his call, 2026-09-14); its zero-critical-findings figure lives in the facts. Home and About copy is the wording from the previous site, kept at his request (2026-09-14): the About heading is "About", with the bio, the "problems I solve" list and the full awards and certifications list.
- **Skills (asked for in words, 2026-09-14):** one ruled register grouped by purpose (GenAI, backend, frontend, cloud and data, security and delivery), each group naming where on the site it did its work. Text chips only, no logos, no proficiency bars, no counts.
- **Side projects:** the hover preview is the pre-redesign three.js effect (ghostly 3D panels that resolve on hover), brought back at his explicit request 2026-09-15 after being cut for bundle size; dynamically imported so it does not load until the section is in view, and never on touch or under reduced motion. Four live React and Firebase sites for a GTA V roleplay community (PitStop, HEAT, SAPR, Valo Tourney), kept in a quiet section as proof he ships.
- **Contact:** `work@anubhavkumaar.in`, and all eight profiles (changed in words 2026-09-14, from GitHub and LinkedIn only): GitHub, LinkedIn, X, Instagram, YouTube, Twitch, Discord, Steam. No contact form. No resume download. No availability, relocation, or geography line.
- **DeepChat** is his office chatbot and is case study material; the site does not embed a chat product. The current working tree carries a scripted "ask anubhav" console (no model behind it; an intent map with canned answers) and three simulated demos of the Deloitte platforms. Whether those demos sit on the right side of the confidentiality line is an open decision.
- **Performance and accessibility targets:** Lighthouse accessibility above 95 and performance above 85 with the full motion layer on; 60fps on a mid-range phone; animate transform and opacity only; respect `prefers-reduced-motion` with a resting state that still looks designed; visible keyboard focus; a real mobile layout with its own motion design.
- **Copy rules, binding:** never an em dash; sentence case; plain verbs; active voice; no "passionate about", no "I'm a X who loves Y", no buzzwords, no exclamation marks. Written like a confident engineer talking to another engineer. Every line does one job.
- **Anti-patterns Anubhav named as template tells, to stay out:** "Hi there" greetings, flip cards, glowing hover buttons and decorative gradient washes, a tech-logo icon grid as the skills section, full-viewport scroll snapping, decorative timeline trees, social icons with hover tooltips, a floating "X years" badge, fade-and-slide-up on every section (desktop; on touch the staggered row rise is his ask, 2026-09-15), cream ground with serif and terracotta, near-black with one acid accent, identical rounded cards with one radius and one soft shadow, tracked all-caps eyebrow labels, middle-dot meta strings, an arrow on every link, 01/02/03 markers on non-sequences, one accented word in a headline. The typed role line was on this list from the original brief and was asked back in words on 2026-09-15; it stays.
- **Must not appear (his profile sheet, 2026-09-14):** any characterisation of who licenses or runs the platform, or the regulatory domain by customer; client, customer or account names; compensation figures; seniority claims relative to colleagues (the acceptable phrasing: "A good share of my week goes on code review, unblocking the team, and writing the design documents the work gets built from"); QA or Project Assistant framing for Oct 2023 to Oct 2024, or any claim of having developed UiPath automations; Terraform in production, ArgoCD ownership, Java, or Go; any number the sheet does not list; em dashes anywhere, including code comments.
- **Motion on phones (his ask, 2026-09-15):** the name rises in, the role line types through six titles from the sheet (starting on the confirmed one), the facts count up once, and the rows of each ruled list rise in staggered as it enters view. All of it off under reduced motion; the static HTML carries the final state.
- **Console facts:** age 25, Hyderabad and LinkedIn are answerable through the landing console, from the sheet. The phone number is not shown anywhere (his call, 2026-09-14). Public email is work@anubhavkumaar.in. Hadoop, Hive, Oracle SQL Developer, UiPath and Power BI stay out of the headline skill set (an "also worked with" line).
- **Open, not to be invented:** whether the DeepChat simulation stays.

## Brand Commitments

- Name: Anubhav Kumar. Mark: "AK" monogram, assets at `public/logo/{avatar,black,white,blue}.png`.
- Portrait: `public/about.jpg` (1024x1024, at his desk).
- Voice: the copy rules above.
- References he pointed at for the level of craft: sashamartynchuk.com and the Awwwards portfolio category. What he wants from them is confidence and craft, not effect volume.
- **Standing visual preference (chosen in words, 2026-09-14):** the dark AI-engineer portfolio genre, played straight and rebuilt rather than polished. Craft bar, all four named by Anubhav: Linear and Vercel (precision, hairlines, fast quiet motion), Raycast and Cursor (atmospheric depth, glass with real light), sashamartynchuk.com (typographic scale, cursor-tied motion), and Awwwards portfolio winners (full-screen landing, scroll choreography, a WebGL moment). Future work inherits this world.
- Revealed preference from four rounds of feedback: he rejected an austere drafting-paper direction as "too grey, too plain, no textures, no homepage" and said the incumbent dark, blue-accent site was better than it. He wants a real landing screen, saturated colour, textures and material presence, and has cleared WebGL, project preview images, and the portrait for use. Gradient washes and glow as decoration stay banned.

## Evidence on Hand

- Resumes: `C:\Users\anubh\Downloads\Anubhav_Kumar_resume_D_DataEngineer.docx` and `Anubhav_Kumar_Resume_Carelon_AI.docx` (newest, September 2026); older variants alongside.
- Project previews: `public/previews/{pitstop,heat,sapr,soulcity}.jpg`, 1280x800.
- Case study copy with all four beats, plus profile, education, and awards content: on branch `redesign-load-bearing` under `content/`. Reusable as product truth independent of that branch's visual world.
- Incumbent implementation: `app/page.tsx` (single file, ~1,900 lines), `app/hero-console.tsx`, `app/enterprise-demos.tsx`, SmoothUI and Amicro components under `components/`.
- Absent, do not fabricate: product screenshots of the Deloitte platform, client names, testimonials, any metric not on the cleared list.

## Product Principles

- Depth beats inventory. Four pieces of work told properly do more than twelve logos.
- The work carries the argument, because the degree does not.
- Motion is a designed system tied to the content, never a pile of hover tricks. Three flawless interactions beat fifteen adequate ones.
- Performance is part of the craft and is what separates the real thing from a laggy imitation.
- Confidentiality is a hard edge, not a tone.

## Accessibility & Inclusion

Lighthouse accessibility above 95. `prefers-reduced-motion` respected with an intentional resting state. Visible focus on every interactive element. Real mobile layout, not a squeezed desktop.
