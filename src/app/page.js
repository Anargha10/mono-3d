'use client';

import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import { BoxGeometry, MeshStandardMaterial, Group, Vector3, PointsMaterial, BufferGeometry, Float32BufferAttribute, AdditiveBlending } from 'three';
import gsap from 'gsap';
import { Power2, Power4 } from 'gsap';

// --- 3D Gift Box Component ---
function GiftBox3D({ onClick }) {
  const groupRef = useRef();
  const lidRef = useRef();
  const boxBaseRef = useRef();
  const ribbon1Ref = useRef();
  const ribbon2Ref = useRef();
  const [opened, setOpened] = useState(false);
  const { camera } = useThree();

  // Materials for box, lid, ribbon
  const boxMaterial = useMemo(() => new MeshStandardMaterial({
    color: '#0a0a1a', // Very dark blue/black
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#4A0080', // Deep purple emissive
    emissiveIntensity: 0.2
  }), []);

  const lidMaterial = useMemo(() => new MeshStandardMaterial({
    color: '#0a0a1a',
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#4A0080',
    emissiveIntensity: 0.2
  }), []);

  const ribbonMaterial = useMemo(() => new MeshStandardMaterial({
    color: '#00FFFF', // Cyan neon
    emissive: '#00FFFF',
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.9,
    blending: AdditiveBlending
  }), []);

  // Particle system for explosion
  const particleGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(500 * 3); // 500 particles
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const particleMaterial = useMemo(() => new PointsMaterial({
    color: '#FFD700', // Gold particles
    size: 0.05,
    transparent: true,
    opacity: 0, // Start invisible
    blending: AdditiveBlending
  }), []);

  const particlesRef = useRef();

  // Initial animation: Box scales and rotates into view
  useEffect(() => {
    if (groupRef.current) {
      gsap.from(groupRef.current.scale, { x: 0, y: 0, z: 0, duration: 1.8, ease: "elastic.out(1, 0.5)" });
      gsap.from(groupRef.current.rotation, { y: Math.PI * 4, duration: 1.8, ease: "power3.out" });
    }
  }, []);

  // Idle animation: Subtle floating and rotation
  useFrame(() => {
    if (groupRef.current && !opened) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.position.y = Math.sin(performance.now() * 0.001) * 0.1;
    }
  });

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);

    // Animate lid opening
    gsap.to(lidRef.current.position, { y: 1.5, z: -0.5, duration: 0.8, ease: Power4.easeOut });
    gsap.to(lidRef.current.rotation, { x: Math.PI / 4, duration: 0.8, ease: Power4.easeOut });

    // Animate ribbons disappearing
    gsap.to([ribbon1Ref.current.scale, ribbon2Ref.current.scale], { y: 0, duration: 0.5, ease: Power2.easeIn, delay: 0.3 });

    // Particle explosion
    if (particlesRef.current) {
      gsap.to(particlesRef.current.material, { opacity: 1, duration: 0.3 });
      gsap.to(particlesRef.current.position, {
        x: (i) => (Math.random() - 0.5) * 5,
        y: (i) => (Math.random() - 0.5) * 5,
        z: (i) => (Math.random() - 0.5) * 5,
        duration: 1.5,
        ease: Power4.easeOut,
        onComplete: () => {
          gsap.to(particlesRef.current.material, { opacity: 0, duration: 0.5 });
        }
      });
    }

    // Trigger navigation after animation
    setTimeout(onClick, 2000); // Increased delay for full animation
  };

  return (
    <group ref={groupRef} onClick={handleOpen} cursor="pointer">
      {/* Main Box Base */}
      <mesh ref={boxBaseRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <primitive object={boxMaterial} attach="material" />
      </mesh>
      {/* Lid */}
      <mesh ref={lidRef} position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.1, 2.1]} />
        <primitive object={lidMaterial} attach="material" />
      </mesh>
      {/* Ribbons */}
      <mesh ref={ribbon1Ref} position={[0, 0, 0.01]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.1, 2.02]} />
        <primitive object={ribbonMaterial} attach="material" />
      </mesh>
      <mesh ref={ribbon2Ref} position={[0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 2.1, 2.02]} />
        <primitive object={ribbonMaterial} attach="material" />
      </mesh>

      {/* Particles for explosion */}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} position={[0, 0, 0]} />
    </group>
  );
}

// --- Landing Page Component ---
export default function LandingPage() {
  const router = useRouter();
  const handleNavigate = () => {
    router.push('/celebrate');
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <Canvas
        shadows // Enable shadows in the scene
        camera={{ position: [0, 2, 5], fov: 60 }}
        dpr={[1, 2]} // Device pixel ratio for better quality
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.8} /> {/* Top light for highlights */}

        {/* Background Stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={2} />

        {/* 3D Gift Box and Text */}
        <Suspense fallback={null}>
          <GiftBox3D onClick={handleNavigate} />
          <Text
            position={[0, -1.8, 0]} // Position below the box
            fontSize={0.4}
            color="#00f0ff"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/orbitron/v17/OzrjdGMu_Q_q_c_f_g_g.woff" // Orbitron font for futuristic look
            outlineWidth={0.02}
            outlineColor="#000000"
            letterSpacing={0.05}
          >
            CLICK TO OPEN YOUR GIFT
          </Text>
          <Text
            position={[0, -2.3, 0]} // Sub-text below main text
            fontSize={0.2}
            color="#A0FFFF"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMwM.woff" // Inter for readability
            maxWidth={3} // Wrap text
            lineHeight={1.2}
            letterSpacing={0.02}
          >
            A universe of memories awaits...
          </Text>
        </Suspense>

        {/* Ground Plane (optional, for shadows) */}
        <mesh position={[0, -1.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        {/* Orbit Controls (can be disabled for fixed camera) */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>

      {/* Global CSS for full screen and font preloading */}
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          overflow: hidden;
          font-family: 'Inter', sans-serif; /* Fallback/general font */
        }
        /* Preload Orbitron font */
        @font-face {
          font-family: 'Orbitron';
          font-style: normal;
          font-weight: 400;
          src: url('https://fonts.gstatic.com/s/orbitron/v17/OzrjdGMu_Q_q_c_f_g_g.woff') format('woff');
          font-display: swap;
        }
      `}</style>
    </div>
  );
}
