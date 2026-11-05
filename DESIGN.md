---
name: Anubhav Kumar, portfolio
description: An AI-engineer portfolio played straight, light by default with dark one tap away, a living light field, display type at scale, and hairline structure.
colors:
  ground: "#0a0c10"
  surface: "#12151c"
  ink: "#eef1f6"
  electric-blue: "#5b9fff"
  electric-blue-deep: "#2f6bff"
  field-violet: "#7c5cff"
  ground-light: "#f4f6fa"
  surface-light: "#e9edf4"
  ink-light: "#0b0e14"
  electric-blue-light: "#2f6fed"
  electric-blue-deep-light: "#1f57d6"
  field-violet-light: "#6a4cf0"
typography:
  hero:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 11vw, 9.5rem)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.035em"
    fontVariation: "'opsz' 96"
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4.5rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.03em"
    fontVariation: "'opsz' 72"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.02em"
    fontVariation: "'opsz' 48"
  lead:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.6vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.008em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  small:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  meta:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  hair: "2px"
  panel: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  section: "clamp(6rem, 14vh, 11rem)"
  nav: "4rem"
  page-max: "1600px"
  measure: "62ch"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.electric-blue}"
    textColor: "#06080c"
  button-ghost:
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 1.25rem"
  chip:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "28px"
    padding: "0 0.7rem"
  glass-panel:
    rounded: "{rounded.panel}"
    padding: "clamp(1.5rem, 3vw, 2.25rem)"
---

# Design System: Anubhav Kumar, portfolio

## Overview

**Creative North Star: "The Living Field"**

One cool ground carries the whole site, near-white by default and deep blue-black one tap away (see The Light Default Rule). Behind the landing a slow field of light drifts through warped noise, blue into violet, luminous where a band runs strong and weighted to the upper right, so a name set at the largest scale on the page sits on the quiet part of it. The same field is allowed in two other places and nowhere else (see The Field Has Three Homes Rule): the standalone `/live/` page and stream mode. Everything after the landing is structure rather than atmosphere: hairlines, one electric blue used for meaning, display type that does the work headings usually leave to boxes. The page is a work sample for a backend and GenAI engineer, so it argues by precision. Nothing glows, nothing floats, nothing is tracked or shouted.

Density is editorial rather than dashboard: sections breathe at a viewport-scaled rhythm, lists are ruled rather than carded, and the one panel that reads as glass (the console) exists because it sits over the light and lets it through. The two themes are one world, not two palettes: the ground inverts, the accent deepens on the light ground to hold contrast, the field tints instead of glowing. Light is where a visitor lands; dark is a first-class equal, not a fallback.

Motion answers the visitor. The name's glyphs ease away from the pointer on a spring (one spring, `lib/glyph-spring.ts`, shared by the hero, the Connect register, `/live/` and stream mode), the side-project panels resolve under the cursor, headings rise once through a mask when they arrive, the role line types through its titles, the facts count up once. On touch, where there is no pointer, the rows of each ruled register rise in one after another as the list enters view instead; on a desktop they are simply there. Nothing fires on scroll for its own sake, and the resting state under reduced motion is the design, not a stripped version of it.

**Key Characteristics:**
- Near-white ground (#f4f6fa) by default, blue-black (#0a0c10) one tap away, with a WebGL light field in three places only: the landing, `/live/` and stream mode
- One accent, electric blue (#2f6fed on light, #5b9fff on dark), reserved for meaning: role line, labels, links, focus
- Hairlines (ink at 10%) as the structure; no boxes, no card grids
- Bricolage Grotesque at scale with optical sizing; Manrope for reading; mono for measurements only
- Glass is a hairline plus a faint fill; backdrop blur on two surfaces only
- Pointer-responsive motion, mask reveals, one exponential-out easing family

## Colors

Five values per theme, and every other colour on the page is one of them at an opacity.

### Primary
- **Electric Blue** (#5b9fff dark, #2f6fed light): the single accent. Role line under the name, beat labels inside a spread, the open spread's title, focus rings, hover and press on the profile rows and their glyphs, the live label (on `/live/` a tint of it, lighter on the dark ground and deeper on the light one, so it holds 3 to 1 against the brightest the light gets) and the live platform's glyph, the current glyph in the stream's progress row, the light field's first band. Never a wash, never a gradient, never a background behind text.
- **Electric Blue Deep** (#2f6bff dark, #1f57d6 light): reserved for pressed and deeper states of the accent; rarely seen.

### Tertiary
- **Field Violet** (#7c5cff dark, #6a4cf0 light): exists only inside the light field's second band. It is never applied to an element.

### Neutral
- **Ground** (#0a0c10 dark, #f4f6fa light): the page. Cool near-black with no slate drift; the field is drawn from this value so the landing fades into the page without a seam.
- **Surface** (#12151c dark, #e9edf4 light): the SmoothUI primitives' card and input fill; not used for page sections.
- **Ink** (#eef1f6 dark, #0b0e14 light): text and the primary button. Secondary text is ink at 0.78 (lede), 0.62 (small, muted), 0.55 (meta), 0.5 (cue). On the light theme the smallest text steps up, because 12px at 0.55 measured 4.18 on the light ground: meta and the About label are 0.68, the cue 0.8, and the console's muted lines 0.78. The role line takes a deeper step of the accent (#1946b0) where it sits on the brightest part of the field.
- **Hair** (ink at 0.10) and **Hair Strong** (ink at 0.22): every rule and border on the site. Ghost buttons use the strong value.
- **Glass** (ink at 0.05 dark, 0.035 light) and **Glass Hover** (0.08, 0.06): the fill of a glass panel and of a ruled cell on hover.

### Named Rules
**The One Voice Rule.** Electric blue marks meaning (a label, a link, the active thing, focus). It is never decorative, never a background, never a gradient, and never appears on more than a few elements per viewport.

**The Opacity Rule.** Secondary tones are ink at an opacity, never a second grey. A new tone is a new opacity step on ink, not a new hex.

**The Field Only Rule.** Violet lives in the WebGL field and nowhere else. If an element needs a second accent, the answer is no.

**The Light Default Rule.** (Decided 2026-11-05, after seeing both themes side by side: "the white one looked better".) The site opens light. A first visit gets light whatever the operating system prefers, and a choice made with the toggle is saved and wins on every visit after. `prefers-color-scheme` is deliberately not read: the light theme is the one that was chosen, and a visitor who wants dark is one tap from it. `theme-color` follows the page (#f4f6fa light, #0a0c10 dark) so the browser bar matches. Dark stays a first-class theme: same five values inverted, same contrast bar, checked on every change. Stream mode is the exception and stays dark, because it is composited over game footage in OBS and the field's brightness budget there was set for the dark ground. `/live/` follows the visitor's theme like the rest of the site.

## Typography

**Display Font:** Bricolage Grotesque (with system-ui), variable, optical-size axis loaded
**Body Font:** Manrope (with system-ui)
**Label/Mono Font:** Azeret Mono 500 (with ui-monospace)

**Character:** Bricolage's wide, low-contrast grotesque at 650 to 700 with the optical size set per role gives the display line a drawn, slightly unusual voice that a geometric sans would not. Manrope underneath is quiet and readable. Mono appears only where a value is a measurement or an identifier: years, counts, tags, a pipeline step name.

### Hierarchy
- **Hero** (700, clamp(3.5rem, 11vw, 9.5rem), 0.9, -0.035em, opsz 96): the name only, set one glyph per element so it can answer the pointer.
- **Display** (650, clamp(2.25rem, 5vw, 4.5rem), 0.98, -0.03em, opsz 72): one section heading per section; the mask reveal applies here and nowhere else.
- **Title** (600, clamp(1.5rem, 2.6vw, 2.25rem), 1.08, -0.02em, opsz 48): spread titles, side-project names, skill group names. The email address on the connect screen sits above this, at clamp(1.6rem, 4.9vw, 6.5rem), because it is the action.
- **Lead** (400, clamp(1.15rem, 1.6vw, 1.35rem), 1.45): the role line, section ledes, About lead. Usually muted.
- **Body** (400, 1.0625rem, 1.62): reading text, capped at 62ch.
- **Small** (400, 0.9375rem, 1.55, ink 0.62): captions, handles, footer, nav links, button labels at 600.
- **Meta** (500 mono, 0.75rem, 1.4, 0.01em, tabular numerals): years, counts, stack tags, the scroll cue.

### Named Rules
**The Mono Is A Measurement Rule.** Mono sets numbers, years, identifiers, and pipeline names. A sentence, a label, or a caption is never set in mono.

**The One Reveal Rule.** The mask rise belongs to display headings, once per section. On a desktop, body copy, rows, and panels arrive plain; on touch, the rows of a ruled register may rise in staggered (55ms apart) as the list enters view, since that is the phone's substitute for hover.

**The No Costume Rule.** No tracked uppercase, no eyebrow labels, no gradient text, no accented single word inside a headline.

## Layout

A single centred column, 1600px maximum, with a fluid gutter (clamp(1.25rem, 4vw, 4rem)). Sections are separated by a viewport-scaled rhythm (clamp(6rem, 14vh, 11rem)); "tight" sections take 55% of that. Section heads are a two-column grid at 960px and above (heading left, lede right) and stack below it. Reading measure is 62ch; hero lede 40ch.

The landing is a full viewport: a two-column grid (copy left, console right) that stacks under 900px, with the name lower-left and the scroll cue anchored to the content column, not the viewport edge. Lists are ruled registers: spreads, side-project rows, the skills register, and the profile register all use top and bottom hairlines rather than gaps between boxes. The profile register is one column of rows at every width, in two ruled groups, Social and Work. Facts are a 2 by 2 grid of big numbers under the About copy.

Sticky elements: the nav (4rem, fixed, hairline and blur once scrolled) and the About portrait on wide screens. The page never scrolls horizontally; the light field and the cursor preview are clipped to their sections.

## Elevation & Depth

Tonal and hairline, not shadowed. Depth on this site is the light field behind the landing, opacity steps on ink, and one panel radius; shadows appear on two elements only and are ambient, never structural.

### Shadow Vocabulary
- **Panel ambient** (`box-shadow: inset 0 1px 0 rgba(238,241,246,0.06), 0 24px 60px -20px rgba(0,0,0,0.55)`): the glass panel (console, email card, demo panel). On light it becomes `inset 0 1px 0 rgba(255,255,255,0.7), 0 24px 60px -24px rgba(11,14,20,0.28)`.
- **Preview lift** (the cursor-following screenshot): a soft ambient drop under the floating image so it reads as a plate above the rows.

### Named Rules
**The Two Blurs Rule.** Backdrop blur exists on the console (blur 18px, ground at 30%) because it sits over the light field, and on the scrolled nav (blur 14px, ground at 72%). Everywhere else glass is a hairline plus a 5% fill, flat.

**The Glass Is A Pane Rule.** (After Apple's Liquid Glass, borrowed 2026-09-15.) The two blurred surfaces carry a highlight layer, one light source catching the top edge (`inset 0 1px 0` white at 0.22 on the console, 0.08 on the nav) with a sheen fading out in the first third, and lensing at the rim (a 1px inner ring, dimmer at the bottom). Interaction lights the pane from within, in the accent: the console on `:focus-within`; every ghost button, the theme toggle and the spread's open/close control on hover and press. The scrolled nav also softens content into the ground over a 22px band beneath it (the scroll edge). Glass is reserved for the chrome layer and floating controls; content (lists, chips, tiles, the portrait, the demo panels) never gets it, and glass never sits on glass, so the controls inside the console stay solid fills.

**The Field Is The Depth Rule.** The landing's depth comes from the moving light, not from layered surfaces. Do not stack panels or add glows to imitate it.

## Shapes

Two silhouettes. Structure is square: ruled registers, hairline grids, and the ruled profile rows carry no radius at all. Objects are round: buttons and chips are full pills (999px), the glass panels and the demo panel are 20px, the theme toggle and the console avatar are circles, focus rings sit at 2px. No bevels, no embossing, no offset shadows, no clip-path shapes.

## Components

### Buttons
- **Shape:** full pill (999px), 44px tall, 1.25rem side padding, small size at 600, inline-flex with a 0.5rem icon gap.
- **Primary:** ink on ground (#eef1f6 on #0a0c10 dark; inverted on light). Hover swaps to electric blue with near-black text (#06080c). Press scales to 0.97 over 180ms.
- **Ghost:** transparent, 1px hair-strong border, ink at 0.85. Hover raises border and text to full ink.
- **Magnetic:** hero CTAs sit inside a magnetic wrapper (strength 0.3) that follows the pointer on a spring; off under reduced motion.
- **Focus:** 2px electric-blue outline, 4px offset, on every focusable element.

### Chips
- **Style:** 28px pill, 1px hair border, no fill, 0.8rem text at ink 0.7. Used for case-study stacks and the skills register. Static, never interactive.

### Glass Panel
- **Corner Style:** 20px.
- **Background:** ink at 0.05 (glass) with a 1px hair border and the panel ambient shadow. The `--lit` variant over the field uses ground at 30% with an 18px blur.
- **Internal Padding:** clamp(1.5rem, 3vw, 2.25rem) on the email card; 1.25rem to 1.5rem on the console.

### Ruled Register
- **Style:** top hairline on the list, bottom hairline on each row; rows are a grid that stacks under 760px. Used by spreads, side projects, skills, and About's listing.
- **Hover:** row text moves 0.75rem right on a 360ms exponential-out transform (side projects), title turns electric blue (spreads). Hover moves transforms and colours only, never padding.

### Connect (signature, redesigned 2026-10-28)
The email address is the primary action: set large as the section's centrepiece with Email me and Copy address beside it. The profiles sit in a profile register, two ruled groups with a small label each, Social (Instagram, X, Steam) and Work (GitHub, LinkedIn). Kick, YouTube, Twitch and Discord are left out of the portfolio (2026-11-05) and live on `/live/` and in stream mode; `ProfileRegister` takes an `exclude` list and drops a group that ends up empty. Every count fills its rows exactly, so there is never an empty cell.

Two arrangements exist until one is chosen, `address` (copy and email left, register right, 7fr and 5fr from 900px) and `ledger` (a sticky lead on the left at 5fr, register 7fr, a larger address). Below 900px both stack in the same order: heading, address, buttons, Social, Work.

### Profile Register
- **Row:** one ruled row per profile, the platform name as a Title (display, 600), the handle in small text under it on a phone and at the right edge from 768px, the brand glyph at the left. Minimum height 4.5rem (5rem on `/live/`). No icon-on-top tiles, no tooltips, no arrows.
- **Colour:** glyph and name are ink at rest and electric blue on hover, press and keyboard focus (the deep blue on the light theme). `:active` mirrors `:hover` since touch never fires the latter. A faint glass fill marks the row.
- **Signature interaction:** the glyphs of the row's name ease away from the pointer on the hero spring (radius 130px, push 11px, scaled down from the hero's 220 and 26 because the type is a fifth the size) and settle back. On touch, a tap springs the glyphs outward from the touch point. The press never delays the link, so universal links and app handoffs work.
- **Live state:** not shown in the portfolio's Connect, which lists no streaming platform (2026-11-05). Where a register does list one, a streaming row (Kick, YouTube, Twitch) shows a small electric-blue "live" label beside its name and the stream title in small text under it. The state comes from `useLiveStatus`, which reads static JSON today (`public/live-status.json`) and can be pointed at the Kick, Twitch or YouTube APIs later through one `LiveSource` function.

### Live Page (`/live/`, signature)
The page a chat link points at. The nine profiles and the email as one continuous list of rows at least 5rem tall (the whole row is the link), Social then Work then Email, with a stronger hairline where each group ends, over the light field at full height. The AK mark draws in, the name rises glyph by glyph through a mask, and the rows cascade, once per visit (sessionStorage), in about 1.3s, and any tap skips it. A tap presses the row in, springs its glyphs outward from the touch point and pulses the field from that spot before the link opens.

When any streaming platform is live the page changes: the field speeds up and breathes (a little brighter, never enough to cost the type its contrast), the AK mark turns electric blue, and the live platform's row leaves the list to become the largest type on the page, with the stream title under it and a mono timer that counts up. The other rows keep their order below. Offline is calm and every row is equal. Device tilt (the light slides, the type shifts a few pixels the other way) is optional: it starts on its own where the platform needs no permission and asks only after a tap where it does. One quiet line at the bottom links to the portfolio.

On desktop the content sits in one column on the left, where the field is quiet; the light has the rest of the screen. Links are real anchors in the static HTML and tappable before any script runs; the field mounts after first paint.

### Stream Mode (`/stream/`, signature)
A fixed 1920 by 1080 stage for an OBS browser source, scaled to the window (1:1 in OBS). One profile at a time: the name, enormous, rises through a mask glyph by glyph, holds, and breaks away on the glyph spring (slowed, with a travelling target) as the next one builds in. The handle sits under the name and the short address under the handle. A row of nine glyphs shows the position, the address `anubhavkumaar.in/live` is always in a corner, and a QR code to `/live/` sits on a light plate opposite it. The field drifts slowly toward each new name. No pointer effects, no scrollbar, no smooth scroll, no nav.

Scenes are query strings: `?scene=starting` adds a mono countdown (`&min=` or `&to=`), `?scene=brb` is "Back soon", `?scene=ending` is "Thanks for watching", `?only=social|work|streams` filters the cycle, `?bg=transparent` drops the field and the ground, `?hold=` sets seconds per name, `?motion=full` animates on a host whose OS has animation switched off. Under reduced motion the names dissolve into one another and the field is one frozen frame.

Legibility after compression is the constraint: no text under 28px, nothing living only in a hairline, nothing thin, slow motion (rise 1.1s, flight 1.1s, names held 6s). It runs for hours: one absolute clock drives every timer so nothing drifts, two cycle layers exist at most, there is one spring and one field, and when OBS hides the source the field and the clock stop.

### Lower Third (`/stream/lower/`)
A 1920 by 200 strip with a transparent background: the platform glyph, the name and the handle at the left, the short address in the accent at the right, rising and breaking away exactly as the stage does at small scale. `?plate=1` adds a flat ground band at 90% for busy video.

### Inputs
- **Style:** the console's prompt input is the SmoothUI primitive on the `--sh-*` tokens: surface fill, hair border, 20px radius inside the panel, a circular send button.
- **Focus:** ring in electric blue via `--sh-ring`.

### Navigation
- **Style:** fixed 4rem bar, mark left (logo plus name; the name hides under 900px), links right in small size at ink 0.66, circular theme toggle. Transparent at the top; once scrolled it gains a hair bottom border, ground at 72%, and a 14px blur.
- **States:** hover and current raise the link to full ink and draw a 1px underline that scales in from the left. Current is set from the section owning the middle of the viewport and clears when none does.

### Light Field (signature)
A WebGL2 fullscreen-triangle shader: two bands of ground-tinted blue and violet through domain-warped noise, a soft bloom that lags the pointer, an optional fade to ground at the bottom, dither against banding. It lives in `lib/light-field.ts` and is steered through a small controller (`setMood`, `setDrift`, `setTilt`, `pulse`, `setActive`) and a few options (a `quiet` zone dims the light toward the left edge for a column of type), so each surface gives it a temperament without forking the shader. DPR capped at 1.5 (1 on phones, with three noise octaves), paused when offscreen, hidden or told to, one frame under reduced motion. It mounts after the page is interactive and reads its colours from the theme tokens, so a palette change reaches it. If the GPU context is lost it is rebuilt, and an adaptive render scale drops resolution when frames run long. `/live/` is the one surface that has to be tappable at once on whatever phone a chat link lands on, so there the shader compiles off the main thread where the browser allows it (`asyncCompile`), the canvas fades in on the first drawn frame rather than on mount, and the field is skipped altogether on a software-only renderer (`requireGpu`: SwiftShader, llvmpipe), where a full-screen noise shader costs more than the light is worth. The page is complete without it. `?gl=any` overrides that for captures and audits made on a machine with no GPU.

Where it lives, and why:
- **The landing.** The first impression, with the name on its quiet side.
- **`/live/`.** The page is a poster for a phone: nothing on it competes with the light, and the light is how it shows he is live (faster, brighter, breathing). Phone settings everywhere, full height, mounted on an idle moment after first paint.
- **Stream mode.** It is the site's face on a stream. Half resolution, slow, dim enough that 28px type holds contrast, and absent with `?bg=transparent`.
- **Behind Connect (proposed, not built).** The end of the page could answer the start, like a bookend. It is not part of the system until it is approved. If it is: mounted only while Connect is in view, one frozen frame under reduced motion, and the rule below counts four.

### Named rules for the field
**The Field Has Three Homes Rule.** The field belongs to the landing, `/live/` and stream mode. A fourth place needs a reason as good as the three above: a place where the visitor's attention is the product and nothing is trying to be read at length. Everywhere else the page is structure.

**The Quiet Side Rule.** The light is weighted to the upper right. Text goes where it is quiet, and the field's gain is set so that every line of text keeps AA against the pixels behind it (3 to 1 for large type, 4.5 to 1 for the rest), measured against the real render across field times, not guessed. The number that matters is the brightest pixel the light ever reaches, which is the gain at the top of the breath, so that is what is capped (a calm and a live peak within a few percent of each other) and what is measured: the field alone, at the top of the breath, across many field times, against the small type's actual colour. If a layout puts reading text in the bright zone, the layout moves before the gain does; where a column has to stay put (the wide `/live/`), the field's `quiet` option dims the light there instead.

**The Live Rule.** "Live" is shown by a small electric-blue label, the live platform's row becoming the largest type on its page, a timer, and the field's mood. Never a red dot, never a banner, never a glow.

### Console (signature)
The scripted assistant on the landing: a `--lit` glass panel with an avatar, "ask anubhav", a transcript that streams an answer word by word, five suggestion chips, and a prompt input. Answers come from a keyword-scored set in `content/answers.ts`, first person, facts from the profile sheet only, and each routes to the section it describes.

### Side-project preview (signature)
Rows on the left; behind and to the right, the four screenshots drift as ghostly, blue-tinted 3D panels (three.js, dynamically imported, mounts only once the section is in view) and resolve into clear focus on hover of their row, the others fading toward invisible. Off under reduced motion and on touch, where the screenshot sits inline under each row instead. Reintroduces three.js for this one effect at the user's explicit request (2026-09-15), after the rebuild had removed it; the cost is lazy-loaded and does not touch the first-load bundle.

## Do's and Don'ts

### Do:
- **Do** build every list as a ruled register: hairlines above and between, no gaps between boxes.
- **Do** use electric blue for meaning only: labels, links, the active item, focus, one hover state.
- **Do** set new secondary tones as ink at an opacity (0.78, 0.62, 0.55, 0.5) rather than a new grey.
- **Do** keep mono for numbers, years, identifiers, and pipeline names, with tabular numerals.
- **Do** use the one easing family: `cubic-bezier(0.22, 1, 0.36, 1)` at 180ms, 360ms, or 700ms, and springs for pointer response.
- **Do** give every entrance a resting state that stands on its own under `prefers-reduced-motion`.
- **Do** keep both themes as the same five values inverted; the light theme deepens the accent to hold contrast.

### Don't:
- **Don't** add a backdrop blur to anything other than the console and the scrolled nav.
- **Don't** set a sentence, caption, or label in mono, tracked uppercase, or as an eyebrow.
- **Don't** put a gradient, glow, or wash on an element; the field is the only light on the site, and it appears in three places only.
- **Don't** put a scrim, plate or text-shadow behind type to rescue contrast over the field; lower the gain or move the text. (The QR code's light plate and the lower third's optional ground band are the two exceptions, because a scanner and busy video need them.)
- **Don't** set stream-mode text under 28px, or let anything in stream mode live only in a hairline.
- **Don't** arrange content as a grid of same-size rounded cards with one shadow.
- **Don't** add a second accent, an accented word inside a headline, or an arrow to a link.
- **Don't** animate padding, height, or layout on hover; move transforms and colours only.
- **Don't** add a custom cursor; the native pointer is the pointer.
