"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function WaxPeelAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-stone-100">
      
      {/* Background paper texture */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none" />

      {/* Ribbon Wrapper */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
            exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.8 } }}
          >
            {/* Horizontal Ribbon */}
            <motion.div 
              exit={{ width: 0, opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
              className="absolute left-0 right-0 h-16 bg-red-800 shadow-lg border-y border-red-900/50" 
              style={{ backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent, rgba(0,0,0,0.2))" }}
            />
            
            {/* Vertical Ribbon */}
            <motion.div 
              exit={{ height: 0, opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
              className="absolute top-0 bottom-0 w-16 bg-red-800 shadow-lg border-x border-red-900/50" 
              style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.1), transparent, rgba(0,0,0,0.2))" }}
            />

            {/* The Wax Seal */}
            <motion.div
              exit={{ scale: 3, opacity: 0, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeIn" } }}
              className="relative w-32 h-32"
            >
              <div className={`w-full h-full rounded-full flex flex-col items-center justify-center ${theme.sealBg} shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-4 border-red-950/20 backdrop-blur-sm relative z-10`}>
                {theme.sealIcon}
              </div>
              {/* Irregular wax edges */}
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className={`absolute w-8 h-8 rounded-full ${theme.sealBg} -z-10`}
                  style={{
                    top: `${50 + 45 * Math.sin(i * Math.PI / 4)}%`,
                    left: `${50 + 45 * Math.cos(i * Math.PI / 4)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </motion.div>

            <p className="absolute bottom-32 text-stone-600 text-xs font-bold uppercase tracking-[0.3em]">
              Tap to break seal
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The actual card */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
        transition={{ duration: 1, delay: isOpen ? 0.6 : 0 }}
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
