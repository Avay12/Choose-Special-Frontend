"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function MagicRevealAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  // Generate some random particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    scale: Math.random() * 0.5 + 0.5,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-black/90">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="magic-overlay"
            className={`absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer ${!isGradient ? theme.coverBg : ""}`}
            style={{ background: isGradient ? theme.coverBg : undefined }}
            onClick={() => setIsOpen(true)}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.8 } }}
          >
            {/* Shimmering background effect */}
            <motion.div 
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 flex flex-col items-center gap-8 text-center px-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`w-32 h-32 rounded-full border-4 border-dashed ${theme.borderColor || "border-white/40"} flex items-center justify-center relative`}
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${theme.sealBg} shadow-xl shadow-current/20`}>
                  {theme.sealIcon}
                </div>
              </motion.div>

              <div>
                <h3 className={`text-3xl font-black mb-2 tracking-tight ${theme.textColor} drop-shadow-lg`}>{theme.title}</h3>
                <p className={`text-sm font-medium ${theme.textColor} opacity-80 uppercase tracking-widest`}>Tap to Reveal Magic</p>
              </div>
            </motion.div>

            {/* Tap Particles */}
            {isOpen && particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute left-1/2 top-1/2 w-4 h-4 text-white"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x: p.x * 3, y: p.y * 3, opacity: 0, scale: p.scale }}
                transition={{ duration: 1, delay: p.delay, ease: "easeOut" }}
              >
                <Sparkles className="w-full h-full fill-current" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1, filter: "brightness(1) blur(0px)" } : { scale: 0.8, opacity: 0, filter: "brightness(2) blur(20px)" }}
        transition={{ duration: 1, delay: isOpen ? 0.3 : 0 }}
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
    </div>
  );
}
