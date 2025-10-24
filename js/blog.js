/**
 * Script Purpose: Blog page functionality and table of contents
 * Author: Erlen Masson
 * Created: 2025-10-12
 * Version: 1.9.1
 * Last Updated: October 22, 2025
 */

console.log("Script - Blog v1.9.1");

// ------- Utility Functions ------- //
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

// ------- Core Functions ------- //
function addAnchorIds(article) {
  const headings = article.querySelectorAll("h2, h3, h4");
  
  headings.forEach((heading) => {
    const title = heading.textContent.trim();
    const anchorId = slugifyHeading(title);
    heading.id = anchorId;
  });
  
  console.log(`✓ Added ${headings.length} anchor IDs to headings`);
}
function buildTocElements(article, tocContainer) {
  const headings = article.querySelectorAll("h2, h3, h4");
  
  if (!headings.length) {
    console.warn("No headings found in article");
    return;
  }

  const ul = document.createElement("ul");
  
  headings.forEach((heading) => {
    const title = heading.textContent.trim();
    const anchorId = heading.id;
    
    const li = document.createElement("li");
    const a = document.createElement("a");
    
    a.textContent = title;
    a.href = `#${anchorId}`;
    
    // ------- ScrollSmoother Configuration ------- //
    a.addEventListener("click", (e) => {
      e.preventDefault();
      
      const smoother = ScrollSmoother ? ScrollSmoother.get() : null;
      if (smoother) {
        smoother.kill();
        heading.scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
          ScrollSmoother.create({
            smooth: 1.5,        // Scroll smoothness (seconds)
            effects: true,      // Enable scroll effects
            smoothTouch: 0,     // Disable touch smoothing
          });
        }, 1500); // Recreate delay (milliseconds)
      } else {
        heading.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    li.appendChild(a);
    ul.appendChild(li);
  });
  
  tocContainer.appendChild(ul);
  console.log(`✓ Built TOC with ${headings.length} links`);
}

// ------- Initialization ------- //

function initTableOfContents() {
  const article = document.getElementById("single-article");
  const tocContainer = document.getElementById("toc");

  if (!article || !tocContainer) {
    console.warn("Article or TOC container not found");
    return;
  }

  addAnchorIds(article);
  buildTocElements(article, tocContainer);
  
  console.log("✓ Table of Contents initialized");
}
document.addEventListener("DOMContentLoaded", () => {
  initTableOfContents();
});
