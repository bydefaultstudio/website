/**
 * Script Purpose: TextAnimations
 * Author: Erlen Masson
 * Version: 3.4
 * Created: 5 Feb 2025
 * Last Updated: 2nd July 2025
 */

console.log("ByDefault Text Animations v3.4 - ByDefault Animation Attributes");

// ------- Configurable Parameters ------- //
function getFadeStart() {
  return window.innerWidth < 768 ? "top 100%" : "top 85%";
}

function getFadeEnd() {
  return window.innerWidth < 768 ? "top 60%" : "bottom 75%";
}

function getFadeEndChars() {
  return window.innerWidth < 768 ? "top 50%" : "bottom 75%";
}

const animationStagger = { chars: 0.05, words: 0.1, lines: 0.15 };
const debounceTimeout = 150;

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let splitTextInstances = [];

//
//------- Animations -------//
//

function textAnimations() {
  // Select all elements with animation attributes (canonical + aliases)
  const animatedElements = document.querySelectorAll("[data-bd-animate], [data-anim], [data-text-animate]");

  animatedElements.forEach((element) => {
    // Set the aria-label attribute to the original text
    element.setAttribute("aria-label", element.textContent);
  });

  // New base text animations (fade/slide) - v3.4 ByDefault Animation Attributes
  baseTextAnimations();
  
  fadeCharacters();
  fadeWords();
  fadeLines();
  fadeRichText();
  fadeElements();
  fadeList();
  // New Animations
  slideUp();
  slideDown();
  slideFromLeft();
  slideFromRight();
  scaleIn();
  rotateIn();
  expandSpacing();
  skewText();
  flipText();
  // New Animations
  fadeInOut();
  blurIn();
  bounceIn();
  shakeText();
  flashText();
  tiltText();
  neonText();
  fadeInViewport();
}

function getScrubValue(element) {
  // Check canonical attribute first
  let scrubAttr = element.getAttribute("data-bd-scrub");
  if (!scrubAttr) {
    // Check generic alias
    scrubAttr = element.getAttribute("data-scrub");
  }
  if (!scrubAttr) {
    // Check legacy text attribute
    scrubAttr = element.getAttribute("data-text-scrub");
  }
  
  if (!scrubAttr) {
    return undefined; // No scrub
  }
  
  // If attribute exists but string is empty, treat as "true"
  if (scrubAttr === "") {
    return true;
  }
  
  // Check for "true" (case-insensitive)
  if (scrubAttr.toLowerCase() === "true") {
    return true;
  }
  
  // Check for numeric value
  const numericValue = parseFloat(scrubAttr);
  if (!isNaN(numericValue) && numericValue > 0) {
    // Clamp to minimum 0.1 for smoothness
    return Math.max(numericValue, 0.1);
  }
  
  // Invalid value, treat as absent
  return undefined;
}

// Get delay value with precedence: data-bd-delay > data-delay > data-text-delay
function getDelayValue(element, defaultDelay = 0) {
  // Check canonical attribute first
  let delayAttr = element.getAttribute("data-bd-delay");
  if (!delayAttr) {
    // Check generic alias
    delayAttr = element.getAttribute("data-delay");
  }
  if (!delayAttr) {
    // Check legacy text attribute
    delayAttr = element.getAttribute("data-text-delay");
  }
  
  if (!delayAttr) {
    return defaultDelay; // Default delay
  }
  
  const delayValue = parseFloat(delayAttr);
  
  // If NaN or negative, use default delay
  if (isNaN(delayValue) || delayValue < 0) {
    return defaultDelay;
  }
  
  return delayValue;
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Base text animations for simple fade/slide effects (v3.4 - ByDefault Animation Attributes)
function baseTextAnimations() {
  // Kill existing ScrollTriggers for fade/slide elements to prevent duplicates
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger?.matches("[data-bd-animate='fade'], [data-bd-animate='slide'], [data-anim='fade'], [data-anim='slide'], [data-text-animate='fade'], [data-text-animate='slide']")) {
      trigger.kill();
    }
  });
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  // Select all elements with animation attributes (new canonical + aliases)
  const allAnimatedElements = document.querySelectorAll("[data-bd-animate], [data-anim], [data-text-animate]");
  
  // Filter to only "fade" and "slide" types, ignoring SplitText-driven animations
  const fadeEls = [];
  const slideEls = [];
  let legacyAttributeDetected = false;
  
  allAnimatedElements.forEach((element) => {
    // Parse animation type with precedence: data-bd-animate > data-anim > data-text-animate
    const animationType = getAnimationType(element);
    
    if (animationType === "fade") {
      fadeEls.push(element);
    } else if (animationType === "slide") {
      slideEls.push(element);
    }
    
    // Track if legacy attributes are being used (for optional console message)
    if (element.hasAttribute("data-text-animate") || element.hasAttribute("data-anim")) {
      legacyAttributeDetected = true;
    }
  });
  
  // Optional: One-time console info message when legacy attributes are detected
  if (legacyAttributeDetected && !window.byDefaultLegacyWarningShown) {
    console.info("ByDefault Animations v3.4: Legacy attributes detected. Consider migrating to data-bd-* namespace for future compatibility.");
    window.byDefaultLegacyWarningShown = true;
  }
  
  // Handle reduced motion - just reveal elements without animation
  if (prefersReducedMotion) {
    [...fadeEls, ...slideEls].forEach((element) => {
      gsap.set(element, { opacity: 1, clearProps: "transform,filter" });
    });
    return; // Don't create ScrollTriggers for reduced motion
  }
  
  // Process fade elements
  fadeEls.forEach((element) => {
    const scrubValue = parseScrubValue(element);
    const delayValue = parseDelayValue(element);
    
    gsap.set(element, { opacity: 0 });
    
    const tweenConfig = {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      delay: delayValue,
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd()
      }
    };
    
    // Only add scrub if it's provided
    if (scrubValue !== null) {
      tweenConfig.scrollTrigger.scrub = scrubValue;
    }
    
    gsap.to(element, tweenConfig);
  });
  
  // Process slide elements
  slideEls.forEach((element) => {
    const scrubValue = parseScrubValue(element);
    const delayValue = parseDelayValue(element);
    
    gsap.set(element, { opacity: 0, y: 40 });
    
    const tweenConfig = {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: delayValue,
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd()
      }
    };
    
    // Only add scrub if it's provided
    if (scrubValue !== null) {
      tweenConfig.scrollTrigger.scrub = scrubValue;
    }
    
    gsap.to(element, tweenConfig);
  });
}

// Parse animation type with precedence: data-bd-animate > data-anim > data-text-animate
function getAnimationType(element) {
  // Check canonical attribute first
  let animationType = element.getAttribute("data-bd-animate");
  if (animationType) return animationType;
  
  // Check generic alias
  animationType = element.getAttribute("data-anim");
  if (animationType) return animationType;
  
  // Check legacy text attribute
  animationType = element.getAttribute("data-text-animate");
  if (animationType) return animationType;
  
  return null;
}

// Parse scrub value with precedence: data-bd-scrub > data-scrub > data-text-scrub
function parseScrubValue(element) {
  // Check canonical attribute first
  let scrubAttr = element.getAttribute("data-bd-scrub");
  if (!scrubAttr) {
    // Check generic alias
    scrubAttr = element.getAttribute("data-scrub");
  }
  if (!scrubAttr) {
    // Check legacy text attribute
    scrubAttr = element.getAttribute("data-text-scrub");
  }
  
  if (!scrubAttr) {
    return null; // No scrub
  }
  
  // If attribute exists but string is empty, treat as "true"
  if (scrubAttr === "") {
    return true;
  }
  
  // Check for "true" (case-insensitive)
  if (scrubAttr.toLowerCase() === "true") {
    return true;
  }
  
  // Check for numeric value
  const numericValue = parseFloat(scrubAttr);
  if (!isNaN(numericValue) && numericValue > 0) {
    // Clamp to minimum 0.1 for smoothness
    return Math.max(numericValue, 0.1);
  }
  
  // Invalid value, treat as absent
  return null;
}

// Parse delay value with precedence: data-bd-delay > data-delay > data-text-delay
function parseDelayValue(element) {
  // Check canonical attribute first
  let delayAttr = element.getAttribute("data-bd-delay");
  if (!delayAttr) {
    // Check generic alias
    delayAttr = element.getAttribute("data-delay");
  }
  if (!delayAttr) {
    // Check legacy text attribute
    delayAttr = element.getAttribute("data-text-delay");
  }
  
  if (!delayAttr) {
    return 0; // Default delay
  }
  
  const delayValue = parseFloat(delayAttr);
  
  // If NaN or negative, use default delay of 0
  if (isNaN(delayValue) || delayValue < 0) {
    return 0;
  }
  
  return delayValue;
}

// Fade in elements that are already in viewport
function fadeInViewport() {
  gsap.utils.toArray("[data-text-animate='in-view']").forEach((element) => {
    if (isInViewport(element)) {
      gsap.set(element, { opacity: 0 });
      gsap.to(element, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay: getDelayValue(element, 0)
      });
    }
  });
}

// Fade by Characters
function fadeCharacters() {
  splitTextInstances.forEach((instance) => instance.revert());
  splitTextInstances = [];

  gsap.utils.toArray("[data-text-animate='chars']").forEach((element) => {
    const split = new SplitText(element, { type: "chars", tag: "span" });
    splitTextInstances.push(split);
    gsap.set(split.chars, { opacity: 0 });

    gsap.to(split.chars, {
      opacity: 1,
      ease: "power1.inOut",
      stagger: animationStagger.chars,
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEndChars(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Fade by Words
function fadeWords() {
  gsap.utils.toArray("[data-text-animate='words']").forEach((element) => {
    const split = new SplitText(element, { type: "words", tag: "span" });
    splitTextInstances.push(split);
    gsap.set(split.words, { opacity: 0 });

    gsap.to(split.words, {
      opacity: 1,
      ease: "power1.inOut",
      stagger: animationStagger.words,
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Fade by Lines
function fadeLines() {
  gsap.utils.toArray("[data-text-animate='lines']").forEach((element) => {
    const split = new SplitText(element, { type: "lines" });
    splitTextInstances.push(split);
    gsap.set(split.lines, { opacity: 0 });

    gsap.to(split.lines, {
      opacity: 1,
      ease: "power1.inOut",
      stagger: animationStagger.lines,
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Fade by Rich Text Lines
function fadeRichText() {
  gsap.utils
    .toArray("[data-text-animate='rich-text']")
    .forEach((richTextElement) => {
      const elements = richTextElement.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, span, strong, em, a, ul, ol, li, blockquote, figure"
      );
      if (elements.length === 0)
        return console.warn("No rich text elements found for animation.");

      elements.forEach((element) => {
        const split = new SplitText(element, { type: "lines", tag: "span" });
        splitTextInstances.push(split);
        gsap.set(split.lines, { opacity: 0 });

        gsap.to(split.lines, {
          opacity: 1,
          ease: "power1.inOut",
          stagger: animationStagger?.lines || 0.1,
          scrollTrigger: {
            trigger: element,
            start: getFadeStart(),
            end: getFadeEnd(),
            scrub: getScrubValue(richTextElement),
          },
        });
      });
    });
}

// Fade by Individual Elements
function fadeElements() {
  gsap.utils.toArray("[data-text-animate='element']").forEach((element) => {
    gsap.set(element, { opacity: 0, y: 0 });
    gsap.to(element, {
      opacity: 1,
      ease: "power2.inOut",
      y: 0,
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        end: "top 60%",
        scrub: getScrubValue(element),
      },
    });
  });
}

// Fade by List Items
function fadeList() {
  gsap.utils.toArray("[data-text-animate='list']").forEach((list) => {
    const items = gsap.utils.toArray(list.querySelectorAll("li"));
    if (items.length === 0)
      return console.warn("No list items found for animation.");

    gsap.set(items, { opacity: 0 });
    gsap.to(items, {
      opacity: 1,
      stagger: 0.2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: list,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(list),
      },
    });
  });
}

// Slide Up Animation
function slideUp() {
  gsap.utils.toArray("[data-text-animate='slide-up']").forEach((element) => {
    gsap.set(element, { opacity: 0, y: 50 });

    gsap.to(element, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Slide Down Animation
function slideDown() {
  gsap.utils.toArray("[data-text-animate='slide-down']").forEach((element) => {
    gsap.set(element, { opacity: 0, y: -50 });

    gsap.to(element, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Slide From Left Animation
function slideFromLeft() {
  gsap.utils.toArray("[data-text-animate='slide-left']").forEach((element) => {
    gsap.set(element, { opacity: 0, x: -50 });

    gsap.to(element, {
      opacity: 1,
      x: 0,
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Slide From Right Animation
function slideFromRight() {
  gsap.utils.toArray("[data-text-animate='slide-right']").forEach((element) => {
    gsap.set(element, { opacity: 0, x: 50 });

    gsap.to(element, {
      opacity: 1,
      x: 0,
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Scale In Animation
function scaleIn() {
  gsap.utils.toArray("[data-text-animate='scale-in']").forEach((element) => {
    gsap.set(element, { opacity: 0, scale: 0.8 });

    gsap.to(element, {
      opacity: 1,
      scale: 1,
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Rotate In Animation
function rotateIn() {
  gsap.utils.toArray("[data-text-animate='rotate-in']").forEach((element) => {
    gsap.set(element, { opacity: 0, rotate: -15 });
    gsap.to(element, {
      opacity: 1,
      rotate: 0,
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Expand Letter Spacing Animation
function expandSpacing() {
  gsap.utils
    .toArray("[data-text-animate='expand-spacing']")
    .forEach((element) => {
      gsap.set(element, { opacity: 0, letterSpacing: "-2px" });
      gsap.to(element, {
        opacity: 1,
        letterSpacing: "normal",
        ease: "power2.out",
        delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
      });
    });
}

// Skew Text Animation
function skewText() {
  gsap.utils.toArray("[data-text-animate='skew']").forEach((element) => {
    gsap.set(element, { opacity: 0, skewX: "15deg" });
    gsap.to(element, {
      opacity: 1,
      skewX: "0deg",
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Flip Text Animation
function flipText() {
  gsap.utils.toArray("[data-text-animate='flip']").forEach((element) => {
    gsap.set(element, { opacity: 0, rotateX: -90 });
    gsap.to(element, {
      opacity: 1,
      rotateX: 0,
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// New Animations

// Fade In and Out Animation
function fadeInOut() {
  gsap.utils.toArray("[data-text-animate='fade-in-out']").forEach((element) => {
    gsap.set(element, { opacity: 0 });
    gsap.to(element, {
      opacity: 1,
      ease: "power2.inOut",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Blur In Animation
function blurIn() {
  gsap.utils.toArray("[data-text-animate='blur-in']").forEach((element) => {
    gsap.set(element, { opacity: 0, filter: "blur(10px)" });
    gsap.to(element, {
      opacity: 1,
      filter: "blur(0px)",
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Bounce In Animation
function bounceIn() {
  gsap.utils.toArray("[data-text-animate='bounce-in']").forEach((element) => {
    gsap.set(element, { opacity: 0, y: 50 });

    gsap.to(element, {
      opacity: 1,
      y: 0,
      ease: "bounce.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Shake Animation
function shakeText() {
  gsap.utils.toArray("[data-text-animate='shake']").forEach((element) => {
    gsap.set(element, { x: 0 }); // Ensures the element starts at its original position
    gsap.to(element, {
      x: "+=10",
      repeat: 5,
      yoyo: true,
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Flashing Text Animation
function flashText() {
  gsap.utils.toArray("[data-text-animate='flash']").forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0 },
      {
        opacity: 1,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: "power2.out",
      }
    );
  });
}

// Neon Glow Flicker (Cyberpunk Style)
function neonText() {
  gsap.utils.toArray("[data-text-animate='neon']").forEach((element) => {
    gsap.fromTo(
      element,
      { textShadow: "0px 0px 5px #fff, 0px 0px 10px #09F", opacity: 0.5 },
      {
        textShadow: "0px 0px 10px #fff, 0px 0px 20px #09F",
        opacity: 1,
        repeat: -1,
        yoyo: true,
        duration: 0.2,
        ease: "power2.inOut",
      }
    );
  });
}

// 3D Perspective Tilt Animation
function tiltText() {
  gsap.utils.toArray("[data-text-animate='tilt']").forEach((element) => {
    gsap.set(element, { rotateY: 90, opacity: 0 });

    gsap.to(element, {
      rotateY: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      delay: getDelayValue(element),
      scrollTrigger: {
        trigger: element,
        start: getFadeStart(),
        end: getFadeEnd(),
        scrub: getScrubValue(element),
      },
    });
  });
}

// Ensure fonts are loaded before running animations
document.fonts.ready
  .then(function () {
    console.log("Fonts loaded successfully");
    textAnimations();
  })
  .catch(function () {
    console.error("Font loading error");
  });

//
//------- Resize Handling -------//
//

// Debounce function to throttle the resize event handler
function debounce(func) {
  var timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 150, event); // 150ms seems like a good sweetspot
  };
}

// Optional: Define the resize event handling logic
function handleResize() {
  console.log("Window resized, refreshing animations");

  // Revert SplitText instances
  splitTextInstances.forEach((instance) => instance.revert());

  // Refresh ScrollTrigger
  ScrollTrigger.refresh();

  // Re-initialize the fade animations on resize
  textAnimations();
}

// Optional: Add event listener for window resize if needed
function addResizeListener() {
  window.addEventListener("resize", debounce(handleResize));
}
