/**
 * Script Purpose: By Default Custom Scripts
 * Author: Erlen Masson
 * Created: 29th June 2025
 * Version: 1.9.0
 * Last Updated: October 22, 2025
 */

console.log("Script - All v1.9.0");

// Check if the device is a touch device
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// Initialize ScrollSmoother only on non-touch devices
function setupScrollSmoother() {
  if (!isTouchDevice()) {
    ScrollSmoother.create({
      smooth: 1, // Adjust smoothness
      effects: true,
      smoothTouch: 0, // This value is for non-touch devices
    });
    // Comment out normalizeScroll to test the behavior
    // ScrollTrigger.normalizeScroll(true);
  }
}

// ------- Dark Mode Toggle ------- //
function initThemeToggle() {
  const root = document.documentElement; // <html>
  const storageKey = 'theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Load saved or system preference
  const savedTheme = localStorage.getItem(storageKey);
  const active = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Apply Webflow theme class
  root.className = root.className.replace(/u-theme-\w+/g, '');
  root.classList.add(`u-theme-${active}`);

  // Update toggle button on initialization
  updateThemeToggleButton();

  // Toggle logic
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('#bd-theme') || e.target.closest('[data-theme-toggle]');
    if (!toggle) return;
    
    console.log('🎨 Theme toggle button clicked');
    
    // Determine next theme
    const isDark = root.classList.contains('u-theme-dark');
    const next = isDark ? 'light' : 'dark';
    
    // Remove existing theme classes and add new one
    root.className = root.className.replace(/u-theme-\w+/g, '');
    root.classList.add(`u-theme-${next}`);
    
    // Update button state
    updateThemeToggleButton();
    
    localStorage.setItem(storageKey, next);
    console.log(`🎨 Theme switched to: ${next}`);
  });
}

// ------- Dark Mode Toggle Button ------- //
function updateThemeToggleButton() {
  const toggleBtn = document.getElementById('bd-theme');
  if (!toggleBtn) return;
  
  const isDark = document.documentElement.classList.contains('u-theme-dark');
  const lightIcon = toggleBtn.querySelector('.light-icon');
  const darkIcon = toggleBtn.querySelector('.dark-icon');
  
  // Update button attributes
  toggleBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  toggleBtn.setAttribute('aria-pressed', (!isDark).toString()); // pressed when light mode
  
  // Check if this is initial setup (no styles set yet)
  const isInitialSetup = !lightIcon.style.display && !darkIcon.style.display;
  
  if (isInitialSetup) {
    // Initial setup - show correct icon without animation
    if (isDark) {
      darkIcon.style.display = 'block';
      lightIcon.style.display = 'none';
      darkIcon.style.opacity = '1';
      lightIcon.style.opacity = '0';
    } else {
      lightIcon.style.display = 'block';
      darkIcon.style.display = 'none';
      lightIcon.style.opacity = '1';
      darkIcon.style.opacity = '0';
    }
  } else {
    // Animate icon transition
    if (isDark) {
      // Switching to dark mode - show dark icon
      if (lightIcon && darkIcon) {
        gsap.to(lightIcon, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
            gsap.fromTo(darkIcon, { opacity: 0 }, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.out"
            });
          }
        });
      }
    } else {
      // Switching to light mode - show light icon
      if (darkIcon && lightIcon) {
        gsap.to(darkIcon, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            darkIcon.style.display = 'none';
            lightIcon.style.display = 'block';
            gsap.fromTo(lightIcon, { opacity: 0 }, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.out"
            });
          }
        });
      }
    }
  }
}



// ------- Pin Elements (Desktop Only) ------- //
function pinElements() {
  const pinnedEls = document.querySelectorAll("[data-pin]");

  // Only apply on desktop (992px and up)
  if (!window.matchMedia("(min-width: 992px)").matches) {
    console.log("Pinning skipped — below desktop breakpoint");
    return;
  }

  pinnedEls.forEach((el) => {
    // Read value directly as pixels
    const pxOffset = parseFloat(el.getAttribute("data-pin")) || 0;

    // The parent acts as the sticky boundary
    const trigger = el.parentElement;

    // Measure heights to determine natural sticky end point
    const parentHeight = trigger.offsetHeight;
    const elementHeight = el.offsetHeight;
    const scrollDistance = parentHeight - elementHeight;

    if (scrollDistance <= 0) {
      console.warn("Skipping pin — element taller than parent:", el);
      return;
    }

    console.log(
      "Pinning element:",
      el,
      "| Trigger:",
      trigger,
      "| Offset:",
      pxOffset + "px",
      "| Scroll Distance:",
      scrollDistance + "px"
    );

    ScrollTrigger.create({
      trigger: trigger,
      start: `top ${pxOffset}px`,
      end: `+=${scrollDistance}`, // ends when element bottom meets parent bottom
      pin: el,
      pinSpacing: false, // behaves like CSS sticky
      // markers: true, // enable to debug start/end
    });
  });
}

// ------- GSAP Refresh Observer ------- //
function refreshObserve(attribute = "data-refresh") {
  const targets = document.querySelectorAll(`[${attribute}]`);
  if (!targets.length) return;

  const smoother = ScrollSmoother ? ScrollSmoother.get() : null;
  let timeout;

  const triggerRefresh = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log("↻ refreshObserve triggered");
      if (smoother) smoother.effects();
      ScrollTrigger.refresh();
    }, 200);
  };

  const observer = new ResizeObserver(triggerRefresh);

  targets.forEach((el) => {
    observer.observe(el);
    el.addEventListener("click", triggerRefresh);
  });
}


// Setup once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  setupScrollSmoother();
  pinElements();
  refreshObserve();
  // logoSlider();
  // blogPostSlider();
});
