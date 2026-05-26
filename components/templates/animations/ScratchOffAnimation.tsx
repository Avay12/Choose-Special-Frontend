"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function ScratchOffAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-zinc-100">
      
      {/* Underlying Card */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.5 }}
        transition={{ duration: 0.8 }}
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

      {/* Scratch Off Layer */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="scratch"
            exit={{ 
              opacity: 0, 
              scale: 1.1,
              filter: "blur(20px)",
              transition: { duration: 1.2, ease: "easeOut" } 
            }}
            onClick={() => setIsOpen(true)}
            className={`absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer ${!isGradient ? theme.coverBg : ""}`}
            style={{ 
              background: isGradient ? theme.coverBg : undefined,
              // Add a noisy texture to simulate scratch-off material
              backgroundImage: isGradient 
                ? `${theme.coverBg}, url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")` 
                : `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-2xl flex flex-col items-center border border-white/50 text-center max-w-[80%]">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme.sealBg} mb-4 shadow-inner`}>
                {theme.sealIcon}
              </div>
              <h3 className={`text-2xl font-black mb-1 ${theme.textColor}`}>{theme.title}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
                Tap to scratch & reveal
              </p>
            </div>
            
            {/* Some animated scratch marks to indicate interactivity */}
            <motion.div 
              animate={{ opacity: [0, 0.5, 0], x: [-20, 20], y: [-20, 20] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:100px_100px] bg-no-repeat bg-center"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
