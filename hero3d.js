/* Real-time 3D hero: polished metal torus-knot with a lime core. Loaded lazily; any failure falls back to the CSS visual. */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export function initHero(host) {
  const small = matchMedia("(max-width:820px)").matches;
  const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  canvas.className = "hero-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 7.2);

  const group = new THREE.Group(); scene.add(group);
  const metal = new THREE.MeshPhysicalMaterial({ color: 0x6b736d, metalness: 1, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.8 });
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, 0.36, small ? 160 : 280, small ? 20 : 36, 2, 3), metal);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x0b0d0c, emissive: 0xb6ff3c, emissiveIntensity: 1.6, roughness: 0.4 });
  const core = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, 0.1, small ? 160 : 280, 10, 2, 3), coreMat);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.012, 8, 160), new THREE.MeshBasicMaterial({ color: 0xb6ff3c, transparent: true, opacity: 0.35 }));
  ring.rotation.x = Math.PI / 2.4;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.006, 6, 160), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
  ring2.rotation.set(Math.PI / 3.2, 0.2, 0.6);
  group.add(knot, core, ring, ring2);

  // A secondary faceted glass form adds foreground depth and a second material language.
  const crystalMat = new THREE.MeshPhysicalMaterial({ color: 0xd8e5ce, metalness: 0.28, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, opacity: 0.72, envMapIntensity: 1.35 });
  const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), crystalMat);
  crystal.position.set(1.72, 0.16, 0.15);
  crystal.scale.setScalar(0.68);
  const crystalEdges = new THREE.LineSegments(new THREE.EdgesGeometry(crystal.geometry), new THREE.LineBasicMaterial({ color: 0xc2ff4b, transparent: true, opacity: 0.48 }));
  crystal.add(crystalEdges);
  const crystalHalo = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.009, 6, 120), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 }));
  crystalHalo.position.copy(crystal.position);
  crystalHalo.rotation.set(0.8, 0.2, -0.4);
  group.add(crystal, crystalHalo);

  // Fine orbital particles add scale and depth without a heavy post-processing pipeline.
  const particleCount = small ? 90 : 180;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 2.25 + Math.random() * 1.25;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = radius * Math.cos(phi);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xc2ff4b, size: small ? 0.018 : 0.024, transparent: true, opacity: 0.58, sizeAttenuation: true, depthWrite: false }));
  group.add(particles);

  const satellite = new THREE.Mesh(
    new THREE.SphereGeometry(0.105, small ? 16 : 24, small ? 12 : 18),
    new THREE.MeshPhysicalMaterial({ color: 0xc2ff4b, metalness: 0.5, roughness: 0.18, emissive: 0x253b09, emissiveIntensity: 0.5, clearcoat: 1 })
  );
  scene.add(satellite);

  const key = new THREE.PointLight(0xb6ff3c, 38, 12, 2); key.position.set(-3, 2.5, 3.5);
  const rim = new THREE.PointLight(0xffffff, 22, 14, 2); rim.position.set(3.5, -1.5, -2);
  scene.add(key, rim);

  let w = 0, h = 0, baseZ = 7.2;
  const resize = () => {
    const r = host.getBoundingClientRect(); w = Math.max(1, r.width); h = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1 : 1.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; baseZ = w / h < 0.9 ? 8.4 : 7.2; camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(host);

  let mx = 0, my = 0, tx = 0, ty = 0, sy = 0, visible = true, raf = 0, last = performance.now(), t = 0;
  const onMove = e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
  const onScroll = () => { sy = Math.min(scrollY / innerHeight, 1.5); };
  if (matchMedia("(hover:hover)").matches && !reduced) addEventListener("pointermove", onMove, { passive: true });
  addEventListener("scroll", onScroll, { passive: true });

  let intro = Infinity; // entrance starts when the page intro finishes
  const start = () => { intro = performance.now(); };
  if (document.documentElement.classList.contains("ready")) start(); else addEventListener("novaryx:ready", start, { once: true });
  const frame = now => {
    raf = 0;
    const dt = Math.min((now - last) / 1000, 0.05); last = now; if (!reduced) t += dt;
    // Reduced-motion users get the finished, composed hero pose immediately—no partial entrance frame.
    const k = reduced ? 1 : Math.max(0, Math.min(1, (now - intro) / 2200));
    const ease = 1 - Math.pow(1 - k, 4); // cinematic entrance
    tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
    group.rotation.set(0.35 + ty * 0.5 + sy * 0.5, t * 0.22 + tx * 0.9 + sy * 1.6 + (1 - ease) * 2.2, 0.1);
    group.position.y = Math.sin(t * 0.8) * 0.08 - sy * 0.4;
    const s = 0.55 + 0.45 * ease; group.scale.setScalar(s);
    coreMat.emissiveIntensity = (0.4 + 1.2 * ease) * (1 + Math.sin(t * 1.6) * 0.12);
    ring.rotation.z = t * 0.08; ring2.rotation.y = -t * 0.11;
    crystal.rotation.x = 0.28 + t * 0.16 + ty * 0.12;
    crystal.rotation.y = t * 0.24 + tx * 0.2;
    crystal.position.y = 0.16 + Math.sin(t * 0.7) * 0.08;
    crystalHalo.rotation.z = -t * 0.12;
    particles.rotation.y = -t * 0.025; particles.rotation.x = Math.sin(t * 0.18) * 0.06;
    satellite.position.set(Math.cos(t * 0.48) * 2.2, Math.sin(t * 0.48) * 0.75, Math.sin(t * 0.48) * 1.25);
    satellite.scale.setScalar(0.82 + Math.sin(t * 1.4) * 0.08);
    key.position.x = -3 + tx * 5; key.position.y = 2.5 - ty * 4;
    camera.position.set(tx * 0.5 + sy * 0.6, -ty * 0.3 + sy * 0.25, baseZ + (1 - ease) * 2.4 + sy * 0.8); camera.lookAt(0, -sy * 0.2, 0);
    renderer.render(scene, camera);
    if (visible && !document.hidden && !reduced) schedule();
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); schedule(); } });
  io.observe(host);
  const onVis = () => { if (!document.hidden) { last = performance.now(); schedule(); } };
  document.addEventListener("visibilitychange", onVis);
  canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); dispose(); host.classList.remove("gl"); });
  schedule();
  if (reduced) { onScroll(); }

  function dispose() {
    cancelAnimationFrame(raf); raf = 0; visible = false;
    ro.disconnect(); io.disconnect();
    removeEventListener("pointermove", onMove); removeEventListener("scroll", onScroll); removeEventListener("novaryx:ready", start);
    document.removeEventListener("visibilitychange", onVis);
    [knot, core, ring, ring2, particles, satellite, crystal, crystalHalo].forEach(m => { if (m.geometry) m.geometry.dispose(); if (Array.isArray(m.material)) m.material.forEach(mat => mat.dispose()); else if (m.material) m.material.dispose(); });
    crystalEdges.geometry.dispose(); crystalEdges.material.dispose();
    envTex.dispose(); pmrem.dispose(); renderer.dispose(); canvas.remove();
  }
  addEventListener("pagehide", dispose, { once: true });
  return dispose;
}
