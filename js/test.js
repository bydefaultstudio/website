/**
 * Script Purpose: Test script to verify local development setup
 * Author: Erlen Masson
 * Created: 2025-10-12
 * Version: 1.0
 * Last Updated: 2025-10-12
 */

console.log("Test Script v1.0 — Test Module Loaded");

//
//------- Utility Functions -------//
//

// Get element by selector
function getElement(selector) {
  return document.querySelector(selector);
}

//
//------- Test Functions -------//
//

// Test DOM manipulation
function testDOMManipulation() {
  const body = getElement("body");
  if (body) {
    body.setAttribute("data-test", "active");
    body.style.transition = "background-color 0.3s ease";
  }
}

// Test event listeners
function testEventListeners() {
  let clickCount = 0;
  
  document.addEventListener("click", (e) => {
    clickCount++;
    const body = getElement("body");
    
    // Flash background on click
    if (body) {
      body.style.backgroundColor = clickCount % 2 === 0 ? "#0a0a0a" : "#0f0f0f";
    }
    
    // Create ripple effect
    createRipple(e.clientX, e.clientY);
  });
}

// Create ripple effect
function createRipple(x, y) {
  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(0, 255, 136, 0.5);
    transform: translate(-50%, -50%) scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
    z-index: 9999;
  `;
  
  document.body.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation
function addRippleAnimation() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ripple-animation {
      to {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

//
//------- Initialize -------//
//

document.addEventListener("DOMContentLoaded", () => {
  testDOMManipulation();
  testEventListeners();
  addRippleAnimation();
});

