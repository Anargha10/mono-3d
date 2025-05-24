'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    const animate = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animate();
  }, []);

  const handleGiftClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
    setTimeout(() => router.push('/celebrate'), 1500);
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden text-cyan-300 font-mono">
      {/* Background canvas for particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Centered Gift Box */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <motion.div
          onClick={handleGiftClick}
          className="relative w-36 h-36 bg-[#00f0ff33] border-4 border-cyan-300 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 backdrop-blur-md overflow-hidden"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
          <div className="flex items-center justify-center h-full text-4xl">🎁</div>
          {ripple.show && (
            <span
              className="absolute w-10 h-10 bg-cyan-300 rounded-full opacity-50 animate-ripple"
              style={{ left: ripple.x - 20, top: ripple.y - 20 }}
            ></span>
          )}
        </motion.div>

        {/* Neon Text */}
        <motion.p
          className="mt-6 text-lg md:text-xl neon-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Click to open your gift
        </motion.p>
      </div>

      {/* Extra Styling */}
      <style jsx>{`
        .neon-text {
          color: #00f0ff;
          text-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 1px;
        }
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(10);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
