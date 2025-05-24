'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRouter } from 'next/navigation';

export default function CelebratePage() {
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (opened) {
      const timer = setTimeout(() => {
        router.push('/celebrate');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [opened, router]);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Stars radius={100} depth={50} count={2000} factor={4} fade speed={2} />
      </Canvas>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => setOpened(true)}
      >
        <div className="relative w-40 h-40 bg-[#111] rounded-md shadow-lg flex items-center justify-center transition-transform duration-500 hover:scale-105" style={{ boxShadow: '0 0 40px #00ffff' }}>
          <div className="absolute w-4 h-40 bg-cyan-400 animate-pulse"></div>
          <div className="absolute w-40 h-4 bg-cyan-400 animate-pulse rotate-90"></div>
          {opened && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-cyan-300 text-xl animate-bounce z-10">
              🎉 Surprise! 🎉
            </div>
          )}
        </div>
        {!opened && (
          <p className="mt-6 text-cyan-300 text-lg font-mono animate-pulse">
            Click to open your gift
          </p>
        )}
      </div>

      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          font-family: 'Orbitron', sans-serif;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from {
            box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff;
          }
          to {
            box-shadow: 0 0 20px #0ff, 0 0 40px #0ff, 0 0 60px #0ff;
          }
        }
      `}</style>
    </div>
  );
}
