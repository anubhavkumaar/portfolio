/**
 * Smooth-Scrolling Single-Page Application Router
 * Features:
 * - Intercepts navigation links and smooth scrolls to sections
 * - Updates browser URL using History API (clean paths, no fragments)
 * - Handles direct page loads with URL paths and query parameters
 * - Auto-updates URL via Intersection Observer (scroll spying)
 * - Preserves UTM and other query parameters
 */

class SPARouter {
  constructor(options = {}) {
    this.options = {
      navLinkSelector: 'a[href^="/"], a[href^="#"]',
      activeLinkClass: 'active',
      scrollBehavior: 'smooth',
      scrollOffset: 0, // Extra offset for fixed headers
      ...options,
    };

    this.sections = new Map();
    this.currentSection = null;
    this.scrollTimeout = null;
    this.isScrolling = false;

    this.init();
  }

  /**
   * Initialize the router
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Setup: discover sections, attach listeners, handle initial load
   */
  setup() {
    this.discoverSections();
    this.attachLinkListeners();
    this.setupIntersectionObserver();
    this.handleInitialLoad();
  }

  /**
   * Discover all sections on the page
   */
  discoverSections() {
    document.querySelectorAll('section[id]').forEach((section) => {
      this.sections.set(section.id, section);
    });
    console.log(`✓ SPA Router initialized with ${this.sections.size} sections`);
  }

  /**
   * Attach click listeners to all navigation links
   */
  attachLinkListeners() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest(this.options.navLinkSelector);
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Extract section ID from href (handle both /path and #path formats)
      const sectionId = this.extractSectionId(href);

      // Check if target section exists
      if (!this.sections.has(sectionId)) return;

      e.preventDefault();
      this.navigateToSection(sectionId, href);
    });
  }

  /**
   * Extract section ID from href
   * Handles: "/socials", "#socials", "/socials?utm_source=ig"
   */
  extractSectionId(href) {
    if (href.startsWith('#')) {
      return href.slice(1).split('?')[0];
    }
    // Remove leading slash and extract path (before any query string)
    return href.slice(1).split('?')[0].split('/')[0];
  }

  /**
   * Navigate to a specific section
   */
  navigateToSection(sectionId, originalHref = null) {
    const section = this.sections.get(sectionId);
    if (!section) {
      console.warn(`Section not found: ${sectionId}`);
      return;
    }

    this.isScrolling = true;

    // Scroll to section
    section.scrollIntoView({ behavior: this.options.scrollBehavior });

    // Update URL using History API
    const url = originalHref
      ? this.parseUrlFromHref(originalHref)
      : `/${sectionId}`;
    window.history.pushState({ sectionId }, '', url);

    // Update active link
    this.updateActiveLink(sectionId);
    this.currentSection = sectionId;

    // Reset scroll flag after animation completes
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 1000);
  }

  /**
   * Parse URL from href, preserving query parameters
   * "/socials?utm_source=ig" → "/socials?utm_source=ig"
   * "#socials?utm_source=ig" → "/socials?utm_source=ig"
   */
  parseUrlFromHref(href) {
    if (href.startsWith('#')) {
      // Convert #socials?utm=ig to /socials?utm=ig
      return '/' + href.slice(1);
    }
    return href;
  }

  /**
   * Update active navigation link
   */
  updateActiveLink(sectionId) {
    // Remove active class from all links
    document
      .querySelectorAll(this.options.navLinkSelector)
      .forEach((link) => {
        link.classList.remove(this.options.activeLinkClass);
      });

    // Add active class to matching link
    document
      .querySelectorAll(
        `${this.options.navLinkSelector}[href*="${sectionId}"]`
      )
      .forEach((link) => {
        link.classList.add(this.options.activeLinkClass);
      });
  }

  /**
   * Handle initial page load
   * Check URL and scroll to appropriate section if needed
   */
  handleInitialLoad() {
    const pathname = window.location.pathname;

    // Extract section ID from pathname
    // "/socials" → "socials"
    // "/" → null
    const pathParts = pathname
      .split('/')
      .filter((part) => part.length > 0);
    const sectionId = pathParts[0];

    if (sectionId && this.sections.has(sectionId)) {
      // Small delay to ensure DOM is fully ready for scroll
      setTimeout(() => {
        const section = this.sections.get(sectionId);
        section.scrollIntoView({ behavior: 'auto' }); // Use 'auto' for initial load
        this.updateActiveLink(sectionId);
        this.currentSection = sectionId;
      }, 100);
    } else {
      // Scroll to first section or home
      this.currentSection = this.sections.keys().next().value;
      this.updateActiveLink(this.currentSection);
    }
  }

  /**
   * Setup Intersection Observer for scroll spying
   * Updates URL and active link as user scrolls
   */
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: `-${this.options.scrollOffset}px 0px -67% 0px`,
      threshold: [0],
    };

    const observer = new IntersectionObserver((entries) => {
      // Skip if user is actively navigating
      if (this.isScrolling) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          // Only update if section changed
          if (this.currentSection !== sectionId) {
            this.currentSection = sectionId;

            // Update URL without triggering navigation
            const newUrl = `/${sectionId}${window.location.search}`;
            window.history.replaceState({ sectionId }, '', newUrl);

            // Update active link
            this.updateActiveLink(sectionId);
          }
        }
      });
    });

    // Observe all sections
    this.sections.forEach((section) => {
      observer.observe(section);
    });
  }

  /**
   * Handle browser back/forward buttons
   */
  setupPopStateListener() {
    window.addEventListener('popstate', (e) => {
      const sectionId = e.state?.sectionId;
      if (sectionId && this.sections.has(sectionId)) {
        this.navigateToSection(sectionId);
      }
    });
  }

  /**
   * Scroll to a section programmatically
   */
  scrollTo(sectionId) {
    if (this.sections.has(sectionId)) {
      this.navigateToSection(sectionId);
    }
  }

  /**
   * Get current section ID
   */
  getCurrentSection() {
    return this.currentSection;
  }

  /**
   * Get all section IDs
   */
  getSections() {
    return Array.from(this.sections.keys());
  }
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
  window.spaRouter = new SPARouter({
    navLinkSelector: 'a[href^="/"], a[href^="#"]',
    activeLinkClass: 'nav-active',
    scrollBehavior: 'smooth',
    scrollOffset: 0, // Adjust if you have a fixed header
  });

  // Setup back/forward button handling
  window.spaRouter.setupPopStateListener();
});
