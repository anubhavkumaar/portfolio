---
name: Anubhav Kumar, portfolio
description: A dark AI-engineer portfolio played straight, with a living light field, display type at scale, and hairline structure.
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

One deep blue-black ground carries the whole site. Behind the landing a slow field of light drifts through warped noise, blue into violet, dim enough that a name set at the largest scale on the page sits on it without a halo. Everything after the landing is structure rather than atmosphere: hairlines, one electric blue used for meaning, display type that does the work headings usually leave to boxes. The page is a work sample for a backend and GenAI engineer, so it argues by precision. Nothing glows, nothing floats, nothing is tracked or shouted.

Density is editorial rather than dashboard: sections breathe at a viewport-scaled rhythm, lists are ruled rather than carded, and the one panel that reads as glass (the console) exists because it sits over the light and lets it through. The light theme is the same world lit, not a second palette: the ground inverts, the accent deepens to hold contrast, the field tints instead of glowing.

Motion answers the visitor. The name's glyphs ease away from the pointer on a spring, the side-project panels resolve under the cursor, headings rise once through a mask when they arrive, the role line types through its titles, the facts count up once. On touch, where there is no pointer, the rows of each ruled register rise in one after another as the list enters view instead; on a desktop they are simply there. Nothing fires on scroll for its own sake, and the resting state under reduced motion is the design, not a stripped version of it.

**Key Characteristics:**
- Blue-black ground (#0a0c10) with a WebGL light field behind the landing only
- One accent, electric blue (#5b9fff), reserved for meaning: role line, labels, links, focus
- Hairlines (ink at 10%) as the structure; no boxes, no card grids
- Bricolage Grotesque at scale with optical sizing; Manrope for reading; mono for measurements only
- Glass is a hairline plus a faint fill; backdrop blur on two surfaces only
- Pointer-responsive motion, mask reveals, one exponential-out easing family

## Colors

Five values per theme, and every other colour on the page is one of them at an opacity.

### Primary
- **Electric Blue** (#5b9fff dark, #2f6fed light): the single accent. Role line under the name, beat labels inside a spread, the open spread's title, focus rings, hover on the primary button and on social glyphs, the light field's first band. Never a wash, never a gradient, never a background behind text.
- **Electric Blue Deep** (#2f6bff dark, #1f57d6 light): reserved for pressed and deeper states of the accent; rarely seen.

### Tertiary
- **Field Violet** (#7c5cff dark, #6a4cf0 light): exists only inside the light field's second band. It is never applied to an element.

### Neutral
- **Ground** (#0a0c10 dark, #f4f6fa light): the page. Cool near-black with no slate drift; the field is drawn from this value so the landing fades into the page without a seam.
- **Surface** (#12151c dark, #e9edf4 light): the SmoothUI primitives' card and input fill; not used for page sections.
- **Ink** (#eef1f6 dark, #0b0e14 light): text and the primary button. Secondary text is ink at 0.78 (lede), 0.62 (small, muted), 0.55 (meta), 0.5 (cue).
- **Hair** (ink at 0.10) and **Hair Strong** (ink at 0.22): every rule and border on the site. Ghost buttons use the strong value.
- **Glass** (ink at 0.05 dark, 0.035 light) and **Glass Hover** (0.08, 0.06): the fill of a glass panel and of a ruled cell on hover.

### Named Rules
**The One Voice Rule.** Electric blue marks meaning (a label, a link, the active thing, focus). It is never decorative, never a background, never a gradient, and never appears on more than a few elements per viewport.

**The Opacity Rule.** Secondary tones are ink at an opacity, never a second grey. A new tone is a new opacity step on ink, not a new hex.

**The Field Only Rule.** Violet lives in the WebGL field and nowhere else. If an element needs a second accent, the answer is no.

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

The landing is a full viewport: a two-column grid (copy left, console right) that stacks under 900px, with the name lower-left and the scroll cue anchored to the content column, not the viewport edge. Lists are ruled registers: spreads, side-project rows, the skills register, and the social grid all use top and bottom hairlines rather than gaps between boxes. The social grid is one column under 720px and four across above it. Facts are a 2 by 2 grid of big numbers under the About copy.

Sticky elements: the nav (4rem, fixed, hairline and blur once scrolled) and the About portrait on wide screens. The page never scrolls horizontally; the light field and the cursor preview are clipped to their sections.

## Elevation & Depth

Tonal and hairline, not shadowed. Depth on this site is the light field behind the landing, opacity steps on ink, and one panel radius; shadows appear on two elements only and are ambient, never structural.

### Shadow Vocabulary
- **Panel ambient** (`box-shadow: inset 0 1px 0 rgba(238,241,246,0.06), 0 24px 60px -20px rgba(0,0,0,0.55)`): the glass panel (console, email card, demo panel). On light it becomes `inset 0 1px 0 rgba(255,255,255,0.7), 0 24px 60px -24px rgba(11,14,20,0.28)`.
- **Preview lift** (the cursor-following screenshot): a soft ambient drop under the floating image so it reads as a plate above the rows.

### Named Rules
**The Two Blurs Rule.** Backdrop blur exists on the console (blur 18px, ground at 30%) because it sits over the light field, and on the scrolled nav (blur 14px, ground at 72%). Everywhere else glass is a hairline plus a 5% fill, flat.

**The Glass Is A Pane Rule.** (After Apple's Liquid Glass, borrowed 2026-09-15.) The two blurred surfaces carry a highlight layer, one light source catching the top edge (`inset 0 1px 0` white at 0.22 on the console, 0.08 on the nav) with a sheen fading out in the first third, and lensing at the rim (a 1px inner ring, dimmer at the bottom). Interaction lights the pane from within: the console on `:focus-within`, the mobile connect controls on `:active`, in the accent. Glass is reserved for the chrome layer; content never gets it, and glass never sits on glass, so the controls inside the console stay solid fills.

**The Field Is The Depth Rule.** The landing's depth comes from the moving light, not from layered surfaces. Do not stack panels or add glows to imitate it.

## Shapes

Two silhouettes. Structure is square: ruled registers, hairline grids, and the ruled social cells carry no radius at all. Objects are round: buttons and chips are full pills (999px), the glass panels and the demo panel are 20px, the theme toggle and the console avatar are circles, focus rings sit at 2px. No bevels, no embossing, no offset shadows, no clip-path shapes.

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

### Connect (signature, redesigned for mobile 2026-09-15)
Below 768px the socials are a 3-column grid of hairline-ruled square tiles, icon over name, handle dropped for density; the two actions become 5.5rem square icon buttons (icon over caption) instead of pills, echoing a phone's own share-sheet shortcuts. At 768px and up both revert to the original form: a single-column ruled list with the handle restored, and pill buttons. Tap and hover carry the same feedback (`:active` mirrors `:hover`) since touch never fires the latter.

### Inputs
- **Style:** the console's prompt input is the SmoothUI primitive on the `--sh-*` tokens: surface fill, hair border, 20px radius inside the panel, a circular send button.
- **Focus:** ring in electric blue via `--sh-ring`.

### Navigation
- **Style:** fixed 4rem bar, mark left (logo plus name; the name hides under 900px), links right in small size at ink 0.66, circular theme toggle. Transparent at the top; once scrolled it gains a hair bottom border, ground at 72%, and a 14px blur.
- **States:** hover and current raise the link to full ink and draw a 1px underline that scales in from the left. Current is set from the section owning the middle of the viewport and clears when none does.

### Light Field (signature)
A WebGL2 fullscreen-triangle shader behind the landing: two bands of ground-tinted blue and violet through domain-warped noise, a soft bloom that lags the pointer, a fade to ground at the bottom, dither against banding. DPR capped at 1.5 (1 on phones, with three noise octaves), paused when offscreen or hidden, one frame under reduced motion. It mounts after the page is interactive and reads its colours from the theme tokens, so a palette change reaches it.

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
- **Don't** put a gradient, glow, or wash on an element; the field is the only light on the site.
- **Don't** arrange content as a grid of same-size rounded cards with one shadow.
- **Don't** add a second accent, an accented word inside a headline, or an arrow to a link.
- **Don't** animate padding, height, or layout on hover; move transforms and colours only.
- **Don't** add a custom cursor; the native pointer is the pointer.
