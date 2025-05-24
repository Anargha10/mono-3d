'use client';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { useEffect, useRef, useState, Suspense, useMemo } from 'react'; // Import useMemo
import { TextureLoader, AdditiveBlending, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points } from 'three'; // Import necessary Three.js components
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Power2, Power4 } from 'gsap'; // Imported, but you can use `ease` strings directly if preferred

gsap.registerPlugin(TextPlugin);

const imagePaths = [
  '/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg', '/img5.jpg'
];

function ImageModal({ image, onClose }) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50"
        >
          <motion.img
            src={image}
            alt="Enlarged"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhotoOrbit({ onImageClick }) {
  const groupRef = useRef();
  const textures = useLoader(TextureLoader, imagePaths);
  const radius = 15;

  useEffect(() => {
    let frameId;
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.003;
        groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.8;
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <group ref={groupRef}>
      {textures.map((texture, i) => {
        const angle = (i / textures.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            <mesh onClick={(e) => { e.stopPropagation(); onImageClick(imagePaths[i]); }}>
              <planeGeometry args={[6, 7.5]} />
              <meshBasicMaterial
                map={texture}
                transparent
                opacity={1}
                side={2}
              />
            </mesh>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[4.2, 5.2]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.1} blending={AdditiveBlending} side={2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
function NeonButton({ text, path, position }) {
    const groupRef = useRef();
    const meshRef = useRef();
    const textRef = useRef();
    const glowRef = useRef();
    const particlePointsRef = useRef();
    const [hovered, setHovered] = useState(false);
  
    const particleCount = 50;
    const particles = useMemo(() => {
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 4;
        const y = (Math.random() - 0.5) * 1.5;
        const z = (Math.random() - 0.5) * 0.5;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
      return geometry;
    }, []);
  
    useEffect(() => {
      if (!meshRef.current || !glowRef.current || !textRef.current || !groupRef.current || !particlePointsRef.current) return;
  
      // Base animations for the entire button group (subtle hover effect)
      gsap.to(groupRef.current.position, {
        y: hovered ? position[1] + 0.5 : position[1],
        duration: 0.3,
        ease: Power2.easeOut
      });
  
      // Main button rotation (subtle, continuous)
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
  
      // Glow effect animation (pulsating)
      gsap.to(glowRef.current.material, {
        emissiveIntensity: 1.0, // Brighter base glow
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: Power2.easeInOut,
        overwrite: true
      });
  
      // Sparkle/Particle effect animation
      gsap.to(particlePointsRef.current.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 15,
        repeat: -1,
        ease: "linear"
      });
  
      // Hover effects
      gsap.to(meshRef.current.scale, {
        x: hovered ? 1.15 : 1,
        y: hovered ? 1.15 : 1,
        z: hovered ? 1.15 : 1,
        duration: 0.3,
        ease: Power4.easeOut
      });
  
      gsap.to(textRef.current, {
        y: hovered ? 0.2 : 0,
        fontSize: hovered ? 0.7 : 0.6,
        duration: 0.3,
        ease: Power4.easeOut
      });
  
      gsap.to(glowRef.current.material, {
        emissiveIntensity: hovered ? 2.5 : 1.0, // Significantly brighter glow on hover
        duration: 0.3,
        ease: Power4.easeOut,
        overwrite: true
      });
  
      gsap.to(particlePointsRef.current.material, {
        opacity: hovered ? 0.9 : 0.5,
        size: hovered ? 0.1 : 0.05,
        duration: 0.3,
        ease: Power4.easeOut,
        overwrite: true
      });
  
    }, [hovered, position]);
  
    const handleClick = () => {
      gsap.to(groupRef.current.scale, {
        x: 0.8, y: 0.8, z: 0.8, duration: 0.1, ease: Power2.easeOut,
        onComplete: () => {
          gsap.to(groupRef.current.scale, {
            x: 1.2, y: 1.2, z: 1.2, duration: 0.2, ease: Power2.easeIn,
            onComplete: () => {
              window.location.href = path;
            }
          });
        }
      });
    };
  
    return (
      <group
        ref={groupRef}
        position={position}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Main Button Body */}
        <mesh ref={meshRef}>
          <boxGeometry args={[3, 1, 0.8]} /> {/* Flatter top and bottom */}
          <meshStandardMaterial
            color="#1A1A1A" // Dark grey base
            emissive="#2A2A4A" // Subtle blueish glow from within
            emissiveIntensity={0.2} // Slightly brighter base emissive
            metalness={0.95} // Very metallic
            roughness={0.1} // Very smooth surface
          />
        </mesh>
  
        {/* Pulsating Glow Effect */}
        <mesh ref={glowRef} position={[0, 0, -0.05]}>
          <boxGeometry args={[3.2, 1.1, 0.9]} /> {/* Slightly larger than button */}
          <meshStandardMaterial
            color="#4A90E2" // Vibrant blue
            emissive="#4A90E2"
            emissiveIntensity={1.0} // Base intensity, animated by GSAP
            transparent
            opacity={0.8}
            blending={AdditiveBlending}
            side={2}
          />
        </mesh>
  
        {/* Text */}
        <Text
          ref={textRef}
          position={[0, 0, 0.45]}
          fontSize={0.6}
          color="#FFFFFF" // White text for better readability
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
  
        {/* Particle Effect */}
        <points ref={particlePointsRef} geometry={particles}>
          <pointsMaterial
            color="#AADDFF" // Soft blue for particles
            size={0.05}
            transparent
            opacity={0.5}
            blending={AdditiveBlending}
          />
        </points>
      </group>
    );
  }

export default function CelebratePage() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'black', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 5, 25], fov: 80 }}>
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={2} />
        <ambientLight intensity={1.2} />
        <pointLight position={[15, 15, 15]} intensity={0.5} />
        <pointLight position={[-15, 15, -15]} intensity={0.5} />
        <pointLight position={[0, 15, 0]} intensity={0.5} />
        <pointLight position={[0, -15, 0]} intensity={0.3} />
        <PhotoOrbit onImageClick={setSelectedImage} />
        <OrbitControls
          enableZoom={true}
          minDistance={15}
          maxDistance={40}
          autoRotate
          autoRotateSpeed={0.3}
          enablePan={false}
        />
        {/* Updated button with "classier" effects */}
        <NeonButton text="ENTER THE PORTAL" path="/us" position={[0, -10, 0]} />
      </Canvas>
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}