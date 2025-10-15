console.log("Hero Physics - Interactive Shapes v3");
// Hero Physics global variables - use window object to prevent conflicts
window.heroPhysics = window.heroPhysics || {};
window.heroPhysics.engine = null;
window.heroPhysics.render = null;
window.heroPhysics.runner = null;
window.heroPhysics.shapes = null;
window.heroPhysics.walls = null;
window.heroPhysics.mouse = null;
window.heroPhysics.mouseConstraint = null;
window.heroPhysics.initialStates = new WeakMap();
window.heroPhysics.score = 0;
window.heroPhysics.won = false;
window.heroPhysics.userHasInteracted = false;
window.heroPhysics.interactionWindowUntil = 0;
window.heroPhysics.lastScoredPair = new Map();
window.heroPhysics.lastSound = new WeakMap();
window.heroPhysics.isDragging = false;
window.heroPhysics.currentScale = 1;
window.heroPhysics.audioCtx = null;
window.heroPhysics.soundEnabled = JSON.parse(
  localStorage.getItem("heroSound") ?? "true"
);
window.heroPhysics.isInitialized = false;

// Hero Physics initialization function
function initHeroPhysics() {
  if (window.heroPhysics.isInitialized) {
    console.log("Hero Physics already initialized, skipping...");
    return;
  }

  const container = document.getElementById("hero-physics-canvas");
  if (!container) {
    console.log("Hero Physics container not found, skipping initialization...");
    return;
  }

  console.log("Hero Physics initializing...");

  if (window.heroPhysics.engine) {
    try {
      Matter.Runner.stop(window.heroPhysics.runner);
      Matter.Render.stop(window.heroPhysics.render);
      Matter.Engine.clear(window.heroPhysics.engine);
    } catch (e) {
      console.log("Hero Physics cleanup completed");
    }
  }

  const {
    Engine,
    Render,
    Runner,
    Bodies,
    Composite,
    Mouse,
    MouseConstraint,
    Svg,
  } = Matter;

  window.heroPhysics.engine = Engine.create();
  window.heroPhysics.render = Render.create({
    element: container,
    engine: window.heroPhysics.engine,
    options: {
      width: innerWidth,
      height: innerHeight,
      wireframes: false,
      background: "#f5f6f8",
    },
  });
  Render.run(window.heroPhysics.render);
  // FIXED-STEP RUNNER → avoids maxUpdates catch-up on resume and creates slower, more controlled physics
  window.heroPhysics.runner = Runner.create({ 
    isFixed: true, 
    delta: 1000/60  // 60 FPS fixed timestep
  });
  Runner.run(window.heroPhysics.runner, window.heroPhysics.engine);

  // Initialize shapes - responsive positioning for mobile
  window.heroPhysics.shapes = [
    bodyFromPath("shape1", innerWidth * 0.25, innerHeight * 0.25, "#094C45", "one", "#news"),
    bodyFromPath("shape2", innerWidth * 0.5, innerHeight * 0.3, "#F7A3BC", "two", "#founders"),
    bodyFromPath("shape3", innerWidth * 0.75, innerHeight * 0.3, "#FFB533", "three", "#work"),
    bodyFromPath("shape4", innerWidth * 0.15, innerHeight * 0.15, "#88D3CD", "four", "#about"),
  ];
  Composite.add(window.heroPhysics.engine.world, window.heroPhysics.shapes);

  // Capture initial states
  window.heroPhysics.shapes.forEach(captureInitialState);

  // Create walls
  window.heroPhysics.walls = createWalls();
  Composite.add(window.heroPhysics.engine.world, window.heroPhysics.walls);

  // Setup mouse interaction
  window.heroPhysics.mouse = Mouse.create(window.heroPhysics.render.canvas);
  window.heroPhysics.mouseConstraint = MouseConstraint.create(
    window.heroPhysics.engine,
    {
      mouse: window.heroPhysics.mouse,
      constraint: {
        stiffness: 0.15,
        angularStiffness: 0.15,
        damping: 0.7,  // Higher damping to slow down drag-drop to match initial drop
        render: { visible: false },
      },
    }
  );
  Composite.add(window.heroPhysics.engine.world, window.heroPhysics.mouseConstraint);
  window.heroPhysics.render.mouse = window.heroPhysics.mouse;

  // Setup event listeners
  setupHeroEventListeners();

  // Add logo sprite
  addLogoSprite();

  // Responsive scaling
  setupResponsiveHandling();

  // Score + modal + sound + labels
  initScoreSystem();
  initModalSystem();
  initSoundSystem();
  startLabelDrawing();

  // Mark as initialized
  window.heroPhysics.isInitialized = true;
  console.log("Hero Physics initialized successfully");
}

// Logo as interactive shape using SVG path with poly-decomp
function addLogoSprite() {
  // Enable poly-decomp for concave shape decomposition
  if (typeof decomp !== 'undefined') {
    Matter.Common.setDecomp(decomp);
  }
  
  // Get the SVG path from the hidden SVG element
  const logoPath = document.getElementById('logo-shape');
  if (!logoPath) {
    console.error('Logo SVG path not found');
    return;
  }
  
  // Convert SVG path to vertices using Matter.js SVG utilities
  let logoVertices;
  try {
    logoVertices = Matter.Svg.pathToVertices(logoPath, 3);
    
    // SVG viewBox reference frame: (0 0 420 202)
    // Center the vertices around (0,0) using viewBox center
    const viewBoxCenterX = 420 / 2; // 210
    const viewBoxCenterY = 202 / 2; // 101
    
    logoVertices = logoVertices.map(vertex => ({
      x: vertex.x - viewBoxCenterX, // Center around (0,0)
      y: vertex.y - viewBoxCenterY
    }));
    
    console.log('SVG vertices centered using viewBox:', logoVertices.length, 'points');
    console.log('ViewBox center used:', { x: viewBoxCenterX, y: viewBoxCenterY });
  } catch (error) {
    console.error('Failed to convert SVG path to vertices:', error);
    // Fallback to simple rectangle if SVG conversion fails
    logoVertices = [
      { x: -50, y: -25 }, { x: 50, y: -25 },
      { x: 50, y: 25 }, { x: -50, y: 25 }
    ];
  }
  
  // Create logo body with polygon collider and poly-decomp
  const logo = Matter.Bodies.fromVertices(
    600, // x position (center of canvas)
    140, // y position (center of canvas)
    logoVertices,
    {
      restitution: 0.6,
      frictionAir: 0.02,
      render: { 
        fillStyle: "transparent", // Dark background to see collision area
        strokeStyle: "transparent"
      },
      label: "logo"
    },
    true // Enable poly-decomp decomposition for concave shapes
  );
  
  console.log('Logo body created with SVG path and poly-decomp');
  
  // Store logo reference for afterRender overlay
  window.heroPhysics.logoBody = logo;
  
  // Load logo image for afterRender overlay
  const logoImage = new Image();
  logoImage.onload = function() {
    window.heroPhysics.logoImage = logoImage;
    console.log('Logo image loaded for afterRender overlay');
  };
  logoImage.src = "https://cdn.prod.website-files.com/68e2be176459e98837a31ed9/68eec956451541e7cfc33ab9_logo_bydefault_primary.svg";
  
  window.heroPhysics.shapes.push(logo);
  Matter.Composite.add(window.heroPhysics.engine.world, logo);
  captureInitialState(logo);
}
// End of logo sprite

// Cleanup
function cleanupHeroPhysics() {
  console.log("cleanupHeroPhysics called");
  if (window.heroPhysics.engine) {
    try {
      Matter.Runner.stop(window.heroPhysics.runner);
      Matter.Render.stop(window.heroPhysics.render);
      Matter.Engine.clear(window.heroPhysics.engine);
      window.heroPhysics.engine = null;
      window.heroPhysics.render = null;
      window.heroPhysics.runner = null;
      window.heroPhysics.shapes = null;
      window.heroPhysics.walls = null;
      window.heroPhysics.mouse = null;
      window.heroPhysics.mouseConstraint = null;
      window.heroPhysics.isInitialized = false;
      console.log("Hero Physics cleanup completed");
    } catch (e) {
      console.log("Hero Physics cleanup completed with errors:", e);
    }
  } else {
    console.log("No Hero Physics engine to cleanup");
  }
}

// Sound
function heroEnsureAudio() {
  if (!window.heroPhysics.soundEnabled) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC && !window.heroPhysics.audioCtx) window.heroPhysics.audioCtx = new AC();
  if (
    window.heroPhysics.audioCtx &&
    window.heroPhysics.audioCtx.state === "suspended"
  )
    window.heroPhysics.audioCtx.resume();
}
function heroPlayPop(impact = 1) {
  if (!window.heroPhysics.soundEnabled || !window.heroPhysics.audioCtx) return;
  const t = window.heroPhysics.audioCtx.currentTime,
    osc = window.heroPhysics.audioCtx.createOscillator(),
    gain = window.heroPhysics.audioCtx.createGain();
  const speed = Math.min(Math.max(impact, 0), 10),
    peak = 0.01 + 0.02 * (speed / 10), // Reduced from 0.12 + 0.12 to 0.04 + 0.06
    pitch = 100 + 10 * speed; // Reduced from 220 + 70 to 180 + 40 for softer tone
  osc.type = "triangle";
  osc.frequency.setValueAtTime(pitch, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  osc.connect(gain).connect(window.heroPhysics.audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.18);
}
function initSoundSystem() {
  window.addEventListener(
    "pointerdown",
    () => {
      if (window.heroPhysics.soundEnabled) heroEnsureAudio();
    },
    { once: true }
  );
  const soundToggle = document.getElementById("hero-sound-toggle");
  if (soundToggle) {
    soundToggle.checked = !!window.heroPhysics.soundEnabled;
    soundToggle.addEventListener("change", async () => {
      window.heroPhysics.soundEnabled = soundToggle.checked;
      localStorage.setItem(
        "heroSound",
        JSON.stringify(window.heroPhysics.soundEnabled)
      );
      if (window.heroPhysics.soundEnabled) heroEnsureAudio();
      else if (
        window.heroPhysics.audioCtx &&
        window.heroPhysics.audioCtx.state === "running"
      ) {
        try {
          await window.heroPhysics.audioCtx.suspend();
        } catch (e) {}
      }
    });
  }
  const voiceControlEl = document.querySelector(".hero-voice-control");
  if (voiceControlEl) {
    const syncVoiceLabel = () => {
      voiceControlEl.textContent = window.heroPhysics.soundEnabled
        ? " : On"
        : " : Off";
      voiceControlEl.setAttribute(
        "aria-pressed",
        String(!!window.heroPhysics.soundEnabled)
      );
    };
    voiceControlEl.setAttribute("role", "button");
    voiceControlEl.setAttribute("tabindex", "0");
    voiceControlEl.style.cursor = "pointer";
    syncVoiceLabel();
    voiceControlEl.addEventListener("click", () => {
      soundToggle.checked = !soundToggle.checked;
      soundToggle.dispatchEvent(new Event("change"));
      syncVoiceLabel();
    });
    voiceControlEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        voiceControlEl.click();
      }
    });
    soundToggle.addEventListener("change", syncVoiceLabel);
  }
}

// Helpers
function hexToRgb(hex) {
  const m = hex.replace("#", "");
  const n =
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m;
  const num = parseInt(n, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function cssToHex(c) {
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return c;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = c;
  return ctx.fillStyle;
}
function getContrastText(color) {
  const { r, g, b } = hexToRgb(cssToHex(color));
  const toLin = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
  return L > 0.45 ? "#111" : "#fff";
}

function bodyFromPath(pathId, x, y, fill, label, link) {
  const path = document.getElementById(pathId);
  const verts = Matter.Svg.pathToVertices(path, 25);
  const b = Matter.Bodies.fromVertices(
    x,
    y,
    verts,
    {
      restitution: 0.6,
      frictionAir: 0.02,  // Add air resistance like the logo
      render: { fillStyle: fill, strokeStyle: "transparent" },
      label,
      link,
    },
    true
  );
  b.textColor = getContrastText(fill);
  return b;
}

function captureInitialState(body) {
  window.heroPhysics.initialStates.set(body, {
    position: { x: body.position.x, y: body.position.y },
    angle: 0,
  });
}

function createWalls() {
  const w = innerWidth,
    h = innerHeight,
    t = 200;
  return [
    Matter.Bodies.rectangle(w / 2, h + t / 2, w, t, { isStatic: true }),
    Matter.Bodies.rectangle(w / 2, -t / 2, w, t, { isStatic: true }),
    Matter.Bodies.rectangle(-t / 2, h / 2, t, h, { isStatic: true }),
    Matter.Bodies.rectangle(w + t / 2, h / 2, t, h, { isStatic: true }),
  ];
}

// Mouse & collisions
function setupHeroEventListeners() {
  let mouseDownPos = null;

  Matter.Events.on(window.heroPhysics.mouseConstraint, "mousedown", (e) => {
    if (window.heroPhysics.soundEnabled) heroEnsureAudio();
    mouseDownPos = { ...e.mouse.position };
  });
  Matter.Events.on(window.heroPhysics.mouseConstraint, "mouseup", (e) => {
    const dx = e.mouse.position.x - mouseDownPos.x,
      dy = e.mouse.position.y - mouseDownPos.y;
    if (Math.hypot(dx, dy) < 5) {
      const hit = Matter.Query.point(
        Matter.Composite.allBodies(window.heroPhysics.engine.world),
        e.mouse.position
      )[0];
      if (!hit) return;
      if (window.heroPhysics.shapes.includes(hit)) markUserInteraction();
      // Modal and link functionality removed - shapes are now purely interactive physics elements
    }
  });

  Matter.Events.on(window.heroPhysics.mouseConstraint, "startdrag", () => {
    window.heroPhysics.isDragging = true;
    markUserInteraction();
  });
  Matter.Events.on(window.heroPhysics.mouseConstraint, "enddrag", () => {
    window.heroPhysics.isDragging = false;
  });

  const passthrough = (e) => {
    if (!window.heroPhysics.isDragging) e.stopPropagation();
  };
  window.heroPhysics.render.canvas.addEventListener("wheel", passthrough, {
    passive: true,
    capture: true,
  });
  window.heroPhysics.render.canvas.addEventListener("touchmove", passthrough, {
    passive: true,
    capture: true,
  });

  Matter.Events.on(window.heroPhysics.engine, "afterUpdate", () => {
    const W = window.heroPhysics.render.canvas.width,
      H = window.heroPhysics.render.canvas.height,
      PAD = 220;
    for (const b of window.heroPhysics.shapes) {
      const bb = b.bounds,
        out =
          bb.max.x < -PAD ||
          bb.min.x > W + PAD ||
          bb.max.y < -PAD ||
          bb.min.y > H + PAD;
      if (out) {
        const x = Math.min(Math.max(b.position.x, 80), W - 80);
        Matter.Body.setPosition(b, { x, y: -60 });
        Matter.Body.setVelocity(b, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(b, 0.6);
      }
    }
  });

  setupCollisionEvents();
}

// Draw labels
function startLabelDrawing() {
  const render = window.heroPhysics.render;
  if (!render || window.heroPhysics._labelsHooked) return; // avoid double-binding
  window.heroPhysics._labelsHooked = true;

  // Always draw labels AFTER Matter renders a frame
  Matter.Events.on(render, "afterRender", () => {
    const ctx = render.context;
    if (!ctx || !Array.isArray(window.heroPhysics.shapes)) return;

    ctx.save();
    ctx.font =
      "600 20px system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    window.heroPhysics.shapes.forEach((b) => {
      if (!b || !b.position) return;
      ctx.fillStyle = b.textColor || "#222";
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(b.angle || 0);
      if (b.label) {
        // Make logo text transparent, keep other shapes visible
        if (b.label === "logo") {
          ctx.fillStyle = "transparent";
        }
        ctx.fillText(b.label, 0, 0);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform for next body
    });

      // Draw logo overlay for the logo body using body's live bounds as single source of truth
      if (window.heroPhysics.logoBody && window.heroPhysics.logoImage && window.heroPhysics.logoBody.label === "logo") {
        const logo = window.heroPhysics.logoBody;
        const img = window.heroPhysics.logoImage;
        
        ctx.save();
        ctx.translate(logo.position.x, logo.position.y);
        ctx.rotate(logo.angle); // Logo rotates with the physics body
        
        // Calculate the original body dimensions (before rotation affects bounds)
        // We need to account for the current scale factor from responsive scaling
        const currentScale = window.heroPhysics.currentScale || 1;
        
        // Original body dimensions (before any scaling/rotation)
        // These are the dimensions when the body was first created
        const originalBodyWidth = 370; // Half of viewBox width (420/2)
        const originalBodyHeight = 176; // Half of viewBox height (202/2)
        
        // Apply current responsive scale to get the actual current size
        const bw = originalBodyWidth * currentScale;
        const bh = originalBodyHeight * currentScale;
        
        // Logo image offset adjustments (doesn't affect physics body)
        const offsetX = -3; // Move logo left (negative) or right (positive)
        const offsetY = -24; // Move logo up (negative) or down (positive)
        
        // Draw image centered using scaled original dimensions with offset - no rotation scaling
        ctx.drawImage(img, -bw/2 + offsetX, -bh/2 + offsetY, bw, bh);
        ctx.restore();
      }

    ctx.restore();
  });
}

// Responsive
const BASE_W = 1280,
  BASE_H = 800;
function getResponsiveScale() {
  const s = Math.min(innerWidth / BASE_W, innerHeight / BASE_H);
  return Math.max(0.45, Math.min(1.2, s));
}
function applyResponsiveScale() {
  const s = getResponsiveScale();
  const ratio = s / window.heroPhysics.currentScale;
  if (Math.abs(ratio - 1) > 0.001) {
    window.heroPhysics.shapes.forEach((b) => {
      Matter.Body.scale(b, ratio, ratio);
      const x = Math.min(Math.max(b.position.x, 80), innerWidth - 80);
      const y = Math.min(Math.max(b.position.y, 80), innerHeight - 80);
      Matter.Body.setPosition(b, { x, y });
    });
    window.heroPhysics.currentScale = s;
  }
}
function setupResponsiveHandling() {
  // start from the current responsive scale to avoid an initial "jump"
  window.heroPhysics.currentScale = getResponsiveScale();
  addEventListener("resize", () => {
    window.heroPhysics.render.canvas.width = innerWidth;
    window.heroPhysics.render.canvas.height = innerHeight;
    window.heroPhysics.render.options.width = innerWidth;
    window.heroPhysics.render.options.height = innerHeight;
    Matter.Composite.remove(
      window.heroPhysics.engine.world,
      window.heroPhysics.walls
    );
    window.heroPhysics.walls = createWalls();
    Matter.Composite.add(window.heroPhysics.engine.world, window.heroPhysics.walls);
    applyResponsiveScale();
  });
}


// Collisions
function setupCollisionEvents() {
  const SOUND_COOLDOWN_MS = 300; // Increased from 120ms to 300ms (less frequent)
  const MIN_SPEED_FOR_SOUND = 2.0; // Increased from 1.2 to 2.0 (only faster collisions)
  Matter.Events.on(window.heroPhysics.engine, "collisionStart", (evt) => {
    if (!window.heroPhysics.soundEnabled) return;
    const now = performance.now();
    evt.pairs.forEach((pair) => {
      const a = pair.bodyA,
        b = pair.bodyB;
      if (
        !window.heroPhysics.shapes.includes(a) &&
        !window.heroPhysics.shapes.includes(b)
      )
        return;
      const speed = Math.hypot(
        a.velocity.x - b.velocity.x,
        a.velocity.y - b.velocity.y
      );
      if (speed < MIN_SPEED_FOR_SOUND) return;
      const okA =
          now - (window.heroPhysics.lastSound.get(a) || 0) > SOUND_COOLDOWN_MS,
        okB = now - (window.heroPhysics.lastSound.get(b) || 0) > SOUND_COOLDOWN_MS;
      if (!okA && !okB) return;
      heroPlayPop(speed);
      window.heroPhysics.lastSound.set(a, now);
      window.heroPhysics.lastSound.set(b, now);
    });
  });
}

// Score
function initScoreSystem() {
  const scoreFill = document.getElementById("hero-score-fill");
  const scoreNum = document.getElementById("hero-score-number");
  const scoreResetBtn = document.getElementById("hero-score-reset");

  function setScore(val) {
    window.heroPhysics.score = Math.max(0, Math.min(100, Math.round(val)));
    if (scoreFill) scoreFill.style.width = window.heroPhysics.score + "%";
    if (scoreNum) scoreNum.textContent = window.heroPhysics.score + "%";
    if (window.heroPhysics.score >= 100 && !window.heroPhysics.won) {
      window.heroPhysics.won = true;
      window.openModal({
        type: "html",
        title: "You won!",
        html: `<div style="padding:28px; text-align:center; color:#111; background:#fff;">
                 <h2 style="margin:0 0 8px 0; font:600 28px/1.2 system-ui">You won! 🎉</h2>
                 <p style="margin:0 0 16px 0;">Score reached 100%.</p>
                 <button class="hero-modal-close" onclick="document.getElementById('hero-modal-close').click()">Close</button>
               </div>`,
      });
    }
  }

  function addScore(delta) {
    if (window.heroPhysics.won) return;
    const now = performance.now();
    if (
      !window.heroPhysics.userHasInteracted ||
      now > window.heroPhysics.interactionWindowUntil
    )
      return;
    setScore(window.heroPhysics.score + delta);
  }

  if (scoreResetBtn) {
    scoreResetBtn.addEventListener("click", () => {
      window.heroPhysics.won = false;
      setScore(0);
      window.heroPhysics.lastScoredPair.clear();
      window.heroPhysics.userHasInteracted = false;
      window.heroPhysics.interactionWindowUntil = 0;
    });
  }

  const MIN_SPEED_FOR_SCORE = 2.2;
  const SCORE_COOLDOWN_MS = 600;
  Matter.Events.on(window.heroPhysics.engine, "collisionStart", (evt) => {
    const now = performance.now();
    evt.pairs.forEach((pair) => {
      const a = pair.bodyA,
        b = pair.bodyB;
      if (
        !(
          window.heroPhysics.shapes.includes(a) &&
          window.heroPhysics.shapes.includes(b)
        )
      )
        return;
      const speed = Math.hypot(
        a.velocity.x - b.velocity.x,
        a.velocity.y - b.velocity.y
      );
      if (speed < MIN_SPEED_FOR_SCORE) return;
      const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
      if (
        now - (window.heroPhysics.lastScoredPair.get(key) || 0) <
        SCORE_COOLDOWN_MS
      )
        return;
      const inc = Math.min(2, 0.2 + speed * 0.2);
      addScore(inc);
      window.heroPhysics.lastScoredPair.set(key, now);
    });
  });

  // any pointer press on the canvas counts as user intent
  window.heroPhysics.render.canvas.addEventListener(
    "pointerdown",
    markUserInteraction,
    { passive: true }
  );
}

// mark recent interaction allowing a brief scoring window
function markUserInteraction() {
  window.heroPhysics.userHasInteracted = true;
  window.heroPhysics.interactionWindowUntil = performance.now() + 4000; // 4s window after each interaction
}

// Modal
function initModalSystem() {
  const heroModal = document.getElementById("hero-media-modal");
  const heroCloseBtn = document.getElementById("hero-modal-close");
  let restartOnClose = false;

  function releaseMouseDrag() {
    try {
      if (window.heroPhysics.mouseConstraint) {
        if (window.heroPhysics.mouseConstraint.constraint) {
          window.heroPhysics.mouseConstraint.constraint.body = null;
          window.heroPhysics.mouseConstraint.constraint.pointA = { x: 0, y: 0 };
        }
        if ("body" in window.heroPhysics.mouseConstraint)
          window.heroPhysics.mouseConstraint.body = null;
        if (window.heroPhysics.mouseConstraint.mouse)
          window.heroPhysics.mouseConstraint.mouse.button = -1;
      }
      window.heroPhysics.isDragging = false;
    } catch (e) {}
  }

  function restartGame() {
    releaseMouseDrag();
    window.heroPhysics.won = false;
    window.heroPhysics.score = 0;
    window.heroPhysics.lastScoredPair.clear();
    window.heroPhysics.userHasInteracted = false;
    window.heroPhysics.interactionWindowUntil = 0;

    const scoreFill = document.getElementById("hero-score-fill");
    const scoreNum = document.getElementById("hero-score-number");
    if (scoreFill) scoreFill.style.width = "0%";
    if (scoreNum) scoreNum.textContent = "0%";

    for (const b of window.heroPhysics.shapes) {
      const init = window.heroPhysics.initialStates.get(b);
      const pos =
        init && init.position
          ? init.position
          : {
              x: Math.min(Math.max(b.position.x, 80), innerWidth - 80),
              y: 140,
            };
      Matter.Body.setPosition(b, { x: pos.x, y: pos.y });
      Matter.Body.setAngle(
        b,
        init && typeof init.angle === "number" ? init.angle : 0
      );
      Matter.Body.setVelocity(b, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(b, 0);
      b.force = { x: 0, y: 0 };
      b.torque = 0;
      if (b.isSleeping) Matter.Sleeping.set(b, false);
    }
    applyResponsiveScale();
  }

  function openModal(media) {
    // Simply open the modal - Webflow handles all content
    heroModal.classList.add("hero-open");
    document.body.classList.add("hero-modal-open");
    
    // Only restart game for HTML content (win modal)
    restartOnClose = media && media.type === "html";
  }

  function closeModal() {
    // Simply close the modal - Webflow handles content cleanup
    heroModal.classList.remove("hero-open");
    document.body.classList.remove("hero-modal-open");
    
    if (restartOnClose) {
      releaseMouseDrag();
      restartOnClose = false;
      setTimeout(() => {
        restartGame();
      }, 0);
    }
  }

  if (heroCloseBtn) heroCloseBtn.addEventListener("click", closeModal);
  if (heroModal)
    heroModal.addEventListener("click", (e) => {
      if (e.target === heroModal) closeModal();
    });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && heroModal.classList.contains("hero-open"))
      closeModal();
  });

  window.openModal = openModal;
}

// ===== Bootstrap (no Barba, no GSAP) =====
(function () {
  function safeInit() {
    if (
      document.getElementById("hero-physics-canvas") &&
      !window.heroPhysics?.isInitialized
    ) {
      try {
        initHeroPhysics();
      } catch (e) {
        console.error("Hero Physics init failed:", e);
      }
    }
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInit, { once: true });
  } else {
    safeInit();
  }

  // Pause/resume on tab visibility change — FIXED
  document.addEventListener("visibilitychange", () => {
    const HP = window.heroPhysics;
    if (!HP || !HP.engine) return;

    try {
      if (document.hidden) {
        if (HP.runner) Matter.Runner.stop(HP.runner);
        if (HP.render) Matter.Render.stop(HP.render);
        HP._paused = true;
      } else {
        if (HP.render) Matter.Render.run(HP.render);
        if (HP.runner && HP.engine) Matter.Runner.run(HP.runner, HP.engine);

        // Wake bodies so collisions happen immediately
        if (Array.isArray(HP.shapes)) {
          HP.shapes.forEach((b) => {
            try {
              Matter.Sleeping.set(b, false);
            } catch (e) {}
          });
        }

        // Fresh scoring window on resume
        if (typeof markUserInteraction === "function") markUserInteraction();

        // Reset cooldowns so first hit/sound works right away
        if (HP.lastScoredPair instanceof Map) HP.lastScoredPair.clear();
        if (HP.lastSound instanceof WeakMap) HP.lastSound = new WeakMap();

        // Resume audio context if needed
        if (HP.soundEnabled) heroEnsureAudio();

        HP._paused = false;
      }
    } catch (e) {
      console.warn("Visibility resume/pause error:", e);
    }
  });

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    try {
      cleanupHeroPhysics();
    } catch (e) {}
  });
})();



document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero animations and interactions
    console.log('Hero Physics section loaded');
    
    // Hero functionality is automatically initialized via the bootstrap function above
});
