# SPA Router - Quick Reference & Code Examples

## ⚡ Quick Start (2 minutes)

### 1. Copy Script to Public
```
spa-router.js → public/spa-router.js
```

### 2. Add to HTML
```html
<script src="/spa-router.js" defer></script>
```

### 3. Structure Sections
```html
<section id="home">Home content</section>
<section id="about">About content</section>
<section id="skills">Skills content</section>
```

### 4. Create Navigation
```html
<nav>
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/skills">Skills</a>
</nav>
```

### 5. Add CSS
```css
a.nav-active {
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
}

section {
  scroll-margin-top: 70px; /* navbar height */
}
```

**That's it!** 🎉

---

## 🔗 URL Handling Cheat Sheet

```javascript
// User clicks this           → URL becomes this
<a href="/about">             // /about
<a href="#skills">            // /skills  (# converted to /)
<a href="/contact?phone=1">   // /contact?phone=1
<a href="#team?id=5">         // /team?id=5
```

### Query Parameter Preservation

```javascript
// Direct visit or link with params
mysite.com/projects?utm_source=twitter&utm_medium=social
                    ↓
Router scrolls to #projects
URL stays intact: /projects?utm_source=twitter&utm_medium=social
```

---

## 📍 Section Detection

```javascript
// If page path is...   → Router scrolls to...
/                       // first section in document
/home                   // <section id="home">
/privacy                // <section id="privacy">
/blog?page=2            // <section id="blog">
/unknown                // first section (fallback)
```

---

## 🎯 API Reference

```javascript
// Access router
window.spaRouter

// Scroll to section (programmatic)
window.spaRouter.scrollTo('contact');

// Get current section
const current = window.spaRouter.getCurrentSection();
console.log(current); // "projects"

// Get all sections
const all = window.spaRouter.getSections();
console.log(all); // ["home", "about", "skills", "projects"]

// Manually update active link
window.spaRouter.updateActiveLink('about');
```

---

## ⚙️ Configuration Options

```javascript
new SPARouter({
  // Which links to intercept
  navLinkSelector: 'a[href^="/"], a[href^="#"]',
  
  // Active link CSS class
  activeLinkClass: 'nav-active',
  
  // Scroll animation: 'smooth' or 'auto'
  scrollBehavior: 'smooth',
  
  // Offset for fixed navbar (pixels)
  scrollOffset: 0
});
```

---

## 🎨 CSS Class Reference

```css
/* Automatically added to active link */
a.nav-active {
  /* Your active link styles */
}

/* Use scroll-margin-top to prevent overlap */
section {
  scroll-margin-top: 80px; /* Match navbar height */
}
```

---

## 🔄 Event Flow

```
[1] User clicks link
    ↓
[2] preventDefault() stops default behavior
    ↓
[3] Extract section ID from href
    ↓
[4] Find matching <section id="...">
    ↓
[5] scrollIntoView({ behavior: 'smooth' })
    ↓
[6] history.pushState() updates URL
    ↓
[7] updateActiveLink() adds .nav-active class
    ↓
[8] Manual scroll triggered by user
    ↓
[9] IntersectionObserver detects new section
    ↓
[10] history.replaceState() updates URL
    ↓
[11] updateActiveLink() updates nav appearance
```

---

## 📋 Checklist: What to Include

- ✅ Section elements with unique `id` attributes
- ✅ Navigation links with `href="/section"` or `href="#section"`
- ✅ CSS for `.nav-active` class styling
- ✅ CSS for `section { scroll-margin-top: ... }`
- ✅ `<script src="spa-router.js"></script>` in HTML

---

## ⚡ Common Patterns

### Pattern 1: Basic Navigation
```html
<nav>
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<section id="home">...</section>
<section id="about">...</section>
<section id="contact">...</section>
```

### Pattern 2: Mobile Menu
```javascript
// Close menu after navigation (automatic)
// Router handles the navigation; just close your menu:
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="/"]');
  if (link) {
    document.getElementById('mobile-menu').classList.remove('open');
  }
});
```

### Pattern 3: With Analytics
```html
<!-- Google Analytics picks up query params automatically -->
<a href="/features?utm_source=newsletter">Features</a>

<!-- GTM, Mixpanel, etc. also work -->
<!-- UTM parameters are 100% preserved -->
```

### Pattern 4: CTA Links
```html
<!-- Any time you want smooth navigation -->
<a href="/pricing" class="cta-button">View Pricing</a>

<!-- Or programmatically: -->
<button onclick="window.spaRouter.scrollTo('pricing')">
  View Pricing
</button>
```

---

## 🐛 Debugging

```javascript
// Check if router is loaded
window.spaRouter
// Output: SPARouter { sections: Map(5), currentSection: "home", ... }

// List all sections
window.spaRouter.getSections()
// Output: ["home", "about", "skills", "projects", "contact"]

// Check current section
window.spaRouter.getCurrentSection()
// Output: "projects"

// Manually trigger navigation
window.spaRouter.scrollTo('contact')
```

---

## ✅ Testing Checklist

```
Feature: Link Clicking
□ Click link → smoothly scrolls to section
□ URL changes to /section (no #)
□ Active .nav-active class applied to link
□ Link has visual feedback

Feature: Direct URL Load  
□ Visit mysite.com/about directly → scrolls to section
□ Visit mysite.com/projects?ref=twitter → query preserved
□ Back button works correctly

Feature: Query Parameters
□ mysite.com/form?id=123 → /form?id=123 preserved
□ mysite.com?utm_source=ig → utm_source preserved
□ Analytics tracking works without configuration

Feature: Manual Scroll
□ Manually scroll down page → URL updates
□ URL reflects currently visible section
□ Active link updates in navigation

Feature: Browser Navigation
□ Click link → URL changes
□ Click back button → URL changes back
□ Smooth scrolls to previous section
```

---

## 🚀 Performance Tips

```javascript
// Router script is ~6KB (~2KB gzipped)
// Use defer attribute to avoid blocking page load
<script src="spa-router.js" defer></script>

// IntersectionObserver is very efficient
// No performance issues with many sections

// Smooth scroll polyfill (optional for old browsers)
// Most modern browsers support it natively
```

---

## 📱 Mobile Optimization

```css
/* Mobile-first design */
nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

section {
  scroll-margin-top: 70px; /* Mobile navbar height */
}

/* Adjust for tablet/desktop */
@media (min-width: 768px) {
  section {
    scroll-margin-top: 80px; /* Desktop navbar height */
  }
}
```

---

## 🔗 URL Examples

```
BASE: mysite.com

/                           Home (default)
/about                      About section
/pricing?plan=pro           Query parameters preserved
/blog?page=2&sort=date      Multiple parameters
/contact?utm_source=ig      UTM parameters preserved
/products?ref=partner       Referral tracking
```

---

## 🎯 Example: Complete Working HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>SPA Portfolio</title>
  <style>
    nav a.nav-active { color: blue; }
    section { scroll-margin-top: 70px; }
  </style>
</head>
<body>
  <nav>
    <a href="/home">Home</a>
    <a href="/about">About</a>
  </nav>

  <section id="home"><h1>Home</h1></section>
  <section id="about"><h1>About</h1></section>

  <script src="spa-router.js"></script>
</body>
</html>
```

---

## 📚 File Reference

| File | Purpose | Size |
|------|---------|------|
| spa-router.js | Main router script | 6KB |
| spa-example.html | Full working example | 8KB |
| SPA-ROUTER.md | Complete documentation | Reference |
| INTEGRATION-GUIDE.md | Next.js/React integration | Reference |
| SPA-QUICK-REFERENCE.md | This file | Reference |

---

## 💡 Pro Tips

1. **Fixed Header Overlap?** 
   - Increase `scrollOffset` or add `scroll-margin-top` to sections

2. **Want Animations?**
   - Router plays nicely with CSS animations and keyframes

3. **Form Submissions?**
   - Forms work normally; router only intercepts `<a>` tags

4. **External Links?**
   - Use full URLs: `<a href="https://google.com">Google</a>`
   - Router ignores them automatically

5. **Multiple Nav Bars?**
   - Router targets all links matching selector
   - Works with header, sidebar, footer navigation

6. **Framework Integration?**
   - Works with React, Vue, Angular, plain HTML
   - No conflicts with existing JS

---

## ❓ FAQ

**Q: Does it work with Next.js?**
A: Yes! Add script to layout, wrap content in sections.

**Q: Does it work offline?**
A: Yes! It's pure JavaScript, no server needed.

**Q: Will it break my analytics?**
A: No! Query parameters are preserved exactly.

**Q: Can I use with existing animations?**
A: Yes! Doesn't interfere with CSS or JS animations.

**Q: What about SEO?**
A: All sections are in HTML, crawlers see them all.

**Q: Browser support?**
A: IE 10+, all modern browsers.

**Q: How do I deploy it?**
A: Copy script to public folder, include in HTML. Works on any host.

---

## 🔗 Link Examples That Work

```html
<!-- All these work automatically: -->
<a href="/home">
<a href="#home">
<a href="/home?id=1">
<a href="#home?id=1">
<a href="/home?utm_source=x">
<a href="/contact?phone=123">

<!-- These don't get intercepted (external): -->
<a href="https://google.com">
<a href="mailto:test@example.com">
<a href="tel:123456">
<a href="/assets/download.pdf">
```

---

**Ready to implement?**

1. Copy `spa-router.js` to your project
2. Add `<script src="spa-router.js"></script>` before closing `</body>`
3. Wrap content in `<section id="...">` elements
4. Use `<a href="/section">` navigation links
5. Add CSS for `.nav-active` styling

That's it! 🚀

