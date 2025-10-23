/**
 * Script Purpose: By Default Custom Scripts
 * Author: Erlen Masson
 * Created: 29th June 2025
 * Last Updated: October 22, 2025
 */

console.log("Script - All v1.8.2");

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

//
//------- Theme Toggle -------//
//

// Initialize theme system with Webflow Variables
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

// Update theme toggle button visual state
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

//
//------- Sliders -------//
//

// Logo Ticker (AutoScrolling)
function logoSlider() {
  let logoSplides = document.querySelectorAll(".logo-slider");
  for (let splide of logoSplides) {
    new Splide(splide, {
      type: "loop",
      autoWidth: true,
      arrows: false,
      pagination: false,
      gap: "1rem",
      drag: false,
      autoScroll: {
        autoStart: true,
        speed: 0.3,
        pauseOnHover: false,
      },
      breakpoints: {
        600: {
          gap: "1rem",
          autoScroll: { speed: 0.5 },
        },
      },
    }).mount({
      AutoScroll: window.splide.Extensions.AutoScroll,
    });
  }
}

// Blog Slider
function blogPostSlider() {
  let blogSliders = document.querySelectorAll(".blog-slider");

  for (let splide of blogSliders) {
    new Splide(splide, {
      type: "slide",
      perPage: 3, // Show 3 posts
      perMove: 1, // Slide 3 posts at a time
      gap: "2rem", // Adjust spacing between cards
      arrows: false, // Hide arrows
      pagination: false, // Hide pagination
      rewind: true, // Loop back to start
      speed: 800, // Slide animation speed
      easing: "ease-out",

      breakpoints: {
        991: {
          perPage: 2,
          perMove: 2,
        },
        600: {
          perPage: 1,
          perMove: 1,
        },
      },
    }).mount();
  }
}


// Testimonial Slider
function testimonialSlider() {
  let splides = document.querySelectorAll(".testimonial-slider");
  for (let splide of splides) {
    let customSplide = new Splide(splide, {
      autoWidth: true,
      pagination: false,
      focus: "center",
      perPage: 1,
      trimSpace: false,
      gap: "2rem",
      drag: "free",
      snap: true,
      type: "loop",
      easing: "ease-out",
      omitEnd: true,
      autoplay: true,
      interval: 9000, // 8 seconds between slides
      pauseOnHover: false,
      disableOnInteraction: false,
    speed: 1500, // Slower transition speed
    resetProgress: false,
      arrowPath:
        "M24.1125 24.5117C25.1624 23.4617 24.4188 21.6665 22.934 21.6665H6.66602V18.3332H22.934C24.4188 18.3332 25.1624 16.5379 24.1125 15.488L17.6243 8.99984L19.9993 6.6665L33.3327 19.9998L19.9993 33.3332L17.6243 30.9998L24.1125 24.5117Z",
      intersection: {
        inView: { autoplay: true },
        outView: { autoplay: false },
        rootMargin: "0px",
        threshold: 0.75,
      },
      breakpoints: {
        600: {
          gap: "1.5rem",
          easing: "ease-out",
        },
      },
      classes: {
        arrow: "button is-icon-only is-faded is-outline is-pill custom-arrows",
      },
    });


    // Add text split animation for testimonial text
    customSplide.on('moved', function(newIndex) {
      // Get the slide that just became active
      const activeSlide = customSplide.Components.Slides.getAt(newIndex).slide;
      animateTestimonialText(activeSlide);
    });

    // Initial animation
    customSplide.on('mounted', function() {
      // Get the initial active slide
      const initialActiveSlide = customSplide.Components.Slides.getAt(0).slide;
      animateTestimonialText(initialActiveSlide);
    });

    customSplide.mount({
      Intersection: window.splide.Extensions.Intersection,
    });
  }
}

// ------- Testimonial Text Animation ------- //
const testimonialCache = new WeakMap();
let isTransitioning = false;

function initTestimonialTextAnimation() {
// Add CSS for styling - only target words, not container
if (!document.getElementById('testimonial-css')) {
  const style = document.createElement('style');
  style.id = 'testimonial-css';
  style.textContent = `
    .testimonial-text .word {
      display: inline-block;
      opacity: 0.3;
    }
  `;
  document.head.appendChild(style);
}

// Split all testimonial texts once and cache them
const testimonialTexts = document.querySelectorAll('.testimonial-slider .splide__slide .testimonial-text');
testimonialTexts.forEach(textElement => {
  if (!textElement.hasAttribute('data-split')) {
    // Store original text
    textElement.setAttribute('data-original-text', textElement.textContent);
    
    // Split text into words once
    const split = new SplitText(textElement, {
      type: 'words',
      wordTag: 'span'
    });
    
    // Cache the words array
    testimonialCache.set(textElement, split.words);
    
    // Set baseline opacity
    gsap.set(split.words, { opacity: 0.3 });
    
    // Mark as processed
    textElement.setAttribute('data-split', '1');
  }
});
}

function animateTestimonialText(activeSlide) {
// Guard against rapid transitions
if (isTransitioning) return;
isTransitioning = true;

setTimeout(() => {
  isTransitioning = false;
}, 100);

// Animate active slide first
if (activeSlide) {
  const testimonialText = activeSlide.querySelector('.testimonial-text');
  if (testimonialText) {
    const words = testimonialCache.get(testimonialText);
    if (words) {
      // Kill any existing tweens on these words
      gsap.killTweensOf(words);
      
      // Snap to baseline and animate up
      gsap.set(words, { opacity: 0.2 });
      gsap.to(words, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.2,
        overwrite: 'auto'
      });
    }
  }
}

// Then fade out all non-active slides
const allSlides = document.querySelectorAll('.testimonial-slider .splide__slide');
allSlides.forEach(slide => {
  if (slide !== activeSlide) {
    const testimonialText = slide.querySelector('.testimonial-text');
    if (testimonialText) {
      const words = testimonialCache.get(testimonialText);
      if (words) {
        // Check current opacity to avoid unnecessary animations
        const currentOpacity = gsap.getProperty(words[0], "opacity");
        if (currentOpacity > 0.15) { // Only animate if not already dim
          // Kill existing tweens
          gsap.killTweensOf(words);
          
          // Animate down to inactive state
          gsap.to(words, {
            opacity: 0.2,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.02,
            overwrite: 'auto'
          });
        }
      }
    }
  }
});
}

//
//------- Other Functions -------//
//


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
  logoSlider();
  blogPostSlider();
  initTestimonialTextAnimation();
  testimonialSlider();
});
