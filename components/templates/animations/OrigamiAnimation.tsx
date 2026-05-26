"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function OrigamiAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  const panelClass = `absolute inset-0 bg-white border border-black/10 shadow-lg ${!isGradient ? theme.coverBg : ""}`;

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center perspective-[1500px]">
      
      {/* Background to give depth */}
      <div className="absolute inset-0 bg-stone-200/50 -z-10" />

      {/* The actual card */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
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

      {/* Origami Wrappers */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="origami"
            exit={{ opacity: 0, transition: { duration: 1.5, delay: 0.5 } }}
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 z-40 cursor-pointer flex items-center justify-center transform-style-3d"
          >
            {/* Base behind everything */}
            <div className={panelClass} style={{ background: isGradient ? theme.coverBg : undefined }} />

            {/* Left Panel */}
            <motion.div
              exit={{ rotateY: -180, opacity: 0, transition: { duration: 0.8, ease: "anticipate" } }}
              className="absolute left-0 top-0 bottom-0 w-1/2 origin-left border-r border-black/20 shadow-2xl"
              style={{ background: isGradient ? theme.coverBg : undefined }}
            >
              <div className={`absolute inset-0 ${!isGradient ? theme.coverBg : ""}`} />
            </motion.div>

            {/* Right Panel */}
            <motion.div
              exit={{ rotateY: 180, opacity: 0, transition: { duration: 0.8, ease: "anticipate", delay: 0.1 } }}
              className="absolute right-0 top-0 bottom-0 w-1/2 origin-right border-l border-black/20 shadow-2xl"
              style={{ background: isGradient ? theme.coverBg : undefined }}
            >
              <div className={`absolute inset-0 ${!isGradient ? theme.coverBg : ""}`} />
            </motion.div>
            
            {/* Top Triangle */}
            <motion.div
              exit={{ rotateX: 180, opacity: 0, transition: { duration: 0.8, ease: "anticipate", delay: 0.2 } }}
              className="absolute top-0 left-0 right-0 h-1/2 origin-top overflow-hidden z-20"
            >
              <div 
                className={`absolute inset-0 shadow-2xl border-b border-black/20 ${!isGradient ? theme.coverBg : ""}`}
                style={{ 
                  background: isGradient ? theme.coverBg : undefined,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)" 
                }}
              />
            </motion.div>

            {/* Bottom Triangle */}
            <motion.div
              exit={{ rotateX: -180, opacity: 0, transition: { duration: 0.8, ease: "anticipate", delay: 0.3 } }}
              className="absolute bottom-0 left-0 right-0 h-1/2 origin-bottom overflow-hidden z-30"
            >
              <div 
                className={`absolute inset-0 shadow-2xl border-t border-black/20 ${!isGradient ? theme.coverBg : ""}`}
                style={{ 
                  background: isGradient ? theme.coverBg : undefined,
                  clipPath: "polygon(50% 0, 100% 100%, 0 100%)" 
                }}
              />
              
              {/* Seal placed precisely on the tip of the bottom triangle */}
              <div className="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16">
                 <div className={`w-full h-full rounded-full flex items-center justify-center ${theme.sealBg} shadow-lg border-2 border-white/50`}>
                   {theme.sealIcon}
                 </div>
              </div>
            </motion.div>

            {/* Center Content Overlay */}
            <motion.div
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 pb-16 pt-24"
            >
              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/50">
                <h3 className={`text-lg font-bold ${theme.textColor}`}>{theme.title}</h3>
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-800 opacity-60 mix-blend-overlay">Tap to unfold</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
