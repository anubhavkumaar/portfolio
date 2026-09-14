# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers and recruiters screening for GenAI, AI, or backend engineering roles at the 2 to 6 year level, in India or visa-sponsored abroad. They arrive from a resume, a LinkedIn profile, or a referral, usually on a laptop between other candidates, and decide within about 30 seconds whether Anubhav is worth a call. A second audience is the engineer on the panel who opens the source to see whether the site itself is competent work.

## Product Purpose

Anubhav Kumar's personal portfolio. It exists to convert a 30 second visit into an interview request. Success is a recruiter reaching for the email link, or an engineer nodding at the case studies. Because his degree is Mechanical Engineering rather than CS, the work has to carry the argument on its own; the site is also a work sample, so a templated look argues against him.

## Positioning

Three years at Deloitte USI building the backend of an internal multi-tenant GenAI product platform that US state governments license. He is the review gate on his team: every merge request passes through him before release, including work from engineers senior in grade. He built the platform's retrieval layer twice (from scratch, then on managed infrastructure) specifically to understand its failure modes. Title on the site: **Full Stack Developer and GenAI Engineer**. Employment reads as one continuous Deloitte entry from July 2023 with grade progression named inside it, not three separate jobs.

## Operating Context

Next.js 14 App Router, TypeScript, Tailwind, `output: 'export'`, deployed as static files by FTP to `htdocs/` on InfinityFree via `.github/workflows/deploy.yml`. `public/.htaccess` rewrites clean URLs to `index.html` and 301s `/discord`, `/insta`, `/youtube`. Dark and light themes both work; the toggle is a control, not a feature. Dev and production build write to separate directories (`.next` and `.next-build`) so a build never disturbs a running dev server. Fonts: Bricolage Grotesque (display) and Manrope (text) are the incumbent faces. Unrelated live route `/monitoroptions` (a monitor buying guide) shares the repo and is out of scope.

## Capabilities and Constraints

- **Confidentiality.** The platform is an internal Deloitte product licensed to US state governments. Describe capability, decisions, and tradeoffs. No internal architecture diagrams, no client names, no product screenshots, no metrics beyond the cleared list, and do not name the four enterprise backends behind the MCP tool layer. Frame it as product engineering, never client project work.
- **Cleared metrics, all approved by Anubhav:** zero critical findings at HIPAA and FIPS review; roughly 40% drop in support tickets after his internal tooling; over 69,000 manual hours a year saved by the UiPath programme he validated; 5,000+ users across 5 state portals. The last two sit nearest the confidentiality line and are framed as programme scale and platform capability, not delivered client results.
- **Case studies, four beats each (problem, constraint, decision, cost):** retrieval layer built twice; MCP tool layer and agents for four backends; backend re-platform (v2). The HIPAA and FIPS review is not listed as a case study (his call, 2026-09-14); its zero-critical-findings figure lives in the facts. The review-gate claim is stated modestly, not as a headline. The v2 case study copy is reconstructed from resume material and still needs two facts from him: what would not hold in v1, and what the re-platform cost.
- **Skills (asked for in words, 2026-09-14):** one ruled register grouped by purpose (GenAI, backend, frontend, cloud and data, security and delivery), each group naming where on the site it did its work. Text chips only, no logos, no proficiency bars, no counts.
- **Side projects:** four live React and Firebase sites for a GTA V roleplay community (PitStop, HEAT, SAPR, Valo Tourney), kept in a quiet section as proof he ships.
- **Contact:** `work@anubhavkumaar.in`, and all eight profiles (changed in words 2026-09-14, from GitHub and LinkedIn only): GitHub, LinkedIn, X, Instagram, YouTube, Twitch, Discord, Steam. No contact form. No resume download. No availability, relocation, or geography line.
- **DeepChat** is his office chatbot and is case study material; the site does not embed a chat product. The current working tree carries a scripted "ask anubhav" console (no model behind it; an intent map with canned answers) and three simulated demos of the Deloitte platforms. Whether those demos sit on the right side of the confidentiality line is an open decision.
- **Performance and accessibility targets:** Lighthouse accessibility above 95 and performance above 85 with the full motion layer on; 60fps on a mid-range phone; animate transform and opacity only; respect `prefers-reduced-motion` with a resting state that still looks designed; visible keyboard focus; a real mobile layout with its own motion design.
- **Copy rules, binding:** never an em dash; sentence case; plain verbs; active voice; no "passionate about", no "I'm a X who loves Y", no buzzwords, no exclamation marks. Written like a confident engineer talking to another engineer. Every line does one job.
- **Anti-patterns Anubhav named as template tells, to stay out:** typed-role animation, "Hi there" greetings, flip cards, glowing hover buttons and decorative gradient washes, a tech-logo icon grid as the skills section, full-viewport scroll snapping, decorative timeline trees, social icons with hover tooltips, a floating "X years" badge, fade-and-slide-up on every section, cream ground with serif and terracotta, near-black with one acid accent, identical rounded cards with one radius and one soft shadow, tracked all-caps eyebrow labels, middle-dot meta strings, an arrow on every link, 01/02/03 markers on non-sequences, one accented word in a headline.
- **Open, not to be invented:** whether the DeepChat simulation stays; the two v2 facts above.

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
