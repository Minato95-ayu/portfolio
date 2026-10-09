import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  AAYU_CORE_STAR,
  TECH_GALAXY_BODIES,
  TechCelestialBody,
  TechCategory,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '../../data/techGalaxyData.ts';
import { sound } from '../../utils/audio.ts';

export type GalaxyViewMode = 'SOLAR_SYSTEM' | 'SPIRAL_GALAXY' | 'ORRERY_3D';

const linearToSrgb = (channel: number) =>
  channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;

const createSurfaceTexture = (body: TechCelestialBody) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const image = context.createImageData(canvas.width, canvas.height);
  const primary = new THREE.Color(body.color);
  const secondary = new THREE.Color(body.secondaryColor ?? body.color);
  const seed = body.id.split('').reduce((value, character) => value + character.charCodeAt(0), 0);

  for (let y = 0; y < canvas.height; y += 1) {
    const latitude = y / canvas.height;
    for (let x = 0; x < canvas.width; x += 1) {
      const longitude = x / canvas.width;
      const band = Math.sin(latitude * Math.PI * 30 + Math.sin(longitude * 15 + seed) * 0.55);
      const continent =
        Math.sin(longitude * 24 + Math.sin(latitude * 17 + seed) * 2.1) *
        Math.cos(latitude * 22 + Math.sin(longitude * 11 + seed) * 1.7);
      const grain = Math.sin(x * 12.9898 + y * 78.233 + seed * 0.37);
      const variation =
        body.category === 'AI_MODEL'
          ? 0.48 + band * 0.22 + continent * 0.1
          : 0.42 + continent * 0.3 + grain * 0.1;
      const shading = 0.78 + Math.sin(latitude * Math.PI) * 0.2;
      const blend = Math.max(0, Math.min(1, variation));
      const pixel = (y * canvas.width + x) * 4;

      image.data[pixel] =
        linearToSrgb((primary.r * (1 - blend) + secondary.r * blend) * shading) * 255;
      image.data[pixel + 1] =
        linearToSrgb((primary.g * (1 - blend) + secondary.g * blend) * shading) * 255;
      image.data[pixel + 2] =
        linearToSrgb((primary.b * (1 - blend) + secondary.b * blend) * shading) * 255;
      image.data[pixel + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const solveEccentricAnomaly = (meanAnomaly: number, eccentricity: number) => {
  let eccentricAnomaly = meanAnomaly;
  for (let iteration = 0; iteration < 5; iteration += 1) {
    eccentricAnomaly -=
      (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
      (1 - eccentricity * Math.cos(eccentricAnomaly));
  }
  return eccentricAnomaly;
};

interface TechGalaxySolarSystemSceneProps {
  reducedMotion?: boolean;
  activeSection?: string;
  isInteractiveMode?: boolean;
  onToggleInteractiveMode?: () => void;
}

export const TechGalaxySolarSystemScene: React.FC<TechGalaxySolarSystemSceneProps> = ({
  reducedMotion = false,
  activeSection = 'hero',
  isInteractiveMode = false,
  onToggleInteractiveMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UI state
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [selectedBody, setSelectedBody] = useState<TechCelestialBody | null>(null);
  const [hoveredBody, setHoveredBody] = useState<TechCelestialBody | null>(null);
  const [viewMode, setViewMode] = useState<GalaxyViewMode>('SOLAR_SYSTEM');
  const [activeCategory, setActiveCategory] = useState<TechCategory | 'ALL'>('ALL');
  const [orbitSpeedMultiplier, setOrbitSpeedMultiplier] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cameraFocusedOnBody, setCameraFocusedOnBody] = useState<string | null>(null);
  const [hudMinimized, setHudMinimized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const isInteractiveRef = useRef(isInteractiveMode);
  isInteractiveRef.current = isInteractiveMode;
  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;

  // References for animation & interaction loop
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const userRotation = useRef({ x: 0.25, y: 0 });
  const targetUserRotation = useRef({ x: 0.25, y: 0 });
  const cameraDistance = useRef(15);
  const targetCameraDistance = useRef(15);
  const cameraTargetPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentCameraTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Dynamic mesh map for raycasting & positions
  const planetMeshesRef = useRef<
    Map<
      string,
      {
        bodyGroup: THREE.Group;
        planetMesh: THREE.Mesh;
        sprite: THREE.Sprite;
        orbitLine: THREE.Line;
        data: TechCelestialBody;
        angle: number;
        eccentricity: number;
        moons: { mesh: THREE.Mesh; dist: number; speed: number; angle: number }[];
      }
    >
  >(new Map());
  const surfaceTexturesRef = useRef<THREE.CanvasTexture[]>([]);

  const viewModeRef = useRef<GalaxyViewMode>('SOLAR_SYSTEM');
  viewModeRef.current = viewMode;

  const activeCategoryRef = useRef<TechCategory | 'ALL'>('ALL');
  activeCategoryRef.current = activeCategory;

  const orbitSpeedRef = useRef(1);
  orbitSpeedRef.current = isPaused ? 0 : orbitSpeedMultiplier;

  const scrollRef = useRef({ progress: 0, targetProgress: 0 });
  const pointerNeedsRaycastRef = useRef(false);
  const hoveredBodyRef = useRef<TechCelestialBody | null>(null);

  useEffect(() => {
    if (isInteractiveMode) targetCameraDistance.current = 24;
  }, [isInteractiveMode]);

  // Helper to generate crisp billboard labels with tech symbol and category color
  const createLabelSprite = (text: string, symbol: string, colorHex: string): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Background rounded pill
      ctx.fillStyle = 'rgba(11, 14, 20, 0.88)';
      ctx.beginPath();
      ctx.roundRect(4, 4, 312, 72, 12);
      ctx.fill();

      // Border glow
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, 312, 72, 12);
      ctx.stroke();

      // Symbol
      ctx.font = '28px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(symbol, 38, 40);

      // Text label
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(text, 68, 40);

      // Category accent dot
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.arc(295, 40, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.7, 0.42, 1);
    return sprite;
  };

  useEffect(() => {
    // Check WebGL availability
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const lowPowerDevice = (navigator.hardwareConcurrency || 8) <= 4;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x080a0e, 0.022);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    camera.position.set(0, 7, cameraDistance.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowPowerDevice,
      alpha: true,
      powerPreference: lowPowerDevice ? 'low-power' : 'high-performance',
    });
    renderer.setClearColor(0x080a0e, 0);
    const maxPixelRatio = lowPowerDevice ? 1 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // --- Master World Hierarchy ---
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ==========================================
    // 1. CENTRAL STAR: AAYU CORE SUN
    // ==========================================
    const sunGroup = new THREE.Group();
    worldGroup.add(sunGroup);

    // Glowing Sun Sphere
    const sunGeom = new THREE.SphereGeometry(AAYU_CORE_STAR.size, 32, 32);
    const sunTexture = createSurfaceTexture({
      ...AAYU_CORE_STAR,
      color: '#F18A3B',
      secondaryColor: '#FFF1B8',
      category: 'SYSTEMS',
    });
    if (sunTexture) surfaceTexturesRef.current.push(sunTexture);
    const sunMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xc6ff3d,
      emissiveMap: sunTexture,
      emissiveIntensity: 1.2,
      map: sunTexture,
      roughness: 0.8,
      metalness: 0.05,
    });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    sunMesh.userData = { id: AAYU_CORE_STAR.id, isSun: true };
    sunGroup.add(sunMesh);

    // Inner Radiant Polyhedron
    const sunInnerGeom = new THREE.IcosahedronGeometry(AAYU_CORE_STAR.size * 0.75, 1);
    const sunInnerMat = new THREE.MeshBasicMaterial({
      color: 0xe5fbff,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    });
    const sunInnerMesh = new THREE.Mesh(sunInnerGeom, sunInnerMat);
    sunGroup.add(sunInnerMesh);

    // Coronal Plasma Corona Rings (Pulsing rings)
    const coronaRings: THREE.Mesh[] = [];
    for (let r = 0; r < 3; r++) {
      const coronaGeom = new THREE.TorusGeometry(
        AAYU_CORE_STAR.size * (1.25 + r * 0.22),
        0.02,
        16,
        80
      );
      const coronaMat = new THREE.MeshBasicMaterial({
        color: r === 0 ? 0xc6ff3d : r === 1 ? 0x4cc9f0 : 0x8b5cf6,
        transparent: true,
        opacity: 0.3 - r * 0.045,
      });
      const ringMesh = new THREE.Mesh(coronaGeom, coronaMat);
      ringMesh.rotation.x = (Math.PI / 3) * (r + 1);
      ringMesh.rotation.y = (Math.PI / 5) * r;
      sunGroup.add(ringMesh);
      coronaRings.push(ringMesh);
    }

    const sunAuraGeometry = new THREE.SphereGeometry(AAYU_CORE_STAR.size * 1.55, 32, 32);
    const sunAuraMaterial = new THREE.MeshBasicMaterial({
      color: 0x8cecff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.13,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sunAura = new THREE.Mesh(sunAuraGeometry, sunAuraMaterial);
    sunGroup.add(sunAura);

    // Sun Label Sprite
    const sunSprite = createLabelSprite('AAYU CORE STAR', '☀️', '#C6FF3D');
    sunSprite.position.set(0, AAYU_CORE_STAR.size + 0.65, 0);
    sunGroup.add(sunSprite);

    // Central Sun Light
    const sunLight = new THREE.PointLight(0xffe7b0, 7, 52, 1.25);
    sunLight.position.set(0, 0, 0);
    sunGroup.add(sunLight);

    const sunSecondaryLight = new THREE.PointLight(0x52d7f2, 0.8, 30, 1.4);
    sunGroup.add(sunSecondaryLight);

    // ==========================================
    // 2. CELESTIAL BODIES (TECH PLANETS & MOONS)
    // ==========================================
    const planetMap = new Map<
      string,
      {
        bodyGroup: THREE.Group;
        planetMesh: THREE.Mesh;
        sprite: THREE.Sprite;
        orbitLine: THREE.Line;
        data: TechCelestialBody;
        angle: number;
        eccentricity: number;
        moons: { mesh: THREE.Mesh; dist: number; speed: number; angle: number }[];
      }
    >();

    const planetAuraGeometry = new THREE.SphereGeometry(1, lowPowerDevice ? 16 : 24, lowPowerDevice ? 16 : 24);
    const planetAuraMaterials: THREE.MeshBasicMaterial[] = [];

    TECH_GALAXY_BODIES.forEach((body, idx) => {
      const bodyGroup = new THREE.Group();
      worldGroup.add(bodyGroup);
      const visualSize = body.size * 1.18;

      // 1. Orbit Path Ellipse / Circle
      const orbitPoints: THREE.Vector3[] = [];
      const segments = 120;
      const eccentricity = body.eccentricity ?? 0.025 + ((idx * 7) % 5) * 0.015;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const eccentricAnomaly = solveEccentricAnomaly(theta, eccentricity);
        const x = body.distance * (Math.cos(eccentricAnomaly) - eccentricity);
        const orbitDepth =
          body.distance * Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentricAnomaly);
        const z = orbitDepth * Math.cos(body.inclination);
        const y = orbitDepth * Math.sin(body.inclination);
        orbitPoints.push(new THREE.Vector3(x, y, z));
      }
      const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: body.hexColor,
        transparent: true,
        opacity: 0.22,
      });
      const orbitLine = new THREE.Line(orbitGeom, orbitMat);
      worldGroup.add(orbitLine);

      // 2. Planet Mesh Sphere
      const planetSegments = lowPowerDevice ? 20 : 40;
      const planetGeom = new THREE.SphereGeometry(visualSize, planetSegments, planetSegments);
      const surfaceTexture = createSurfaceTexture(body);
      if (surfaceTexture) surfaceTexturesRef.current.push(surfaceTexture);
      const auraMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(body.secondaryColor ?? body.color),
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      planetAuraMaterials.push(auraMaterial);
      const planetAura = new THREE.Mesh(planetAuraGeometry, auraMaterial);
      planetAura.scale.setScalar(visualSize * 1.65);
      bodyGroup.add(planetAura);

      const planetMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: surfaceTexture,
        bumpMap: surfaceTexture,
        bumpScale: 0.05,
        emissive: body.hexColor,
        emissiveIntensity: 0.3,
        roughness: body.category === 'AI_MODEL' ? 0.62 : 0.86,
        metalness: 0.1,
      });
      const planetMesh = new THREE.Mesh(planetGeom, planetMat);
      planetMesh.rotation.z = 0.18 + body.inclination;
      planetMesh.userData = { id: body.id, isPlanet: true };
      bodyGroup.add(planetMesh);

      // 3. Optional Planetary Ring (Saturn-like)
      if (body.hasRing) {
        const ringGeom = new THREE.RingGeometry(visualSize * 1.35, visualSize * 2.05, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: body.ringColor || body.hexColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.58,
        });
        const saturnRing = new THREE.Mesh(ringGeom, ringMat);
        saturnRing.rotation.x = Math.PI / 2.5;
        bodyGroup.add(saturnRing);
      }

      // 4. Orbiting Moons / Satellites
      const moonsList: { mesh: THREE.Mesh; dist: number; speed: number; angle: number }[] = [];
      if (body.moons && body.moons.length > 0) {
        body.moons.forEach((m, mIdx) => {
          const moonGeom = new THREE.SphereGeometry(visualSize * 0.16, 12, 10);
          const moonMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(m.color).getHex(),
            emissive: new THREE.Color(m.color).getHex(),
            emissiveIntensity: 0.08,
            roughness: 0.82,
            metalness: 0.04,
          });
          const moonMesh = new THREE.Mesh(moonGeom, moonMat);
          bodyGroup.add(moonMesh);
          moonsList.push({
            mesh: moonMesh,
            dist: m.dist + visualSize * 0.55,
            speed: (1.5 + mIdx * 0.8) * (mIdx % 2 === 0 ? 1 : -1),
            angle: Math.random() * Math.PI * 2,
          });
        });
      }

      // 5. Billboard Label with tech logo symbol & name
      const sprite = createLabelSprite(body.name, body.symbol, body.color);
      sprite.position.set(0, visualSize + 0.45, 0);
      bodyGroup.add(sprite);

      // Stagger initial orbital angles evenly around the sun
      const initialAngle = (idx / TECH_GALAXY_BODIES.length) * Math.PI * 2;

      planetMap.set(body.id, {
        bodyGroup,
        planetMesh,
        sprite,
        orbitLine,
        data: body,
        angle: initialAngle,
        eccentricity,
        moons: moonsList,
      });
    });

    planetMeshesRef.current = planetMap;

    // ==========================================
    // 3. COSMIC STELLAR GALAXY FIELD (2,000 STARS)
    // ==========================================
    const starCount = lowPowerDevice ? 1100 : 2600;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0xdcecff),
      new THREE.Color(0x9ecbff),
      new THREE.Color(0x52d7f2),
      new THREE.Color(0xa88bff),
      new THREE.Color(0xb6ff5c),
      new THREE.Color(0xffc780),
    ];

    for (let i = 0; i < starCount; i++) {
      const idx3 = i * 3;
      // Spherical distribution with logarithmic arm concentration
      const radius = 4 + Math.random() * 45;
      const armTheta = (i % 3) * ((Math.PI * 2) / 3) + radius * 0.15 + (Math.random() - 0.5) * 0.6;
      const heightSpread = (Math.random() - 0.5) * (4 + radius * 0.2);

      starPositions[idx3] = Math.cos(armTheta) * radius;
      starPositions[idx3 + 1] = heightSpread;
      starPositions[idx3 + 2] = Math.sin(armTheta) * radius;

      const colorIndex = i % 12 < 6 ? 0 : i % 12 < 9 ? 1 : (i % 12) % colorPalette.length;
      const c = colorPalette[colorIndex];
      starColors[idx3] = c.r;
      starColors[idx3 + 1] = c.g;
      starColors[idx3 + 2] = c.b;
    }

    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeom, starMat);
    worldGroup.add(starField);

    // Ambient and directional lighting for planet 3D depth
    const ambientLight = new THREE.AmbientLight(0x53617e, 2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc4e7ff, 1.4);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0x725cff, 1.2, 70, 1.8);
    rimLight.position.set(-18, 10, -12);
    scene.add(rimLight);

    // ==========================================
    // 4. INTERACTIVE DRAG & ZOOM CONTROLS
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const mousePointer = new THREE.Vector2();

    const updatePointerPosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mousePointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mousePointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      pointerNeedsRaycastRef.current = true;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!isInteractiveRef.current) return;
      if (e.button !== 0) return;
      sound.playOrbitMotion();
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isInteractiveRef.current) {
        if (isDraggingRef.current) isDraggingRef.current = false;
        return;
      }

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;

        targetUserRotation.current.y += deltaX * 0.005;
        targetUserRotation.current.x = Math.max(
          -Math.PI / 2.5,
          Math.min(Math.PI / 2.5, targetUserRotation.current.x + deltaY * 0.005)
        );

        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }

      updatePointerPosition(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handlePointerLeave = () => {
      if (!isDraggingRef.current) {
        pointerNeedsRaycastRef.current = false;
        if (hoveredBodyRef.current) {
          hoveredBodyRef.current = null;
          setHoveredBody(null);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isInteractiveRef.current) return;
      if (e.target instanceof Element && e.target.closest('[data-no-zoom]')) return;
      e.preventDefault();
      sound.playOrbitMotion();
      targetCameraDistance.current = Math.max(
        2,
        Math.min(40, targetCameraDistance.current + e.deltaY * 0.02)
      );
    };

    // Click on Planet to Select & Fly To
    const handleClick = (e: MouseEvent) => {
      if (!isInteractiveRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const clickPointer = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(clickPointer, camera);

      // Collect all clickable planet meshes + sun
      const clickableObjects: THREE.Object3D[] = [sunMesh];
      planetMap.forEach((entry) => {
        clickableObjects.push(entry.planetMesh);
      });

      const intersects = raycaster.intersectObjects(clickableObjects);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const id = hit.userData.id as string;
        sound.playOrbitMotion();

        if (id === AAYU_CORE_STAR.id) {
          setSelectedBody(AAYU_CORE_STAR);
          setCameraFocusedOnBody(AAYU_CORE_STAR.id);
        } else {
          const found = TECH_GALAXY_BODIES.find((b) => b.id === id);
          if (found) {
            setSelectedBody(found);
            setCameraFocusedOnBody(found.id);
          }
        }
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current.targetProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    // Window Listeners
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 5. ANIMATION LOOP
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isInteractiveRef.current && activeSectionRef.current !== 'hero') return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const speedMult = orbitSpeedRef.current;

      // 1. Smooth rotation lerp from user dragging (or ambient drift if in background mode)
      if (!isInteractiveRef.current && !reducedMotion) {
        targetUserRotation.current.y += 0.0006 * speedMult;
      }
      userRotation.current.x += (targetUserRotation.current.x - userRotation.current.x) * 0.08;
      userRotation.current.y += (targetUserRotation.current.y - userRotation.current.y) * 0.08;
      cameraDistance.current += (targetCameraDistance.current - cameraDistance.current) * 0.08;

      // 2. Sun Pulsation & Corona Rings
      sunMesh.rotation.y += 0.006;
      sunInnerMesh.rotation.y -= 0.012;
      sunInnerMesh.rotation.z += 0.008;

      const sunScale = 1 + Math.sin(time * 2.2) * 0.035;
      sunMesh.scale.set(sunScale, sunScale, sunScale);

      coronaRings.forEach((cr, i) => {
        cr.rotation.z += 0.005 * (i % 2 === 0 ? 1 : -1);
      });

      // 3. Move Planets & Moons along Orbits
      const curMode = viewModeRef.current;
      const curCategory = activeCategoryRef.current;

      planetMap.forEach((entry) => {
        const body = entry.data;

        // Advance orbital angle based on speed
        if (!reducedMotion) {
          entry.angle += delta * body.speed * 0.5 * speedMult;
        }

        let posX = 0;
        let posY = 0;
        let posZ = 0;

        if (curMode === 'SOLAR_SYSTEM') {
          // Solve Kepler's equation so elliptical orbits move faster near periapsis.
          const eccentricAnomaly = solveEccentricAnomaly(entry.angle, entry.eccentricity);
          posX = body.distance * (Math.cos(eccentricAnomaly) - entry.eccentricity);
          const orbitDepth =
            body.distance *
            Math.sqrt(1 - entry.eccentricity * entry.eccentricity) *
            Math.sin(eccentricAnomaly);
          posY = orbitDepth * Math.sin(body.inclination);
          posZ = orbitDepth * Math.cos(body.inclination);
        } else if (curMode === 'SPIRAL_GALAXY') {
          // Logarithmic spiral galaxy dispersion
          const spiralTheta = entry.angle + body.distance * 0.28;
          posX = Math.cos(spiralTheta) * (body.distance * 1.15);
          posZ = Math.sin(spiralTheta) * (body.distance * 1.15);
          posY = Math.sin(time * 0.5 + entry.angle) * 1.2;
        } else {
          // Orrery 3D multi-axial inclination
          const tiltTheta = entry.angle;
          posX = Math.cos(tiltTheta) * body.distance;
          posY = Math.sin(tiltTheta * 1.3) * (body.distance * 0.45);
          posZ = Math.sin(tiltTheta) * (body.distance * 0.85);
        }

        entry.bodyGroup.position.set(posX, posY, posZ);

        // Planet self-rotation
        entry.planetMesh.rotation.y += 0.02;

        // Moons orbit around planet
        entry.moons.forEach((m) => {
          if (!reducedMotion) {
            m.angle += delta * m.speed * 1.5 * speedMult;
          }
          m.mesh.position.set(
            Math.cos(m.angle) * m.dist,
            Math.sin(m.angle * 1.2) * (m.dist * 0.3),
            Math.sin(m.angle) * m.dist
          );
          m.mesh.rotation.y += 0.04;
        });

        // Category filtering visual cues (dim unselected, highlight selected)
        const isSelectedCategory = curCategory === 'ALL' || body.category === curCategory;
        const targetOpacity = isSelectedCategory ? 1.0 : 0.18;
        const lineOpacity = isSelectedCategory ? 0.25 : 0.04;

        entry.sprite.material.opacity = targetOpacity;
        (entry.orbitLine.material as THREE.LineBasicMaterial).opacity = lineOpacity;
        (entry.planetMesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
          isSelectedCategory ? 0.3 : 0.07;
      });

      // 4. Galaxy Dust Rotation
      starField.rotation.y += 0.0004 * speedMult;

      // 5. Camera Positioning (Spherical Orbit Around Focus Target)
      // If camera is focused on a specific planet, center orbit target on that planet!
      let targetCenter = new THREE.Vector3(0, 0, 0);

      if (cameraFocusedOnBody) {
        if (cameraFocusedOnBody === AAYU_CORE_STAR.id) {
          targetCenter = new THREE.Vector3(0, 0, 0);
        } else {
          const focusedEntry = planetMap.get(cameraFocusedOnBody);
          if (focusedEntry) {
            targetCenter = focusedEntry.bodyGroup.position.clone();
          }
        }
      }

      // Lerp camera look target
      currentCameraTarget.current.lerp(targetCenter, 0.06);

      // Compute camera position using spherical coordinates based on userRotation
      const phi = userRotation.current.x; // pitch
      const theta = userRotation.current.y; // yaw
      const dist = cameraDistance.current;

      const camX = currentCameraTarget.current.x + dist * Math.cos(phi) * Math.sin(theta);
      const camY = currentCameraTarget.current.y + dist * Math.sin(phi);
      const camZ = currentCameraTarget.current.z + dist * Math.cos(phi) * Math.cos(theta);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(currentCameraTarget.current);

      // 6. Raycast Hover Check (only if in interactive mode)
      if (isInteractiveRef.current && pointerNeedsRaycastRef.current) {
        pointerNeedsRaycastRef.current = false;
        raycaster.setFromCamera(mousePointer, camera);
        const testObjects: THREE.Object3D[] = [sunMesh];
        planetMap.forEach((e) => testObjects.push(e.planetMesh));

        const hoverIntersects = raycaster.intersectObjects(testObjects);
        let nextHoveredBody: TechCelestialBody | null = null;
        if (hoverIntersects.length > 0) {
          const hit = hoverIntersects[0].object;
          const id = hit.userData.id as string;
          if (id === AAYU_CORE_STAR.id) {
            nextHoveredBody = AAYU_CORE_STAR;
          } else {
            nextHoveredBody = TECH_GALAXY_BODIES.find((b) => b.id === id) ?? null;
          }
        }
        if (hoveredBodyRef.current !== nextHoveredBody) {
          hoveredBodyRef.current = nextHoveredBody;
          setHoveredBody(nextHoveredBody);
        }
      } else if (!isInteractiveRef.current && hoveredBodyRef.current) {
        hoveredBodyRef.current = null;
        setHoveredBody(null);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      // Dispose Three resources
      sunGeom.dispose();
      sunMat.dispose();
      sunInnerGeom.dispose();
      sunInnerMat.dispose();
      sunAuraGeometry.dispose();
      sunAuraMaterial.dispose();
      planetAuraGeometry.dispose();
      planetAuraMaterials.forEach((material) => material.dispose());
      surfaceTexturesRef.current.forEach((texture) => texture.dispose());
      surfaceTexturesRef.current = [];
      starGeom.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  // Handler to smoothly fly to a specific celestial body
  const handleFlyToBody = (body: TechCelestialBody) => {
    sound.playOrbitMotion();
    setSelectedBody(body);
    setCameraFocusedOnBody(body.id);
    targetCameraDistance.current = body.id === AAYU_CORE_STAR.id ? 8 : 4.5;
  };

  const handleResetCamera = () => {
    sound.playOrbitMotion();
    setCameraFocusedOnBody(null);
    targetUserRotation.current = { x: 0.28, y: 0 };
    targetCameraDistance.current = 24;
  };

  const adjustCameraZoom = (amount: number) => {
    sound.playOrbitMotion();
    targetCameraDistance.current = Math.max(
      2,
      Math.min(40, targetCameraDistance.current + amount)
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden transition-all duration-300 ${
        isInteractiveMode
          ? 'pointer-events-auto select-none bg-[#07090D]'
          : 'pointer-events-none select-none'
      }`}
      aria-label="3D Tech Solar System & Galaxy Scene"
    >
      {/* Three.js Canvas */}
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          className={`w-full h-full block ${
            isInteractiveMode ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'cursor-default pointer-events-none'
          }`}
          style={{ touchAction: isInteractiveMode ? 'none' : 'auto' }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#07090D] text-white">
          <p className="font-mono text-sm text-[#C6FF3D]">
            [WebGL Solar System requires GPU acceleration]
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3D GALAXY HUD CONTROLS OVERLAY - ONLY IN INTERACTIVE MODE */}
      {/* ========================================================= */}
      {isInteractiveMode && (
        <div className="absolute top-24 sm:top-28 left-3 sm:left-8 z-30 pointer-events-auto flex flex-col gap-2 w-[calc(100vw-24px)] sm:max-w-sm sm:w-auto animate-fadeIn">
          {/* Galaxy Title & Mode Badges */}
          <div className="bg-[#0c1017]/95 border border-white/10 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-sm backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-[#C6FF3D] font-bold flex items-center gap-1.5 truncate mr-2">
                <span className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-ping shrink-0" />
                SOLAR TECH SYSTEM
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playOrbitMotion();
                  setHudMinimized(!hudMinimized);
                }}
                className="text-[10px] text-white/60 hover:text-white px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 cursor-pointer font-mono shrink-0"
              >
                {hudMinimized ? '＋ EXPAND HUD' : '━ MINIMIZE'}
              </button>
            </div>

            {!hudMinimized && (
              <>
                <div className="text-[10px] sm:text-[11px] text-white/70 font-mono leading-tight mb-2">
                  Select a world to explore the languages, research areas, and tools behind{' '}
                  <span className="text-[#C6FF3D] font-semibold">Ayush Kaushik</span>.
                </div>

                {/* Mode Switcher Buttons */}
                <div className="grid grid-cols-3 gap-1 pt-1 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playOrbitMotion();
                      setViewMode('SOLAR_SYSTEM');
                    }}
                    className={`py-1 px-1.5 rounded transition-all text-center border cursor-pointer ${
                      viewMode === 'SOLAR_SYSTEM'
                        ? 'bg-[#C6FF3D]/15 text-[#C6FF3D] border-[#C6FF3D] font-bold'
                        : 'bg-white/[0.02] text-white/50 border-white/10 hover:text-white'
                    }`}
                  >
                    🪐 SOLAR
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playOrbitMotion();
                      setViewMode('SPIRAL_GALAXY');
                    }}
                    className={`py-1 px-1.5 rounded transition-all text-center border cursor-pointer ${
                      viewMode === 'SPIRAL_GALAXY'
                        ? 'bg-[#4CC9F0]/15 text-[#4CC9F0] border-[#4CC9F0] font-bold'
                        : 'bg-white/[0.02] text-white/50 border-white/10 hover:text-white'
                    }`}
                  >
                    🌀 GALAXY
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setViewMode('ORRERY_3D');
                    }}
                    className={`py-1 px-1.5 rounded transition-all text-center border cursor-pointer ${
                      viewMode === 'ORRERY_3D'
                        ? 'bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6] font-bold'
                        : 'bg-white/[0.02] text-white/50 border-white/10 hover:text-white'
                    }`}
                  >
                    ⚡ ORRERY
                  </button>
                </div>
              </>
            )}
          </div>

          {!hudMinimized && (
            <>
              {/* Category Filter Pills */}
              <div className="bg-[#0c1017]/90 border border-white/10 p-2 rounded-sm backdrop-blur-md flex flex-wrap gap-1 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory('ALL');
                  }}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                    activeCategory === 'ALL'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  ALL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory('LANGUAGE');
                  }}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                    activeCategory === 'LANGUAGE'
                      ? 'bg-[#F97316]/20 text-[#F97316] font-bold border border-[#F97316]/40'
                      : 'text-[#F97316]/60 hover:text-[#F97316]'
                  }`}
                >
                  LANGUAGES
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory('AI_MODEL');
                  }}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                    activeCategory === 'AI_MODEL'
                      ? 'bg-[#38BDF8]/20 text-[#38BDF8] font-bold border border-[#38BDF8]/40'
                      : 'text-[#38BDF8]/60 hover:text-[#38BDF8]'
                  }`}
                >
                  AI MODELS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory('SYSTEMS');
                  }}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                    activeCategory === 'SYSTEMS'
                      ? 'bg-[#EF4444]/20 text-[#EF4444] font-bold border border-[#EF4444]/40'
                      : 'text-[#EF4444]/60 hover:text-[#EF4444]'
                  }`}
                >
                  SYSTEMS & METAL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory('TOOLS');
                  }}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                    activeCategory === 'TOOLS'
                      ? 'bg-[#06B6D4]/20 text-[#06B6D4] font-bold border border-[#06B6D4]/40'
                      : 'text-[#06B6D4]/60 hover:text-[#06B6D4]'
                  }`}
                >
                  DEV TOOLS
                </button>
              </div>

              {/* Camera Navigation & Orbit Controls */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-white/50">
                <button
                  type="button"
                  onClick={() => adjustCameraZoom(-3)}
                  aria-label="Zoom in on 3D solar system"
                  className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/10 border border-white/10 rounded cursor-pointer text-white/70 hover:text-white"
                >
                  ＋ ZOOM
                </button>
                <button
                  type="button"
                  onClick={() => adjustCameraZoom(3)}
                  aria-label="Zoom out on 3D solar system"
                  className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/10 border border-white/10 rounded cursor-pointer text-white/70 hover:text-white"
                >
                  － ZOOM
                </button>
                <button
                  type="button"
                  onClick={handleResetCamera}
                  className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/10 border border-white/10 rounded cursor-pointer text-white/70 hover:text-white"
                >
                  ↺ RESET VIEW
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsPaused(!isPaused);
                  }}
                  className={`px-2.5 py-1 border rounded cursor-pointer ${
                    isPaused
                      ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                      : 'bg-white/[0.04] border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setOrbitSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1));
                  }}
                  className="px-2 py-1 bg-white/[0.04] hover:bg-white/10 border border-white/10 rounded cursor-pointer text-white/70 hover:text-white"
                >
                  {orbitSpeedMultiplier}x SPEED
                </button>

                {onToggleInteractiveMode && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onToggleInteractiveMode();
                    }}
                    className="px-2.5 py-1 border rounded cursor-pointer transition-all bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444] hover:bg-[#EF4444]/30"
                  >
                    ✕ CLOSE LAB
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* FLOATING HOVER CARD - ONLY IN INTERACTIVE MODE             */}
      {/* ========================================================= */}
      {isInteractiveMode && hoveredBody && !selectedBody && (
        <div className="absolute top-24 sm:top-28 right-3 sm:right-8 z-30 pointer-events-none bg-[#0c1017]/95 border border-[#C6FF3D] px-3 py-2 rounded-sm backdrop-blur-md shadow-2xl animate-fadeIn max-w-[260px] sm:max-w-xs hidden xs:block">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#C6FF3D] font-bold uppercase tracking-wider">
            <span>{hoveredBody.symbol}</span>
            <span className="truncate">{hoveredBody.name}</span>
            <span
              className="ml-auto text-[9px] px-1.5 py-0.2 rounded shrink-0"
              style={{
                backgroundColor: `${hoveredBody.color}20`,
                color: hoveredBody.color,
                border: `1px solid ${hoveredBody.color}50`,
              }}
            >
              {CATEGORY_LABELS[hoveredBody.category]}
            </span>
          </div>
          <div className="text-[11px] font-mono text-white/80 mt-1 leading-snug">
            {hoveredBody.tag}
          </div>
          <div className="text-[10px] font-mono text-[#4CC9F0] mt-1">
            [CLICK TO LOCK CAMERA & INSPECT]
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DETAILED CELESTIAL INSPECTION MODAL DRAWER                */}
      {/* ========================================================= */}
      {isInteractiveMode && selectedBody && (
        <div data-no-zoom className="absolute bottom-3 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-8 z-40 pointer-events-auto bg-[#0d121a]/98 border border-white/20 p-4 sm:p-5 rounded-sm backdrop-blur-lg shadow-2xl w-auto sm:w-[420px] max-h-[55vh] overflow-y-auto animate-fadeIn transition-all">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-white/10 gap-2">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border shrink-0"
                style={{
                  backgroundColor: `${selectedBody.color}15`,
                  borderColor: selectedBody.color,
                  boxShadow: `0 0 15px ${selectedBody.color}40`,
                }}
              >
                {selectedBody.symbol}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
                  <span className="truncate">{selectedBody.name}</span>
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase shrink-0"
                    style={{
                      backgroundColor: `${selectedBody.color}25`,
                      color: selectedBody.color,
                    }}
                  >
                    {CATEGORY_LABELS[selectedBody.category]}
                  </span>
                </h3>
                <div className="text-[11px] font-mono text-white/50 truncate">
                  {selectedBody.tag}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedBody(null);
                setCameraFocusedOnBody(null);
              }}
              className="text-white/40 hover:text-white text-lg p-1 cursor-pointer transition-colors shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Role in Ayush's Stack */}
          <div className="py-3 space-y-2 border-b border-white/10">
            <div className="text-[10px] font-mono text-[#C6FF3D] font-bold uppercase tracking-wider">
              AYUSH'S IMPLEMENTATION ROLE:
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              {selectedBody.role}
            </p>
          </div>

          {/* Description */}
          <div className="py-2.5 space-y-1 border-b border-white/10">
            <div className="text-[10px] font-mono text-white/40 uppercase">
              DEEP ARCHITECTURAL CONTEXT:
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              {selectedBody.description}
            </p>
          </div>

          {/* Key Specs Grid */}
          <div className="py-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
            {selectedBody.specs.map((sp) => (
              <div
                key={sp.label}
                className="p-1.5 rounded bg-white/[0.02] border border-white/5"
              >
                <div className="text-white/40">{sp.label}</div>
                <div className="text-white/90 font-medium truncate">{sp.value}</div>
              </div>
            ))}
          </div>

          {/* Actions & Mastery */}
          <div className="pt-2 flex items-center justify-between">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded border"
              style={{
                borderColor: `${selectedBody.color}40`,
                color: selectedBody.color,
                backgroundColor: `${selectedBody.color}10`,
              }}
            >
              ★ {selectedBody.mastery}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFlyToBody(selectedBody)}
                className="px-3 py-1.5 bg-[#C6FF3D] hover:bg-[#d6ff66] text-[#0B0D10] text-[11px] font-mono font-bold rounded cursor-pointer transition-all shadow-[0_0_12px_rgba(198,255,61,0.3)]"
              >
                FOCUS CAMERA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag & Interaction Helper Hint - ONLY IN INTERACTIVE MODE */}
      {isInteractiveMode && (
        <div className="absolute bottom-4 left-4 sm:left-8 pointer-events-none text-[10px] font-mono text-white/50 flex items-center gap-2 bg-[#0c1017]/80 px-2.5 py-1 rounded border border-white/10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
          <span>DRAG TO ROTATE 360° · SCROLL TO ZOOM · CLICK ANY PLANET TO INSPECT</span>
        </div>
      )}
    </div>
  );
};
