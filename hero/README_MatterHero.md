# Interactive Hero (Matter.js) — README

A physics‑driven hero built with **Matter.js** that turns brand shapes into draggable, bouncy objects with optional media actions, lightweight sound effects, and a score HUD. It’s responsive, accessible, and cleans up after itself — by default.

---

## ✨ What it does

- Renders a **canvas** inside `#myContainer` and simulates 2D physics.
- Converts **SVG paths** into physical bodies (plus a logo sprite).
- Click to **open media** (image / video / YouTube / iframe / inline HTML) or follow a **link**.
- **Drag** shapes, hear subtle **“pop”** sounds on impacts.
- A **Score HUD** increments on meaningful collisions (with cooldowns). Reaching 100% shows a win modal.
- **Responsive scaling**, **tab visibility pause/resume**, and full **cleanup** on unload.

---

## 📦 Tech stack

- **Matter.js** `0.20.x`
- **pathseg** polyfill (for `SVGPathElement.getPathData` compatibility used by `Matter.Svg.pathToVertices`)
- Plain JS + Canvas 2D (no frameworks).

> The script defers initialisation until `DOMContentLoaded` and guards against double‑init.

---

## 🗂 Required DOM structure

Place these elements in the page (class names may be adapted, but IDs should match unless you update the script):

```html
<div id="myContainer" class="my-container"></div>

<!-- Score HUD -->
<div id="bdxScoreHud" class="bdx-score" aria-live="polite">
  <div class="bdx-score-bar"><span id="bdxScoreFill" style="width:0%"></span></div>
  <div class="bdx-score-num"><span id="bdxScoreNum">0%</span></div>
  <button id="bdxScoreReset" class="bdx-close">Reset</button>
</div>

<!-- Optional colour controls -->
<div id="colorPanel" class="controls">
  <input id="color-news" type="color" />
  <input id="color-founders" type="color" />
  <input id="color-work" type="color" />
  <input id="color-about" type="color" />
</div>

<!-- Media modal -->
<div id="bdxMediaModal" class="bdx-modal" aria-hidden="true">
  <div class="bdx-modal__dialog">
    <header class="bdx-modal__header">
      <h2 id="bdxMediaTitle"></h2>
      <button id="bdxModalClose" class="bdx-close" aria-label="Close">Close</button>
    </header>
    <div id="bdxModalBody" class="bdx-body"></div>
  </div>
</div>

<!-- SVG paths used to build bodies (example) -->
<svg width="0" height="0" style="position:absolute;left:-9999px;top:-9999px;">
  <path id="shape1" d="..." />
  <path id="shape2" d="..." />
  <path id="shape3" d="..." />
  <path id="shape4" d="..." />
</svg>
```

> The SVG paths are not meant to be visible; they are used to generate vertices for polygonal bodies.

---

## 🎛 CSS essentials

```css
#myContainer { width: 100%; height: 100vh; overflow: hidden; }
#myContainer canvas { display:block; border:0; outline:0; box-shadow:none; touch-action: pan-y; }
.bdx-body img, .bdx-body video, .bdx-body iframe { display:block; width:100%; height:auto; }
body.bdx-modal-open { overflow:hidden; }
.bdx-score-bar > span { display:block; height:100%; width:0%; transition:width .18s ease; }
```

Add your design system tokens (colours, typography) as needed. The canvas background can be themed via CSS custom properties used by the script (e.g. `--_semantic---background--background-primary`).

---

## 🔌 Script order & initialisation

Include the inline **app script** before loading the libraries is fine, because the app defers execution until DOM ready (and checks for `#myContainer`). Just ensure the libraries are available **by the time initialisation runs**.

```html
<!-- App script (inline or bundled) -->
<script src="app-matter-hero.js" defer></script>

<!-- Libraries -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.20.0/matter.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pathseg@1.2.1/pathseg.js"></script>
```

The bootstrap calls `initMatterJS()` once it detects `#myContainer`. It will **skip** if already initialised.

---

## 🧠 Data model for shapes

Shapes are created in code via:

```js
bodyFromPath(id, x, y, fill, label, link, media)
```

- `id` — SVG path ID to read vertices from (e.g. `"shape1"`).
- `x, y` — initial position on the canvas.
- `fill` — hex or CSS colour.
- `label` — text rendered on the body (centre‑aligned, rotates with the body).
- `link` — optional URL to open when tapped/clicked.
- `media` — optional object (see below).

### Media object variants
```js
{ type: "image",  title, src }
{ type: "video",  title, src, poster? }
{ type: "youtube", title, id }           // id = YouTube video id
{ type: "iframe", title, src }
{ type: "html",   title, html }          // inline HTML content
```

> On pointer *tap* (not a drag), if `media` exists, the modal opens. Else if `link` exists, the browser navigates to the link.

---

## 🔊 Sound system

- WebAudio **AudioContext** is created on the **first user gesture** (browser policy).
- Collisions above a speed threshold play a short **triangle‑wave pop** (`bdxPlayPop`), throttled per body via a cooldown map.
- A **sound toggle** (`#bdx-sound`) in the UI can persist state in `localStorage` (`bdxSound`). There’s also a `.voice-control` mirror for accessible toggle text/ARIA.

---

## 🧮 Scoring system

- Only collisions **between shapes** (not walls) can score.
- Score increments scale with **relative velocity**, with a **per‑pair cooldown** to avoid spamming.
- A **4‑second interaction window** after any user input enables scoring (prevents idle points).
- HUD updates: bar fill (`#bdxScoreFill`) and number (`#bdxScoreNum`). At 100% a “You won!” modal appears.
- `#bdxScoreReset` resets score, cooldowns and “win” state.

---

## 🪟 Modal behaviour

- Global `window.openModal(media, fallbackTitle?)` handles all media types.
- Body receives `bdx-modal-open` (locks background scroll).
- Close options: close button, backdrop click, or `Esc` key.
- For `type: "html"` modals, closing **resets** the scene (positions, score, cooldowns) to a fresh state.

---

## 📱 Responsiveness

- Shapes scale **uniformly** from a 1280×800 base using `getResponsiveScale()`.
- On **resize**: canvas is resized, **walls are rebuilt**, shapes are **scaled & clamped** back into safe margins.
- A guard prevents redundant re‑scaling when the computed ratio is ~1.

---

## 🧯 Lifecycle & cleanup

- **Visibility**: when the tab is hidden, Runner/Render are stopped; on show, they’re resumed, bodies are woken, cooldowns reset, audio resumed if enabled.
- **Unload**: on `beforeunload`, `cleanupMatterJS()` stops/clears engine, render, runner, listeners — helpful for SPA navigation or hot reloads.

---

## ♿ Accessibility

- Score HUD uses `aria-live="polite"` to announce changes without being disruptive.
- `.voice-control` is given `role="button"`, `tabindex="0"`, and keyboard handlers for **Enter/Space**.
- Modal respects **focus escape** patterns (backdrop click, `Esc`) and avoids scroll traps by toggling `body.bdx-modal-open`.
- Canvas has `touch-action: pan-y` so vertical scrolling works on touch devices when not dragging.

---

## 🔧 Extending / theming

- **Add a shape**: include an SVG `<path id="shapeX">` and call `bodyFromPath("shapeX", x, y, "#hex", "Label", link?, media?)` in the init list.
- **Change colours**: use the colour inputs in `#colorPanel` (optional), or set `render.fillStyle` in code.
- **Change text styling**: edit the `afterRender` label drawing (font, size, weight).
- **Add media types**: extend `openModal()` with a new `type` branch.
- **Adjust physics feel**: tweak body options (restitution, frictionAir) or wall placements.

---

## 🧪 Troubleshooting

- **Nothing renders**: check Matter.js is loaded and `#myContainer` exists at init. Ensure SVG paths with the expected IDs exist.
- **Click opens nothing**: confirm the shape has `media` or `link` set. Remember taps are detected when pointer down/up distance < 5px (not a drag).
- **Shapes vanish**: the after‑update hook teleports out‑of‑bounds bodies back in; if still “lost”, inspect walls and canvas dimensions on resize.
- **Audio silent**: browser blocks audio until a user gesture; try a click inside the canvas to prime the context. Also check the sound toggle state.
- **Scroll conflicts**: if you introduce virtual scrolling (e.g., GSAP ScrollSmoother), review the canvas wheel/touch listeners to keep page scroll smooth.

---

## 🔐 Known assumptions

- The app expects **four** SVG shapes with IDs `shape1…shape4` by default (you can change the list).
- Score HUD IDs: `#bdxScoreFill`, `#bdxScoreNum`, `#bdxScoreReset` must exist if you keep scoring enabled.
- Modal IDs: `#bdxMediaModal`, `#bdxModalBody`, `#bdxMediaTitle`, `#bdxModalClose` must exist to open media.

---

## 📏 Configuration quick refs

- **Base size** for scaling: **1280×800** (edit `BASE_W`, `BASE_H`).
- **Walls thickness**: `t = 200` (keeps fast bodies inside even at edges).
- **Sound**: min speed `1.2`, cooldown `120ms`.
- **Score**: min speed `2.2`, per‑pair cooldown `600ms`, interaction window `4s`.
- **Out‑of‑bounds padding**: `PAD = 220` in the after‑update reset.

---

## 🧭 File organisation suggestion

```
/src
  /js/app-matter-hero.js
  /css/hero.css
  /partials/modal.html
  /partials/score-hud.html
  /assets/svg/shapes.svg
/README_MatterHero.md
```

Keep the shapes SVG in a separate file and inline it server‑side or embed via `<use>` with IDs available at init.

---

## ✅ Launch checklist

- [ ] Matter.js and pathseg included
- [ ] `#myContainer` present and visible
- [ ] SVG `<path id="shape…">` elements available before init
- [ ] Modal + HUD markup present
- [ ] Colours/theme tokens loaded
- [ ] Test resize, mobile tap, and tab hide/show
- [ ] Confirm audio toggle + first‑gesture priming
- [ ] Verify links/media open as expected

---

## © Notes

Crafted for **ByDefault**. Designed to be playful, accessible, and culturally tuned — by default.
