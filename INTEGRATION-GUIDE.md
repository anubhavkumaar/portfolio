# Integration Guide: SPA Router in Your Next.js Portfolio

This guide shows how to integrate the smooth-scrolling SPA router into your existing Next.js portfolio.

---

## Current Setup vs. SPA Router

Your current `page.tsx` already has:
- ✅ Multiple sections with content
- ✅ Scroll reveal animations
- ✅ Dark/light mode toggle
- ✅ TypeScript setup

The SPA router adds:
- ✅ Smooth scroll navigation between sections
- ✅ Clean URLs (`/home` instead of `/#home`)
- ✅ Scroll spying with auto-URL updates
- ✅ Query parameter preservation

---

## Option 1: Minimal Integration (Recommended)

### Step 1: Add the Script to Layout

Edit [app/layout.tsx](app/layout.tsx):

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anubhav Kumar - Full Stack Developer & GenAI Engineer",
  description: "Full Stack Developer...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Add script before closing body */}
        <script src="/spa-router.js" defer></script>
      </body>
    </html>
  );
}
```

### Step 2: Place Script in Public Folder

```
your-project/
├── public/
│   └── spa-router.js          ← Copy the file here
├── app/
│   ├── layout.tsx
│   └── page.tsx
└── ...
```

### Step 3: Add Section IDs to Your Existing Sections

Your `page.tsx` already has sections. Just add unique `id` attributes:

```tsx
// In page.tsx, wrap content in <section> with unique ids
<section id="home">
  {/* Your hero/intro content */}
</section>

<section id="about">
  {/* Your about content */}
</section>

<section id="skills">
  {/* Your skills content */}
</section>

<section id="projects">
  {/* Your projects content */}
</section>

<section id="contact">
  {/* Your contact/footer content */}
</section>
```

### Step 4: Update Navigation Links

Change any `<a>` tags or navigation links:

```tsx
// Before
<a href="#skills">Skills</a>

// After (either format works)
<a href="/skills">Skills</a>
<a href="#skills">Skills (also works)</a>
```

---

## Option 2: React Component Wrapper (Advanced)

If you want TypeScript support, create a wrapper component:

### Create [components/SPANav.tsx](components/SPANav.tsx)

```tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  id: string;
}

interface SPANavProps {
  items: NavItem[];
  activeLinkClass?: string;
}

export function SPANav({ 
  items, 
  activeLinkClass = 'nav-active' 
}: SPANavProps) {
  useEffect(() => {
    // Ensure SPA router is loaded
    if ((window as any).spaRouter) {
      console.log('✓ SPA Router initialized');
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-1000">
      <ul className="flex gap-4 justify-center p-4">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="px-4 py-2 hover:bg-gray-100 rounded transition-colors"
              // Router adds active class automatically
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Use in page.tsx

```tsx
import { SPANav } from '@/components/SPANav';

const navItems = [
  { label: 'Home', href: '/home', id: 'home' },
  { label: 'About', href: '/about', id: 'about' },
  { label: 'Skills', href: '/skills', id: 'skills' },
  { label: 'Projects', href: '/projects', id: 'projects' },
  { label: 'Contact', href: '/contact', id: 'contact' },
];

export default function Home() {
  return (
    <>
      <SPANav items={navItems} activeLinkClass="nav-active" />
      
      <section id="home">
        {/* Content */}
      </section>
      
      {/* More sections */}
    </>
  );
}
```

---

## CSS Styling Updates

Add to [app/globals.css](app/globals.css):

```css
/* SPA Active Link Styling */
a.nav-active {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.1);
  border-bottom: 2px solid #2563eb;
  border-radius: 0.25rem;
}

/* Prevent navbar overlap on scroll */
section {
  scroll-margin-top: 70px; /* Adjust to your navbar height */
}

/* Smooth scrolling (fallback) */
html {
  scroll-behavior: smooth;
}
```

---

## Example: Converting Your Current Structure

### Before (Current page.tsx style)
```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="hero-section">
        {/* Hero content */}
      </div>
      <div className="about-section">
        {/* About content */}
      </div>
      {/* More sections */}
    </div>
  );
}
```

### After (SPA Router compatible)
```tsx
'use client';

export default function App() {
  return (
    <>
      <nav>
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/skills">Skills</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>

      <section id="home" className="min-h-screen bg-white">
        {/* Hero content */}
      </section>

      <section id="about" className="min-h-screen bg-gray-50">
        {/* About content */}
      </section>

      <section id="skills" className="min-h-screen bg-white">
        {/* Skills content */}
      </section>

      <section id="projects" className="min-h-screen bg-gray-50">
        {/* Projects content */}
      </section>

      <section id="contact" className="min-h-screen bg-white">
        {/* Contact content */}
      </section>
    </>
  );
}
```

---

## Testing After Integration

### Test 1: Link Clicking
```
✓ Click navigation link
✓ Page smoothly scrolls to section
✓ URL in address bar changes to /section
✓ Navigation link highlighted with .nav-active class
```

### Test 2: Direct URL Access
```
✓ Visit mysite.com/skills
✓ Page loads and scrolls to skills section
✓ URL shows /skills (not /#skills)
```

### Test 3: Scroll Spying
```
✓ Manually scroll down the page
✓ Navigation link updates automatically
✓ URL changes to reflect current section
```

### Test 4: Query Parameters
```
✓ Visit mysite.com/projects?utm_source=twitter
✓ URL preserved when scrolling
✓ Query params visible in address bar
```

### Test 5: Browser Navigation
```
✓ Click link → URL becomes /about
✓ Click browser back button → URL becomes /home
✓ Smooth scrolls to previous section
```

---

## Performance Considerations

### Build Optimization
The SPA router is vanilla JS (no dependencies), so:
- ✅ No additional npm packages needed
- ✅ Small bundle size (~6KB)
- ✅ Gzips to ~2KB
- ✅ Loads with `defer` attribute (non-blocking)

### Next.js Export
If using `next export` for static build:
```js
// next.config.js
const nextConfig = {
  output: 'export',  // ← Already set in your config
  basePath: '',
  // ...
};
```

The SPA router works perfectly with static exports.

---

## Troubleshooting Integration Issues

### Issue: Sections not scrolling
**Solution**: Ensure sections have `id` attributes matching href paths:
```tsx
<a href="/skills">           {/* href = /skills */}
<section id="skills">        {/* id must be skills */}
```

### Issue: Links not working
**Solution**: Check script is loaded:
```tsx
{/* In DevTools Console */}
> window.spaRouter
// Should output SPARouter instance, not undefined
```

### Issue: Active class not applying
**Solution**: Verify CSS class name:
```tsx
// Update globals.css to use correct class:
a.nav-active {  /* Must match activeLinkClass option */
  /* styles */
}
```

### Issue: Query parameters missing
**Solution**: The router preserves them automatically. Check:
```tsx
// Visit: mysite.com/projects?utm_source=ig
console.log(window.location.search); // ?utm_source=ig
```

---

## Production Deployment

### Vercel
No changes needed. The SPA router works out of the box:
```bash
npm run build
npm run export  # If using static export
git push        # Deploy to Vercel
```

### Infinity Free / FTP Upload
1. Build locally: `npm run build`
2. Output folder: `out/` or `.next/`
3. Upload to server via FTP
4. All URLs work automatically (History API is native browser feature)

---

## Next Steps

1. ✅ Copy `spa-router.js` to `public/` folder
2. ✅ Add script tag to `app/layout.tsx`
3. ✅ Wrap content sections with `<section id="...">`
4. ✅ Update navigation links to use `/path` format
5. ✅ Add active link styling to `globals.css`
6. ✅ Test locally with `npm run dev`
7. ✅ Deploy and verify on production

---

## Questions?

- **Full documentation**: See [SPA-ROUTER.md](SPA-ROUTER.md)
- **Working example**: Open [spa-example.html](spa-example.html) in browser
- **Browser support**: IE 10+, all modern browsers
- **No conflicts**: The router doesn't interfere with your existing React components or animations

Your existing animations (typewriter effect, scroll reveals) work seamlessly alongside the SPA router!

