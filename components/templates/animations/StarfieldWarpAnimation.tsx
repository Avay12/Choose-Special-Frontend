"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function StarfieldWarpAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState<{id: number, x: number, y: number, size: number, delay: number}[]>([]);

  useEffect(() => {
    // Generate stars
    const s = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 2
    }));
    setStars(s);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-black perspective-[1000px]">
      
      {/* Starfield Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{ 
              left: `${star.x}%`, 
              top: `${star.y}%`, 
              width: star.size, 
              height: star.size 
            }}
            animate={isOpen ? { 
              scale: [1, 20], 
              opacity: [0.8, 0],
              z: 500
            } : {
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{ 
              duration: isOpen ? 1 : 3 + star.delay, 
              repeat: isOpen ? 0 : Infinity,
              ease: isOpen ? "easeIn" : "linear"
            }}
          />
        ))}
      </div>

      {/* Center Portal/Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            exit={{ scale: 50, opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            onClick={() => setIsOpen(true)}
            className="absolute z-40 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(139,92,246,0.3)", "0 0 60px rgba(139,92,246,0.6)", "0 0 20px rgba(139,92,246,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 rounded-full border-2 border-violet-500/50 bg-violet-900/40 backdrop-blur-md flex items-center justify-center relative"
            >
              <div className="absolute inset-2 rounded-full border border-dashed border-violet-400/50 animate-spin-slow" />
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme.sealBg} shadow-inner z-10`}>
                {theme.sealIcon}
              </div>
            </motion.div>
            
            <p className="mt-8 text-violet-300 text-xs font-bold uppercase tracking-[0.4em] animate-pulse">
              Initiate Warp
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Card */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1, z: 0 } : { scale: 0.1, opacity: 0, z: -1000 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="w-full h-full relative z-20"
      >
        {children}

        {isOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, scale: 1.1, rotate: -45 }}
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/30 shadow-lg text-slate-800 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
