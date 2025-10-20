console.log("Stacking Shapes - Interactive Physics v3");
// Stacking Shapes global variables - use window object to prevent conflicts
window.stackingShapes = window.stackingShapes || {};
window.stackingShapes.engine = null;
window.stackingShapes.render = null;
window.stackingShapes.runner = null;
window.stackingShapes.shapes = null;
window.stackingShapes.walls = null;
window.stackingShapes.mouse = null;
window.stackingShapes.mouseConstraint = null;
window.stackingShapes.initialStates = new WeakMap();
window.stackingShapes.score = 0;
window.stackingShapes.won = false;
window.stackingShapes.userHasInteracted = false;
window.stackingShapes.interactionWindowUntil = 0;
window.stackingShapes.lastScoredPair = new Map();
window.stackingShapes.lastSound = new WeakMap();
window.stackingShapes.isDragging = false;
window.stackingShapes.currentScale = 1;
window.stackingShapes.audioCtx = null;
// Audio will be controlled by main audio system
window.stackingShapes.soundEnabled = false; // Will be updated when audio system loads
window.stackingShapes.isInitialized = false;

// Sync with main audio system
function syncWithMainAudioSystem() {
  if (window.audioSystem && window.audioSystem.settings) {
    window.stackingShapes.soundEnabled = window.audioSystem.settings.enabled;
    console.log('Stacking Shapes audio synced with main system:', window.stackingShapes.soundEnabled);
  } else {
    console.log('Audio system not available yet, sound disabled');
    window.stackingShapes.soundEnabled = false;
  }
}

// Listen for audio system changes
function setupAudioSystemListener() {
  // Check if audio system is already loaded
  if (window.audioSystem) {
    syncWithMainAudioSystem();
  } else {
    // Wait for audio system to load
    const checkAudioSystem = setInterval(() => {
      if (window.audioSystem) {
        syncWithMainAudioSystem();
        clearInterval(checkAudioSystem);
      }
    }, 100);
  }
  
  // Listen for audio system state changes
  document.addEventListener('audioSystemChanged', (event) => {
    console.log('Audio system changed event received:', event.detail);
    syncWithMainAudioSystem();
  });
}

// Stacking Shapes initialization function
function initStackingShapes() {
  if (window.stackingShapes.isInitialized) {
    return;
  }

  const container = document.getElementById("hero-physics-canvas");
  if (!container) {
    return;
  }

  if (window.stackingShapes.engine) {
    try {
      Matter.Runner.stop(window.stackingShapes.runner);
      Matter.Render.stop(window.stackingShapes.render);
      Matter.Engine.clear(window.stackingShapes.engine);
    } catch (e) {
      // Cleanup completed
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

  window.stackingShapes.engine = Engine.create();
  window.stackingShapes.render = Render.create({
    element: container,
    engine: window.stackingShapes.engine,
    options: {
      width: innerWidth,
      height: innerHeight,
      wireframes: false,
      background: "#f5f6f8",
    },
  });
  Render.run(window.stackingShapes.render);
  // FIXED-STEP RUNNER → avoids maxUpdates catch-up on resume and creates slower, more controlled physics
  window.stackingShapes.runner = Runner.create({ 
    isFixed: true, 
    delta: 1000/60  // 60 FPS fixed timestep
  });
  Runner.run(window.stackingShapes.runner, window.stackingShapes.engine);

  // Initialize shapes - responsive positioning for mobile
  window.stackingShapes.shapes = [
    bodyFromPath("shape1", innerWidth * 0.25, innerHeight * 0.25, "#094C45", "one", "#news"),
    bodyFromPath("shape2", innerWidth * 0.5, innerHeight * 0.3, "#F7A3BC", "two", "#founders"),
    bodyFromPath("shape3", innerWidth * 0.75, innerHeight * 0.3, "#FFB533", "three", "#work"),
    bodyFromPath("shape4", innerWidth * 0.15, innerHeight * 0.15, "#88D3CD", "four", "#about"),
  ];
  Composite.add(window.stackingShapes.engine.world, window.stackingShapes.shapes);

  // Capture initial states
  window.stackingShapes.shapes.forEach(captureInitialState);

  // Create walls
  window.stackingShapes.walls = createWalls();
  Composite.add(window.stackingShapes.engine.world, window.stackingShapes.walls);

  // Setup mouse interaction
  window.stackingShapes.mouse = Mouse.create(window.stackingShapes.render.canvas);
  window.stackingShapes.mouseConstraint = MouseConstraint.create(
    window.stackingShapes.engine,
    {
      mouse: window.stackingShapes.mouse,
      constraint: {
        stiffness: 0.15,
        angularStiffness: 0.15,
        damping: 0.7,  // Higher damping to slow down drag-drop to match initial drop
        render: { visible: false },
      },
    }
  );
  Composite.add(window.stackingShapes.engine.world, window.stackingShapes.mouseConstraint);
  window.stackingShapes.render.mouse = window.stackingShapes.mouse;

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
  
  // Setup audio system integration
  setupAudioSystemListener();
  
  // Mark as initialized
  window.stackingShapes.isInitialized = true;
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
  
  
  // Store logo reference for afterRender overlay
  window.stackingShapes.logoBody = logo;
  
  // Load logo image for afterRender overlay
  const logoImage = new Image();
  logoImage.onload = function() {
    window.stackingShapes.logoImage = logoImage;
  };
  logoImage.src = "https://cdn.prod.website-files.com/68e2be176459e98837a31ed9/68eec956451541e7cfc33ab9_logo_bydefault_primary.svg";
  
  window.stackingShapes.shapes.push(logo);
  Matter.Composite.add(window.stackingShapes.engine.world, logo);
  captureInitialState(logo);
}
// End of logo sprite

// Cleanup
function cleanupStackingShapes() {
  if (window.stackingShapes.engine) {
    try {
      Matter.Runner.stop(window.stackingShapes.runner);
      Matter.Render.stop(window.stackingShapes.render);
      Matter.Engine.clear(window.stackingShapes.engine);
      window.stackingShapes.engine = null;
      window.stackingShapes.render = null;
      window.stackingShapes.runner = null;
      window.stackingShapes.shapes = null;
      window.stackingShapes.walls = null;
      window.stackingShapes.mouse = null;
      window.stackingShapes.mouseConstraint = null;
      window.stackingShapes.isInitialized = false;
      // Cleanup completed
    } catch (e) {
      // Cleanup completed with errors
    }
  }
}

// Sound
function stackingShapesEnsureAudio() {
  if (!window.stackingShapes.soundEnabled) {
    console.log('Audio ensure skipped - sound disabled');
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC && !window.stackingShapes.audioCtx) {
    window.stackingShapes.audioCtx = new AC();
    console.log('Audio context created for stacking shapes');
  }
  if (
    window.stackingShapes.audioCtx &&
    window.stackingShapes.audioCtx.state === "suspended"
  ) {
    window.stackingShapes.audioCtx.resume();
    console.log('Audio context resumed');
  }
}
function stackingShapesPlayPop(impact = 1) {
  if (!window.stackingShapes.soundEnabled || !window.stackingShapes.audioCtx) {
    console.log('Sound play blocked - enabled:', window.stackingShapes.soundEnabled, 'audioCtx:', !!window.stackingShapes.audioCtx);
    return;
  }
  console.log('Playing collision sound with impact:', impact);
  const t = window.stackingShapes.audioCtx.currentTime,
    osc = window.stackingShapes.audioCtx.createOscillator(),
    gain = window.stackingShapes.audioCtx.createGain();
  const speed = Math.min(Math.max(impact, 0), 10),
    peak = 0.01 + 0.02 * (speed / 10), // Reduced from 0.12 + 0.12 to 0.04 + 0.06
    pitch = 100 + 10 * speed; // Reduced from 220 + 70 to 180 + 40 for softer tone
  osc.type = "triangle";
  osc.frequency.setValueAtTime(pitch, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  osc.connect(gain).connect(window.stackingShapes.audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.18);
}
function initSoundSystem() {
  // Audio is now controlled by main audio system
  // Just ensure audio context is available when needed
  window.addEventListener(
    "pointerdown",
    () => {
      if (window.stackingShapes.soundEnabled) stackingShapesEnsureAudio();
    },
    { once: true }
  );
  
  // Remove old sound toggle UI - now controlled by main audio system
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
  window.stackingShapes.initialStates.set(body, {
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

  Matter.Events.on(window.stackingShapes.mouseConstraint, "mousedown", (e) => {
    if (window.stackingShapes.soundEnabled) stackingShapesEnsureAudio();
    mouseDownPos = { ...e.mouse.position };
  });
  Matter.Events.on(window.stackingShapes.mouseConstraint, "mouseup", (e) => {
    const dx = e.mouse.position.x - mouseDownPos.x,
      dy = e.mouse.position.y - mouseDownPos.y;
    if (Math.hypot(dx, dy) < 5) {
      const hit = Matter.Query.point(
        Matter.Composite.allBodies(window.stackingShapes.engine.world),
        e.mouse.position
      )[0];
      if (!hit) return;
      if (window.stackingShapes.shapes.includes(hit)) markUserInteraction();
      // Modal and link functionality removed - shapes are now purely interactive physics elements
    }
  });

  Matter.Events.on(window.stackingShapes.mouseConstraint, "startdrag", () => {
    window.stackingShapes.isDragging = true;
    markUserInteraction();
  });
  Matter.Events.on(window.stackingShapes.mouseConstraint, "enddrag", () => {
    window.stackingShapes.isDragging = false;
  });

  const passthrough = (e) => {
    if (!window.stackingShapes.isDragging) e.stopPropagation();
  };
  window.stackingShapes.render.canvas.addEventListener("wheel", passthrough, {
    passive: true,
    capture: true,
  });
  window.stackingShapes.render.canvas.addEventListener("touchmove", passthrough, {
    passive: true,
    capture: true,
  });

  Matter.Events.on(window.stackingShapes.engine, "afterUpdate", () => {
    const W = window.stackingShapes.render.canvas.width,
      H = window.stackingShapes.render.canvas.height,
      PAD = 220;
    for (const b of window.stackingShapes.shapes) {
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
  const render = window.stackingShapes.render;
  if (!render || window.stackingShapes._labelsHooked) return; // avoid double-binding
  window.stackingShapes._labelsHooked = true;

  // Always draw labels AFTER Matter renders a frame
  Matter.Events.on(render, "afterRender", () => {
    const ctx = render.context;
    if (!ctx || !Array.isArray(window.stackingShapes.shapes)) return;

    ctx.save();
    ctx.font =
      "600 20px system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    window.stackingShapes.shapes.forEach((b) => {
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
      if (window.stackingShapes.logoBody && window.stackingShapes.logoImage && window.stackingShapes.logoBody.label === "logo") {
        const logo = window.stackingShapes.logoBody;
        const img = window.stackingShapes.logoImage;
        
        ctx.save();
        ctx.translate(logo.position.x, logo.position.y);
        ctx.rotate(logo.angle); // Logo rotates with the physics body
        
        // Calculate the original body dimensions (before rotation affects bounds)
        // We need to account for the current scale factor from responsive scaling
        const currentScale = window.stackingShapes.currentScale || 1;
        
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
  const ratio = s / window.stackingShapes.currentScale;
  if (Math.abs(ratio - 1) > 0.001) {
    window.stackingShapes.shapes.forEach((b) => {
      Matter.Body.scale(b, ratio, ratio);
      const x = Math.min(Math.max(b.position.x, 80), innerWidth - 80);
      const y = Math.min(Math.max(b.position.y, 80), innerHeight - 80);
      Matter.Body.setPosition(b, { x, y });
    });
    window.stackingShapes.currentScale = s;
  }
}
function setupResponsiveHandling() {
  // start from the current responsive scale to avoid an initial "jump"
  window.stackingShapes.currentScale = getResponsiveScale();
  addEventListener("resize", () => {
    window.stackingShapes.render.canvas.width = innerWidth;
    window.stackingShapes.render.canvas.height = innerHeight;
    window.stackingShapes.render.options.width = innerWidth;
    window.stackingShapes.render.options.height = innerHeight;
    Matter.Composite.remove(
      window.stackingShapes.engine.world,
      window.stackingShapes.walls
    );
    window.stackingShapes.walls = createWalls();
    Matter.Composite.add(window.stackingShapes.engine.world, window.stackingShapes.walls);
    applyResponsiveScale();
  });
}


// Collisions
function setupCollisionEvents() {
  const SOUND_COOLDOWN_MS = 300; // Increased from 120ms to 300ms (less frequent)
  const MIN_SPEED_FOR_SOUND = 2.0; // Increased from 1.2 to 2.0 (only faster collisions)
  Matter.Events.on(window.stackingShapes.engine, "collisionStart", (evt) => {
    if (!window.stackingShapes.soundEnabled) {
      console.log('Collision detected but sound disabled:', window.stackingShapes.soundEnabled);
      return;
    }
    const now = performance.now();
    evt.pairs.forEach((pair) => {
      const a = pair.bodyA,
        b = pair.bodyB;
      if (
        !window.stackingShapes.shapes.includes(a) &&
        !window.stackingShapes.shapes.includes(b)
      )
        return;
      const speed = Math.hypot(
        a.velocity.x - b.velocity.x,
        a.velocity.y - b.velocity.y
      );
      if (speed < MIN_SPEED_FOR_SOUND) return;
      const okA =
          now - (window.stackingShapes.lastSound.get(a) || 0) > SOUND_COOLDOWN_MS,
        okB = now - (window.stackingShapes.lastSound.get(b) || 0) > SOUND_COOLDOWN_MS;
      if (!okA && !okB) return;
      stackingShapesPlayPop(speed);
      window.stackingShapes.lastSound.set(a, now);
      window.stackingShapes.lastSound.set(b, now);
    });
  });
}

// Score
function initScoreSystem() {
  const scoreFill = document.getElementById("hero-score-fill");
  const scoreNum = document.getElementById("hero-score-number");
  const scoreResetBtn = document.getElementById("hero-score-reset");

  function setScore(val) {
    window.stackingShapes.score = Math.max(0, Math.min(100, Math.round(val)));
    if (scoreFill) scoreFill.style.width = window.stackingShapes.score + "%";
    if (scoreNum) scoreNum.textContent = window.stackingShapes.score + "%";
    if (window.stackingShapes.score >= 100 && !window.stackingShapes.won) {
      window.stackingShapes.won = true;
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
    if (window.stackingShapes.won) return;
    const now = performance.now();
    if (
      !window.stackingShapes.userHasInteracted ||
      now > window.stackingShapes.interactionWindowUntil
    )
      return;
    setScore(window.stackingShapes.score + delta);
  }

  if (scoreResetBtn) {
    scoreResetBtn.addEventListener("click", () => {
      window.stackingShapes.won = false;
      setScore(0);
      window.stackingShapes.lastScoredPair.clear();
      window.stackingShapes.userHasInteracted = false;
      window.stackingShapes.interactionWindowUntil = 0;
    });
  }

  const MIN_SPEED_FOR_SCORE = 2.2;
  const SCORE_COOLDOWN_MS = 600;
  Matter.Events.on(window.stackingShapes.engine, "collisionStart", (evt) => {
    const now = performance.now();
    evt.pairs.forEach((pair) => {
      const a = pair.bodyA,
        b = pair.bodyB;
      if (
        !(
          window.stackingShapes.shapes.includes(a) &&
          window.stackingShapes.shapes.includes(b)
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
        now - (window.stackingShapes.lastScoredPair.get(key) || 0) <
        SCORE_COOLDOWN_MS
      )
        return;
      const inc = Math.min(2, 0.2 + speed * 0.2);
      addScore(inc);
      window.stackingShapes.lastScoredPair.set(key, now);
    });
  });

  // any pointer press on the canvas counts as user intent
  window.stackingShapes.render.canvas.addEventListener(
    "pointerdown",
    markUserInteraction,
    { passive: true }
  );
}

// mark recent interaction allowing a brief scoring window
function markUserInteraction() {
  window.stackingShapes.userHasInteracted = true;
  window.stackingShapes.interactionWindowUntil = performance.now() + 4000; // 4s window after each interaction
}

// Modal
function initModalSystem() {
  const heroModal = document.getElementById("hero-media-modal");
  const heroCloseBtn = document.getElementById("hero-modal-close");
  let restartOnClose = false;

  function releaseMouseDrag() {
    try {
      if (window.stackingShapes.mouseConstraint) {
        if (window.stackingShapes.mouseConstraint.constraint) {
          window.stackingShapes.mouseConstraint.constraint.body = null;
          window.stackingShapes.mouseConstraint.constraint.pointA = { x: 0, y: 0 };
        }
        if ("body" in window.stackingShapes.mouseConstraint)
          window.stackingShapes.mouseConstraint.body = null;
        if (window.stackingShapes.mouseConstraint.mouse)
          window.stackingShapes.mouseConstraint.mouse.button = -1;
      }
      window.stackingShapes.isDragging = false;
    } catch (e) {}
  }

  function restartGame() {
    releaseMouseDrag();
    window.stackingShapes.won = false;
    window.stackingShapes.score = 0;
    window.stackingShapes.lastScoredPair.clear();
    window.stackingShapes.userHasInteracted = false;
    window.stackingShapes.interactionWindowUntil = 0;

    const scoreFill = document.getElementById("hero-score-fill");
    const scoreNum = document.getElementById("hero-score-number");
    if (scoreFill) scoreFill.style.width = "0%";
    if (scoreNum) scoreNum.textContent = "0%";

    for (const b of window.stackingShapes.shapes) {
      const init = window.stackingShapes.initialStates.get(b);
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
      !window.stackingShapes?.isInitialized
    ) {
      try {
        initStackingShapes();
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
    const HP = window.stackingShapes;
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
        if (HP.soundEnabled) stackingShapesEnsureAudio();

        HP._paused = false;
      }
    } catch (e) {
      console.warn("Visibility resume/pause error:", e);
    }
  });

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    try {
      cleanupStackingShapes();
    } catch (e) {}
  });
})();



document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero animations and interactions
    
    // Hero functionality is automatically initialized via the bootstrap function above
});
