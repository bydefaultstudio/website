/**
 * Script Purpose: Key Visual Collection Spawner
 * Author: Erlen Masson
 * Created: 2024-12-19
 * Version: 1.0.0
 * Last Updated: 2024-12-19
 */

console.log("Script v1.0 — Key Visual Collection Loaded");

//
//------- Utility Functions -------//
//

// Random number between min and max
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

//
//------- Key Visual Collection System -------//
//

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
    
    // Animation configs - will be set responsively
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
    
    console.log("Key Visual Collection initialized");
  }

  // Create the fixed overlay for key visuals
  createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'key-visual-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1000;
      overflow: hidden;
    `;
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  // Check if device is mobile
  isMobile() {
    return window.innerWidth <= 768;
  }

  // Get responsive animation config based on screen size
  getResponsiveConfig() {
    if (this.isMobile()) {
      // Mobile: faster animations, less movement, more conservative
      return {
        enterDuration: 0.3,        // Faster entrance on mobile
        dwellDuration: 3000,        // Shorter dwell on mobile
        exitDuration: 0.8,         // Faster exit on mobile
        scaleRange: [0.95, 1.05],  // Less dramatic scaling
        rotationRange: [-3, 3],    // Less rotation on mobile
        driftDistance: 20,         // Very short drift distance
        driftXMultiplier: 0.05,    // Much less X movement on mobile
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      };
    } else {
      // Desktop: original settings
      return {
        enterDuration: 0.4,
        dwellDuration: 3000,
        exitDuration: 3.0,
        scaleRange: [0.9, 1.1],
        rotationRange: [-5, 5],
        driftDistance: 30,
        driftXMultiplier: 0.1,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      };
    }
  }

  // Get responsive display widths based on screen size
  getResponsiveDisplayWidths() {
    if (this.isMobile()) {
      // Mobile: larger widths to fill screen better
      return {
        '16:9': '70vw',  // Landscape - larger on mobile
        '4:5': '50vw',   // Portrait - medium width
        '1:1': '55vw',   // Square - medium width
        '2:1': '70vw',   // Ultra-wide landscape - larger
        '9:16': '45vw'   // Ultra-tall portrait - smaller
      };
    } else {
      // Desktop: original widths
      return {
        '16:9': '50vw',  // Landscape - larger width
        '4:5': '35vw',   // Portrait - smaller width
        '1:1': '40vw',   // Square - medium width
        '2:1': '50vw',   // Ultra-wide landscape - extra large width
        '9:16': '30vw'   // Ultra-tall portrait - smaller width
      };
    }
  }

  // Load the curated collection of key visuals
  loadCollection() {
    // Get responsive display widths
    this.ratioDisplayWidths = this.getResponsiveDisplayWidths();

    // Curated collection of key visuals with varied dimensions and asset types
    this.collection = [
      { 
        type: 'image', 
        src: 'https://placehold.co/1920x1080/094C45/B6D6A5?text=PNG', 
        ratio: '16:9'
      },
      { 
        type: 'gif', 
        src: 'https://placehold.co/1200x1500/F7A3BC/2B2B2B?text=GIF', 
        ratio: '4:5'
      },
      { 
        type: 'video', 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
        ratio: '16:9'
      },
      { 
        type: 'image', 
        src: 'https://placehold.co/1080x1080/FFB533/2B2B2B?text=PNG', 
        ratio: '1:1'
      },
      { 
        type: 'video', 
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
        ratio: '16:9'
      },
      { 
        type: 'image', 
        src: 'https://placehold.co/900x1600/094C45/B6D6A5?text=PNG', 
        ratio: '9:16'
      }
    ];
  }

  // Setup event listeners
  setupEventListeners() {
    const debouncedSpawn = debounce((e) => this.spawnKeyVisual(e), this.spawnCooldown);
    
    // Mouse events
    this.container.addEventListener('click', debouncedSpawn);
    
    // Touch events for mobile
    this.container.addEventListener('touchstart', (e) => {
      e.preventDefault();
      debouncedSpawn(e.touches[0]);
    }, { passive: false });
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
        console.log('📱 Responsive settings updated for', this.isMobile() ? 'mobile' : 'desktop');
      }, 150); // Debounce resize events
    });
  }

  // Spawn a key visual at the click position
  spawnKeyVisual(event) {
    if (!this.isInitialized || this.activeKeyVisuals.length >= this.maxKeyVisuals) return;
    
    const now = Date.now();
    if (now - this.lastSpawnTime < this.spawnCooldown) return;
    this.lastSpawnTime = now;

    const rect = this.container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Don't spawn too close to edges
    if (x < 50 || x > rect.width - 50 || y < 50 || y > rect.height - 50) return;

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
      mediaElement.preload = 'none';                // Don't preload until needed
      mediaElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
      
      // Load and play video when it becomes visible
      mediaElement.load();
      mediaElement.play().catch(e => console.log('Video autoplay prevented:', e));
      
    } else if (visual.type === 'gif') {
      // GIF: treat as image for optimal performance
      mediaElement = document.createElement('img');
      mediaElement.src = visual.src;
      mediaElement.alt = `Key visual GIF`;
      mediaElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
      
    } else {
      // Default: PNG/JPEG images
      mediaElement = document.createElement('img');
      mediaElement.src = visual.src;
      mediaElement.alt = `Key visual`;
      mediaElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
    }
    
    keyVisual.appendChild(mediaElement);
    
    // Set common styling
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

    // Set GSAP transform origin to center
    gsap.set(keyVisual, {
      transformOrigin: "50% 50%",
      xPercent: -50,
      yPercent: -50
    });

    this.overlay.appendChild(keyVisual);
    return keyVisual;
  }

  // Select next key visual from collection consecutively
  selectNextKeyVisual() {
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
      ease: "power.out",
      onComplete: () => {
        // Dwell then exit
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

    gsap.to(keyVisual, {
      x: driftX,
      y: driftY,
      scale: 0.95,
      rotation: rotation,
      opacity: 0,
      duration: this.config.exitDuration,
      ease: "power4.out",
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
      ratio: visual.ratio,
      displayWidth: this.ratioDisplayWidths[visual.ratio] || '40vw',
      url: visual.src
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
//------- Main Functions -------//
//

// Initialize key visual collection
function initKeyVisualCollection(containerSelector = '#key-visual-container') {
  window.keyVisualCollection = new KeyVisualCollection(containerSelector);
  window.keyVisualCollection.init();
  return window.keyVisualCollection;
}

//
//------- Initialize -------//
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
