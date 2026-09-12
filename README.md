# 💈 Billu Saloon — Cinematic 3D Barber Shop Experience

A modern, cinematic 3D Barber Shop landing page web application for **Billu Saloon**, built with vanilla HTML5, CSS3, JavaScript, **Three.js (via CDN)**, and **GSAP ScrollTrigger**.

![Billu Saloon Preview](https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 1. Cinematic 3D Scene Setup (Three.js)
- **Zero Broken Assets / 0% CORS Errors**: All 3D models and materials (vintage barber chair, grooming vanity credenza, shears, straight razor, floor, and brick walls) are constructed **procedurally**, guaranteeing instant load times (<1s) and zero external file dependencies.
- **Lighting & Atmosphere**:
  - Warm overhead tungsten spotlight (`#ffe8c2`) with soft PCF shadow casting directly focused on the chair.
  - Cool neon cyan edge rim light (`#00e5ff`) tracing metallic silhouettes and blade edges.
  - Rich amber wall wash light (`#ff9100`) accentuating charcoal brick mortar.
  - Volumetric depth fog (`THREE.FogExp2`) and 180 floating luminous dust particles.
- **Procedural Canvas Textures**:
  - Dark herringbone parquet wood flooring with custom bump mapping.
  - Heritage charcoal brick accent wall with recessed mortar lines.
  - Rotating helical barber pole with red, white, and blue candy-cane striping.

### 2. Camera Director & Scroll Animations (GSAP ScrollTrigger)
- **Intro Cinematic Sequence**: Smooth dolly-in from darkness into the spotlight, complete with an incandescent flicker ramp-up and staggered text entrance.
- **Scroll-Synchronized 3D Positions**:
  1. **Hero**: Master panoramic view of the vintage chair and salon ambiance.
  2. **The Craft**: Dramatic macro swoop down to the vanity station, framing the chrome shears and straight razor.
  3. **Services Menu**: 45° profile view framing the glassmorphic service cards.
  4. **The Space**: High-angle pan showcasing the illuminated mirror and spinning barber pole.
  5. **VIP Booking**: Frontal hero vantage framing the interactive appointment configurator.
- **Micro-Parallax**: Interactive cursor tracking with lerp damping for physical depth.

### 3. Glassmorphic HUD & Appointment Booking
- **Modern Glassmorphic UI**: `backdrop-filter: blur(16px)`, gold and cyan gradient borders, and responsive grid layouts.
- **Interactive Appointment Modal**:
  - Service selection with duration & pricing.
  - Master barber selector (Billu, Marcus Vance, Elena Rossi).
  - Date picker & interactive time slot buttons.
  - Instant appointment confirmation receipt card with simulated reference ticket ID.

### 4. Native Web Audio API Sound Engine
- 100% procedural audio synthesis (no external mp3 files required):
  - Toggleable warm vinyl room ambiance hum (brown noise filter).
  - Tactile scissor snip audio clicks triggered on button and card interactions.

---

## 📁 File Structure

```
d:/Billu saloon/
├── index.html       # Primary single-page HTML5 semantic structure & CDN loaders
├── style.css        # Glassmorphic UI design system, typography, animations
├── app.js           # Three.js 3D engine, procedural props, GSAP ScrollTrigger timeline
├── README.md        # Project guide & zero-config deployment instructions
└── docs/
    └── superpowers/
        ├── specs/   # Architectural design specifications
        └── plans/   # Detailed task implementation plans
```

---

## 🚀 Instant Local Setup

Because the application uses official CDN imports and zero compilation steps, you can run it immediately with zero configuration:

### Option A: Direct Browser Launch
Simply double-click `index.html` or open it directly in any modern web browser (Chrome, Edge, Firefox, Safari, Arc).

### Option B: Lightweight Local Server
If you prefer running via a local HTTP server:

```bash
# Using Node.js (npx)
npx serve .

# Or using Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

---

## 🌐 Zero-Config Deployment

### 1. Deploy to GitHub Pages (Free)
1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/billu-saloon.git
   git push -u origin main
   ```
2. In your GitHub repository, go to **Settings** → **Pages**.
3. Under **Build and deployment** > **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live at `https://YOUR_USERNAME.github.io/billu-saloon/` within 60 seconds!

### 2. Deploy to Vercel (Free)
1. Install the Vercel CLI or import via the Vercel Dashboard:
   ```bash
   npx vercel
   ```
2. Accept the default options. Vercel automatically detects static HTML/JS and provides a global edge URL.

### 3. Deploy to Netlify
- Drag and drop the `Billu saloon` folder directly into [Netlify Drop](https://app.netlify.com/drop).

---

## 🛠️ Technology Stack
- **HTML5** & **CSS3** (Glassmorphism, CSS Custom Properties, Flexbox & Grid)
- **JavaScript (ES6+)**
- **Three.js r160** (WebGL Renderer, PBR Materials, PerspectiveCamera, Shadow Maps)
- **GSAP 3.12.5** & **ScrollTrigger 3.12.5**
- **Web Audio API** (Procedural synthesis)
- **Google Fonts** (*Cinzel* & *Plus Jakarta Sans*)
- **Font Awesome 6**
