/**
 * Script Purpose: Hero Video Scroll Expand + Custom Controls
 * Author: Erlen Masson
 * Created: April 9, 2026
 * Version: 2.2.0
 * Last Updated: April 10, 2026
 */

console.log("Script - Hero Video v2.2.0");

//
//------- Config -------//
//
// All scroll values are % of viewport height (0–100), measured against the
// placeholder's top edge:
//   100 = placeholder just entering bottom of viewport
//    50 = placeholder at vertical center
//     0 = placeholder.top at very top of viewport

// What to morph
const videoSelector = ".hero-video-wrapper";

// Start size — desktop (≥768px)
const startW = 280;              // width in px
const startAspect = 16 / 9;      // width ÷ height (16:9 landscape, 9:16 portrait, 1 square)
const startRadius = 10;          // corner radius in px

// Start size — mobile (<768px)
const mobileStartW = 250;        // width in px
const mobileStartAspect = 16 / 9; // width ÷ height
const mobileCornerOffset = 16;   // distance from corner edge in px

// Start position
const corner = "bottom-right";   // "top-left" | "top-right" | "bottom-left" | "bottom-right"
const cornerOffset = 24;         // distance from the corner edge in px (desktop)

// Scroll timing (% of viewport height)
const morphStart = 100;           // morph begins (higher = starts later)
const morphEnd = 40;             // morph completes (closer to morphStart = faster morph)
const lockPosition = 15;         // wrapper hands off to flow here

// Smoothness
const scrubAmount = 0.9;         // scroll catch-up lag in seconds (0.1 = snappy, 2 = silky)

// Initial fade-in
const fadeInDelay = 1;           // seconds to wait before fade-in starts
const fadeInDuration = 2.5;        // fade-in duration in seconds

//
//------- State -------//
//

let wrapper = null;
let placeholder = null;
let originalParent = null;
let morphTween = null;
let snapTrigger = null;
let usesSmoother = false;
const morphProgress = { p: 0 };

let cornerTop = 0;
let cornerLeft = 0;
let targetTop = 0;
let targetLeft = 0;
let targetW = 0;
let targetH = 0;

//
//------- Utility Functions -------//
//

// Debounce
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Linear interpolate between a and b by progress t (0-1)
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Skip on reduced motion or missing libraries
function shouldSkip() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}

// Resolve start size based on viewport width.
// Height is derived from width ÷ aspect, so you only set one dimension.
function getStartSize() {
  const isMobile = window.innerWidth < 768;
  const w = isMobile ? mobileStartW : startW;
  const aspect = isMobile ? mobileStartAspect : startAspect;
  return {
    w,
    h: Math.round(w / aspect),
    offset: isMobile ? mobileCornerOffset : cornerOffset,
  };
}

// Resolve corner setting → top/left coordinates
function getCornerPos() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { w, h, offset } = getStartSize();
  const positions = {
    "top-left":     { top: offset,           left: offset },
    "top-right":    { top: offset,           left: vw - w - offset },
    "bottom-left":  { top: vh - h - offset,  left: offset },
    "bottom-right": { top: vh - h - offset,  left: vw - w - offset },
  };
  return positions[corner] || positions["bottom-right"];
}

//
//------- Main Functions -------//
//

// Create the shallow-cloned placeholder
function createPlaceholder() {
  placeholder = wrapper.cloneNode(false);
  placeholder.removeAttribute("id");
  placeholder.setAttribute("data-video-placeholder", "");
  placeholder.style.visibility = "hidden";
  placeholder.style.pointerEvents = "none";
  originalParent = wrapper.parentNode;
  originalParent.insertBefore(placeholder, wrapper);
}

// Recompute corner and in-flow target coordinates
function computeTargets() {
  const c = getCornerPos();
  cornerTop = c.top;
  cornerLeft = c.left;

  const rect = placeholder.getBoundingClientRect();
  targetTop = window.innerHeight * (lockPosition / 100);
  targetLeft = rect.left;
  targetW = rect.width;
  targetH = rect.height;
}

// Apply the corner state inline (plain CSS, no GSAP — paints on first frame)
function applyCornerState() {
  const { w, h } = getStartSize();
  wrapper.style.position = "fixed";
  wrapper.style.top = cornerTop + "px";
  wrapper.style.left = cornerLeft + "px";
  wrapper.style.bottom = "auto";
  wrapper.style.right = "auto";
  wrapper.style.width = w + "px";
  wrapper.style.height = h + "px";
  wrapper.style.borderRadius = startRadius + "px";
  wrapper.style.overflow = "hidden";
  wrapper.style.zIndex = "100";
  wrapper.style.opacity = "0";
}

// Build the scroll-driven morph
function buildMorph() {
  if (morphTween) {
    morphTween.scrollTrigger?.kill();
    morphTween.kill();
    morphTween = null;
  }
  if (snapTrigger) {
    snapTrigger.kill();
    snapTrigger = null;
  }

  // Tween a proxy progress value via scroll. The wrapper is mutated inside
  // onUpdate via manual lerp — no GSAP write to wrapper at construction time,
  // so the inline corner state stays painted until the user scrolls into range.
  morphProgress.p = 0;
  morphTween = gsap.to(morphProgress, {
    p: 1,
    ease: "none",
    scrollTrigger: {
      trigger: placeholder,
      start: `top ${morphStart}%`,
      end: `top ${morphEnd}%`,
      scrub: scrubAmount,
      invalidateOnRefresh: true,
      onRefresh: computeTargets,
    },
    onUpdate: () => {
      const p = morphProgress.p;
      const { w, h } = getStartSize();
      gsap.set(wrapper, {
        top: lerp(cornerTop, targetTop, p),
        left: lerp(cornerLeft, targetLeft, p),
        width: lerp(w, targetW, p),
        height: lerp(h, targetH, p),
        borderRadius: lerp(startRadius, 0, p),
      });
    },
  });

  snapTrigger = ScrollTrigger.create({
    trigger: placeholder,
    start: `top ${lockPosition}%`,
    onEnter: snapToFlow,
    onLeaveBack: returnToFixed,
  });
}

// Hand wrapper back to document flow
function snapToFlow() {
  if (usesSmoother && wrapper.parentNode !== originalParent) {
    originalParent.insertBefore(wrapper, placeholder);
  }
  placeholder.style.display = "none";
  wrapper.removeAttribute("style");
}

// Re-pin wrapper when scrolling back up past the snap
function returnToFixed() {
  placeholder.style.display = "";
  if (usesSmoother && wrapper.parentNode !== document.body) {
    document.body.appendChild(wrapper);
  }
  computeTargets();
  wrapper.style.position = "fixed";
  wrapper.style.top = targetTop + "px";
  wrapper.style.left = targetLeft + "px";
  wrapper.style.bottom = "auto";
  wrapper.style.right = "auto";
  wrapper.style.width = targetW + "px";
  wrapper.style.height = targetH + "px";
  wrapper.style.borderRadius = "0px";
  wrapper.style.overflow = "hidden";
  wrapper.style.zIndex = "100";
  wrapper.style.opacity = "1";
}

// Fade the wrapper in
function fadeIn() {
  gsap.to(wrapper, {
    opacity: 1,
    duration: fadeInDuration,
    delay: fadeInDelay,
    ease: "power2.out",
  });
}

// Wire up custom play/mute/fullscreen buttons inside the wrapper.
// Markup is provided by a Webflow embed box; styles live in css/hero-video.css.
function initVideoControls(wrapper) {
  const root = wrapper.querySelector(".hv-root");
  if (!root) return;
  const video = root.querySelector(".hv-video");
  const playBtn = root.querySelector("[data-hv-play]");
  const muteBtn = root.querySelector("[data-hv-mute]");
  const fsBtn = root.querySelector("[data-hv-fs]");
  if (!video || !playBtn || !muteBtn || !fsBtn) return;

  const ICONS = {
    play: `<div class="vdo-icon" data-icon="play"><svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M19 11.1357V12.8643L7.50391 20L6 19V5L7.50391 4L19 11.1357Z" fill="currentColor"></path></svg></div>`,
    pause: `<div class="vdo-icon" data-icon="pause"><svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M13 19V5H19V19H13ZM5 19V5H11V19H5ZM15 16C15 16.5523 15.4477 17 16 17C16.5523 17 17 16.5523 17 16V8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8V16ZM7 16C7 16.5523 7.44772 17 8 17C8.55228 17 9 16.5523 9 16V8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8V16Z" fill="currentColor"></path></svg></div>`,
    soundOn: `<div class="vdo-icon" data-icon="sound-on"><svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M14 2.98535C17.7763 4.24145 20.5 7.80184 20.5 12C20.5 16.1981 17.7761 19.7575 14 21.0137V18.873C16.6483 17.7155 18.5 15.0751 18.5 12C18.5 8.92479 16.6485 6.28347 14 5.12598V2.98535Z" fill="currentColor"></path><path d="M14 7.39062C15.5048 8.37203 16.5 10.0694 16.5 12C16.5 13.9304 15.5046 15.627 14 16.6084V7.39062Z" fill="currentColor"></path><path d="M12 20L6.66699 16H3V8H6.66699L12 4V20ZM7.33301 10H6C5.44772 10 5 10.4477 5 11V13C5 13.5523 5.44772 14 6 14H7.33301L9.20002 15.4001C9.52965 15.6473 10 15.4121 10 15.0001V8.99924C10 8.58718 9.52954 8.352 9.19993 8.5993L7.33301 10Z" fill="currentColor"></path></svg></div>`,
    soundOff: `<div class="vdo-icon" data-icon="sound-off"><svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.7031 21.2969L20.293 22.707L16.9707 19.3848C16.0951 20.0931 15.0921 20.6504 14 21.0137V18.873C14.5538 18.631 15.0714 18.3222 15.5459 17.96L12 14.4141V20L6.66699 16H3V8H5.58594L1.29297 3.70703L2.70312 2.29688L21.7031 21.2969ZM6 10C5.44772 10 5 10.4477 5 11V13C5 13.5523 5.44772 14 6 14H7.33301L9.2002 15.4004C9.52981 15.6473 10 15.4119 10 15V12.4141L7.58594 10H6Z" fill="currentColor"></path><path d="M14 2.98535C17.7763 4.24145 20.5 7.80184 20.5 12C20.5 13.5314 20.1356 14.9766 19.4912 16.2568L17.9795 14.7451C18.315 13.8952 18.5 12.9695 18.5 12C18.5 8.92479 16.6485 6.28347 14 5.12598V2.98535Z" fill="currentColor"></path><path d="M14 7.39062C15.5048 8.37203 16.5 10.0694 16.5 12C16.5 12.3925 16.4564 12.7747 16.3779 13.1436L14 10.7656V7.39062Z" fill="currentColor"></path><path d="M12 8.76562L9.27637 6.04199L12 4V8.76562Z" fill="currentColor"></path></svg></div>`,
    fullScreen: `<div class="vdo-icon" data-icon="full-screen"><svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 24 24" fill="none"><path d="M9.70703 15.707L6.26762 19.1464C5.95263 19.4614 6.17572 20 6.62117 20H9V22H2V15H4V17.3788C4 17.8243 4.53857 18.0474 4.85355 17.7324L8.29297 14.293L9.70703 15.707ZM19.1464 17.7324C19.4614 18.0474 20 17.8243 20 17.3788V15H22V22H15V20H17.3788C17.8243 20 18.0474 19.4614 17.7324 19.1464L14.293 15.707L15.707 14.293L19.1464 17.7324ZM9 2V4H6.62117C6.17572 4 5.95263 4.53857 6.26762 4.85355L9.70703 8.29297L8.29297 9.70703L4.85355 6.26762C4.53857 5.95263 4 6.17572 4 6.62117V9H2V2H9ZM22 9H20V6.62117C20 6.17572 19.4614 5.95263 19.1464 6.26762L15.707 9.70703L14.293 8.29297L17.7324 4.85355C18.0474 4.53857 17.8243 4 17.3788 4H15V2H22V9Z" fill="currentColor"></path></svg></div>`,
  };

  // Make sure the fullscreen button always shows the right icon
  fsBtn.innerHTML = ICONS.fullScreen;

  // Sync initial play/mute icons with the actual video state (handles autoplay-blocked tabs)
  playBtn.innerHTML = video.paused ? ICONS.play : ICONS.pause;
  playBtn.setAttribute("aria-label", video.paused ? "Play" : "Pause");
  muteBtn.innerHTML = video.muted ? ICONS.soundOff : ICONS.soundOn;
  muteBtn.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");

  // Play / pause
  playBtn.addEventListener("click", () => {
    if (video.paused) video.play();
    else video.pause();
  });
  video.addEventListener("play", () => {
    playBtn.innerHTML = ICONS.pause;
    playBtn.setAttribute("aria-label", "Pause");
  });
  video.addEventListener("pause", () => {
    playBtn.innerHTML = ICONS.play;
    playBtn.setAttribute("aria-label", "Play");
  });

  // Mute / unmute
  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted ? ICONS.soundOff : ICONS.soundOn;
    muteBtn.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");
  });

  // Fullscreen (with iOS Safari fallback on the <video> itself)
  fsBtn.addEventListener("click", () => {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsEl) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    if (root.requestFullscreen) root.requestFullscreen();
    else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  });
}

// Init the video expand
function initVideo() {
  if (shouldSkip()) return;

  wrapper = document.querySelector(videoSelector);
  if (!wrapper) return;

  gsap.registerPlugin(ScrollTrigger);

  const smoother = typeof ScrollSmoother !== "undefined" ? ScrollSmoother.get() : null;
  usesSmoother = !!smoother;

  createPlaceholder();
  if (usesSmoother) document.body.appendChild(wrapper);

  computeTargets();
  applyCornerState();
  buildMorph();
  fadeIn();
  initVideoControls(wrapper);
}

// Rebuild on resize (debounced)
function handleResize() {
  if (!wrapper || !placeholder) return;
  computeTargets();

  // Re-apply current state with fresh targets, only if wrapper is still fixed
  if (morphTween && wrapper.style.position === "fixed") {
    const p = morphTween.progress();
    const { w, h } = getStartSize();
    wrapper.style.top = lerp(cornerTop, targetTop, p) + "px";
    wrapper.style.left = lerp(cornerLeft, targetLeft, p) + "px";
    wrapper.style.width = lerp(w, targetW, p) + "px";
    wrapper.style.height = lerp(h, targetH, p) + "px";
    wrapper.style.borderRadius = lerp(startRadius, 0, p) + "px";
    if (wrapper.style.opacity === "0") wrapper.style.opacity = "1";
  }

  ScrollTrigger.refresh();
  const smoother = typeof ScrollSmoother !== "undefined" ? ScrollSmoother.get() : null;
  if (smoother) smoother.effects();
}

//
//------- Initialize -------//
//

document.addEventListener("DOMContentLoaded", () => {
  initVideo();
  window.addEventListener("resize", debounce(handleResize, 200));
});
