/**
 * Script Purpose: By Default Custom Scripts
 * Author: Erlen Masson
 * Created: 29th June 2025
 * Last Updated: 4th July 2025
 */

console.log("Script v1");

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
      smooth: 1.5, // Adjust smoothness
      effects: true,
      smoothTouch: 0, // This value is for non-touch devices
    });
    // Comment out normalizeScroll to test the behavior
    // ScrollTrigger.normalizeScroll(true);
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
        speed: 0.5,
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

//------- Table of Contents (GSAP + Safe IDs) -------//
function tableOfContents() {
  const article = document.getElementById("single-article");
  const tocContainer = document.getElementById("toc");

  if (!article || !tocContainer) {
    console.warn("TOC skipped — missing #single-article or #toc");
    return;
  }

  console.log("TOC initialized (GSAP-integrated & safe IDs)");

  //
  // Utility: Safe ID slug generator
  //
  function slugifyHeading(text) {
    return (
      "toc-" +
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // spaces to hyphens
    );
  }

  //
  // Smooth scroll helper (ScrollSmoother / GSAP / native)
  //
  function smoothScrollTo(targetEl, offset = 100) {
    const smoother =
      (window.ScrollSmoother && ScrollSmoother.get && ScrollSmoother.get()) ||
      null;

    // Give the DOM a short moment to compute layout before moving
    setTimeout(() => {
      if (smoother && typeof smoother.scrollTo === "function") {
        // ✅ Negative offset fixes "scrolls wrong direction" issue
        smoother.scrollTo(targetEl, true, -offset);
        return;
      }

      if (window.gsap && gsap.to && window.ScrollToPlugin) {
        gsap.to(window, {
          duration: 0.8,
          scrollTo: { y: targetEl, offsetY: offset, autoKill: true },
          ease: "power2.out",
        });
        return;
      }

      // Native fallback
      const rect = targetEl.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top - offset,
        behavior: "smooth",
      });
    }, 10);
  }

  //
  // Build the TOC
  //
  function buildTOC() {
    const headings = article.querySelectorAll("h2, h3, h4");
    if (!headings.length) {
      console.warn("No headings found for TOC");
      return;
    }

    const frag = document.createDocumentFragment();

    headings.forEach((heading) => {
      const title = heading.textContent.trim();
      const anchorId = slugifyHeading(title);
      heading.id = anchorId;

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = title;
      a.href = `#${anchorId}`;
      li.appendChild(a);
      frag.appendChild(li);
    });

    const ul = document.createElement("ul");
    ul.appendChild(frag);
    tocContainer.appendChild(ul);
  }

  //
  // Setup active states and interactions
  //
  function setupActiveState() {
    const tocItems = tocContainer.querySelectorAll("a");
    const headings = article.querySelectorAll("h2, h3, h4");
    const defaultOffset =
      parseFloat(tocContainer.getAttribute("data-toc-offset")) || 100;

    function setActiveById(id) {
      tocItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${id}`);
      });
    }

    // Click event → smooth scroll using GSAP/Smoother
    tocItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const id = item.getAttribute("href").substring(1);
        const target = document.getElementById(id);
        if (!target) return;

        setActiveById(id);

        // Update URL hash (without jumping)
        if (history.pushState) history.pushState(null, "", `#${id}`);
        else location.hash = `#${id}`;

        smoothScrollTo(target, defaultOffset);
      });
    });

    // Observe headings → highlight active section while scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveById(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -50% 0px" }
    );

    headings.forEach((h) => observer.observe(h));

    // Handle hash navigation (page load or manual hash change)
    function handleHash() {
      if (!location.hash) return;
      const id = location.hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      setActiveById(id);
      smoothScrollTo(target, defaultOffset);
    }

    window.addEventListener("hashchange", handleHash);
    setTimeout(handleHash, 1);
  }

  //
  // Initialize TOC build + scroll setup
  //
  buildTOC();
  setupActiveState();
}

// Setup once the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  setupScrollSmoother();
  pinElements();
  tableOfContents();
  // refreshObserve();
  // logoSlider();
  blogPostSlider();
});
