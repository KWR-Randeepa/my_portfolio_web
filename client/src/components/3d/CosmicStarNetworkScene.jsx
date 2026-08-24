import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CosmicStarNetworkScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera & Renderer setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 125;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    // 1. Create Glowing Star Sprite Texture
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(240, 248, 255, 0.95)');
      gradient.addColorStop(0.6, 'rgba(56, 189, 248, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      return new THREE.CanvasTexture(canvas);
    };

    const starTexture = createStarTexture();

    // 2. Background Universe Star Field
    const bgStarCount = 1600;
    const bgStarGeo = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgStarCount * 3);

    for (let i = 0; i < bgStarCount; i++) {
      bgPositions[i * 3] = (Math.random() - 0.5) * 600;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 600;
    }

    bgStarGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));

    const bgStarMat = new THREE.PointsMaterial({
      size: 1.8,
      map: starTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const bgStars = new THREE.Points(bgStarGeo, bgStarMat);
    scene.add(bgStars);

    // 3. Define Real Constellation Star Patterns (Orion, Ursa Major, Cassiopeia, Cygnus, Leo)
    const constellations = [
      // 1. Orion (The Hunter - Betelgeuse, Bellatrix, Belt, Rigel, Saiph)
      {
        name: 'Orion',
        center: new THREE.Vector3(50, -10, -10),
        stars: [
          new THREE.Vector3(-14, 20, 0),  // 0: Betelgeuse (Red Supergiant)
          new THREE.Vector3(14, 18, 0),   // 1: Bellatrix
          new THREE.Vector3(-5, 0, 0),    // 2: Alnitak (Belt 1)
          new THREE.Vector3(0, 0, 0),     // 3: Alnilam (Belt 2)
          new THREE.Vector3(5, 0, 0),     // 4: Mintaka (Belt 3)
          new THREE.Vector3(-12, -20, 0), // 5: Saiph
          new THREE.Vector3(14, -18, 0),  // 6: Rigel (Blue Supergiant)
          new THREE.Vector3(0, -8, 0)     // 7: Orion Sword / Nebula
        ],
        edges: [
          [0, 1], [0, 2], [1, 4], // Torso top
          [2, 3], [3, 4],         // Orion's Belt
          [2, 5], [4, 6], [5, 6], // Legs bottom
          [3, 7]                  // Sword hanging from Belt
        ]
      },

      // 2. Ursa Major (The Big Dipper)
      {
        name: 'Ursa Major',
        center: new THREE.Vector3(-50, 28, -15),
        stars: [
          new THREE.Vector3(-32, 16, 0), // 0: Alkaid
          new THREE.Vector3(-20, 18, 0), // 1: Mizar
          new THREE.Vector3(-8, 12, 0),  // 2: Alioth
          new THREE.Vector3(3, 4, 0),    // 3: Megrez (Bowl Top-Left)
          new THREE.Vector3(1, -12, 0),  // 4: Phecda (Bowl Bottom-Left)
          new THREE.Vector3(18, -12, 0), // 5: Merak (Bowl Bottom-Right)
          new THREE.Vector3(20, 4, 0)    // 6: Dubhe (Bowl Top-Right)
        ],
        edges: [
          [0, 1], [1, 2], [2, 3],        // Handle
          [3, 4], [4, 5], [5, 6], [6, 3] // Bowl
        ]
      },

      // 3. Cassiopeia (The Queen - W-Shape)
      {
        name: 'Cassiopeia',
        center: new THREE.Vector3(0, 38, -20),
        stars: [
          new THREE.Vector3(-22, 8, 0),  // 0: Caph
          new THREE.Vector3(-10, -10, 0),// 1: Schedar
          new THREE.Vector3(0, 6, 0),    // 2: Gamma Cassiopeiae
          new THREE.Vector3(12, -8, 0),  // 3: Ruchbah
          new THREE.Vector3(22, 10, 0)   // 4: Segin
        ],
        edges: [
          [0, 1], [1, 2], [2, 3], [3, 4]
        ]
      },

      // 4. Cygnus (The Swan / Northern Cross)
      {
        name: 'Cygnus',
        center: new THREE.Vector3(-45, -28, -20),
        stars: [
          new THREE.Vector3(0, 25, 0),   // 0: Deneb (Tail)
          new THREE.Vector3(0, 2, 0),    // 1: Sadr (Center)
          new THREE.Vector3(0, -22, 0),  // 2: Albireo (Head)
          new THREE.Vector3(-22, 6, 0),  // 3: Gienah (Wing Left)
          new THREE.Vector3(22, 6, 0)    // 4: Fawaris (Wing Right)
        ],
        edges: [
          [0, 1], [1, 2], [3, 1], [1, 4]
        ]
      },

      // 5. Leo (The Lion)
      {
        name: 'Leo',
        center: new THREE.Vector3(55, 30, -25),
        stars: [
          new THREE.Vector3(0, -12, 0),  // 0: Regulus (Heart)
          new THREE.Vector3(-6, 4, 0),   // 1: Algieba
          new THREE.Vector3(-14, 16, 0), // 2: Adhafera
          new THREE.Vector3(-6, 24, 0),  // 3: Rasalas (Head Nose)
          new THREE.Vector3(18, 6, 0),   // 4: Zosma (Hip)
          new THREE.Vector3(30, -2, 0),  // 5: Denebola (Tail)
          new THREE.Vector3(16, -12, 0)  // 6: Chertan
        ],
        edges: [
          [0, 1], [1, 2], [2, 3], // Sickle Head
          [1, 4], [4, 5], [5, 6], [6, 0] // Body & Tail
        ]
      }
    ];

    // Build Constellation Star Node Array & Connection Lines
    const allStarNodes = [];
    const constellationEdges = [];

    constellations.forEach((c, cIdx) => {
      const baseIdx = allStarNodes.length;

      c.stars.forEach((s) => {
        const pos = s.clone().add(c.center);
        const origPos = pos.clone();
        allStarNodes.push({
          pos,
          origPos,
          driftAngle: Math.random() * Math.PI * 2,
          driftSpeed: 0.004 + Math.random() * 0.004,
          constellationIdx: cIdx
        });
      });

      c.edges.forEach(([from, to]) => {
        constellationEdges.push({
          nodeA: baseIdx + from,
          nodeB: baseIdx + to,
          opacity: 0,
          targetOpacity: 0.8,
          holdTimer: 0,
          constellationIdx: cIdx
        });
      });
    });

    // Additional Random Floating Stars in Universe Background Network
    const randomNodeCount = 35;
    const randomBounds = 110;

    for (let i = 0; i < randomNodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * randomBounds * 1.5,
        (Math.random() - 0.5) * randomBounds * 1.2,
        (Math.random() - 0.5) * randomBounds
      );

      allStarNodes.push({
        pos,
        origPos: pos.clone(),
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: 0.006,
        constellationIdx: -1
      });
    }

    // Node Points Geometry
    const totalNodes = allStarNodes.length;
    const nodePositions = new Float32Array(totalNodes * 3);

    allStarNodes.forEach((n, i) => {
      nodePositions[i * 3] = n.pos.x;
      nodePositions[i * 3 + 1] = n.pos.y;
      nodePositions[i * 3 + 2] = n.pos.z;
    });

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: 5.5,
      map: starTexture,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodePoints);

    // Dynamic Connection Lines System
    const maxPossibleLines = constellationEdges.length + 150;
    const linePositions = new Float32Array(maxPossibleLines * 6);
    const lineColors = new Float32Array(maxPossibleLines * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // Dynamic Constellation Activation Sequence
    let lastSwitchTime = 0;
    let activeConstellationIdx = 0;

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0006;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0006;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Rotate background universe stars
      bgStars.rotation.y = time * 0.01;
      bgStars.rotation.x = time * 0.005;

      // Drift Star Nodes slightly around original positions
      const nodePosArr = nodePoints.geometry.attributes.position.array;

      allStarNodes.forEach((n, i) => {
        n.driftAngle += n.driftSpeed;
        n.pos.x = n.origPos.x + Math.sin(n.driftAngle) * 2.5;
        n.pos.y = n.origPos.y + Math.cos(n.driftAngle * 0.8) * 2.5;

        nodePosArr[i * 3] = n.pos.x;
        nodePosArr[i * 3 + 1] = n.pos.y;
        nodePosArr[i * 3 + 2] = n.pos.z;
      });

      nodePoints.geometry.attributes.position.needsUpdate = true;
      nodeMat.size = 5.5 + Math.sin(time * 3) * 0.9;

      // Periodically trigger constellation alignment transitions (every 3 seconds)
      if (time - lastSwitchTime > 3.0) {
        lastSwitchTime = time;
        activeConstellationIdx = (activeConstellationIdx + 1) % constellations.length;

        constellationEdges.forEach((edge) => {
          if (edge.constellationIdx === activeConstellationIdx || Math.random() < 0.25) {
            edge.targetOpacity = 0.95;
            edge.holdTimer = 2.5; // Hold illuminated pattern
          } else {
            edge.targetOpacity = 0.15; // Soft background glow
          }
        });
      }

      // Smooth opacity transitions for constellation edges
      constellationEdges.forEach((edge) => {
        if (edge.holdTimer > 0) {
          edge.holdTimer -= 0.016;
          if (edge.holdTimer <= 0) {
            edge.targetOpacity = 0.15;
          }
        }
        edge.opacity += (edge.targetOpacity - edge.opacity) * 0.05;
      });

      // Render Line Connections (Constellation Patterns + Random Interstellar Nodes)
      let vertexIndex = 0;
      let colorIndex = 0;

      // 1. Render Constellation Pattern Edges (Bright White Glowing Lines)
      constellationEdges.forEach((edge) => {
        if (edge.opacity > 0.03) {
          const nA = allStarNodes[edge.nodeA];
          const nB = allStarNodes[edge.nodeB];

          linePositions[vertexIndex++] = nA.pos.x;
          linePositions[vertexIndex++] = nA.pos.y;
          linePositions[vertexIndex++] = nA.pos.z;

          linePositions[vertexIndex++] = nB.pos.x;
          linePositions[vertexIndex++] = nB.pos.y;
          linePositions[vertexIndex++] = nB.pos.z;

          const op = edge.opacity;

          // Pure Crisp White Glowing Constellation Line
          lineColors[colorIndex++] = op * 1.1;
          lineColors[colorIndex++] = op * 1.1;
          lineColors[colorIndex++] = op * 1.25;

          lineColors[colorIndex++] = op * 1.1;
          lineColors[colorIndex++] = op * 1.1;
          lineColors[colorIndex++] = op * 1.25;
        }
      });

      // 2. Render Random Fading Interstellar Connections
      const maxDistance = 42;
      for (let i = 0; i < totalNodes; i++) {
        for (let j = i + 1; j < totalNodes; j++) {
          if (allStarNodes[i].constellationIdx !== -1 && allStarNodes[i].constellationIdx === allStarNodes[j].constellationIdx) {
            continue;
          }

          const dist = allStarNodes[i].pos.distanceTo(allStarNodes[j].pos);

          if (dist < maxDistance) {
            const pulse = (Math.sin(time * 2.5 + i + j) + 1) * 0.5;

            if (pulse > 0.35) {
              linePositions[vertexIndex++] = allStarNodes[i].pos.x;
              linePositions[vertexIndex++] = allStarNodes[i].pos.y;
              linePositions[vertexIndex++] = allStarNodes[i].pos.z;

              linePositions[vertexIndex++] = allStarNodes[j].pos.x;
              linePositions[vertexIndex++] = allStarNodes[j].pos.y;
              linePositions[vertexIndex++] = allStarNodes[j].pos.z;

              const alpha = Math.pow(1 - dist / maxDistance, 1.8) * pulse * 0.4;

              lineColors[colorIndex++] = alpha;
              lineColors[colorIndex++] = alpha;
              lineColors[colorIndex++] = alpha * 1.15;

              lineColors[colorIndex++] = alpha;
              lineColors[colorIndex++] = alpha;
              lineColors[colorIndex++] = alpha * 1.15;
            }
          }
        }
      }

      lineSegments.geometry.setDrawRange(0, vertexIndex / 3);
      lineSegments.geometry.attributes.position.needsUpdate = true;
      lineSegments.geometry.attributes.color.needsUpdate = true;

      // Smooth Mouse Parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      scene.rotation.y = targetX;
      scene.rotation.x = targetY;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      bgStarGeo.dispose();
      bgStarMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      starTexture.dispose();
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 -z-10 w-full h-full pointer-events-none" />;
}
