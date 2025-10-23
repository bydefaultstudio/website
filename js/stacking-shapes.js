/**
 * Script Purpose: Interactive Stacking Shapes with Matter.js Physics Engine
 * Author: Erlen Masson
 * Created: October 18, 2025
 * Version: 1.9.0
 * Last Updated: October 22, 2025
 */

console.log("Script - Stacking Shapes v1.9.0");
// Global variables - use window object to prevent conflicts
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
// Audio controlled by main audio system
window.stackingShapes.soundEnabled = false;
window.stackingShapes.isInitialized = false;

// ------- Audio System Integration ------- //
function syncWithMainAudioSystem() {
  if (window.bdAudio && window.bdAudio.settings) {
    window.stackingShapes.soundEnabled = window.bdAudio.settings.enabled;
  } else {
    window.stackingShapes.soundEnabled = false;
  }
}
function setupAudioSystemListener() {
  syncWithMainAudioSystem();
  
  document.addEventListener('audioSystemChanged', () => {
    syncWithMainAudioSystem();
  });
  
  const checkForMainAudio = setInterval(() => {
    if (window.bdAudio) {
      syncWithMainAudioSystem();
      clearInterval(checkForMainAudio);
    }
  }, 100);
  
  setInterval(() => {
    if (window.bdAudio) {
      const mainAudioEnabled = window.bdAudio.settings.enabled;
      if (window.stackingShapes.soundEnabled !== mainAudioEnabled) {
        syncWithMainAudioSystem();
      }
    }
  }, 1000);
}

// ------- Initialization ------- //
function initStackingShapes() {
  if (window.stackingShapes.isInitialized) {
    return;
  }

  const container = document.getElementById("ss-canvas");
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
  // Fixed-step runner for controlled physics
  window.stackingShapes.runner = Runner.create({ 
    isFixed: true, 
    delta: 1000/60  // 60 FPS fixed timestep
  });
  Runner.run(window.stackingShapes.runner, window.stackingShapes.engine);

  // Initialize shapes with responsive positioning
  window.stackingShapes.shapes = [
    bodyFromPath("shape1", innerWidth * 0.25, innerHeight * 0.25, "#094C45", "one", "#news"),
    bodyFromPath("shape2", innerWidth * 0.5, innerHeight * 0.3, "#F7A3BC", "two", "#founders"),
    bodyFromPath("shape3", innerWidth * 0.75, innerHeight * 0.3, "#FFB533", "three", "#work"),
    bodyFromPath("shape4", innerWidth * 0.15, innerHeight * 0.15, "#88D3CD", "four", "#about"),
  ];
  Composite.add(window.stackingShapes.engine.world, window.stackingShapes.shapes);

  window.stackingShapes.shapes.forEach(captureInitialState);

  window.stackingShapes.walls = createWalls();
  Composite.add(window.stackingShapes.engine.world, window.stackingShapes.walls);

  // ------- Mouse Interaction Configuration ------- //
  window.stackingShapes.mouse = Mouse.create(window.stackingShapes.render.canvas);
  window.stackingShapes.mouseConstraint = MouseConstraint.create(
    window.stackingShapes.engine,
    {
      mouse: window.stackingShapes.mouse,
      constraint: {
        stiffness: 0.15,        // Mouse constraint stiffness
        angularStiffness: 0.15, // Angular constraint stiffness
        damping: 0.7,           // Higher damping for controlled drag-drop
        render: { visible: false },
      },
    }
  );
  Composite.add(window.stackingShapes.engine.world, window.stackingShapes.mouseConstraint);
  window.stackingShapes.render.mouse = window.stackingShapes.mouse;

  setupStackingShapesEventListeners();
  addLogoSprite();
  setupResponsiveHandling();
  initScoreSystem();
  initModalSystem();
  initSoundSystem();
  startLabelDrawing();
  setupAudioSystemListener();

  window.stackingShapes.isInitialized = true;
}

// ------- Logo Sprite ------- //
function addLogoSprite() {
  if (typeof decomp !== 'undefined') {
    Matter.Common.setDecomp(decomp);
  }
  
  const logoPath = document.getElementById('logo-shape');
  if (!logoPath) {
    console.error('Logo SVG path not found');
    return;
  }
  
  let logoVertices;
  try {
    logoVertices = Matter.Svg.pathToVertices(logoPath, 3);
    
    // Center vertices around (0,0) using viewBox center
    const viewBoxCenterX = 420 / 2; // 210
    const viewBoxCenterY = 202 / 2; // 101
    
    logoVertices = logoVertices.map(vertex => ({
      x: vertex.x - viewBoxCenterX,
      y: vertex.y - viewBoxCenterY
    }));

  } catch (error) {
    console.error('Failed to convert SVG path to vertices:', error);
    logoVertices = [
      { x: -50, y: -25 }, { x: 50, y: -25 },
      { x: 50, y: 25 }, { x: -50, y: 25 }
    ];
  }
  
  const logo = Matter.Bodies.fromVertices(
    600, // x position (center of canvas)
    140, // y position (center of canvas)
    logoVertices,
    {
      restitution: 0.6,        // Bounce on collision
      frictionAir: 0.02,       // Air resistance
      render: { 
        fillStyle: "transparent",
        strokeStyle: "transparent"
      },
      label: "logo"
    },
    true // Enable poly-decomp decomposition
  );
  
  window.stackingShapes.logoBody = logo;
  
  const logoImage = new Image();
  logoImage.onload = function() {
    window.stackingShapes.logoImage = logoImage;
  };
  logoImage.src = "https://cdn.prod.website-files.com/68e2be176459e98837a31ed9/68eec956451541e7cfc33ab9_logo_bydefault_primary.svg";
  
  window.stackingShapes.shapes.push(logo);
  Matter.Composite.add(window.stackingShapes.engine.world, logo);
  captureInitialState(logo);
}

// ------- Cleanup ------- //
function cleanupStackingShapes() {
  console.log("cleanupStackingShapes called");
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
    } catch (e) {
      // Cleanup completed with errors
    }
  }
}

// ------- Sound System ------- //
function stackingShapesEnsureAudio() {
  if (!window.stackingShapes.soundEnabled) {
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC && !window.stackingShapes.audioCtx) {
    window.stackingShapes.audioCtx = new AC();
  }
  if (
    window.stackingShapes.audioCtx &&
    window.stackingShapes.audioCtx.state === "suspended"
  ) {
    window.stackingShapes.audioCtx.resume();
  }
}
function stackingShapesPlayPop(impact = 1) {
  if (!window.stackingShapes.soundEnabled || !window.stackingShapes.audioCtx) {
    return;
  }
  const t = window.stackingShapes.audioCtx.currentTime,
    osc = window.stackingShapes.audioCtx.createOscillator(),
    gain = window.stackingShapes.audioCtx.createGain();
  const speed = Math.min(Math.max(impact, 0), 10),
    peak = 0.12 + 0.12 * (speed / 10),
    pitch = 220 + 70 * speed;
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
  window.addEventListener(
    "pointerdown",
    () => {
      if (window.stackingShapes.soundEnabled) stackingShapesEnsureAudio();
    },
    { once: true }
  );
}

// ------- Helper Functions ------- //
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
      restitution: 0.6,        // Bounce on collision
      frictionAir: 0.02,       // Air resistance
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

// ------- Mouse & Collisions ------- //
function setupStackingShapesEventListeners() {
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

// ------- Label Drawing ------- //
function startLabelDrawing() {
  const render = window.stackingShapes.render;
  if (!render || window.stackingShapes._labelsHooked) return;
  window.stackingShapes._labelsHooked = true;
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
        if (b.label === "logo") {
          ctx.fillStyle = "transparent";
        }
        ctx.fillText(b.label, 0, 0);
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform for next body
    });

      // Draw logo overlay
      if (window.stackingShapes.logoBody && window.stackingShapes.logoImage && window.stackingShapes.logoBody.label === "logo") {
        const logo = window.stackingShapes.logoBody;
        const img = window.stackingShapes.logoImage;
        
        ctx.save();
        ctx.translate(logo.position.x, logo.position.y);
        ctx.rotate(logo.angle);
        
        const currentScale = window.stackingShapes.currentScale || 1;
        const originalBodyWidth = 370; // Half of viewBox width (420/2)
        const originalBodyHeight = 176; // Half of viewBox height (202/2)
        
        const bw = originalBodyWidth * currentScale;
        const bh = originalBodyHeight * currentScale;
        
        const offsetX = -3;  // Logo horizontal offset
        const offsetY = -24; // Logo vertical offset
        
        ctx.drawImage(img, -bw/2 + offsetX, -bh/2 + offsetY, bw, bh);
        ctx.restore();
      }

    ctx.restore();
  });
}

// ------- Responsive Scaling ------- //
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


// ------- Collision Events ------- //
function setupCollisionEvents() {
  const SOUND_COOLDOWN_MS = 120;
  const MIN_SPEED_FOR_SOUND = 1.2;
  Matter.Events.on(window.stackingShapes.engine, "collisionStart", (evt) => {
    if (!window.stackingShapes.soundEnabled) {
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

// ------- Score System ------- //
function initScoreSystem() {
  const scoreFill = document.getElementById("ss-score-fill");
  const scoreNum = document.getElementById("ss-score-number");
  const scoreResetBtn = document.getElementById("ss-score-reset");

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
                 <button class="ss-modal-close" onclick="document.getElementById('ss-modal-close').click()">Close</button>
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

// Mark recent interaction allowing a brief scoring window
function markUserInteraction() {
  window.stackingShapes.userHasInteracted = true;
  window.stackingShapes.interactionWindowUntil = performance.now() + 4000; // 4s window after each interaction
}

// ------- Modal System ------- //
function initModalSystem() {
  const stackingShapesModal = document.getElementById("ss-modal");
  const stackingShapesCloseBtn = document.getElementById("ss-modal-close");
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

    const scoreFill = document.getElementById("ss-score-fill");
    const scoreNum = document.getElementById("ss-score-number");
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
    stackingShapesModal.classList.add("ss-open");
    document.body.classList.add("ss-modal-open");
    restartOnClose = media && media.type === "html";
  }

  function closeModal() {
    stackingShapesModal.classList.remove("ss-open");
    document.body.classList.remove("ss-modal-open");
    
    if (restartOnClose) {
      releaseMouseDrag();
      restartOnClose = false;
      setTimeout(() => {
        restartGame();
      }, 0);
    }
  }

  if (stackingShapesCloseBtn) stackingShapesCloseBtn.addEventListener("click", closeModal);
  if (stackingShapesModal)
    stackingShapesModal.addEventListener("click", (e) => {
      if (e.target === stackingShapesModal) closeModal();
    });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && stackingShapesModal.classList.contains("ss-open"))
      closeModal();
  });

  window.openModal = openModal;
}

// ------- Bootstrap ------- //
(function () {
  function safeInit() {
    if (
      document.getElementById("ss-canvas") &&
      !window.stackingShapes?.isInitialized
    ) {
      try {
        initStackingShapes();
      } catch (e) {
        console.error("Stacking Shapes Physics init failed:", e);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInit, { once: true });
  } else {
    safeInit();
  }
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

        if (Array.isArray(HP.shapes)) {
          HP.shapes.forEach((b) => {
            try {
              Matter.Sleeping.set(b, false);
            } catch (e) {}
          });
        }

        if (typeof markUserInteraction === "function") markUserInteraction();

        if (HP.lastScoredPair instanceof Map) HP.lastScoredPair.clear();
        if (HP.lastSound instanceof WeakMap) HP.lastSound = new WeakMap();

        if (HP.soundEnabled) stackingShapesEnsureAudio();

        HP._paused = false;
      }
    } catch (e) {
      console.warn("Visibility resume/pause error:", e);
    }
  });

  window.addEventListener("beforeunload", () => {
    try {
      cleanupStackingShapes();
    } catch (e) {}
  });
})();



document.addEventListener('DOMContentLoaded', function() {
    // Additional initialization if needed
});
