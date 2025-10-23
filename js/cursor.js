/**
 * Script Purpose: Desktop custom cursor with GSAP follow + conflict-free nested data-cursor handling
 * Author: Erlen Masson
 * Version: 1.8.6
 * Started: [Start Date]
 * Last Updated: October 22, 2025
 */

console.log("Script - Cursor v1.8.6");

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".cursor-default");
  const cursorHalo = document.querySelector(".cursor-halo");

  // --- SAFEGUARD ---
  if (!cursor || !cursorHalo) {
    console.warn(
      "Custom Cursor skipped — .cursor-default or .cursor-halo not found."
    );
    return;
  }

  // --- PROGRESSIVE ENHANCEMENT ---
  // Check for GSAP dependency
  if (typeof gsap === 'undefined') {
    console.warn("Custom Cursor skipped — GSAP library not found.");
    return;
  }

  // Only hide default cursor when custom cursor is successfully initialized
  document.body.classList.add("custom-cursor-active");

  // ------- Helpers for resolving cursor type at pointer (child wins) ------- //
  function getCursorTypeAtPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const host = el.closest("[data-cursor]");
    return host ? host.getAttribute("data-cursor") : null;
  }

  function setCursorType(type) {
    const prev = setCursorType._activeType || null;
    if (type === prev) return;

    if (prev) cursor.classList.remove(`cursor-${prev}`);

    // Active hover/custom state
    if (type) {
      cursor.classList.add("cursor-custom", `cursor-${type}`);
    } else {
      cursor.classList.remove("cursor-custom");
    }

    setCursorType._activeType = type || null;
  }

  // Position tracking
  let mouseX = 0;
  let mouseY = 0;

  // GSAP follow + per-move cursor type resolve
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(cursor, {
      x: mouseX,
      y: mouseY,
      duration: 0.25,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(cursorHalo, {
      x: mouseX,
      y: mouseY,
      duration: 0.1,
      ease: "none",
      overwrite: "auto",
    });

    const type = getCursorTypeAtPoint(mouseX, mouseY);
    setCursorType(type);
  });

  // Press / Release
  document.addEventListener("mousedown", () => {
    cursorHalo.classList.add("cursor-pressed");
    gsap.to(cursorHalo, { duration: 0.2, ease: "power2.out" });
  });

  document.addEventListener("mouseup", () => {
    cursorHalo.classList.remove("cursor-pressed");
    gsap.to(cursorHalo, { duration: 0.2, ease: "power2.out" });
  });
});
