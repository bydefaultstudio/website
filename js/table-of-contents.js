/**
 * Script Purpose: Auto-generated table of contents
 * Author: Erlen Masson
 * Created: 2025-10-12
 * Version: 2.0.1
 * Last Updated: 2025-10-20
 */

console.log("[Testing] Table of Contents v2.0.1 — Loaded (2025-10-20)");

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

//
//------- Core Functions -------//
//

// Function 1: Add anchor IDs to content headings
function addAnchorIds(article) {
  const headings = article.querySelectorAll("h2, h3, h4");
  
  headings.forEach((heading) => {
    const title = heading.textContent.trim();
    const anchorId = slugifyHeading(title);
    heading.id = anchorId;
  });
  
  console.log(`✓ Added ${headings.length} anchor IDs to headings`);
}

// Function 2: Build TOC elements from article content
function buildTocElements(article, tocContainer) {
  const headings = article.querySelectorAll("h2, h3, h4");
  
  if (!headings.length) {
    console.warn("No headings found in article");
    return;
  }

  // Create list items
  const ul = document.createElement("ul");
  
  headings.forEach((heading) => {
    const title = heading.textContent.trim();
    const anchorId = heading.id;
    
    const li = document.createElement("li");
    const a = document.createElement("a");
    
    a.textContent = title;
    a.href = `#${anchorId}`;
    
    // Option A: Disable ScrollSmoother Only for TOC Navigation (WORKING SOLUTION)
    a.addEventListener("click", (e) => {
      e.preventDefault();
      
      console.log("TOC Navigation: Temporarily disabling ScrollSmoother");
      
      const smoother = ScrollSmoother ? ScrollSmoother.get() : null;
      if (smoother) {
        // Kill ScrollSmoother temporarily
        smoother.kill();
        
        // Use native smooth scroll
        heading.scrollIntoView({ behavior: 'smooth' });
        
        // Recreate ScrollSmoother after scroll completes
        setTimeout(() => {
          ScrollSmoother.create({
            smooth: 1.5,
            effects: true,
            smoothTouch: 0,
          });
          console.log("ScrollSmoother recreated after TOC navigation");
        }, 1500);
      } else {
        // Fallback to native scroll
        heading.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    li.appendChild(a);
    ul.appendChild(li);
  });
  
  tocContainer.appendChild(ul);
  console.log(`✓ Built TOC with ${headings.length} links (WORKING: Disable ScrollSmoother for TOC)`);
}

//
//------- Initialize -------//
//

function initTableOfContents() {
  const article = document.getElementById("single-article");
  const tocContainer = document.getElementById("toc");

  if (!article || !tocContainer) {
    console.warn("Article or TOC container not found");
    return;
  }

  // Step 1: Add IDs to headings
  addAnchorIds(article);
  
  // Step 2: Build TOC list
  buildTocElements(article, tocContainer);
  
  console.log("✓ Table of Contents initialized");
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initTableOfContents();
});
