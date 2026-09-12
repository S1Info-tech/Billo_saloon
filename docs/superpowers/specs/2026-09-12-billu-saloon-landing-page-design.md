# Technical Design Specification: Billu Saloon 3D Cinematic Landing Page

**Date:** 2026-09-12  
**Project:** Billu Saloon — Cinematic 3D Barber Shop Web Application  
**Target Architecture:** Single Page Application (HTML5, CSS3, ES6 JavaScript, Three.js CDN, GSAP ScrollTrigger)  
**Status:** Validated Design Spec  

---

## 1. Executive Summary & Goals
Billu Saloon is a luxury, cinematic 3D web experience designed to showcase the prestige, precision craftsmanship, and vintage atmosphere of a world-class barbershop. Built with modern web technologies, the application delivers:
- An immersive 3D real-time scene featuring a detailed vintage barber chair, grooming vanity station with chrome scissors and straight razor, ambient mirrors, brick/wood architecture, and dynamic volumetric lighting.
- A seamless camera director system driven by GSAP ScrollTrigger, choreographing macro and panoramic views aligned with editorial narrative sections.
- A glassmorphic HUD overlay with fluid typography, responsive layout, appointment booking modal, and synthesized ambient salon sound.
- Zero-config deployment readiness for GitHub Pages, Vercel, or static web hosting with zero external heavy asset dependencies.

---

## 2. Technical Stack & Dependencies
The application uses pure standard web technologies without mandatory build or bundling steps, ensuring instant cross-platform execution:

- **Markup & Layout**: HTML5 semantic structure with responsive glassmorphic HUD layers.
- **Styling**: CSS3 custom properties, CSS Grid, Flexbox, `backdrop-filter: blur()`, and keyframe micro-animations.
- **3D Graphics Engine**: Three.js `r160` loaded via CDN (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r160/three.min.js`).
- **Animation & Scroll Director**: 
  - GSAP core `3.12.5` (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`)
  - GSAP ScrollTrigger `3.12.5` (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`)
- **Typography & Icons**: Google Fonts (`Cinzel` for editorial luxury headers, `Plus Jakarta Sans` for clean UI body text, FontAwesome 6 for iconography).
- **Audio Synthesis**: Native Web Audio API for organic ambient salon hum and scissor snip sound effects.

---

## 3. 3D Scene Architecture & Asset Construction

### 3.1 WebGL Renderer & Canvas Configuration
- **Antialiasing**: Enabled (`antialias: true`).
- **Alpha**: Transparent (`alpha: true`) allowing background styling integration.
- **Tone Mapping**: `THREE.ACESFilmicToneMapping` with exposure tuned to `1.15`.
- **Color Space**: `THREE.SRGBColorSpace` for precise color rendering.
- **Shadows**: Soft PCF shadow map (`renderer.shadowMap.enabled = true`, `renderer.shadowMap.type = THREE.PCFSoftShadowMap`).
- **Fog System**: `THREE.FogExp2('#07090e', 0.045)` to achieve natural falloff into dark perimeter walls.

### 3.2 Procedural 3D Environment & Props

1. **Vintage Hydraulic Barber Chair**:
   - **Hydraulic Pedestal**: Tiered chrome cylindrical base (`THREE.CylinderGeometry`) with brushed metalness (`0.9`), low roughness (`0.15`), and hydraulic lift cylinder.
   - **Footrest & Pump Lever**: Chrome footplate with embossed grip lines, articulated support arms, and foot-pump tilt lever.
   - **Tufted Leather Seat**: Beveled hexagonal/rounded cushion box with deep espresso/burgundy leather material (`roughness: 0.4`, `metalness: 0.1`) and piping seams.
   - **Contoured Backrest & Recline Bracket**: Ergonomic leather back support with side chrome hinges, headrest stem, and cushioned neck support.
   - **Armrests**: Curved polished steel tubes topped with stitched leather arm pads.

2. **Grooming Vanity Station & High-Detail Tools**:
   - **Station Credenza**: Rich dark walnut wooden vanity table with marble stone countertop.
   - **Precision Barber Shears**: Dual intersecting beveled stainless steel blades (`metalness: 0.95`, `roughness: 0.05`), brass pivot screw, finger tang, and contoured rubber inner grip rings.
   - **Classic Straight Razor**: Foldable polished steel hollow-ground blade with spine ridge, set into an ebony/pearlized resin scales handle resting ajar on a leather strop.
   - **Grooming Bottles & Jars**: Amber glass aftershave bottle with refraction, matte black pomade tins, and badger hair shaving brush with wooden handle.

3. **Shop Room Architecture & Surfaces**:
   - **Flooring**: Procedurally generated herringbone parquet dark timber texture mapped with realistic specular reflection and normal bump lines.
   - **Accent Wall**: Charcoal heritage exposed brick wall with mortar depth map.
   - **Mirrors**: Large floor-to-ceiling salon mirror framed with warm LED backlighting (`MeshStandardMaterial` with emissive glow strip).
   - **Barber Pole**: Vertical cylindrical pole with rotating helical red, white, and blue stripe shader/canvas texture, encased in brass caps with glowing frosted glass.
   - **Atmospheric Motile Dust**: 150 floating luminous dust particles (`THREE.Points`) drifting subtly in the spotlight beam.

### 3.3 Lighting Choreography
- **Key Overhead Spotlight**: Warm incandescent spotlight (`THREE.SpotLight`, `#ffe5b4`, `intensity: 8.5`, `angle: 0.52`, `penumbra: 0.7`, `castShadow: true`) aimed directly at the chair.
- **Cool Neon Edge Rim**: Cyan point light (`#00e5ff`, `intensity: 4.0`, `distance: 14`) positioned low to the left to rim-light chrome edges and razor blades.
- **Warm Amber Wash**: Amber point light (`#ff8c00`, `intensity: 3.5`, `distance: 12`) illuminating the brick wall and grooming station.
- **Low Ambient Fill**: Deep twilight blue ambient light (`#080c14`, `intensity: 1.2`) ensuring soft, cinematic contrast without muddy blacks.

---

## 4. Camera Choreography & GSAP Scroll System

### 4.1 Intro Cinematic Sequence
1. Upon page load, the camera starts in darkness at distance `(0.0, 3.5, 13.0)`.
2. GSAP animates camera position to `(0.0, 1.8, 6.2)` and lookAt target to `(0, 1.2, 0)` over 2.6s with `power3.out`.
3. The key spotlight ramps up intensity with a realistic dual flicker effect, illuminating the barber chair as hero title text staggers upward.

### 4.2 Scroll-Driven 3D Spatial Timeline
GSAP `ScrollTrigger` synchronizes the scroll container with 5 camera coordinates across the page:

| Section Name | Camera Coordinates `(X, Y, Z)` | LookAt Coordinates `(X, Y, Z)` | Visual Narrative Focus |
| :--- | :--- | :--- | :--- |
| **1. Hero** | `(0.0, 1.8, 6.2)` | `(0.0, 1.2, 0.0)` | Master wide view of the salon with the illuminated vintage chair. |
| **2. The Craft & Tools** | `(1.45, 1.35, 2.3)` | `(1.75, 1.1, 0.2)` | Dramatic macro swoop onto the straight razor and chrome shears. |
| **3. Services & Menus** | `(-2.7, 1.65, 4.2)` | `(0.2, 1.2, -0.4)` | 45° profile view framing the glassmorphic service cards. |
| **4. The Space & Ambiance**| `(2.1, 2.35, 4.8)` | `(-0.4, 1.45, -0.8)`| Panoramic high-angle pan capturing the mirror and spinning barber pole. |
| **5. VIP Chair Reservation**| `(0.0, 1.65, 4.8)` | `(0.0, 1.25, 0.0)` | Frontal hero perspective framing the interactive booking HUD. |

A subtle mouse-movement parallax damping factor (`0.05`) gently shifts the camera in response to cursor position, preserving natural perspective fluidity.

---

## 5. UI / HUD System & User Interactions

### 5.1 Glassmorphic Interface Structure
- **Navigation Bar**:
  - Brand Logo: "BILLU SALOON" with custom barber shears emblem.
  - Links: Experience, The Craft, Services, The Space, Contact.
  - Audio Ambience Toggle (interactive speaker button).
  - Quick Booking Trigger button.
- **Section 1 (Hero)**: High-impact headline *"THE PINNACLE OF GROOMING"*, editorial sub-header, social proof badge (4.9★ from 1,200+ clients), and scroll hint indicator.
- **Section 2 (The Craft)**: Interactive showcase of artisanal techniques (Honing & Stropping, Precision Shears, Hot Lather Treatment) with metallic accent badges.
- **Section 3 (Services)**: 4 glass cards with interactive hover 3D tilt:
  - *The Executive Haircut* ($45 / 45 min)
  - *Royal Straight Razor Shave* ($40 / 40 min)
  - *Beard Sculpting & Hot Towel* ($35 / 30 min)
  - *The Billu VIP Full Treatment* ($95 / 90 min)
- **Section 4 (The Space & Legacy)**: Ambient story, master barber profiles, working hours, and shop details.
- **Section 5 (VIP Booking Portal)**:
  - Interactive appointment configurator: Service selection, Master Barber picker, Date & Time slot selector, Client details input.
  - Interactive submit action generating an instant booking confirmation card with appointment ticket details.

### 5.2 Ambient Audio System (Web Audio API)
- Toggleable soundscape featuring an organic warm low-frequency vinyl room hum and crisp scissor snip clicks on button interactions.
- Completely synthesized in-code to remove external media loading latency and 404 risks.

---

## 6. Project Directory & File Layout
```
d:/Billu saloon/
├── index.html       # Primary single-page HTML5 semantic structure & CDN loaders
├── style.css        # Glassmorphic UI design system, responsive typography, HUD styles
├── app.js           # Three.js 3D scene engine, procedural models, GSAP ScrollTrigger timeline, UI logic
├── README.md        # Documentation, feature highlights, and zero-config deployment guide
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-09-12-billu-saloon-landing-page-design.md
```

---

## 7. Verification & Quality Assurance Plan
- **Visual & 3D Render Checks**: Verify 60 FPS smooth rendering, correct PBR material reflections on chrome and leather, and proper shadow falloff.
- **Scroll Synchronization**: Verify that GSAP ScrollTrigger transitions smoothly between all 5 camera viewpoints without jitter or coordinate snapping.
- **Responsiveness**: Verify proper HUD layout, modal centering, and canvas auto-resizing across desktop (1920x1080), laptop (1366x768), tablet (768x1024), and mobile (375x812) viewports.
- **Interactive Functionality**: Test navigation anchor scrolling, sound synthesis toggle, service selection, and the appointment booking modal workflow.
- **Zero-Dependency Guarantee**: Confirm zero external asset load failures or CORS issues on static local execution.
