/**
 * Script Purpose: Auto-generated table of contents with smooth scroll and active states
 * Author: Erlen Masson
 * Created: 2025-10-12
 * Version: 1.0
 * Last Updated: 2025-10-12
 * Dependencies: GSAP (optional), ScrollSmoother (optional), ScrollToPlugin (optional)
 */

console.log("Table of Contents v1.0 — Loaded");

//
//------- Utility Functions -------//
//

// Safe ID slug generator
function slugifyHeading(text) {
  return (
    "toc-" +
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
  );
}

// Smooth scroll helper using GSAP ScrollTo
function smoothScrollTo(targetEl, offset = 100) {
  // Check for GSAP and ScrollToPlugin
  if (window.gsap && window.ScrollToPlugin) {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: targetEl,
        offsetY: offset,
        autoKill: false
      },
      ease: "power3.inOut",
      overwrite: "auto"
    });
    return;
  }

  // Fallback to native smooth scroll
  const rect = targetEl.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  window.scrollTo({
    top: scrollTop + rect.top - offset,
    behavior: "smooth"
  });
}

//
//------- Main Functions -------//
//

// Build the TOC
function buildTOC(article, tocContainer) {
  const headings = article.querySelectorAll("h2, h3, h4");
  if (!headings.length) return;

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

// Setup active states and interactions
function setupActiveState(article, tocContainer) {
  const tocItems = tocContainer.querySelectorAll("a");
  const headings = article.querySelectorAll("h2, h3, h4");
  const defaultOffset =
    parseFloat(tocContainer.getAttribute("data-toc-offset")) || 100;
  
  let isScrolling = false;

  function setActiveById(id) {
    tocItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${id}`);
    });
  }

  // Click event → smooth scroll with GSAP
  tocItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const id = item.getAttribute("href").substring(1);
      const target = document.getElementById(id);
      if (!target) return;

      // Prevent observer from updating during scroll
      isScrolling = true;
      setActiveById(id);

      // Update URL hash without jumping
      if (history.pushState) history.pushState(null, "", `#${id}`);
      else location.hash = `#${id}`;

      smoothScrollTo(target, defaultOffset);
      
      // Re-enable observer after scroll animation completes
      setTimeout(() => {
        isScrolling = false;
      }, 1200);
    });
  });

  // Observe headings → highlight active section while scrolling
  
  const observer = new IntersectionObserver(
    (entries) => {
      if (isScrolling) return; // Don't update during programmatic scroll
      
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setActiveById(entry.target.id);
        }
      });
    },
    { 
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }
  );

  headings.forEach((h) => observer.observe(h));

  // Handle hash navigation
  function handleHash() {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    
    isScrolling = true;
    setActiveById(id);
    smoothScrollTo(target, defaultOffset);
    
    setTimeout(() => {
      isScrolling = false;
    }, 1200);
  }

  window.addEventListener("hashchange", handleHash);
  
  // Handle initial hash on page load
  if (location.hash) {
    setTimeout(handleHash, 100);
  }
}

// Initialize table of contents
function initTableOfContents() {
  const article = document.getElementById("single-article");
  const tocContainer = document.getElementById("toc");

  if (!article || !tocContainer) return;

  buildTOC(article, tocContainer);
  setupActiveState(article, tocContainer);
}

//
//------- Initialize -------//
//

document.addEventListener("DOMContentLoaded", () => {
  initTableOfContents();
});

