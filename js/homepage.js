/**
 * Homepage Scripts
 * Author: Erlen Masson
 * Version: 1.8.6
 * Purpose: Custom Homepage scripts
 */

console.log("Script - Homepage v1.8.6");

// ------- Video Hover Functionality ------- //
function thumbVideoHover() {
  // Skip on touch devices
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    return;
  }

  const workPosts = document.querySelectorAll('.work_post-wrapper');
  
  workPosts.forEach(workPost => {
    const video = workPost.querySelector('.vdo_thumb');
    if (!video) return;

    // Configure video
    video.muted = true;
    video.autoplay = false;
    video.loop = false;
    video.controls = false;
    video.pause();
    video.currentTime = 0;

    // Hover events (desktop only)
    if (window.matchMedia("(min-width: 992px)").matches) {
      workPost.addEventListener('mouseenter', () => {
        video.currentTime = 0;
        video.play().catch(() => {});
      });

      workPost.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });
}

// ------- Brand Logo Scroll Visibility ------- //
function brandLogoScroll() {
  const delay = 500;
  let timeout = null;

  window.addEventListener('scroll', function() {
    // Add scrolling class to all brand logos
    const brandLogos = document.querySelectorAll('.work_post-wrapper .thumb-brand-logo');
    brandLogos.forEach(brandLogo => {
      brandLogo.classList.add('scrolling');
    });


    // Clear existing timeout
    clearTimeout(timeout);
    
    // Set new timeout to remove scrolling class
    timeout = setTimeout(function() {
      brandLogos.forEach(brandLogo => {
        brandLogo.classList.remove('scrolling');
      });
    }, delay);
  });
}

// ------- Mobile Video Autoplay ------- //
function mobileVideoAutoplay() {
  // Only run on mobile/touch devices
  if (!("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return;
  }

  const videos = document.querySelectorAll('.work_post-wrapper .vdo_thumb');
  let userHasInteracted = false;

  // Configure videos for mobile autoplay
  videos.forEach(video => {
    video.muted = true;
    video.autoplay = false;
    video.loop = false;
    video.controls = false;
    video.pause();
    video.currentTime = 0;
  });

  function tryPlayIfInView(video) {
    const rect = video.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      video.play().catch(() => {});
    }
  }

  function unlockAutoplay() {
    userHasInteracted = true;
    videos.forEach((video) => tryPlayIfInView(video));
  }

  // Unlock autoplay on first user interaction
  window.addEventListener("scroll", unlockAutoplay, { once: true });
  window.addEventListener("touchstart", unlockAutoplay, { once: true });
  window.addEventListener("click", unlockAutoplay, { once: true });

  // Set up intersection observer for each video
  videos.forEach((video) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (userHasInteracted) {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
              video.currentTime = 0; // Reset to first frame when out of view
            }
          }
        });
      },
      { threshold: 0.5 } // Video needs to be 50% visible to play
    );

    observer.observe(video);
  });
}

// ------- Initialize when DOM is ready ------- //
document.addEventListener("DOMContentLoaded", () => {
  thumbVideoHover();
  brandLogoScroll();
  mobileVideoAutoplay();
});
