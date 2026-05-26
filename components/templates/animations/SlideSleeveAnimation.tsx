"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function SlideSleeveAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex flex-col items-center justify-center">
      
      {/* The actual card */}
      <motion.div
        initial={false}
        animate={isOpen ? { y: 0, opacity: 1 } : { y: "20%", opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
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

      {/* The Sleeve */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="sleeve"
            exit={{ y: "100%", opacity: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer p-6"
          >
            <div 
              className={`w-full h-[80%] mt-auto rounded-t-3xl border-t-8 border-l-8 border-r-8 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col items-center justify-start pt-12 px-8 text-center
                ${theme.borderColor || "border-white/40"} ${!isGradient ? theme.coverBg : ""}`}
              style={{ background: isGradient ? theme.coverBg : undefined }}
            >
              {/* Glass reflection effect */}
              <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${theme.sealBg} shadow-xl mb-8 z-10`}>
                {theme.sealIcon}
              </div>
              
              <h3 className={`text-3xl font-black tracking-tight ${theme.textColor} z-10`}>
                {theme.title}
              </h3>
              
              <div className="mt-auto mb-8 animate-bounce">
                <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${theme.textColor} opacity-60`}>
                  Slide up to open
                </p>
                <div className={`w-6 h-6 mx-auto mt-2 border-t-2 border-r-2 -rotate-45 ${theme.textColor} opacity-60`} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
