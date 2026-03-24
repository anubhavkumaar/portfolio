# Single-Page Application Router - Complete Documentation

## Overview

This is a lightweight, vanilla JavaScript router that converts a traditional multi-page website into a smooth-scrolling single-page application (SPA). It manages:

- ✅ **Link Interception**: Typical links become smooth scroll triggers
- ✅ **Clean URLs**: Uses History API for clean paths (e.g., `/about` instead of `/#about`)
- ✅ **Direct Load Handling**: Preserves query parameters (UTM-safe)
- ✅ **Scroll Spying**: Auto-updates URL as user scrolls
- ✅ **Browser Navigation**: Back/forward buttons work correctly

---

## Installation

### 1. Include in Your HTML

```html
<!-- At the end of <body> -->
<script src="spa-router.js"></script>
```

The router auto-initializes immediately.

---

## HTML Structure Requirements

### Basic Section Setup

```html
<section id="home">
  <h1>Home Section</h1>
  <p>Content here...</p>
</section>

<section id="about">
  <h1>About Section</h1>
  <p>More content...</p>
</section>
```

**Key Requirements:**
- Each section must have a unique `id` attribute
- `<section>` elements can be anywhere in the DOM
- No special classes or attributes needed

### Navigation Links

Use standard `<a>` tags with either format:

```html
<!-- Format 1: Clean paths (recommended) -->
<a href="/about">About</a>
<a href="/contact">Contact</a>

<!-- Format 2: Fragment identifiers (also supported) -->
<a href="#about">About</a>
<a href="#contact">Contact</a>

<!-- With query parameters (both formats work) -->
<a href="/about?utm_source=newsletter">About</a>
<a href="#about?utm_source=ig">About</a>
```

---

## Core Features

### 1. Link Interception & Smooth Scrolling

When a user clicks any link matching `a[href^="/"]` or `a[href^="#"]`:

```javascript
// What happens automatically:
1. Click is intercepted (preventDefault)
2. Target section is found by ID
3. Section smoothly scrolls into view
4. Browser URL is updated via History API
5. Active navigation link is highlighted
```

**Example:**
```html
<a href="/projects">View Projects</a>
<!-- Clicking scrolls to <section id="projects"> -->
```

---

### 2. Clean URL Management

The router uses the **History API** (`history.pushState()`) to update URLs without page reloads:

```javascript
// User clicks: <a href="/about?ref=social">
// URL changes to: /about?ref=social (clean, no #)
// Browser history is updated
// Back button works correctly
```

**Query Parameters Preserved:**
```javascript
// Original link has query params?
<a href="/products?utm_source=google&utm_medium=cpc">

// URL becomes: /products?utm_source=google&utm_medium=cpc
// Parameters are kept intact
```

---

### 3. Direct Load Handling & UTM Safety

When a user visits your site directly with a path or query string:

```javascript
// User visits: mysite.com/about
// OR: mysite.com/projects?utm_source=instagram
// OR: mysite.com/skills?utm_campaign=launch

// The router:
1. Reads the pathname and extracts section ID
2. Finds matching <section id="projects">
3. Scrolls to that section on page load
4. Query parameters are 100% preserved
5. No "?utm_source=..." gets stripped
```

**Example Timeline:**
```
1. User clicks Instagram post: mysite.com/projects?utm_source=ig
2. Page loads, router detects "/projects" path
3. Router finds <section id="projects">
4. Section smoothly scrolls into view
5. URL remains: mysite.com/projects?utm_source=ig
6. Analytics tools still see the utm_source parameter
```

---

### 4. Scroll Spying & Auto-URL Updates

Using **IntersectionObserver API**, the router monitors which section is in viewport:

```javascript
// As user scrolls down the page:
1. Router detects when "projects" section enters viewport
2. URL automatically updates to: /projects
3. Corresponding navigation link gets .nav-active class
4. History is saved with replaceState (no duplicate entries)
```

**Active Link Styling:**
```css
nav a.nav-active {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.1);
  border-bottom: 2px solid #2563eb;
}
```

---

## Configuration Options

### Initialize with Custom Options

```javascript
window.spaRouter = new SPARouter({
  // CSS selector for navigation links
  navLinkSelector: 'a[href^="/"], a[href^="#"]',
  
  // CSS class added to active navigation link
  activeLinkClass: 'nav-active',
  
  // Scroll behavior: 'smooth' or 'auto'
  scrollBehavior: 'smooth',
  
  // Extra offset (useful for fixed headers)
  scrollOffset: 80, // pixels from top
});
```

### For Fixed Headers

If your navigation is fixed to the top, adjust `scrollOffset`:

```javascript
window.spaRouter = new SPARouter({
  scrollOffset: 80, // Height of your fixed navbar
});
```

Add `scroll-margin-top` to sections to prevent overlap:

```css
section {
  scroll-margin-top: 80px; /* Match your navbar height */
}
```

---

## Public API Methods

Once initialized, access the router via `window.spaRouter`:

### `scrollTo(sectionId)`
Programmatically navigate to a section:
```javascript
window.spaRouter.scrollTo('contact');
// Scrolls to <section id="contact">
// Updates URL to /contact
// Updates active link
```

### `getCurrentSection()`
Get the currently active section:
```javascript
const active = window.spaRouter.getCurrentSection();
console.log(active); // "projects"
```

### `getSections()`
Get all available section IDs:
```javascript
const sections = window.spaRouter.getSections();
console.log(sections); // ["home", "about", "skills", "projects", "contact"]
```

### `updateActiveLink(sectionId)`
Manually update the active link styling:
```javascript
window.spaRouter.updateActiveLink('about');
```

---

## Advanced: Browser Back/Forward

The router handles browser navigation automatically:

```javascript
// User clicks navigation link → /about
// Then clicks back button
// Router restores /home
// Smooth scrolls to home section
// Updates active link

// This happens automatically via the internal popstate listener
```

---

## Common Implementation Patterns

### Pattern 1: Basic Portfolio

```html
<nav>
  <a href="/home">Home</a>
  <a href="/work">Work</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<section id="home">...</section>
<section id="work">...</section>
<section id="about">...</section>
<section id="contact">...</section>

<script src="spa-router.js"></script>
```

### Pattern 2: With UTM Tracking

```html
<!-- Marketing link with UTM params -->
<a href="/features?utm_source=twitter&utm_medium=social">
  Learn More
</a>

<!-- Section -->
<section id="features">
  <h1>Features</h1>
  <!-- Content -->
</section>

<!-- Report UTM in Google Analytics -->
<script>
// Google Analytics automatically reads query params
// No additional configuration needed
</script>
```

### Pattern 3: Mobile Menu

```javascript
// In your mobile menu close handler:
document.getElementById('mobile-menu').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    // Menu closes automatically because link navigation
    // triggers the SPA router, which can close the menu
    document.getElementById('menu-toggle').checked = false;
  }
});
```

### Pattern 4: In Next.js App

If adapting to Next.js, place the script in your layout and adjust the section structure:

```html
<!-- In app/layout.tsx -->
<html lang="en">
  <body>
    {children}
    <script src="/spa-router.js"></script>
  </body>
</html>
```

---

## Event Flow Diagram

```
User Action: Click <a href="/about">
    ↓
Link Interception (preventDefault)
    ↓
Extract Section ID ("about")
    ↓
Smooth Scroll to <section id="about">
    ↓
UpdateActiveLink() → Add "nav-active" class
    ↓
history.pushState() → URL becomes /about
    ↓
Set this.isScrolling = true
    ↓
Timeout after animation → this.isScrolling = false
    ↓
IntersectionObserver disabled during scroll ✓
    ↓
User Manual Scroll
    ↓
IntersectionObserver detects section change
    ↓
history.replaceState() → Update URL
    ↓
UpdateActiveLink() → Update nav appearance
```

---

## Query Parameter Examples

### Google Analytics UTM Parameters
```
/products?utm_source=google&utm_medium=cpc&utm_campaign=launch
```
✅ Fully preserved and tracked

### Referral Parameters
```
/signup?ref=partner&discount_code=LAUNCH20
```
✅ Intact for processing at component level

### Session Parameters
```
/checkout?session_id=abc123&cart_id=xyz789
```
✅ Accessible via `window.location.search`

### Multiple Levels
```
/docs/api/endpoints?version=2&format=json
```
✅ Works (though section ID is "docs")

---

## CSS Integration Guide

### Active Link Styling

```css
/* Simple underline */
nav a.nav-active {
  border-bottom: 3px solid #2563eb;
  color: #2563eb;
}

/* Background highlight */
nav a.nav-active {
  background-color: rgba(37, 99, 235, 0.1);
  border-radius: 4px;
}

/* Icon indicator */
nav a.nav-active::before {
  content: "▸ ";
  color: #2563eb;
}
```

### Section Styling

```css
/* Prevent navbar overlap */
section {
  scroll-margin-top: 80px;
}

/* Smooth scroll enabled globally */
html {
  scroll-behavior: smooth;
}

/* Fade-in effect on section entry */
section {
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

## Troubleshooting

### Sections not scrolling?
✓ Ensure each section has a unique `id` attribute
✓ Check browser console for errors (`console.log()` shows initialization)

### URLs not updating?
✓ Verify links use `/path` or `#path` format
✓ Confirm section IDs match the path exactly

### Active link not highlighting?
✓ Check CSS class name matches `activeLinkClass` option (default: `nav-active`)
✓ Ensure your CSS rules have proper specificity

### Query parameters are stripped?
✓ This shouldn't happen - the router preserves them automatically
✓ Check browser address bar to confirm

### Scroll not smooth?
✓ Some browsers don't support `behavior: 'smooth'`
✓ Fallback to CSS: `html { scroll-behavior: smooth; }`

### Back button doesn't work?
✓ Ensure `setupPopStateListener()` is called
✓ Check browser console: "SPA Router initialized with X sections"

---

## Files Provided

1. **spa-router.js** - Main router script (~260 lines, fully documented)
2. **spa-example.html** - Complete working example with all sections visible
3. **SPA-ROUTER.md** - This documentation

---

## Performance Notes

- **Bundle size**: ~6KB minified (~2KB gzipped)
- **No dependencies**: Vanilla JavaScript, no jQuery or frameworks needed
- **IntersectionObserver**: Native browser API, excellent performance
- **History API**: Standard browser feature with broad support (IE 10+)
- **Memory efficient**: Single instance, minimal DOM manipulation

---

## Browser Support

| Feature | Support |
|---------|---------|
| History API | IE 10+, all modern browsers |
| IntersectionObserver | IE 12+, all modern browsers |
| scrollIntoView() | IE 9+, all modern browsers |
| Query Parameters | All browsers |
| Smooth scroll | Chrome 61+, Firefox 36+, Safari 15.4+, Edge 79+ |

**Fallback**: Browsers without smooth scroll support will jump instantly (still works, just not animated).

---

## License & Usage

This code is provided as-is for educational and commercial use. Feel free to modify and extend as needed.

## Next Steps

1. Review `spa-example.html` in a browser to see it in action
2. Adapt the HTML structure to your website
3. Customize CSS for your design
4. Test URLs in address bar and back button
5. Monitor analytics to confirm UTM parameters are captured

