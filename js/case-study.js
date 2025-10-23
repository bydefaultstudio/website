/**
 * Case Study Template Scripts
 * Author: Erlen Masson
 * Created: 4th July 2025
 * Version: 1.9.0
 * Last Updated: October 22, 2025
 * Purpose: Handles all case study template functionality
 */

console.log("Script Case Study v1.9.0");

function toggleCaseStudyContent() {
  const btnProjectInfo = document.getElementById('btn-project-info');
  const caseStudyContent = document.querySelector('.case-study-content');
  
  if (btnProjectInfo && caseStudyContent) {
    const icnInfo = btnProjectInfo.querySelector('.icn-info');
    const icnClose = btnProjectInfo.querySelector('.icn-close');
    const svgInfo = icnInfo?.querySelector('.svg-icon');
    const svgClose = icnClose?.querySelector('.svg-icon');
    
    if (icnInfo) {
      icnInfo.style.display = '';
      if (svgInfo) gsap.set(svgInfo, { opacity: 1 });
    }
    if (icnClose) {
      icnClose.style.display = 'none';
      if (svgClose) gsap.set(svgClose, { opacity: 0 });
    }
    
    btnProjectInfo.setAttribute('data-cursor', 'info');
    
    btnProjectInfo.addEventListener('click', () => {
      const isCurrentlyOpen = caseStudyContent.classList.contains('is-open');
      
      if (isCurrentlyOpen) {
        caseStudyContent.classList.remove('is-open');
        btnProjectInfo.setAttribute('data-cursor', 'info');
        
        if (svgClose && icnClose.style.display !== 'none') {
          gsap.to(svgClose, {
            opacity: 0,
            duration: 0.2,        // Icon fade out duration (seconds)
            ease: "power2.in",    // Icon fade out easing
            onComplete: () => {
              icnClose.style.display = 'none';
              icnInfo.style.display = '';
              gsap.fromTo(svgInfo, 
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }  // Icon fade in duration & easing
              );
            }
          });
        } else {
          icnInfo.style.display = '';
          gsap.fromTo(svgInfo, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power2.out" }  // Icon fade in duration & easing
          );
        }
        
      } else {
        caseStudyContent.classList.add('is-open');
        btnProjectInfo.setAttribute('data-cursor', 'close');
        
        if (svgInfo && icnInfo.style.display !== 'none') {
          gsap.to(svgInfo, {
            opacity: 0,
            duration: 0.2,        // Icon fade out duration (seconds)
            ease: "power2.in",    // Icon fade out easing
            onComplete: () => {
              icnInfo.style.display = 'none';
              icnClose.style.display = '';
              gsap.fromTo(svgClose, 
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: "power2.out" }  // Icon fade in duration & easing
              );
            }
          });
        } else {
          icnClose.style.display = '';
          gsap.fromTo(svgClose, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power2.out" }  // Icon fade in duration & easing
          );
        }
      }

      setTimeout(() => {
        ScrollTrigger.refresh();
        
        const smoother = ScrollSmoother ? ScrollSmoother.get() : null;
        if (smoother) {
          smoother.effects();
        }

        if (pinCaseStudyContent) {
          pinCaseStudyContent.refresh();
        }
      }, 500); // Refresh delay - allows CSS transitions to complete
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

  checkDeviceCapabilities() {
    this.isDesktop = window.matchMedia("(min-width: 992px)").matches;
    
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

  setupPinning() {
    this.waitForCMSContent().then(() => {
      this.initializePinning();
    });
  }

  waitForCMSContent() {
    return new Promise((resolve) => {
      const hasWebflowCMS = document.querySelector('.w-dyn-list, .w-dyn-item, [data-wf-cms]');
      
      if (!hasWebflowCMS) {
        resolve();
        return;
      }

      const images = document.querySelectorAll('.case-study-content img');
      let loadedImages = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        setTimeout(resolve, 500);
        return;
      }

      const checkComplete = () => {
        loadedImages++;
        if (loadedImages >= totalImages) {
          setTimeout(resolve, 200); // Layout delay after images load
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

  // ------- Content Block Setup ------- //
  initializePinning() {
    this.contentBlocks = document.querySelectorAll('.case-study_content-block');
    
    if (this.contentBlocks.length === 0) {
      console.log('No case study content blocks found');
      return;
    }

    console.log(`Found ${this.contentBlocks.length} case study content blocks`);

    this.contentBlocks.forEach((block, index) => {
      this.setupContentBlock(block, index);
    });

    this.setupResizeObserver();
  }

  setupContentBlock(contentBlock, index) {
    const container = contentBlock.closest('.case-study-content');
    
    if (!container) {
      console.warn(`No .case-study-content container found for block ${index}`);
      return;
    }

    const measurements = {
      contentBlock: contentBlock,
      container: container,
      index: index,
      scrollTrigger: null
    };

    this.measurements.set(contentBlock, measurements);

    this.measureAndPin(contentBlock);
  }

  measureAndPin(contentBlock) {
    const measurements = this.measurements.get(contentBlock);
    if (!measurements) return;

    if (measurements.scrollTrigger) {
      measurements.scrollTrigger.kill();
      measurements.scrollTrigger = null;
    }

    requestAnimationFrame(() => {
      this.performMeasurement(contentBlock);
    });
  }

  performMeasurement(contentBlock) {
    const measurements = this.measurements.get(contentBlock);
    if (!measurements) return;

    const { container } = measurements;

    // ------- Pinning Configuration ------- //
    // Edit these values to customize pinning behavior
    const contentBlockHeight = contentBlock.offsetHeight;
    const viewportHeight = window.innerHeight;
    const basePinOffset = 120; // Base offset from top when pinned (pixels)
    const breathingSpace = 64; // Additional space for long content (pixels)

    if (contentBlockHeight <= viewportHeight) {
      this.pinContentBlock(contentBlock, container, basePinOffset);
    } else {
      const longModeOffset = viewportHeight - contentBlockHeight - breathingSpace;
      this.pinContentBlock(contentBlock, container, longModeOffset);
    }
  }

  pinContentBlock(contentBlock, container, pinOffset) {
    const measurements = this.measurements.get(contentBlock);
    if (!measurements) return;

    const contentBlockHeight = contentBlock.offsetHeight;
    const containerHeight = container.offsetHeight;
    const scrollDistance = containerHeight - contentBlockHeight;

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: `top ${pinOffset}px`,
      end: `+=${scrollDistance}`,
      pin: contentBlock,
      pinSpacing: false
    });

    measurements.scrollTrigger = scrollTrigger;
  }


  // ------- Resize Observer ------- //
  setupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.reMeasureAll();
      }, 200); // Resize debounce delay (milliseconds)
    });

    this.contentBlocks.forEach((contentBlock) => {
      const measurements = this.measurements.get(contentBlock);
      if (measurements) {
        this.resizeObserver.observe(contentBlock);
        this.resizeObserver.observe(measurements.container);
      }
    });

    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.checkDeviceCapabilities();
        if (this.isDesktop && !this.isTouchDevice) {
          this.reMeasureAll();
        }
      }, 200); // Window resize debounce delay (milliseconds)
    });
  }

  reMeasureAll() {
    this.contentBlocks.forEach((contentBlock) => {
      this.measureAndPin(contentBlock);
    });

    ScrollTrigger.refresh();
    
    const smoother = ScrollSmoother ? ScrollSmoother.get() : null;
    if (smoother) {
      smoother.effects();
    }
  }

  refresh() {
    if (this.isDesktop && !this.isTouchDevice) {
      this.reMeasureAll();
    }
  }

  destroy() {
    this.measurements.forEach((measurements) => {
      if (measurements.scrollTrigger) {
        measurements.scrollTrigger.kill();
      }
    });

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.measurements.clear();
  }
}

let pinCaseStudyContent = null;

// ------- Case Study Template Initialization ------- //
function initCaseStudyTemplate() {
  toggleCaseStudyContent();
  
  pinCaseStudyContent = new PinCaseStudyContent();
}

document.addEventListener("DOMContentLoaded", () => {
  initCaseStudyTemplate();
});

window.PinCaseStudyContent = PinCaseStudyContent;
