/**
 * HARSATH ALI - THREE.JS INTERACTIVE HERO NETWORK
 * Abstract digital network of particles and connecting lines reacting smoothly to mouse motion.
 * Lightweight, performant, theme-adaptive (Dark & Light Mode), respects prefers-reduced-motion, with WebGL fallback.
 */

(function () {
  'use strict';

  function initThreeHero() {
    const container = document.getElementById('heroThreeCanvas');
    if (!container) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.style.opacity = '0.35';
      return;
    }

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Hero visual fallback active.');
      return;
    }

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) return;
    } catch (e) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Current theme check
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    // Particle Group
    const particleCount = 65;
    const maxDistance = 55;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    const bounds = { x: 140, y: 90, z: 80 };

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * bounds.x * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * bounds.y * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * bounds.z * 2;

      velocities.push({
        x: (Math.random() - 0.5) * 0.22,
        y: (Math.random() - 0.5) * 0.22,
        z: (Math.random() - 0.5) * 0.22
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Material
    const pMaterial = new THREE.PointsMaterial({
      color: currentTheme === 'light' ? 0x0284c7 : 0x38bdf8,
      size: 3.2,
      transparent: true,
      opacity: currentTheme === 'light' ? 0.9 : 0.85,
      blending: currentTheme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, pMaterial);
    scene.add(particles);

    // Lines geometry
    const maxLines = (particleCount * (particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineSegments({
      vertexColors: true,
      transparent: true,
      opacity: currentTheme === 'light' ? 0.6 : 0.45,
      blending: currentTheme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Theme update handler
    window.addEventListener('themechange', (e) => {
      currentTheme = e.detail && e.detail.theme ? e.detail.theme : 'dark';
      if (currentTheme === 'light') {
        pMaterial.color.setHex(0x0284c7);
        pMaterial.blending = THREE.NormalBlending;
        pMaterial.opacity = 0.9;
        lineMaterial.blending = THREE.NormalBlending;
        lineMaterial.opacity = 0.6;
      } else {
        pMaterial.color.setHex(0x38bdf8);
        pMaterial.blending = THREE.AdditiveBlending;
        pMaterial.opacity = 0.85;
        lineMaterial.blending = THREE.AdditiveBlending;
        lineMaterial.opacity = 0.45;
      }
      pMaterial.needsUpdate = true;
      lineMaterial.needsUpdate = true;
    });

    // Mouse Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    function onMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetMouseX = (x / rect.width) * 40;
      targetMouseY = -(y / rect.height) * 40;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Window Resize
    function onResize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', onResize);

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(scene.position);

      const pos = particleGeometry.attributes.position.array;
      let lineVertexIdx = 0;
      let lineColorsIdx = 0;

      for (let i = 0; i < particleCount; i++) {
        // Move particles
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        // Bounce at boundaries
        if (Math.abs(pos[i * 3]) > bounds.x) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > bounds.y) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > bounds.z) velocities[i].z *= -1;

        // Connect nearby nodes
        for (let j = i + 1; j < particleCount; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dist * 0.0001 || dz * dz);

          if (dist < maxDistance) {
            const alpha = 1.0 - dist / maxDistance;

            linePositions[lineVertexIdx++] = pos[i * 3];
            linePositions[lineVertexIdx++] = pos[i * 3 + 1];
            linePositions[lineVertexIdx++] = pos[i * 3 + 2];

            linePositions[lineVertexIdx++] = pos[j * 3];
            linePositions[lineVertexIdx++] = pos[j * 3 + 1];
            linePositions[lineVertexIdx++] = pos[j * 3 + 2];

            if (currentTheme === 'light') {
              // Sky blue (0.01, 0.52, 0.78) to Indigo (0.31, 0.27, 0.9)
              lineColors[lineColorsIdx++] = 0.01 * alpha;
              lineColors[lineColorsIdx++] = 0.52 * alpha;
              lineColors[lineColorsIdx++] = 0.78 * alpha;

              lineColors[lineColorsIdx++] = 0.31 * alpha;
              lineColors[lineColorsIdx++] = 0.27 * alpha;
              lineColors[lineColorsIdx++] = 0.90 * alpha;
            } else {
              // Cyan (0.22, 0.74, 0.97) to Indigo (0.39, 0.4, 0.95)
              lineColors[lineColorsIdx++] = 0.22 * alpha;
              lineColors[lineColorsIdx++] = 0.74 * alpha;
              lineColors[lineColorsIdx++] = 0.97 * alpha;

              lineColors[lineColorsIdx++] = 0.39 * alpha;
              lineColors[lineColorsIdx++] = 0.40 * alpha;
              lineColors[lineColorsIdx++] = 0.95 * alpha;
            }
          }
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineVertexIdx / 3);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      scene.rotation.y += 0.0008;

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeHero);
  } else {
    initThreeHero();
  }
})();
