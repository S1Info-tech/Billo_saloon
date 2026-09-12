# Billu Saloon 3D Cinematic Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a modern, cinematic 3D Barber Shop landing page web application for "Billu Saloon" using HTML5, CSS3, JavaScript, Three.js (via CDN), and GSAP with ScrollTrigger animations.

**Architecture:** Single-page architecture with index.html, style.css, and app.js. Three.js manages a WebGL scene with procedural 3D assets (vintage barber chair, grooming vanity, chrome shears, straight razor, brick and herringbone wood textures, volumetric fog, and multi-point cinematic lighting). GSAP and ScrollTrigger drive cinematic camera choreography coordinated with glassmorphic HUD overlay sections.

**Tech Stack:** HTML5, CSS3 (Glassmorphism, Flexbox, Grid), JavaScript (ES6+), Three.js r160 CDN, GSAP 3.12.5 & ScrollTrigger CDN, Web Audio API.

**Spec:** `docs/superpowers/specs/2026-09-12-billu-saloon-landing-page-design.md`

## Global Constraints
- Pure vanilla CDN stack: `index.html`, `style.css`, `app.js`, `README.md`.
- Zero external 3D file dependencies (`.gltf`/`.glb`) or external audio mp3 files: all assets, textures, and soundscapes are procedural to prevent CORS/404 issues.
- Responsive design across desktop, tablet, and mobile displays.
- Smooth 60 FPS rendering with ACESFilmicToneMapping and soft shadows.

---

### Task 1: Glassmorphic UI Design System & Styling (`style.css`)

**Files:**
- Create: `style.css`

**Interfaces:**
- Produces: CSS custom properties (`--bg-primary`, `--accent-gold`, `--accent-cyan`, `--glass-bg`, `--glass-border`), typography rules, layout utilities, animations, and modal styles consumed by `index.html`.

- [ ] **Step 1: Write complete `style.css`**
Include custom color palette, Google Fonts (`Cinzel` and `Plus Jakarta Sans`), reset, full-screen canvas container, glassmorphic HUD panels, sticky header, responsive service cards with hover glow, booking modal, sound indicator button, and mobile media queries.

- [ ] **Step 2: Verify CSS validity and linting**
Inspect file content and ensure all selectors and responsive breakpoints are properly formed.

- [ ] **Step 3: Commit**
`git add style.css`
`git commit -m "feat: add glassmorphic design system and responsive styles"`

---

### Task 2: Semantic HTML5 Architecture & Overlay HUD (`index.html`)

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `style.css`, Three.js CDN, GSAP CDN, ScrollTrigger CDN, FontAwesome CDN, Google Fonts.
- Produces: DOM elements (`#webgl-canvas`, `#nav`, `#hero`, `#craft`, `#services`, `#atmosphere`, `#booking-section`, `#booking-modal`) targeted by `app.js`.

- [ ] **Step 1: Write complete `index.html`**
Setup HTML structure with CDN resource imports, full-screen WebGL canvas, navigation bar with "BILLU SALOON" branding, audio toggle, 5 content sections with rich copy and stat badges, and the interactive booking modal dialog.

- [ ] **Step 2: Verify HTML DOM tags and CDN URLs**
Ensure all tags are closed, IDs match selector standards, and script tags load in proper order (`three.min.js` -> `gsap.min.js` -> `ScrollTrigger.min.js` -> `app.js`).

- [ ] **Step 3: Commit**
`git add index.html`
`git commit -m "feat: add semantic HTML5 structure with HUD overlay and booking modal"`

---

### Task 3: Procedural 3D Engine & Environment Setup (`app.js` - Phase 1)

**Files:**
- Create: `app.js`

**Interfaces:**
- Consumes: Three.js global `THREE`, DOM element `#webgl-canvas`.
- Produces: `initThree()`, `createProceduralTextures()`, `setupLighting()`, and animation render loop.

- [ ] **Step 1: Implement procedural canvas texture generators**
Generate herringbone parquet dark wood flooring canvas texture with bump map, exposed charcoal brick texture with mortar lines, and barber pole animated striped canvas texture.

- [ ] **Step 2: Configure WebGLRenderer, Camera, Fog, and Studio Lighting**
Setup `PerspectiveCamera`, `WebGLRenderer` with shadows and `ACESFilmicToneMapping`, `THREE.FogExp2('#07090e', 0.045)`, key tungsten spotlight, cyan edge rim light, amber wall wash, and ambient fill.

- [ ] **Step 3: Add shop walls, floor, ceiling, mirror with LED frame, and barber pole**
Construct the room geometry and materials with procedural bump maps.

- [ ] **Step 4: Commit**
`git add app.js`
`git commit -m "feat: initialize Three.js 3D engine, procedural textures, and studio lighting"`

---

### Task 4: Detailed Procedural 3D Props: Vintage Barber Chair, Shears & Razor (`app.js` - Phase 2)

**Files:**
- Modify: `app.js`

**Interfaces:**
- Consumes: Three.js scene from Task 3.
- Produces: `createVintageBarberChair()`, `createGroomingTools()`, and `createDustParticles()`.

- [ ] **Step 1: Construct the vintage hydraulic barber chair**
Assemble chrome tiered pedestal, hydraulic piston, foot pump lever, footrest plate with grip lines, deep espresso leather seat cushion, contoured backrest with recline hinges, adjustable headrest, and chrome/leather armrests.

- [ ] **Step 2: Construct the grooming vanity station and artisanal tools**
Add walnut vanity table with marble counter, chrome barber shears (overlapping beveled blades, finger tang, pivot screw), and folding straight razor (stainless steel hollow blade, resin scales handle).

- [ ] **Step 3: Add floating motile dust particle system**
Create 150 soft luminous particles (`THREE.Points`) drifting through the spotlight beam.

- [ ] **Step 4: Commit**
`git add app.js`
`git commit -m "feat: add procedural vintage barber chair, vanity station, shears, and razor"`

---

### Task 5: GSAP ScrollTrigger Camera Director, Web Audio & UI Interactivity (`app.js` - Phase 3)

**Files:**
- Modify: `app.js`

**Interfaces:**
- Consumes: GSAP `gsap`, `ScrollTrigger`, DOM buttons and booking form elements.
- Produces: `setupScrollAnimation()`, `setupIntroAnimation()`, `setupAudioEngine()`, and `setupBookingSystem()`.

- [ ] **Step 1: Implement cinematic intro sequence**
Dolly-in camera from `(0, 3.5, 13)` to `(0, 1.8, 6.2)`, spotlight power flicker ramp-up, and hero text entrance staggered animation.

- [ ] **Step 2: Implement GSAP ScrollTrigger 5-stage camera choreography**
Scrub-linked camera movement across Hero, Craft, Services, Atmosphere, and Booking coordinates with smooth lookAt interpolation.

- [ ] **Step 3: Implement Web Audio API procedural sound engine**
Create warm analog room hum and realistic scissors snip audio effect triggered on sound toggle and button interactions.

- [ ] **Step 4: Implement interactive booking modal and toast notification**
Connect appointment form inputs (service, barber, date, time slot, client info) to generate appointment confirmation card and feedback toast.

- [ ] **Step 5: Commit**
`git add app.js`
`git commit -m "feat: add GSAP ScrollTrigger camera director, audio synthesis, and booking system"`

---

### Task 6: Documentation, Deployment Setup & End-to-End Verification

**Files:**
- Create: `README.md`

**Interfaces:**
- Produces: Setup instructions, deployment guide for GitHub Pages & Vercel, and project feature documentation.

- [ ] **Step 1: Write `README.md`**
Provide project overview, feature breakdown, live preview instructions, and zero-config deployment steps for GitHub Pages and Vercel.

- [ ] **Step 2: Run verification checks**
Verify all files are present, start a local test server, verify no JavaScript console errors, verify WebGL context initializes cleanly, and verify all interactions work.

- [ ] **Step 3: Commit**
`git add README.md`
`git commit -m "docs: add README with feature guide and zero-config deployment instructions"`
