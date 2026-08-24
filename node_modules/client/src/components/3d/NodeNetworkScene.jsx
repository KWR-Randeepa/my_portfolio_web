import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NodeNetworkScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.006);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 110;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    // Minimal Node Parameters
    const nodeCount = 45;
    const maxDistance = 40;
    const bounds = 80;

    // Node Positions & Gentle Velocities
    const nodes = [];
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    const cyanColor = new THREE.Color(0x38bdf8);
    const slateColor = new THREE.Color(0x64748b);

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * bounds * 2;
      const y = (Math.random() - 0.5) * bounds * 1.4;
      const z = (Math.random() - 0.5) * bounds * 1.2;

      nodes.push({
        x, y, z,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        vz: (Math.random() - 0.5) * 0.08,
      });

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const nodeColor = Math.random() > 0.5 ? cyanColor : slateColor;
      colors[i * 3] = nodeColor.r;
      colors[i * 3 + 1] = nodeColor.g;
      colors[i * 3 + 2] = nodeColor.b;
    }

    // Particle Dots Geometry
    const nodesGeometry = new THREE.BufferGeometry();
    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nodesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const nodesMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const nodePoints = new THREE.Points(nodesGeometry, nodesMaterial);
    scene.add(nodePoints);

    // Connecting Lines Geometry
    const maxLines = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    const lineSegments = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lineSegments);

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.03;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.03;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;

    const animate = () => {
      // 1. Slow, Gentle Node Drift
      const posAttr = nodesGeometry.attributes.position.array;

      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (Math.abs(node.x) > bounds) node.vx *= -1;
        if (Math.abs(node.y) > bounds * 0.7) node.vy *= -1;
        if (Math.abs(node.z) > bounds * 0.6) node.vz *= -1;

        posAttr[i * 3] = node.x;
        posAttr[i * 3 + 1] = node.y;
        posAttr[i * 3 + 2] = node.z;
      }
      nodesGeometry.attributes.position.needsUpdate = true;

      // 2. Subtle Connections
      let vertexIndex = 0;
      let colorIndex = 0;
      let linesCount = 0;

      const linePosAttr = linesGeometry.attributes.position.array;
      const lineColAttr = linesGeometry.attributes.color.array;

      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35;

            // Start Point
            linePosAttr[vertexIndex++] = nodes[i].x;
            linePosAttr[vertexIndex++] = nodes[i].y;
            linePosAttr[vertexIndex++] = nodes[i].z;

            // End Point
            linePosAttr[vertexIndex++] = nodes[j].x;
            linePosAttr[vertexIndex++] = nodes[j].y;
            linePosAttr[vertexIndex++] = nodes[j].z;

            // Line Colors (Subtle cyan/slate gradient)
            const r = 0.2 * alpha;
            const g = 0.5 * alpha;
            const b = 0.7 * alpha;

            lineColAttr[colorIndex++] = r;
            lineColAttr[colorIndex++] = g;
            lineColAttr[colorIndex++] = b;

            lineColAttr[colorIndex++] = r;
            lineColAttr[colorIndex++] = g;
            lineColAttr[colorIndex++] = b;

            linesCount++;
          }
        }
      }

      linesGeometry.setDrawRange(0, linesCount * 2);
      linesGeometry.attributes.position.needsUpdate = true;
      linesGeometry.attributes.color.needsUpdate = true;

      // Smooth Ambient Tilt
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;
      scene.rotation.y = targetX * 0.008;
      scene.rotation.x = -targetY * 0.008;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      nodesGeometry.dispose();
      nodesMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 z-0 w-full h-full pointer-events-none opacity-70"
    />
  );
}
