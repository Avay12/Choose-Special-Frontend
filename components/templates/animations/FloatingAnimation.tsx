"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function FloatingAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [confetti, setConfetti] = useState<{id: number, x: number, y: number, color: string, delay: number}[]>([]);

  useEffect(() => {
    if (isOpen) {
      const colors = ['#fde047', '#f43f5e', '#3b82f6', '#22c55e', '#a855f7'];
      const pieces = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100, // percentage relative to center
        y: Math.random() * 200 - 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5
      }));
      setConfetti(pieces);
    }
  }, [isOpen]);

  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-sky-50">
      
      {/* Cloud decorations */}
      <div className="absolute top-10 left-10 w-24 h-8 bg-white/50 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-12 bg-white/50 rounded-full blur-xl" />

      {/* The Card wrapper (floats in when opened) */}
      <motion.div
        initial={false}
        animate={isOpen ? { y: 0, opacity: 1, scale: 1 } : { y: "-100%", opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", damping: 12, stiffness: 40, delay: 0.2 }}
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

      {/* Confetti Explosion when opened */}
      <AnimatePresence>
        {isOpen && confetti.map((c) => (
          <motion.div
            key={`confetti-${c.id}`}
            initial={{ top: "50%", left: "50%", opacity: 1, scale: 0 }}
            animate={{ 
              top: `${50 + c.y}%`, 
              left: `${50 + c.x}%`, 
              opacity: 0, 
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360
            }}
            transition={{ duration: 2, delay: c.delay, ease: "easeOut" }}
            className="absolute z-20 w-3 h-3 rounded-sm pointer-events-none"
            style={{ backgroundColor: c.color }}
          />
        ))}
      </AnimatePresence>

      {/* The Balloon/Cloud Trigger Overlay */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="balloon"
            exit={{ y: "-150%", opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
          >
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              {/* Balloon */}
              <div 
                className={`w-32 h-40 rounded-[4rem] shadow-2xl border-4 ${theme.borderColor || "border-white/50"} flex items-center justify-center mb-4 relative ${!isGradient ? theme.coverBg : ""}`}
                style={{ background: isGradient ? theme.coverBg : undefined }}
              >
                <div className="absolute -bottom-4 w-4 h-4 bg-current rotate-45 border-r border-b opacity-50" />
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme.sealBg} shadow-inner`}>
                  {theme.sealIcon}
                </div>
              </div>
              
              <div className="h-20 border-l-2 border-dashed border-slate-400 opacity-50" />
              
              <div className="mt-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-[2rem] shadow-lg text-center border border-white/60">
                <h3 className={`text-xl font-black mb-1 ${theme.textColor}`}>{theme.title}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Tap to pop balloon
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
