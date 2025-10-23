/**
 * Homepage Scripts
 * Author: Erlen Masson
 * Version: 1.9.0
 * Purpose: Custom Homepage scripts
 */

console.log("Script - Homepage v1.9.0");

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

// ------- Logo Ticker ------- //
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

// ------- Testimonial Slider ------- //
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

// ------- Blog Slider ------- //
function blogPostSlider() {
  // Check if Splide is available before initializing
  if (typeof Splide === 'undefined') {
    console.warn('Splide not loaded, retrying blog slider initialization...');
    setTimeout(blogPostSlider, 100);
    return;
  }

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

// ------- Testimonial Text Animation ------- //
const testimonialCache = new WeakMap();
let isTransitioning = false;


// ------- Testimonial Text Animation ------- //
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
  
  // ------- Testimonial Text Animation ------- //
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


// ------- Initialize when DOM is ready ------- //
document.addEventListener("DOMContentLoaded", () => {
  thumbVideoHover();
  brandLogoScroll();
  mobileVideoAutoplay();
  initTestimonialTextAnimation();
  testimonialSlider();
  logoSlider();
  blogPostSlider();
});
