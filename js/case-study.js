/**
 * Case Study Template Scripts
 * Author: Erlen Masson
 * Created: 4th July 2025
 * Last Updated: October 22, 2025
 * Purpose: Handles all case study template functionality
 */

console.log("Script Case Study v1.8.2");

// ------- Case Study Content Toggle ------- //
function toggleCaseStudyContent() {
  const btnProjectInfo = document.getElementById('btn-project-info');
  const caseStudyContent = document.querySelector('.case-study-content');
  
  if (btnProjectInfo && caseStudyContent) {
    // Get the icons and their SVG children
    const icnInfo = btnProjectInfo.querySelector('.icn-info');
    const icnClose = btnProjectInfo.querySelector('.icn-close');
    const svgInfo = icnInfo?.querySelector('.svg-icon');
    const svgClose = icnClose?.querySelector('.svg-icon');
    
    // Set initial state: info icon visible, close icon hidden
    if (icnInfo) {
      icnInfo.style.display = '';
      if (svgInfo) gsap.set(svgInfo, { opacity: 1 });
    }
    if (icnClose) {
      icnClose.style.display = 'none';
      if (svgClose) gsap.set(svgClose, { opacity: 0 });
    }
    
    // Set initial cursor attribute
    btnProjectInfo.setAttribute('data-cursor', 'info');
    
    btnProjectInfo.addEventListener('click', () => {
      const isCurrentlyOpen = caseStudyContent.classList.contains('is-open');
      
      if (isCurrentlyOpen) {
        // CLOSING: Currently open, so close it
        caseStudyContent.classList.remove('is-open');
        btnProjectInfo.setAttribute('data-cursor', 'info');
        
        // Fade out close icon, then fade in info icon
        if (svgClose && icnClose.style.display !== 'none') {
          gsap.to(svgClose, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
              icnClose.style.display = 'none';
              // Show and fade in info icon
              icnInfo.style.display = '';
              gsap.fromTo(svgInfo, 
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
              );
            }
          });
        } else {
          // No close icon to fade, just show info icon
          icnInfo.style.display = '';
          gsap.fromTo(svgInfo, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        }
        
      } else {
        // OPENING: Currently closed, so open it
        caseStudyContent.classList.add('is-open');
        btnProjectInfo.setAttribute('data-cursor', 'close');
        
        // Fade out info icon, then fade in close icon
        if (svgInfo && icnInfo.style.display !== 'none') {
          gsap.to(svgInfo, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
              icnInfo.style.display = 'none';
              // Show and fade in close icon
              icnClose.style.display = '';
              gsap.fromTo(svgClose, 
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }
              );
            }
          });
        } else {
          // No info icon to fade, just show close icon
          icnClose.style.display = '';
          gsap.fromTo(svgClose, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        }
      }

      setTimeout(() => {
        console.log('Refreshing GSAP after case study toggle');
        ScrollTrigger.refresh();
        
        // Also refresh ScrollSmoother if it exists
        const smoother = ScrollSmoother ? ScrollSmoother.get() : null;
        if (smoother) {
          smoother.effects();
        }

        // Refresh case study pinning system
        if (pinCaseStudyContent) {
          pinCaseStudyContent.refresh();
        }
      }, 500); // Small delay to allow CSS transitions to complete
    });
  }
}

// ------- Case Study Content Pinning (Desktop Only) ------- //
class PinCaseStudyContent {
  constructor() {
    this.isDesktop = false;
    this.isTouchDevice = false;
    this.contentBlocks = [];
    this.resizeObserver = null;
    this.measurements = new Map();
    
    this.init();
  }

  init() {
    // Check if we're on desktop and not a touch device
    this.checkDeviceCapabilities();
    
    if (!this.isDesktop || this.isTouchDevice) {
      console.log('Case study pinning skipped - not desktop or touch device detected');
      return;
    }

    // Initialize pinning after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.setupPinning();
    }, 100);
  }

  // Check device capabilities
  checkDeviceCapabilities() {
    // Desktop breakpoint (992px and up)
    this.isDesktop = window.matchMedia("(min-width: 992px)").matches;
    
    // Touch device detection
    this.isTouchDevice = (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );

    console.log('Device capabilities:', {
      isDesktop: this.isDesktop,
      isTouchDevice: this.isTouchDevice
    });
  }

  // Setup pinning
  setupPinning() {
    // Wait for CMS content to load before measuring
    this.waitForCMSContent().then(() => {
      this.initializePinning();
    });
  }

  // Wait for CMS content to be fully loaded
  waitForCMSContent() {
    return new Promise((resolve) => {
      // Check if Webflow CMS is present
      const hasWebflowCMS = document.querySelector('.w-dyn-list, .w-dyn-item, [data-wf-cms]');
      
      if (!hasWebflowCMS) {
        // No CMS content, proceed immediately
        resolve();
        return;
      }

      // Wait for images to load (common CMS delay)
      const images = document.querySelectorAll('.case-study-content img');
      let loadedImages = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        // No images, wait a bit for other content
        setTimeout(resolve, 500);
        return;
      }

      const checkComplete = () => {
        loadedImages++;
        if (loadedImages >= totalImages) {
          // All images loaded, wait a bit more for layout
          setTimeout(resolve, 200);
        }
      };

      images.forEach(img => {
        if (img.complete) {
          checkComplete();
        } else {
          img.addEventListener('load', checkComplete);
          img.addEventListener('error', checkComplete);
        }
      });
    });
  }

  // Initialize pinning after CMS content is loaded
  initializePinning() {
    // Find all case study content blocks
    this.contentBlocks = document.querySelectorAll('.case-study_content-block');
    
    if (this.contentBlocks.length === 0) {
      console.log('No case study content blocks found');
      return;
    }

    console.log(`Found ${this.contentBlocks.length} case study content blocks`);

    // Setup each content block
    this.contentBlocks.forEach((block, index) => {
      this.setupContentBlock(block, index);
    });

    // Setup resize observer for dynamic content changes
    this.setupResizeObserver();
  }

  // Setup content block
  setupContentBlock(contentBlock, index) {
    const container = contentBlock.closest('.case-study-content');
    
    if (!container) {
      console.warn(`No .case-study-content container found for block ${index}`);
      return;
    }

    // Store measurement data
    const measurements = {
      contentBlock: contentBlock,
      container: container,
      index: index,
      scrollTrigger: null
    };

    this.measurements.set(contentBlock, measurements);

    // Initial measurement and pinning setup
    this.measureAndPin(contentBlock);
  }

  // Measure and pin
  measureAndPin(contentBlock) {
    const measurements = this.measurements.get(contentBlock);
    if (!measurements) return;

    // Clear existing ScrollTrigger if it exists
    if (measurements.scrollTrigger) {
      measurements.scrollTrigger.kill();
      measurements.scrollTrigger = null;
    }

    // Wait for any pending layout changes
    requestAnimationFrame(() => {
      this.performMeasurement(contentBlock);
    });
  }

  // Perform measurement
  performMeasurement(contentBlock) {
    const measurements = this.measurements.get(contentBlock);
    if (!measurements) return;

    const { container } = measurements;

    // Pin content blocks regardless of height
    const contentBlockHeight = contentBlock.offsetHeight;
    const viewportHeight = window.innerHeight;
    const basePinOffset = 120; // Base offset from top of viewport when pinned
    const breathingSpace = 64; // Additional breathing space for long mode

    if (contentBlockHeight <= viewportHeight) {
      // Short mode: use base offset
      this.pinContentBlock(contentBlock, container, basePinOffset);
    } else {
      // Long mode: pin from bottom of viewport with breathing space
      const longModeOffset = viewportHeight - contentBlockHeight - breathingSpace;
      this.pinContentBlock(contentBlock, container, longModeOffset);
    }
  }

  // Pin content block
  pinContentBlock(contentBlock, container, pinOffset) {
    const measurements = this.measurements.get(contentBlock);
    if (!measurements) return;

    // Calculate when to stop pinning - when content bottom hits container bottom
    const contentBlockHeight = contentBlock.offsetHeight;
    const containerHeight = container.offsetHeight;
    const scrollDistance = containerHeight - contentBlockHeight;

    // Create ScrollTrigger with proper end condition
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: `top ${pinOffset}px`,
      end: `+=${scrollDistance}`,
      pin: contentBlock,
      pinSpacing: false
    });

    measurements.scrollTrigger = scrollTrigger;
  }


  // Setup resize observer
  setupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      // Debounce the re-measurement
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        console.log('Resize detected - re-measuring case study content blocks');
        this.reMeasureAll();
      }, 200);
    });

    // Observe all content blocks and their containers
    this.contentBlocks.forEach((contentBlock) => {
      const measurements = this.measurements.get(contentBlock);
      if (measurements) {
        this.resizeObserver.observe(contentBlock);
        this.resizeObserver.observe(measurements.container);
      }
    });

    // Also observe window resize
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.checkDeviceCapabilities();
        if (this.isDesktop && !this.isTouchDevice) {
          this.reMeasureAll();
        }
      }, 200);
    });
  }

  // Re-measure all
  reMeasureAll() {
    this.contentBlocks.forEach((contentBlock) => {
      this.measureAndPin(contentBlock);
    });

    // Refresh ScrollTrigger and ScrollSmoother
    ScrollTrigger.refresh();
    
    const smoother = ScrollSmoother ? ScrollSmoother.get() : null;
    if (smoother) {
      smoother.effects();
    }
  }

  // Refresh pinning
  refresh() {
    if (this.isDesktop && !this.isTouchDevice) {
      this.reMeasureAll();
    }
  }

  // Cleanup
  destroy() {
    // Kill all ScrollTriggers
    this.measurements.forEach((measurements) => {
      if (measurements.scrollTrigger) {
        measurements.scrollTrigger.kill();
      }
    });

    // Disconnect resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Clear timeouts
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    // Clear measurements
    this.measurements.clear();
  }
}

// Global instance
let pinCaseStudyContent = null;

// ------- Case Study Template Initialization ------- //
function initCaseStudyTemplate() {
  toggleCaseStudyContent();
  
  // Initialize pinning system
  pinCaseStudyContent = new PinCaseStudyContent();
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initCaseStudyTemplate();
});

// Export for external use
window.PinCaseStudyContent = PinCaseStudyContent;
