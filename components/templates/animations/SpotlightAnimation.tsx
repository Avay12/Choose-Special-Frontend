"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function SpotlightAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate percentage for CSS radial gradient
      if (typeof window !== "undefined") {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setMousePos({ x, y });
      }
    };
    
    if (!isOpen) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isOpen]);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-zinc-950">
      
      {/* The actual card */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="w-full h-full relative z-10"
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

      {/* Spotlight overlay */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="spotlight"
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 z-40 cursor-pointer pointer-events-auto"
            style={{
              background: `radial-gradient(circle 150px at ${mousePos.x}% ${mousePos.y}%, transparent 0%, rgba(0,0,0,0.95) 100%)`
            }}
          >
            {/* Ambient instruction text */}
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mix-blend-difference text-white"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="p-4 border-2 border-white/20 rounded-full mb-4">
                {theme.sealIcon}
              </div>
              <p className="text-sm tracking-[0.3em] uppercase font-bold text-center">
                Click to turn on<br/>the lights
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
