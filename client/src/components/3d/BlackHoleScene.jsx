import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BlackHoleScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 45);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    // Event Horizon
    const eventHorizon = new THREE.Mesh(
      new THREE.SphereGeometry(8, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    scene.add(eventHorizon);

    // Photon Sphere
    const photonSphere = new THREE.Mesh(
      new THREE.SphereGeometry(8.5, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      })
    );
    scene.add(photonSphere);

    // Accretion Disk
    const particleCount = 6000;
    const diskGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x94a3b8),
      new THREE.Color(0x475569),
      new THREE.Color(0xe2e8f0)
    ];

    for (let i = 0; i < particleCount; i++) {
      const minRadius = 9;
      const maxRadius = 45;
      const radius = minRadius + Math.pow(Math.random(), 2) * (maxRadius - minRadius);
      const angle = Math.random() * Math.PI * 2;
      const verticalSpread = (radius - minRadius) * 0.1 * (Math.random() - 0.5);

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = verticalSpread;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      angles[i] = angle;
      radii[i] = radius;

      const randColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = randColor.r;
      colors[i * 3 + 1] = randColor.g;
      colors[i * 3 + 2] = randColor.b;
    }

    diskGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    diskGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const diskMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const accretionDisk = new THREE.Points(diskGeo, diskMat);
    accretionDisk.rotation.x = Math.PI / 8;
    scene.add(accretionDisk);

    // Mouse Interaction
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX - windowHalfX;
      mouseY = e.clientY - windowHalfY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const render = () => {
      const time = clock.getElapsedTime();
      const posArray = accretionDisk.geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const r = radii[i];
        const speed = 2 / Math.sqrt(r);
        angles[i] -= speed * 0.005;
        posArray[i * 3] = Math.cos(angles[i]) * r;
        posArray[i * 3 + 2] = Math.sin(angles[i]) * r;
      }
      accretionDisk.geometry.attributes.position.needsUpdate = true;

      const scale = 1 + Math.sin(time * 2) * 0.02;
      photonSphere.scale.set(scale, scale, scale);

      targetX = mouseX * 0.003;
      targetY = mouseY * 0.003;
      scene.rotation.y += 0.05 * (targetX - scene.rotation.y);
      scene.rotation.x += 0.05 * (targetY - scene.rotation.x);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

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
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 -z-10 w-full h-full pointer-events-none" />;
}