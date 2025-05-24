'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Power2, Power4 } from 'gsap';

// Register GSAP plugins for advanced text animations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

// --- Placeholder Image Paths for the Dynamic Photo Canvas ---
const placeholderImagePaths = [
  '/us1.jpg', // Vibrant Red
  '/us2.jpg', // Steel Blue
  '/us3.jpg', // Bright Green
  '/us4.jpg', // Royal Purple
  '/us5.jpg', // Gold
  '/us6.jpg', // Dark Cyan
];

// --- Animated Header Component: Top Section with Dynamic Messages ---
function AnimatedHeader() {
  const textRefs = useRef([]); // Array to hold refs for each message element
  const headerRef = useRef(null); // Ref for the header container
  const messages = useMemo(() => [
    "HAPPY BIRTHDAY!",
    "STAY BLESSED WITH YOUR FAMILY!",
    "WISHES COME TRUE!",
    "BRIGHT FUTURE AHEAD!",
    "CELEBRATE EVERY MOMENT!",
    "MAY JOY ILLUMINATE YOUR PATH!",
    "EMBRACE THE JOURNEY AHEAD!"
  ], []);

  useEffect(() => {
    // Ensure GSAP is available and we have elements to animate
    if (typeof gsap === 'undefined' || !textRefs.current.length || !headerRef.current) {
      console.warn("GSAP or refs not ready for AnimatedHeader.");
      return;
    }

    // Initial animation for the header container
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -50, scaleY: 0.8 },
      { opacity: 1, y: 0, scaleY: 1, duration: 1.5, ease: Power4.easeOut }
    );

    // Create a master timeline for sequential animation of messages
    const masterTimeline = gsap.timeline({ repeat: -1, yoyo: true, delay: 1, repeatDelay: 1.5 });

    messages.forEach((message, index) => {
      // Animate each message in (typing effect + fade/slide in)
      masterTimeline.fromTo(textRefs.current[index],
        { opacity: 0, y: 30, scale: 0.8, filter: 'blur(5px)' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: Power4.easeOut,
          text: message, // GSAP TextPlugin for typing effect
          onComplete: () => {
            // After typing, hold for a bit then fade out
            gsap.to(textRefs.current[index], {
              opacity: 0,
              y: -30,
              scale: 0.8,
              filter: 'blur(5px)',
              duration: 1,
              ease: Power4.easeIn,
              delay: 2 // Hold message for 2 seconds before fading out
            });
          }
        },
        index * 3 // Stagger the start of each message animation
      );
    });

  }, [messages]);

  return (
    <div
      ref={headerRef}
      className="relative w-full h-48 sm:h-56 md:h-64 flex flex-col items-center justify-center overflow-hidden
                    bg-gradient-to-br from-purple-950 to-indigo-900 shadow-2xl p-4 sm:p-6 rounded-b-3xl md:rounded-b-full
                    transform-gpu origin-top" // Add transform-gpu for smoother animations
    >
      {messages.map((_, index) => (
        <h1
          key={index}
          ref={el => textRefs.current[index] = el}
          className="absolute text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold
                     bg-clip-text text-transparent
                     bg-gradient-to-r from-yellow-300 via-pink-400 to-blue-400
                     drop-shadow-lg opacity-0 leading-tight"
          style={{ fontFamily: "'Inter', sans-serif", WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}
        >
          {/* Text content dynamically set by GSAP TextPlugin */}
        </h1>
      ))}
    </div>
  );
}

// --- Left Column Cards: Profound Messages ---

// Base Card component with subtle 3D tilt and enhanced animations
function ProfoundCard({ title, content, delay }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // GSAP for subtle border glow animation
    gsap.to(cardRef.current, {
      '--border-glow-opacity': 0.8, // Custom CSS variable for glow
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 30px rgba(128,0,128,0.8), 0 0 15px rgba(255,0,255,0.4)", // Enhanced shadow
        rotateX: 5, // Subtle 3D tilt
        rotateY: 5,
        transition: { type: "spring", stiffness: 300, damping: 10 }
      }}
      className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl border border-purple-700
                 flex flex-col justify-between items-center text-center w-full
                 min-h-[250px] sm:min-h-[300px] lg:min-h-[350px]
                 transform-gpu preserve-3d" // Enable 3D transforms
      style={{
        border: "2px solid var(--border-color, #8B5CF6)", // Default border
        boxShadow: "0 0 15px rgba(128,0,128,0.4)",
        '--border-glow-opacity': 0.4, // Initial CSS variable for glow
        '--border-color': 'rgba(139, 92, 246, var(--border-glow-opacity))' // Use CSS variable for dynamic border
      }}
    >
      <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
        {title}
      </h3>
      <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-serif italic">
        "{content}"
      </p>
      <div className="mt-4 w-16 h-1 bg-purple-500 rounded-full animate-pulse"></div>
    </motion.div>
  );
}

// Brotherhood Card
function BrotherhoodCard() {
  const title = "Fraternal Bonds: An Unyielding Covenant";
  const content = `In the grand tapestry of existence, where destinies intertwine and trials abound,
                   the sacred covenant of brotherhood stands as an unassailable bastion.
                   It is a profound kinship, forged not merely by consanguinity, but by an
                   indomitable confluence of spirit, a shared odyssey through the labyrinthine
                   expanse of life's multifarious vicissitudes. A camaraderie that transcends
                   the ephemeral, echoing through the annals of time with an unwavering resonance.`;
  return <ProfoundCard title={title} content={content} delay={0.5} />;
}

// Conquering World Card
function ConqueringWorldCard() {
  const title = "Ascension to Zenith: A Conjoint Dominion";
  const content = `Behold, the epoch of our collective ascendancy, a testament to the symbiotic
                   potency of unified resolve. Together, we shall traverse the uncharted
                   frontiers of endeavor, surmounting every formidable impediment with
                   unflinching tenacity. The world, in its boundless grandeur, awaits our
                   conjoint dominion, a realm ripe for the impress of our shared ambition.
                   No summit too arduous, no chasm too profound, for spirits intertwined in
                   the pursuit of unparalleled eminence. Mumbai D'Or ta jeettei hbe vaai. Tu e Vorsha`;
  return <ProfoundCard title={title} content={content} delay={0.7} />;
}

// --- Dynamic Photo Canvas Components ---

// Draggable Photo Item for the canvas
function DraggablePhoto({ src, id, initialX, initialY, initialRotate, zIndex, onBringToFront, onUpdatePosition, dragConstraintsRef }) {
  const photoRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Use useMotionValue to control x, y, and rotate directly
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  const rotate = useMotionValue(initialRotate); // This will be updated by the rotation handle

  // State to manage rotation handle drag
  const [isRotating, setIsRotating] = useState(false);
  const rotationStartAngle = useRef(0);
  const rotationStartPhotoAngle = useRef(0);

  const handleRotationDragStart = (event) => {
    setIsRotating(true);
    onBringToFront(id); // Bring to front when rotating too

    // Calculate initial angle from photo center to mouse
    if (photoRef.current) {
      const rect = photoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      rotationStartAngle.current = Math.atan2(dy, dx) * (180 / Math.PI); // Angle in degrees
      rotationStartPhotoAngle.current = rotate.get(); // Current photo rotation
    }
    event.stopPropagation(); // Prevent parent drag
  };

  const handleRotationDrag = (event) => {
    if (!isRotating || !photoRef.current) return;

    const rect = photoRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);

    const deltaAngle = currentAngle - rotationStartAngle.current;
    rotate.set(rotationStartPhotoAngle.current + deltaAngle);
    event.stopPropagation(); // Prevent parent drag
  };

  const handleRotationDragEnd = () => {
    setIsRotating(false);
    onUpdatePosition(id, x.get(), y.get(), rotate.get()); // Update position and rotation
  };

  return (
    <motion.div
      ref={photoRef}
      className="absolute w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl shadow-2xl overflow-hidden cursor-grab
                 bg-white p-2 border-4 border-white group" // Added 'group' class for hover effects on child
      style={{
        x, // Bind to motion value
        y, // Bind to motion value
        rotate, // Bind to motion value
        zIndex: isDragging || isRotating ? 100 : zIndex, // Bring dragged/rotating item to front
        touchAction: 'none', // Prevent default touch actions like scrolling
        boxShadow: (isDragging || isRotating) ? "0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,255,0.8)" : "0 5px 15px rgba(0,0,0,0.3)", // Enhanced shadow
      }}
      drag // Enable dragging for translation
      dragConstraints={dragConstraintsRef} // Constrain drag within the canvas
      dragElastic={0.8} // High elasticity for a "throw" feel
      dragTransition={{ bounceStiffness: 200, bounceDamping: 10, timeConstant: 200 }} // Physics-like transition
      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,255,255,0.7)" }} // Removed rotate from here as it's handled by MotionValue
      whileTap={{ scale: 0.95, cursor: 'grabbing' }}
      onDragStart={() => { setIsDragging(true); onBringToFront(id); }}
      onDragEnd={() => { setIsDragging(false); onUpdatePosition(id, x.get(), y.get(), rotate.get()); }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <img
        src={src}
        alt={`Memory ${id}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/300x300/CCCCCC/000000?text=Image+Error';
        }}
      />
      {/* Rotation Handle */}
      <motion.div
        className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        drag // Make handle draggable
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // No constraints for handle itself
        onPointerDown={handleRotationDragStart}
        onPointerMove={handleRotationDrag}
        onPointerUp={handleRotationDragEnd}
        onDragStart={(e) => { e.stopPropagation(); }} // Prevent photo drag when handle is dragged
        onDragEnd={(e) => { e.stopPropagation(); }}
      >
        {/* Rotation icon (e.g., SVG or emoji) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.162l1.88-1.88a3 3 0 014.24 0L14 5l2-2h-3a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.162l-1.88 1.88a3 3 0 01-4.24 0L6 5H4a1 1 0 01-1-1V2a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// Photo Canvas
function PhotoCanvas() {
  const canvasRef = useRef(null); // Ref for the canvas container, used for dragConstraints
  const [photos, setPhotos] = useState(() => {
    // Define distinct initial positions and rotations for each photo
    // Adjusted positions to ensure they are more spread out and clearly visible
    const initialPhotoData = [
      { x: -180, y: -150, rotate: -10 }, // Top-left
      { x: 120, y: -180, rotate: 8 },    // Top-right
      { x: -200, y: 50, rotate: 12 },    // Mid-left
      { x: 150, y: 80, rotate: -15 },    // Mid-right
      { x: -50, y: 180, rotate: 5 },     // Bottom-center-left
      { x: 200, y: 130, rotate: -9 },    // Bottom-right
    ];

    return placeholderImagePaths.map((src, index) => ({
      id: `photo-${index}`,
      src: src,
      x: initialPhotoData[index].x,
      y: initialPhotoData[index].y,
      rotate: initialPhotoData[index].rotate,
      zIndex: index, // Initial z-index
    }));
  });

  // State to hold the drag constraints reference
  const [dragConstraints, setDragConstraints] = useState(null);

  // Set drag constraints once the canvasRef is mounted
  useEffect(() => {
    if (canvasRef.current) {
      setDragConstraints(canvasRef.current);
    }
  }, [canvasRef]);

  // Function to bring a photo to the front of the z-index stack
  const handleBringToFront = (idToBringFront) => {
    setPhotos(prevPhotos => {
      // Find the current max zIndex
      const maxZIndex = prevPhotos.reduce((max, photo) => Math.max(max, photo.zIndex), 0);
      const newPhotos = prevPhotos.map(photo => {
        if (photo.id === idToBringFront) {
          return { ...photo, zIndex: maxZIndex + 1 }; // Set dragged photo to new highest z-index
        }
        return photo;
      });
      return newPhotos;
    });
  };

  // Function to update a photo's position and rotation after drag ends
  const updatePhotoPosition = (id, newX, newY, newRotate) => {
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === id ? { ...photo, x: newX, y: newY, rotate: newRotate } : photo
      )
    );
  };

  return (
    <motion.div
      ref={canvasRef} // Attach ref to the canvas container
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]
                 bg-gray-800 rounded-2xl overflow-hidden
                 flex items-center justify-center p-4 md:p-6"
      style={{
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
        border: "2px dashed rgba(100,100,255,0.3)",
        background: "radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%)" // Subtle gradient background
      }}
    >
      {photos.sort((a, b) => a.zIndex - b.zIndex).map((photo) => (
        <DraggablePhoto
          key={photo.id}
          src={photo.src}
          id={photo.id}
          initialX={photo.x}
          initialY={photo.y}
          initialRotate={photo.rotate}
          zIndex={photo.zIndex}
          onBringToFront={handleBringToFront}
          onUpdatePosition={updatePhotoPosition} // Pass update function
          dragConstraintsRef={dragConstraints} // Pass the state variable for constraints
        />
      ))}
    </motion.div>
  );
}

// --- Main Page Component ---
export default function CelebratePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center overflow-x-hidden">
      {/* Animated Header Section */}
      <AnimatedHeader />

      {/* Main Content Area - Responsive Two Columns */}
      <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto p-4 gap-8 mt-8">
        {/* Left Column: Profound Message Cards */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col gap-8"
        >
          <BrotherhoodCard />
          <ConqueringWorldCard />
        </motion.div>

        {/* Right Column: Happy Memories Dynamic Photo Canvas */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex-1 bg-gray-900 rounded-3xl shadow-2xl border border-blue-700 p-4 flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Happy Memories
          </h2>
          <PhotoCanvas />
          <p className="text-gray-400 text-sm mt-4 text-center px-4">
            Drag, throw, and arrange your memories! Use the corner handle to rotate!
          </p>
        </motion.div>
      </div>

      {/* Footer Section */}
      <footer className="w-full text-center py-6 text-gray-500 text-sm mt-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          Crafted with profound dedication and a touch of digital artistry of Anargha Bhattacharjee.
        </motion.p>
      </footer>
    </div>
  );
}
