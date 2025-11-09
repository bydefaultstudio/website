/**
 * Script Purpose: Key Visual Collection Spawner
 * Author: Erlen Masson
 * Version: 1.9.7
 * Last Updated: November 9, 2025
 */

console.log("Script - Key Visuals v1.9.7");

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

class KeyVisualCollection {
  constructor(containerSelector = '#key-visual-container') {
    this.container = null;
    this.activeKeyVisuals = [];
    this.maxKeyVisuals = 20;
    this.collection = [];
    this.isInitialized = false;
    this.spawnCooldown = 100;
    this.lastSpawnTime = 0;
    this.containerSelector = containerSelector;
    this.currentImageIndex = 0;
    
    this.config = this.getResponsiveConfig();
  }

  // Initialize the spawner
  init() {
    this.container = document.querySelector(this.containerSelector);
    if (!this.container) {
      console.warn(`Container ${this.containerSelector} not found`);
      return;
    }

    this.createOverlay();
    this.loadCollection();
    this.setupEventListeners();
    this.setupResponsiveListener();
    this.isInitialized = true;
    
  }

  // Create the overlay for key visuals within the hero section
  createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'key-visual-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      overflow: hidden;
    `;
    // Append to the hero container instead of body
    this.container.appendChild(overlay);
    this.overlay = overlay;
  }

  // Check if device is mobile
  isMobile() {
    const isMobile = window.innerWidth <= 768;
    return isMobile;
  }

  // ANIMATION CONFIGURATION - Edit these values to customize animations
  getResponsiveConfig() {
    if (this.isMobile()) {
      return {
        enterDuration: 0.3,        // How fast visuals appear (seconds)
        dwellDuration: 0,          // How long visuals stay visible (seconds)
        exitDuration: 0.8,         // How long exit animation takes (seconds)
        scaleRange: [0.95, 1.05],  // Size variation range [min, max]
        rotationRange: [-3, 3],    // Rotation range in degrees [min, max]
        driftDistance: 100,        // How far visuals move when exiting (pixels)
        driftXMultiplier: 0.05,    // Horizontal movement multiplier
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      };
    } else {
      return {
        enterDuration: 0.4,        // How fast visuals appear (seconds)
        dwellDuration: 0,          // How long visuals stay visible (seconds)
        exitDuration: 6.0,         // How long exit animation takes (seconds)
        scaleRange: [0.9, 1.1],    // Size variation range [min, max]
        rotationRange: [-5, 5],    // Rotation range in degrees [min, max]
        driftDistance: 100,        // How far visuals move when exiting (pixels)
        driftXMultiplier: 0.1,     // Horizontal movement multiplier
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      };
    }
  }

  getResponsiveDisplayWidths() {
    if (this.isMobile()) {
      return {
        '16:9': '70vw',  // Landscape - larger on mobile
        '4:5': '50vw',   // Portrait - medium width
        '1:1': '55vw',   // Square - medium width
        '2:1': '60vw',   // Ultra-wide landscape - larger
        '9:16': '25vw'   // Ultra-tall portrait - smaller
      };
    } else {
      const widths = {
        '16:9': '45vw',  // Landscape - larger width
        '4:5': '30vw',   // Portrait - smaller width
        '1:1': '35vw',   // Square - medium width
        '2:1': '60vw',   // Ultra-wide landscape - extra large width
        '9:16': '25vw'   // Ultra-tall portrait - smaller width
      };
      return widths;
    }
  }

  // Load key visuals from Webflow CMS inline JSON feed
  loadCollection() {
    // Get responsive display widths
    this.ratioDisplayWidths = this.getResponsiveDisplayWidths();

    // Try to load from Webflow CMS JSON feed first
    const cmsData = this.parseWebflowCMSFeed();
    
    if (cmsData && cmsData.length > 0) {
      this.collection = cmsData;
      
      // Pre-warm the first asset for better performance
      this.preWarmFirstAsset();
    } else {
      // Fallback to default collection if no CMS data
      this.collection = this.getDefaultCollection();
    }
  }

  // Parse Webflow CMS inline JSON feed
  parseWebflowCMSFeed() {
    const feedContainer = document.querySelector('#kv-json-feed');
    
    if (!feedContainer) {
      return null;
    }

    const jsonBlocks = feedContainer.querySelectorAll('.kv-json');

    const parsedItems = [];

    jsonBlocks.forEach((block, index) => {
      try {
        const jsonText = block.textContent.trim();
        
        const item = JSON.parse(jsonText);
        
        // Validate required fields
        if (!item.src) {
          console.warn(`⚠️ Skipping item ${index} - no src`);
          return;
        }

        // Normalize to internal format (Webflow JSON structure)
        const normalizedItem = {
          type: item.type || 'image',
          src: item.src,
          poster: item.poster || null,
          alt: item.alt || 'Key visual',
          ratio: item.ratio || '16:9',
          weight: item.weight || 1,
          drop: item.drop || null,
          order: item.order || index
        };

        parsedItems.push(normalizedItem);
      } catch (error) {
        console.error(`❌ Failed to parse JSON block ${index}:`, error);
        console.error(`❌ Raw content:`, block.textContent);
      }
    });

    // Sort by order
    parsedItems.sort((a, b) => a.order - b.order);

    // Remove the feed from DOM to free memory
    feedContainer.remove();

    return parsedItems;
  }

  // Pre-warm the first asset for better performance
  preWarmFirstAsset() {
    if (!this.collection || this.collection.length === 0) return;

    const firstVisual = this.collection[0];
    
    if (firstVisual.type === 'video') {
      // Pre-warm video metadata
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'video';
      preloadLink.href = firstVisual.src;
      document.head.appendChild(preloadLink);
      
      if (firstVisual.poster) {
        // Pre-warm poster image
        const posterLink = document.createElement('link');
        posterLink.rel = 'preload';
        posterLink.as = 'image';
        posterLink.href = firstVisual.poster;
        document.head.appendChild(posterLink);
      }
    } else {
      // Pre-warm image
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = firstVisual.src;
      document.head.appendChild(preloadLink);
    }
    
  }

  // Default fallback collection
  getDefaultCollection() {
    return [
      { 
        type: 'image', 
        src: 'https://placehold.co/1920x1080/094C45/B6D6A5?text=PNG', 
        ratio: '16:9',
        weight: 1,
        order: 1
      },
      { 
        type: 'gif', 
        src: 'https://placehold.co/1200x1500/F7A3BC/2B2B2B?text=GIF', 
        ratio: '4:5',
        weight: 1,
        order: 2
      },
      { 
        type: 'video', 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
        ratio: '16:9',
        weight: 1,
        order: 3
      },
      { 
        type: 'image', 
        src: 'https://placehold.co/1080x1080/FFB533/2B2B2B?text=PNG', 
        ratio: '1:1',
        weight: 1,
        order: 4
      },
      { 
        type: 'video', 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
        ratio: '16:9',
        weight: 1,
        order: 5
      },
      { 
        type: 'image', 
        src: 'https://placehold.co/900x1600/094C45/B6D6A5?text=PNG', 
        ratio: '9:16',
        weight: 1,
        order: 6
      }
    ];
  }

  // Setup event listeners
  setupEventListeners() {
    const debouncedSpawn = debounce((e) => this.spawnKeyVisual(e), this.spawnCooldown);
    
    // Mouse events
    this.container.addEventListener('click', (e) => {
      debouncedSpawn(e);
    });
    
    // Touch events for mobile - distinguish between tap and scroll
    let touchStartTime = 0;
    let touchStartY = 0;
    let touchMoved = false;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      touchStartY = e.touches[0].clientY;
      touchMoved = false;
    }, { passive: true });
    
    this.container.addEventListener('touchmove', (e) => {
      if (Math.abs(e.touches[0].clientY - touchStartY) > 10) {
        touchMoved = true;
      }
    }, { passive: true });
    
    this.container.addEventListener('touchend', (e) => {
      const touchDuration = Date.now() - touchStartTime;
      // Only spawn if it was a quick tap (not a scroll)
      if (touchDuration < 300 && !touchMoved) {
        debouncedSpawn(e.changedTouches[0]);
      }
    }, { passive: true });
    
  }

  // Setup responsive listener for screen size changes
  setupResponsiveListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Update responsive settings when screen size changes
        this.config = this.getResponsiveConfig();
        this.ratioDisplayWidths = this.getResponsiveDisplayWidths();
      }, 150); // Debounce resize events
    });
  }

  // Spawn a key visual at the click position
  spawnKeyVisual(event) {
    
    if (!this.isInitialized) {
      return;
    }
    
    if (this.activeKeyVisuals.length >= this.maxKeyVisuals) {
      return;
    }
    
    const now = Date.now();
    if (now - this.lastSpawnTime < this.spawnCooldown) {
      return;
    }
    this.lastSpawnTime = now;

    const rect = this.container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    

    // Don't spawn too close to edges
    if (x < 50 || x > rect.width - 50 || y < 50 || y > rect.height - 50) {
      return;
    }

    const keyVisual = this.createKeyVisual(x, y);
    this.animateKeyVisual(keyVisual);
    this.activeKeyVisuals.push(keyVisual);
  }

  // Create a key visual element
  createKeyVisual(x, y) {
    const keyVisual = document.createElement('div');
    keyVisual.className = 'key-visual';
    
    // Select next key visual from collection consecutively
    const visual = this.selectNextKeyVisual();
    
    // Get display width based on ratio
    const displayWidth = this.ratioDisplayWidths[visual.ratio] || '40vw';
    const rotation = random(this.config.rotationRange[0], this.config.rotationRange[1]);
    
    // Create media element based on type
    let mediaElement;
    
    if (visual.type === 'video') {
      // Video: optimized for performance (no controls, no sound, loop)
      mediaElement = document.createElement('video');
      mediaElement.src = visual.src;
      mediaElement.muted = true;                    // No sound for performance
      mediaElement.autoplay = true;                 // Auto-play
      mediaElement.loop = true;                     // Loop continuously
      mediaElement.playsInline = true;              // Play inline on mobile
      mediaElement.controls = false;                // No controls for clean look
      mediaElement.preload = 'metadata';            // Load metadata for poster
      mediaElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
      
      // Set poster image if provided
      if (visual.poster) {
        mediaElement.poster = visual.poster;
      }
      
      // Load and play video when it becomes visible
      mediaElement.load();
      mediaElement.play().catch(e => {});
      
    } else if (visual.type === 'gif') {
      // GIF: treat as image for optimal performance
      mediaElement = document.createElement('img');
      mediaElement.src = visual.src;
      mediaElement.alt = visual.alt || 'Key visual GIF';
      mediaElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
      
    } else {
      // Default: PNG/JPEG images
      mediaElement = document.createElement('img');
      mediaElement.src = visual.src;
      mediaElement.alt = visual.alt || 'Key visual';
      mediaElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
    }
    
    keyVisual.appendChild(mediaElement);
    
    // Set common styling with relative positioning within hero container
    keyVisual.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${displayWidth};
      aspect-ratio: ${visual.ratio};
      pointer-events: none;
    `;
    
    // Add source info attributes
    keyVisual.setAttribute('data-type', visual.type || 'image');
    keyVisual.setAttribute('data-ratio', visual.ratio || 'unknown');
    keyVisual.setAttribute('data-display-width', displayWidth);
    keyVisual.setAttribute('data-source-url', visual.src || '');
    
    // Set aspect ratio for proper container sizing
    const aspectRatio = visual.ratio.replace(':', ' / ');
    keyVisual.style.setProperty('--aspect-ratio', aspectRatio);

    // Set GSAP transform origin to center
    gsap.set(keyVisual, {
      transformOrigin: "50% 50%",
      xPercent: -50,
      yPercent: -50
    });

    this.overlay.appendChild(keyVisual);
    return keyVisual;
  }

  // Select key visual consecutively
  selectNextKeyVisual() {
    if (!this.collection || this.collection.length === 0) {
      return null;
    }

    // Simple consecutive selection
    const visual = this.collection[this.currentImageIndex];
    this.currentImageIndex = (this.currentImageIndex + 1) % this.collection.length;
    
    return visual;
  }

  // Animate key visual lifecycle
  animateKeyVisual(keyVisual) {
    if (this.config.reducedMotion) {
      // Simple fade for reduced motion
      gsap.set(keyVisual, { opacity: 1 });
      gsap.to(keyVisual, { 
        opacity: 0, 
        duration: 0.3, 
        delay: 1,
        onComplete: () => this.removeKeyVisual(keyVisual)
      });
      return;
    }

    // Set initial state
    gsap.set(keyVisual, { 
      scale: 0, 
      opacity: 0,
      rotation: 0
    });

    // Enter animation with GSAP
    gsap.to(keyVisual, {
      scale: 1,
      opacity: 1,
      rotation: random(-5, 5),
      duration: this.config.enterDuration,
      ease: "power2.out",
      onComplete: () => {
        setTimeout(() => {
          this.animateExit(keyVisual);
        }, this.config.dwellDuration);
      }
    });
  }

  // Animate key visual exit
  animateExit(keyVisual) {
    const driftX = random(-this.config.driftDistance * this.config.driftXMultiplier, this.config.driftDistance * this.config.driftXMultiplier);
    const driftY = random(100, this.config.driftDistance * 2);
    const rotation = random(-10, 10);

    // Start movement immediately
    gsap.to(keyVisual, {
      x: driftX,
      y: driftY,
      scale: 0.95,
      rotation: rotation,
      duration: this.config.exitDuration,
      ease: "power1.out"
    });

    // Fade out timing: starts after 40% of movement, takes 60% of total duration
    gsap.to(keyVisual, {
      opacity: 0,
      duration: this.config.exitDuration * 0.6, // Fade duration
      delay: this.config.exitDuration * 0.4,    // Fade delay
      ease: "power1.out",
      onComplete: () => {
        this.removeKeyVisual(keyVisual);
      }
    });
  }

  // Remove key visual from DOM and active list
  removeKeyVisual(keyVisual) {
    const index = this.activeKeyVisuals.indexOf(keyVisual);
    if (index > -1) {
      this.activeKeyVisuals.splice(index, 1);
    }
    
    if (keyVisual.parentNode) {
      keyVisual.parentNode.removeChild(keyVisual);
    }
  }

  // Get key visual collection info
  getCollectionInfo() {
    return this.collection.map((visual, index) => ({
      index,
      type: visual.type,
      src: visual.src,
      poster: visual.poster,
      alt: visual.alt,
      ratio: visual.ratio,
      weight: visual.weight,
      drop: visual.drop,
      order: visual.order,
      displayWidth: this.ratioDisplayWidths[visual.ratio] || '40vw'
    }));
  }

  // Cleanup all key visuals
  cleanup() {
    this.activeKeyVisuals.forEach(keyVisual => this.removeKeyVisual(keyVisual));
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}

//
//

// Initialize key visual collection
function initKeyVisualCollection(containerSelector = '#key-visual-container') {
  window.keyVisualCollection = new KeyVisualCollection(containerSelector);
  window.keyVisualCollection.init();
  return window.keyVisualCollection;
}

//
//

// Auto-initialize if container exists
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector('#key-visual-container') || document.querySelector('#pebble-container') || document.querySelector('#hero-container');
  if (container) {
    initKeyVisualCollection(container.id ? `#${container.id}` : '#key-visual-container');
  }
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (window.keyVisualCollection) {
    window.keyVisualCollection.cleanup();
  }
});