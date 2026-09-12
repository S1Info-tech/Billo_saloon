/**
 * ==========================================================================
 * BILLU SALOON — CINEMATIC 3D WEB APPLICATION
 * Three.js Procedural 3D Engine, GSAP Scroll Director & UI Controller
 * ==========================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
   * 1. GLOBAL STATE & CONSTANTS
   * -------------------------------------------------------------------------- */
  let canvas = null;
  let loadingVeil = null;
  let isAppLoaded = false;
  let is3DActive = false;
  
  // Camera & Director Coordinates
  const cameraCoord = {
    x: 0,
    y: 3.2,
    z: 13.0,
    targetX: 0,
    targetY: 1.2,
    targetZ: 0
  };

  // Mouse Parallax Offsets
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let clock = null;

  let scene = null;
  let camera = null;
  let renderer = null;
  let keySpotLight = null;
  let cyanRimLight = null;
  let amberWallLight = null;
  let ambientLight = null;
  let barberPoleTexture = null;
  let dustParticles = null;
  let shearsGroup = null;
  let straightRazorGroup = null;
  let chairGroup = null;

  /**
   * Safe WebGL Context Detection
   */
  function isWebGLAvailable() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl') || testCanvas.getContext('webgl2')));
    } catch (e) {
      return false;
    }
  }

  /**
   * Safe Loading Screen Dismissal (Guaranteed to hide veil and reveal application)
   */
  function dismissLoadingScreen(mode = 'success') {
    if (isAppLoaded) return;
    isAppLoaded = true;

    if (!loadingVeil) {
      loadingVeil = document.getElementById('loading-veil');
    }

    if (loadingVeil) {
      loadingVeil.classList.add('loaded');
      setTimeout(() => {
        if (loadingVeil) {
          loadingVeil.style.display = 'none';
          loadingVeil.style.pointerEvents = 'none';
        }
      }, 1000);
    }
    console.log(`[Billu Saloon] Application loaded successfully (mode: ${mode}).`);
  }

  /**
   * Graceful Fallback Mode (If 3D/WebGL fails, renders luxury 2D atmosphere)
   */
  function activateFallbackMode(reason = 'unknown') {
    is3DActive = false;
    document.body.classList.add('three-fallback');
    if (!canvas) {
      canvas = document.getElementById('webgl-canvas');
    }
    if (canvas) {
      canvas.style.display = 'none';
    }
    console.warn(`[Billu Saloon] Activated graceful atmospheric fallback (reason: ${reason}).`);
  }

  /* --------------------------------------------------------------------------
   * 2. PROCEDURAL TEXTURE GENERATORS (Zero-dependency canvas textures)
   * -------------------------------------------------------------------------- */
  
  /**
   * Generates a photorealistic dark herringbone parquet wood floor texture
   */
  function createHerringboneFloorTexture() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Deep rich wood base
    ctx.fillStyle = '#100c08';
    ctx.fillRect(0, 0, size, size);

    const plankW = 64;
    const plankH = 256;

    // Draw interlocking herringbone parquet pattern
    for (let y = -plankH; y < size + plankH; y += plankW * 2) {
      for (let x = -plankH; x < size + plankH; x += plankH) {
        // Left slant plank
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);

        // Wood tone variations
        const lightness = 12 + Math.floor(Math.random() * 8);
        ctx.fillStyle = `hsl(28, 25%, ${lightness}%)`;
        ctx.fillRect(0, 0, plankH, plankW - 2);

        // Wood grain streaks
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let g = 0; g < 4; g++) {
          ctx.fillRect(0, Math.random() * plankW, plankH, 1.5);
        }
        // Plank beveled edge shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(0, plankW - 2, plankH, 2);
        ctx.restore();

        // Right slant plank
        ctx.save();
        ctx.translate(x + plankH / 2, y + plankW);
        ctx.rotate(-Math.PI / 4);

        const lightness2 = 12 + Math.floor(Math.random() * 8);
        ctx.fillStyle = `hsl(28, 25%, ${lightness2}%)`;
        ctx.fillRect(0, 0, plankH, plankW - 2);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let g = 0; g < 4; g++) {
          ctx.fillRect(0, Math.random() * plankW, plankH, 1.5);
        }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(0, plankW - 2, plankH, 2);
        ctx.restore();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }

  /**
   * Generates bump map for floor texture
   */
  function createFloorBumpMap() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    // Subtle noise and seam lines
    const imgData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 25;
      imgData.data[i] += noise;
      imgData.data[i + 1] += noise;
      imgData.data[i + 2] += noise;
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }

  /**
   * Generates an exposed heritage brick texture with dark charcoal mortar
   */
  function createCharcoalBrickTexture() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Mortar background
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, size, size);

    const brickW = 120;
    const brickH = 44;
    const mortar = 6;

    let row = 0;
    for (let y = 0; y < size; y += brickH + mortar) {
      const offsetX = (row % 2) * (brickW / 2);
      for (let x = -brickW; x < size + brickW; x += brickW + mortar) {
        const brickX = x + offsetX;
        
        // Brick color tone variation: charcoal, deep slate, burnt umber hints
        const tone = 14 + Math.floor(Math.random() * 8);
        ctx.fillStyle = `rgb(${tone + 4}, ${tone + 2}, ${tone + 6})`;
        ctx.fillRect(brickX, y, brickW, brickH);

        // Brick surface texture stippling
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        for (let s = 0; s < 12; s++) {
          ctx.fillRect(
            brickX + Math.random() * brickW,
            y + Math.random() * brickH,
            Math.random() * 8,
            Math.random() * 4
          );
        }
      }
      row++;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 2);
    return texture;
  }

  /**
   * Generates animated Barber Pole helical candy-cane stripes texture
   */
  function createBarberPoleTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const stripeW = 48;
    const colors = ['#d62828', '#ffffff', '#0077b6', '#ffffff'];

    for (let y = -size; y < size * 2; y += stripeW * 4) {
      for (let c = 0; c < colors.length; c++) {
        ctx.fillStyle = colors[c];
        ctx.beginPath();
        ctx.moveTo(0, y + c * stripeW);
        ctx.lineTo(size, y + c * stripeW + size);
        ctx.lineTo(size, y + (c + 1) * stripeW + size);
        ctx.lineTo(0, y + (c + 1) * stripeW);
        ctx.closePath();
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  /* --------------------------------------------------------------------------
   * 3. THREE.JS SCENE SETUP & LIGHTING
   * -------------------------------------------------------------------------- */
  function initThree() {
    canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      throw new Error('Canvas #webgl-canvas element not found');
    }
    clock = new THREE.Clock();

    // 3.1 Scene & Camera
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.045);

    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(cameraCoord.x, cameraCoord.y, cameraCoord.z);
    camera.lookAt(cameraCoord.targetX, cameraCoord.targetY, cameraCoord.targetZ);

    // 3.2 WebGLRenderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3.3 Cinematic Studio Lights
    // Key Spotlight directly over barber chair
    keySpotLight = new THREE.SpotLight(0xffe8c2, 0.1); // Starts dim for intro flicker
    keySpotLight.position.set(0, 6.5, 1.2);
    keySpotLight.target.position.set(0, 1.1, 0);
    keySpotLight.angle = 0.58;
    keySpotLight.penumbra = 0.75;
    keySpotLight.decay = 1.6;
    keySpotLight.distance = 25;
    keySpotLight.castShadow = true;
    keySpotLight.shadow.mapSize.width = 2048;
    keySpotLight.shadow.mapSize.height = 2048;
    keySpotLight.shadow.bias = -0.0001;
    keySpotLight.shadow.camera.near = 0.5;
    keySpotLight.shadow.camera.far = 25;
    scene.add(keySpotLight);
    scene.add(keySpotLight.target);

    // Cyan Neon Edge Rim Light (Sharp silhouette highlights)
    cyanRimLight = new THREE.PointLight(0x00e5ff, 4.0, 16);
    cyanRimLight.position.set(-3.6, 1.6, 2.2);
    scene.add(cyanRimLight);

    // Amber Back/Wall Wash Light (Rich heritage warmth)
    amberWallLight = new THREE.PointLight(0xff9100, 3.8, 14);
    amberWallLight.position.set(3.2, 2.4, -1.2);
    scene.add(amberWallLight);

    // Ambient Lighting (Gentle twilight fill)
    ambientLight = new THREE.AmbientLight(0x0b111e, 1.2);
    scene.add(ambientLight);

    // 3.4 Build Environment & Models
    buildRoomEnvironment();
    buildVintageBarberChair();
    buildVanityStationAndTools();
    buildAtmosphericDustParticles();

    // 3.5 Event Listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
  }

  /* --------------------------------------------------------------------------
   * 4. PROCEDURAL 3D ARCHITECTURE & PROPS
   * -------------------------------------------------------------------------- */

  /**
   * Builds the floor, back brick accent wall, vanity mirror with LED strip, and barber pole
   */
  function buildRoomEnvironment() {
    // Floor
    const floorTexture = createHerringboneFloorTexture();
    const floorBump = createFloorBumpMap();
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      bumpMap: floorBump,
      bumpScale: 0.04,
      roughness: 0.35,
      metalness: 0.08
    });
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Back Exposed Charcoal Brick Wall
    const brickTexture = createCharcoalBrickTexture();
    const brickMat = new THREE.MeshStandardMaterial({
      map: brickTexture,
      roughness: 0.85,
      metalness: 0.05
    });
    const wallGeo = new THREE.PlaneGeometry(30, 14);
    const wallMesh = new THREE.Mesh(wallGeo, brickMat);
    wallMesh.position.set(0, 7, -3.8);
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);

    // Vanity Mirror System
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(0, 3.2, -3.72);

    // Mirror Brass Outer Frame
    const frameGeo = new THREE.BoxGeometry(4.2, 5.2, 0.08);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.castShadow = true;
    mirrorGroup.add(frameMesh);

    // Mirror Glass Surface (High reflectivity glass)
    const glassGeo = new THREE.PlaneGeometry(3.9, 4.9);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1a2233,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0x050810
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.z = 0.045;
    mirrorGroup.add(glassMesh);

    // Perimeter LED Cove Lighting Strip
    const ledGeo = new THREE.PlaneGeometry(4.05, 5.05);
    const ledMat = new THREE.MeshBasicMaterial({
      color: 0xffeaad,
      transparent: true,
      opacity: 0.35
    });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.z = 0.042;
    mirrorGroup.add(ledMesh);

    scene.add(mirrorGroup);

    // Vintage Rotating Barber Pole
    buildBarberPole();
  }

  /**
   * Builds the iconic vintage barber pole with brass caps and rotating helical cylinder
   */
  function buildBarberPole() {
    const poleGroup = new THREE.Group();
    poleGroup.position.set(3.8, 3.2, -3.2);

    // Wall mounting bracket
    const mountGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2
    });
    const mountUpper = new THREE.Mesh(mountGeo, brassMat);
    mountUpper.rotation.x = Math.PI / 2;
    mountUpper.position.set(0, 1.1, -0.35);
    poleGroup.add(mountUpper);

    const mountLower = mountUpper.clone();
    mountLower.position.set(0, -1.1, -0.35);
    poleGroup.add(mountLower);

    // Top and bottom brass finials
    const finialGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const topFinial = new THREE.Mesh(finialGeo, brassMat);
    topFinial.position.y = 1.35;
    poleGroup.add(topFinial);

    const bottomFinial = new THREE.Mesh(finialGeo, brassMat);
    bottomFinial.position.y = -1.35;
    poleGroup.add(bottomFinial);

    const capGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 24);
    const topCap = new THREE.Mesh(capGeo, brassMat);
    topCap.position.y = 1.15;
    poleGroup.add(topCap);

    const bottomCap = topCap.clone();
    bottomCap.position.y = -1.15;
    poleGroup.add(bottomCap);

    // Rotating Helical Cylinder
    barberPoleTexture = createBarberPoleTexture();
    const poleMat = new THREE.MeshStandardMaterial({
      map: barberPoleTexture,
      roughness: 0.2,
      metalness: 0.1
    });
    const cylinderGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.15, 32);
    const rotatingCylinder = new THREE.Mesh(cylinderGeo, poleMat);
    rotatingCylinder.name = 'barberPoleCylinder';
    poleGroup.add(rotatingCylinder);

    // Outer Glass Enclosure
    const glassEnclosureGeo = new THREE.CylinderGeometry(0.21, 0.21, 2.2, 32);
    const glassEnclosureMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5
    });
    const glassEnclosure = new THREE.Mesh(glassEnclosureGeo, glassEnclosureMat);
    poleGroup.add(glassEnclosure);

    // Internal soft light inside pole
    const poleLight = new THREE.PointLight(0xfff5e0, 1.5, 4);
    poleLight.position.set(0, 0, 0);
    poleGroup.add(poleLight);

    scene.add(poleGroup);
  }

  /**
   * Detailed procedural model of a vintage hydraulic luxury barber chair
   */
  function buildVintageBarberChair() {
    chairGroup = new THREE.Group();
    chairGroup.position.set(0, 0, 0);

    // Shared Materials
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.12
    });

    const brushedMetalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.28
    });

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x22110c, // Deep antique espresso / burgundy leather
      roughness: 0.38,
      metalness: 0.12
    });

    const leatherHighlightMat = new THREE.MeshStandardMaterial({
      color: 0x2e1811,
      roughness: 0.32,
      metalness: 0.1
    });

    // 1. Hydraulic Base
    const baseGeo = new THREE.CylinderGeometry(1.25, 1.35, 0.14, 48);
    const baseMesh = new THREE.Mesh(baseGeo, chromeMat);
    baseMesh.position.y = 0.07;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    chairGroup.add(baseMesh);

    // Collar bevel
    const collarGeo = new THREE.CylinderGeometry(0.85, 1.15, 0.12, 36);
    const collarMesh = new THREE.Mesh(collarGeo, chromeMat);
    collarMesh.position.y = 0.19;
    collarMesh.castShadow = true;
    chairGroup.add(collarMesh);

    // Main Hydraulic Piston
    const pistonGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.8, 32);
    const pistonMesh = new THREE.Mesh(pistonGeo, chromeMat);
    pistonMesh.position.y = 0.6;
    pistonMesh.castShadow = true;
    chairGroup.add(pistonMesh);

    // 2. Hydraulic Foot Pump Lever & Tilt Recline Lever
    const pumpStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 16);
    const pumpStem = new THREE.Mesh(pumpStemGeo, chromeMat);
    pumpStem.rotation.z = Math.PI / 4;
    pumpStem.position.set(0.45, 0.35, 0.2);
    chairGroup.add(pumpStem);

    const pumpPedalGeo = new THREE.BoxGeometry(0.18, 0.05, 0.1);
    const pedalMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const pumpPedal = new THREE.Mesh(pumpPedalGeo, pedalMat);
    pumpPedal.position.set(0.68, 0.58, 0.2);
    chairGroup.add(pumpPedal);

    // 3. Chrome Footrest Assembly
    const footrestGroup = new THREE.Group();
    footrestGroup.position.set(0, 0.45, 0.95);

    // Dual chrome support arms
    const armLeftGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 16);
    const armLeft = new THREE.Mesh(armLeftGeo, chromeMat);
    armLeft.rotation.x = Math.PI / 6;
    armLeft.position.set(-0.45, 0, 0);
    footrestGroup.add(armLeft);

    const armRight = armLeft.clone();
    armRight.position.set(0.45, 0, 0);
    footrestGroup.add(armRight);

    // Footrest Plate
    const plateGeo = new THREE.BoxGeometry(1.15, 0.05, 0.55);
    const plateMesh = new THREE.Mesh(plateGeo, chromeMat);
    plateMesh.position.set(0, -0.22, 0.22);
    plateMesh.rotation.x = -Math.PI / 12;
    plateMesh.castShadow = true;
    footrestGroup.add(plateMesh);

    // Calf support leather pad
    const calfPadGeo = new THREE.BoxGeometry(1.0, 0.22, 0.08);
    const calfPad = new THREE.Mesh(calfPadGeo, leatherMat);
    calfPad.position.set(0, -0.05, 0.05);
    footrestGroup.add(calfPad);

    chairGroup.add(footrestGroup);

    // 4. Seat Undercarriage & Seat Cushion
    const seatBaseGeo = new THREE.BoxGeometry(1.45, 0.12, 1.45);
    const seatBaseMesh = new THREE.Mesh(seatBaseGeo, brushedMetalMat);
    seatBaseMesh.position.y = 1.0;
    seatBaseMesh.castShadow = true;
    chairGroup.add(seatBaseMesh);

    // Main Tufted Leather Seat Cushion
    const seatCushionGeo = new THREE.CylinderGeometry(0.85, 0.88, 0.28, 36);
    const seatCushion = new THREE.Mesh(seatCushionGeo, leatherMat);
    seatCushion.position.y = 1.18;
    seatCushion.castShadow = true;
    chairGroup.add(seatCushion);

    // Decorative seat piping ring
    const pipeRingGeo = new THREE.TorusGeometry(0.86, 0.03, 16, 48);
    const pipeRing = new THREE.Mesh(pipeRingGeo, leatherHighlightMat);
    pipeRing.rotation.x = Math.PI / 2;
    pipeRing.position.y = 1.28;
    chairGroup.add(pipeRing);

    // 5. Contoured Tufted Backrest
    const backrestGroup = new THREE.Group();
    backrestGroup.position.set(0, 1.45, -0.55);
    backrestGroup.rotation.x = -0.12; // Slight ergonomic recline

    // Chrome backrest side hinge brackets
    const hingeLGeo = new THREE.BoxGeometry(0.06, 0.7, 0.12);
    const hingeL = new THREE.Mesh(hingeLGeo, chromeMat);
    hingeL.position.set(-0.72, 0.35, 0);
    backrestGroup.add(hingeL);

    const hingeR = hingeL.clone();
    hingeR.position.set(0.72, 0.35, 0);
    backrestGroup.add(hingeR);

    // Backrest leather pad
    const backCushionGeo = new THREE.BoxGeometry(1.36, 0.95, 0.22);
    const backCushion = new THREE.Mesh(backCushionGeo, leatherMat);
    backCushion.position.set(0, 0.5, 0);
    backCushion.castShadow = true;
    backrestGroup.add(backCushion);

    // Tufted button accents on backrest
    const buttonGeo = new THREE.SphereGeometry(0.04, 16, 16);
    for (let r = 0; r < 2; r++) {
      for (let c = -1; c <= 1; c++) {
        const button = new THREE.Mesh(buttonGeo, leatherHighlightMat);
        button.position.set(c * 0.35, 0.35 + r * 0.3, 0.12);
        backrestGroup.add(button);
      }
    }

    // 6. Adjustable Headrest
    const headrestStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 16);
    const headrestStemL = new THREE.Mesh(headrestStemGeo, chromeMat);
    headrestStemL.position.set(-0.18, 1.15, -0.02);
    backrestGroup.add(headrestStemL);

    const headrestStemR = headrestStemL.clone();
    headrestStemR.position.set(0.18, 1.15, -0.02);
    backrestGroup.add(headrestStemR);

    const headrestCushionGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.75, 24);
    const headrestCushion = new THREE.Mesh(headrestCushionGeo, leatherMat);
    headrestCushion.rotation.z = Math.PI / 2;
    headrestCushion.position.set(0, 1.38, 0.02);
    headrestCushion.castShadow = true;
    backrestGroup.add(headrestCushion);

    chairGroup.add(backrestGroup);

    // 7. Chrome & Leather Armrests
    function createArmrest(isLeft) {
      const armGroup = new THREE.Group();
      const xSign = isLeft ? -1 : 1;
      armGroup.position.set(xSign * 0.82, 1.1, -0.05);

      // Chrome vertical posts
      const postFrontGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.52, 16);
      const postFront = new THREE.Mesh(postFrontGeo, chromeMat);
      postFront.position.set(0, 0.25, 0.45);
      armGroup.add(postFront);

      const postBack = postFront.clone();
      postBack.position.set(0, 0.3, -0.4);
      armGroup.add(postBack);

      // Chrome top horizontal bar
      const barGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.95, 16);
      const bar = new THREE.Mesh(barGeo, chromeMat);
      bar.rotation.x = Math.PI / 2;
      bar.position.set(0, 0.52, 0.02);
      armGroup.add(bar);

      // Leather Armrest Pad
      const armPadGeo = new THREE.BoxGeometry(0.14, 0.06, 0.88);
      const armPad = new THREE.Mesh(armPadGeo, leatherHighlightMat);
      armPad.position.set(0, 0.56, 0.02);
      armPad.castShadow = true;
      armGroup.add(armPad);

      return armGroup;
    }

    chairGroup.add(createArmrest(true));
    chairGroup.add(createArmrest(false));

    scene.add(chairGroup);
  }

  /**
   * Builds the walnut vanity station, chrome shears, straight razor, aftershave bottles
   */
  function buildVanityStationAndTools() {
    const vanityGroup = new THREE.Group();
    vanityGroup.position.set(0, 0, -2.4);

    // Materials
    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x1f140e,
      roughness: 0.5,
      metalness: 0.1
    });

    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0x141820,
      roughness: 0.15,
      metalness: 0.3
    });

    const chromeToolsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.04
    });

    const brassScrewMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2
    });

    // 1. Vanity Credenza Table
    const tableBodyGeo = new THREE.BoxGeometry(5.2, 0.95, 1.3);
    const tableBody = new THREE.Mesh(tableBodyGeo, walnutMat);
    tableBody.position.y = 0.48;
    tableBody.castShadow = true;
    tableBody.receiveShadow = true;
    vanityGroup.add(tableBody);

    // Marble Top Slab
    const slabGeo = new THREE.BoxGeometry(5.4, 0.08, 1.4);
    const slabMesh = new THREE.Mesh(slabGeo, marbleMat);
    slabMesh.position.y = 0.99;
    slabMesh.castShadow = true;
    slabMesh.receiveShadow = true;
    vanityGroup.add(slabMesh);

    // 2. High-Precision Barber Shears (Scissors)
    shearsGroup = new THREE.Group();
    shearsGroup.position.set(1.5, 1.05, 0.1);
    shearsGroup.rotation.y = -Math.PI / 5;
    shearsGroup.rotation.x = 0.08;

    // Blade 1 with finger ring
    const blade1Geo = new THREE.BoxGeometry(0.04, 0.015, 0.65);
    const blade1 = new THREE.Mesh(blade1Geo, chromeToolsMat);
    blade1.position.set(0, 0.02, 0.3);
    blade1.rotation.y = 0.06;
    blade1.castShadow = true;
    shearsGroup.add(blade1);

    // Blade 2 (Intersecting)
    const blade2 = blade1.clone();
    blade2.position.set(0.01, 0.015, 0.3);
    blade2.rotation.y = -0.08;
    shearsGroup.add(blade2);

    // Pivot Screw (Gold accent)
    const pivotGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.03, 16);
    const pivot = new THREE.Mesh(pivotGeo, brassScrewMat);
    pivot.position.set(0, 0.025, 0.12);
    shearsGroup.add(pivot);

    // Scissor Finger Rings
    const ringGeo = new THREE.TorusGeometry(0.09, 0.018, 16, 32);
    const ring1 = new THREE.Mesh(ringGeo, chromeToolsMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.set(-0.06, 0.02, -0.16);
    shearsGroup.add(ring1);

    const ring2 = ring1.clone();
    ring2.position.set(0.08, 0.02, -0.22);
    shearsGroup.add(ring2);

    // Finger Tang
    const tangGeo = new THREE.CylinderGeometry(0.015, 0.01, 0.14, 12);
    const tang = new THREE.Mesh(tangGeo, chromeToolsMat);
    tang.rotation.x = Math.PI / 3;
    tang.position.set(-0.14, 0.02, -0.26);
    shearsGroup.add(tang);

    vanityGroup.add(shearsGroup);

    // 3. Vintage Straight Razor (Cut-Throat)
    straightRazorGroup = new THREE.Group();
    straightRazorGroup.position.set(1.9, 1.05, 0.35);
    straightRazorGroup.rotation.y = Math.PI / 8;

    // Razor Scales (Handle)
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x0f1118,
      roughness: 0.2,
      metalness: 0.15
    });
    const handleGeo = new THREE.BoxGeometry(0.04, 0.035, 0.62);
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, 0.02, 0);
    straightRazorGroup.add(handle);

    // Razor Hollow-ground Steel Blade (partially open)
    const razorBladeGeo = new THREE.BoxGeometry(0.01, 0.07, 0.58);
    const razorBlade = new THREE.Mesh(razorBladeGeo, chromeToolsMat);
    razorBlade.position.set(0.08, 0.05, 0.42);
    razorBlade.rotation.y = 0.55; // Opened angle
    razorBlade.castShadow = true;
    straightRazorGroup.add(razorBlade);

    // Razor Pivot Pin
    const razorPin = new THREE.Mesh(pivotGeo, brassScrewMat);
    razorPin.position.set(0.02, 0.03, 0.26);
    straightRazorGroup.add(razorPin);

    // Leather Honing Strop on counter
    const stropMat = new THREE.MeshStandardMaterial({
      color: 0x4a2c16,
      roughness: 0.6,
      metalness: 0.05
    });
    const stropGeo = new THREE.BoxGeometry(0.24, 0.008, 1.05);
    const strop = new THREE.Mesh(stropGeo, stropMat);
    strop.position.set(1.95, 1.035, 0.2);
    vanityGroup.add(strop);

    vanityGroup.add(straightRazorGroup);

    // 4. Amber Glass Aftershave Bottle & Shaving Brush
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(-1.6, 1.03, 0.1);

    const bottleGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.45, 24);
    const amberGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.75,
      ior: 1.48
    });
    const bottle = new THREE.Mesh(bottleGeo, amberGlassMat);
    bottle.position.y = 0.23;
    bottle.castShadow = true;
    bottleGroup.add(bottle);

    const bottleCapGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16);
    const bottleCap = new THREE.Mesh(bottleCapGeo, brassScrewMat);
    bottleCap.position.y = 0.48;
    bottleGroup.add(bottleCap);

    // Pomade Metal Jar
    const jarGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 24);
    const jarMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.6, roughness: 0.3 });
    const jar = new THREE.Mesh(jarGeo, jarMat);
    jar.position.set(0.4, 0.07, 0.1);
    bottleGroup.add(jar);

    // Badger Hair Shaving Brush
    const brushHandleGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.2, 16);
    const brushHandle = new THREE.Mesh(brushHandleGeo, walnutMat);
    brushHandle.position.set(-0.35, 0.1, 0.1);
    bottleGroup.add(brushHandle);

    const bristleGeo = new THREE.ConeGeometry(0.09, 0.18, 16);
    const bristleMat = new THREE.MeshStandardMaterial({ color: 0xdcd6cd, roughness: 0.8 });
    const bristles = new THREE.Mesh(bristleGeo, bristleMat);
    bristles.position.set(-0.35, 0.27, 0.1);
    bottleGroup.add(bristles);

    vanityGroup.add(bottleGroup);

    scene.add(vanityGroup);
  }

  /**
   * Creates 150 soft floating golden dust particles drifting through the light
   */
  function buildAtmosphericDustParticles() {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 5.5 + 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = Math.random() * 0.003 + 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.userData = { velocities };

    const material = new THREE.PointsMaterial({
      color: 0xffe8a3,
      size: 0.038,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    dustParticles = new THREE.Points(geometry, material);
    scene.add(dustParticles);
  }

  /* --------------------------------------------------------------------------
   * 5. GSAP SCROLLTRIGGER CAMERA DIRECTOR & CINEMATIC INTRO
   * -------------------------------------------------------------------------- */

  /**
   * Initializes the cinematic camera movements across the 5 narrative sections
   */
  function initCameraDirector() {
    // Register GSAP ScrollTrigger plugin
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Intro Dolly-in from darkness into spotlight
      const introTl = gsap.timeline({
        onComplete: () => {
          dismissLoadingScreen('3d-intro-complete');
        }
      });

      // Camera dolly-in from distance 13 to 6.2
      introTl.to(cameraCoord, {
        x: 0,
        y: 1.8,
        z: 6.2,
        targetX: 0,
        targetY: 1.2,
        targetZ: 0,
        duration: 2.6,
        ease: 'power3.out'
      });

      // Key spotlight vintage neon/incandescent flicker ramp-up
      if (keySpotLight) {
        introTl.to(keySpotLight, {
          intensity: 2.5,
          duration: 0.15,
          ease: 'power1.in'
        }, 0.8)
        .to(keySpotLight, {
          intensity: 0.4,
          duration: 0.1,
          ease: 'power1.out'
        })
        .to(keySpotLight, {
          intensity: 8.5,
          duration: 0.8,
          ease: 'power2.out'
        });
      }

      // Fade in hero elements smoothly
      introTl.from('.hero-content > *', {
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 1.0,
        ease: 'power3.out'
      }, 1.2);

      // Setup ScrollTrigger scrubbing timeline across the 5 sections
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#app-overlay',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2
        }
      });

      // --- SECTION 1 -> SECTION 2: Swoop to The Craft (Shears & Straight Razor) ---
      scrollTl.to(cameraCoord, {
        x: 1.45,
        y: 1.35,
        z: 2.3,
        targetX: 1.75,
        targetY: 1.1,
        targetZ: 0.2,
        ease: 'power1.inOut'
      }, 0.1);

      // Subtle light shift to emphasize shears reflection
      scrollTl.to(cyanRimLight, {
        intensity: 6.0,
        ease: 'power1.inOut'
      }, 0.1);

      // --- SECTION 2 -> SECTION 3: Glide to Services Menu (45° Profile) ---
      scrollTl.to(cameraCoord, {
        x: -2.7,
        y: 1.65,
        z: 4.2,
        targetX: 0.2,
        targetY: 1.2,
        targetZ: -0.4,
        ease: 'power1.inOut'
      }, 0.35);

      scrollTl.to(amberWallLight, {
        intensity: 5.5,
        ease: 'power1.inOut'
      }, 0.35);

      // --- SECTION 3 -> SECTION 4: Ascend to Atmosphere (Barber Pole & Mirror Pan) ---
      scrollTl.to(cameraCoord, {
        x: 2.1,
        y: 2.35,
        z: 4.8,
        targetX: -0.4,
        targetY: 1.45,
        targetZ: -0.8,
        ease: 'power1.inOut'
      }, 0.65);

      // --- SECTION 4 -> SECTION 5: Settle into VIP Booking Throne Perspective ---
      scrollTl.to(cameraCoord, {
        x: 0.0,
        y: 1.65,
        z: 4.8,
        targetX: 0.0,
        targetY: 1.25,
        targetZ: 0.0,
        ease: 'power1.inOut'
      }, 0.88);
    } else {
      // Fallback if GSAP is not yet ready
      if (loadingVeil) loadingVeil.classList.add('loaded');
      cameraCoord.x = 0;
      cameraCoord.y = 1.8;
      cameraCoord.z = 6.2;
      keySpotLight.intensity = 8.5;
    }
  }

  /* --------------------------------------------------------------------------
   * 6. WEB AUDIO API SOUND ENGINE (Procedural synthesized audio)
   * -------------------------------------------------------------------------- */
  const soundEngine = {
    audioCtx: null,
    isMuted: true,
    humGain: null,

    init() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
    },

    toggle() {
      this.init();
      if (!this.audioCtx) return false;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.isMuted = !this.isMuted;

      if (!this.isMuted) {
        this.startHum();
      } else {
        this.stopHum();
      }
      return !this.isMuted;
    },

    startHum() {
      if (!this.audioCtx) return;
      if (this.humGain) {
        this.humGain.gain.setTargetAtTime(0.08, this.audioCtx.currentTime, 0.2);
        return;
      }

      // Generate soft warm vinyl room hum
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02; // Brown noise algorithm
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, this.audioCtx.currentTime);

      this.humGain = this.audioCtx.createGain();
      this.humGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.humGain);
      this.humGain.connect(this.audioCtx.destination);
      whiteNoise.start(0);
    },

    stopHum() {
      if (this.humGain && this.audioCtx) {
        this.humGain.gain.setTargetAtTime(0.0001, this.audioCtx.currentTime, 0.2);
      }
    },

    /**
     * Plays a procedural scissor snip sound effect on interactions
     */
    playScissorSnip() {
      if (this.isMuted || !this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      // High-pass band burst
      const bufferSize = this.audioCtx.sampleRate * 0.06;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, t);
      filter.Q.setValueAtTime(4.0, t);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      noise.start(t);
    }
  };

  /* --------------------------------------------------------------------------
   * 7. UI INTERACTIONS & BOOKING MODAL LOGIC
   * -------------------------------------------------------------------------- */
  function initUI() {
    // 7.1 Sound Toggle Button
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isPlaying = soundEngine.toggle();
        if (isPlaying) {
          audioBtn.classList.add('playing');
          audioIcon.className = 'fa-solid fa-volume-high';
          showToast('Salon Ambiance Audio: Activated');
          soundEngine.playScissorSnip();
        } else {
          audioBtn.classList.remove('playing');
          audioIcon.className = 'fa-solid fa-volume-xmark';
          showToast('Salon Audio: Muted');
        }
      });
    }

    // 7.2 Mobile Navigation Toggle
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        soundEngine.playScissorSnip();
      });
    }

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('open');
        soundEngine.playScissorSnip();
      });
    });

    // 7.3 Booking Modal Triggers
    const modal = document.getElementById('booking-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const bookingFormWrapper = document.getElementById('booking-form-wrapper');
    const bookingConfirmation = document.getElementById('booking-confirmation');
    const serviceSelect = document.getElementById('selected-service');
    const dateInput = document.getElementById('booking-date');

    // Pre-populate date input with tomorrow's date
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;
      dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    function openBookingModal(preselectedService) {
      if (modal) {
        modal.classList.add('active');
        if (bookingFormWrapper) bookingFormWrapper.style.display = 'block';
        if (bookingConfirmation) bookingConfirmation.classList.remove('active');

        if (preselectedService && serviceSelect) {
          for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].text.includes(preselectedService)) {
              serviceSelect.selectedIndex = i;
              break;
            }
          }
        }
        soundEngine.playScissorSnip();
      }
    }

    function closeBookingModal() {
      if (modal) {
        modal.classList.remove('active');
        soundEngine.playScissorSnip();
      }
    }

    // Modal open buttons
    const triggerButtons = [
      document.getElementById('header-book-btn'),
      document.getElementById('hero-book-btn'),
      document.getElementById('open-booking-modal-btn')
    ];

    triggerButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => openBookingModal());
      }
    });

    // Service card "Select" buttons
    document.querySelectorAll('.btn-book-service').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const serviceName = e.target.getAttribute('data-service') || 'The Master Haircut';
        openBookingModal(serviceName);
      });
    });

    // Modal Close
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeBookingModal();
      });
    }

    // 7.4 Barber Selection Pills
    const barberPills = document.querySelectorAll('.barber-pill');
    let selectedBarber = 'Billu (Founder)';
    barberPills.forEach(pill => {
      pill.addEventListener('click', () => {
        barberPills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        selectedBarber = pill.getAttribute('data-barber') || 'Billu (Founder)';
        soundEngine.playScissorSnip();
      });
    });

    // 7.5 Time Slot Buttons
    const timeSlots = document.querySelectorAll('.time-slot-btn');
    let selectedTime = '10:00 AM';
    timeSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        timeSlots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTime = slot.textContent.trim();
        soundEngine.playScissorSnip();
      });
    });

    // 7.6 Appointment Form Submission
    const form = document.getElementById('appointment-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const clientName = document.getElementById('client-name').value;
        const chosenService = serviceSelect.options[serviceSelect.selectedIndex].text;
        const bookingDateVal = dateInput.value;
        const randomRef = '#BLU-' + Math.floor(10000 + Math.random() * 90000);

        // Update confirmation view fields
        document.getElementById('confirm-ref').textContent = randomRef;
        document.getElementById('confirm-client').textContent = clientName;
        document.getElementById('confirm-service').textContent = chosenService;
        document.getElementById('confirm-barber').textContent = selectedBarber;
        document.getElementById('confirm-datetime').textContent = `${bookingDateVal} at ${selectedTime}`;

        // Switch to confirmation view
        if (bookingFormWrapper) bookingFormWrapper.style.display = 'none';
        if (bookingConfirmation) bookingConfirmation.classList.add('active');

        soundEngine.playScissorSnip();
        showToast('VIP Chair Reserved Successfully!');
      });
    }

    const confirmDoneBtn = document.getElementById('confirm-done-btn');
    if (confirmDoneBtn) {
      confirmDoneBtn.addEventListener('click', () => {
        closeBookingModal();
      });
    }

    // Scroll prompt click handler
    const scrollPrompt = document.getElementById('scroll-prompt');
    if (scrollPrompt) {
      scrollPrompt.addEventListener('click', () => {
        const craftSection = document.getElementById('craft');
        if (craftSection) {
          craftSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
   * 8. TOAST NOTIFICATION UTILITY
   * -------------------------------------------------------------------------- */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(60px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  /* --------------------------------------------------------------------------
   * 9. EVENT HANDLERS & ANIMATION RENDER LOOP
   * -------------------------------------------------------------------------- */
  function onMouseMove(event) {
    // Normalized device coordinates (-1 to 1)
    mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onWindowResize() {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  /**
   * Main 60 FPS Render Loop with Damping & Procedural Animations
   */
  function animate() {
    if (!is3DActive || !renderer || !scene || !camera) return;
    requestAnimationFrame(animate);

    const delta = clock ? clock.getDelta() : 0.016;
    const elapsedTime = clock ? clock.getElapsedTime() : 0;

    // 9.1 Mouse Parallax Lerp Damping
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Apply Director Camera Coordinates with Mouse Parallax
    camera.position.x = cameraCoord.x + mouse.x * 0.35;
    camera.position.y = cameraCoord.y + mouse.y * 0.22;
    camera.position.z = cameraCoord.z;

    camera.lookAt(
      cameraCoord.targetX + mouse.x * 0.15,
      cameraCoord.targetY + mouse.y * 0.1,
      cameraCoord.targetZ
    );

    // 9.2 Barber Pole Helical Stripe Scroll Animation
    if (barberPoleTexture) {
      barberPoleTexture.offset.y -= delta * 0.35;
    }

    // 9.3 Floating Dust Particles Drift
    if (dustParticles && dustParticles.geometry.attributes.position) {
      const positions = dustParticles.geometry.attributes.position.array;
      const velocities = dustParticles.geometry.userData.velocities;

      for (let i = 0; i < positions.length / 3; i++) {
        // Vertical upward drift with looping
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3] += Math.sin(elapsedTime + i) * 0.001;

        if (positions[i * 3 + 1] > 5.5) {
          positions[i * 3 + 1] = 0.2;
        }
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 9.4 Subtle breathing idle motion on straight razor & shears
    if (shearsGroup) {
      shearsGroup.rotation.z = Math.sin(elapsedTime * 1.5) * 0.02;
    }
    if (straightRazorGroup) {
      straightRazorGroup.rotation.z = Math.cos(elapsedTime * 1.2) * 0.015;
    }

    // 9.5 Render Scene
    renderer.render(scene, camera);
  }

  /* --------------------------------------------------------------------------
   * 10. ROBUST STARTUP & LIFECYCLE CONTROLLER
   * -------------------------------------------------------------------------- */
  function initializeApplication() {
    console.log('[Billu Saloon] Bootstrapping application...');
    loadingVeil = document.getElementById('loading-veil');
    canvas = document.getElementById('webgl-canvas');

    // 10.1 UI Interactivity initialized FIRST (guarantees buttons, booking form, audio work)
    try {
      initUI();
    } catch (uiErr) {
      console.warn('[Billu Saloon] UI initialization notice:', uiErr);
    }

    // 10.2 Hard Safety Timeout: Guarantee loading screen never blocks application indefinitely
    const safetyTimeout = setTimeout(() => {
      if (!isAppLoaded) {
        console.warn('[Billu Saloon] Safety timeout triggered (3.0s). Dismissing loading veil.');
        if (!is3DActive) {
          activateFallbackMode('timeout');
        }
        dismissLoadingScreen('safety-timeout');
      }
    }, 3000);

    // 10.3 Attempt 3D Atmosphere Initialization
    let threeReady = false;
    try {
      if (typeof THREE === 'undefined') {
        throw new Error('Three.js library not loaded or blocked');
      }
      if (!isWebGLAvailable()) {
        throw new Error('WebGL is not supported or hardware acceleration disabled');
      }

      initThree();
      is3DActive = true;
      threeReady = true;
      console.log('[Billu Saloon] Three.js 3D engine initialized successfully.');
    } catch (err) {
      console.error('[Billu Saloon] 3D initialization failed, falling back gracefully:', err.message);
      activateFallbackMode(err.message);
      dismissLoadingScreen('fallback-after-error');
      return;
    }

    // 10.4 Initialize Camera Director & Render Loop
    if (threeReady) {
      try {
        initCameraDirector();
        animate();
        // Dismiss loading screen quickly once 3D is active
        setTimeout(() => {
          dismissLoadingScreen('3d-active');
        }, 1200);
      } catch (directorErr) {
        console.warn('[Billu Saloon] Director initialization notice:', directorErr);
        dismissLoadingScreen('3d-partial');
      }
    }
  }

  // Safe DOM ready bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
  } else {
    initializeApplication();
  }

})();
