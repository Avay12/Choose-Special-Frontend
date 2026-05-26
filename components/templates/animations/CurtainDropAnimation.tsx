"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function CurtainDropAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-zinc-900 perspective-[1000px]">
      
      {/* Background stage (behind card) */}
      <div className="absolute inset-0 bg-radial-gradient from-zinc-800 to-black opacity-50 z-0" />

      {/* Card Content */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2 }}
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

      {/* Curtains overlay */}
      <AnimatePresence>
        {!isOpen && (
          <div 
            className="absolute inset-0 z-40 flex cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            {/* Left Curtain */}
            <motion.div
              exit={{ x: "-100%", skewX: -10, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } }}
              className="w-1/2 h-full bg-red-800 relative shadow-[10px_0_20px_rgba(0,0,0,0.5)] origin-top"
              style={{
                backgroundImage: "repeating-linear-gradient(to right, transparent, transparent 10%, rgba(0,0,0,0.2) 15%, transparent 20%)"
              }}
            >
              {/* Tassel */}
              <div className="absolute right-0 top-1/2 w-4 h-16 bg-yellow-600 rounded-l-full translate-x-1/2 shadow-lg" />
            </motion.div>

            {/* Right Curtain */}
            <motion.div
              exit={{ x: "100%", skewX: 10, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } }}
              className="w-1/2 h-full bg-red-800 relative shadow-[-10px_0_20px_rgba(0,0,0,0.5)] origin-top"
              style={{
                backgroundImage: "repeating-linear-gradient(to right, transparent, transparent 10%, rgba(0,0,0,0.2) 15%, transparent 20%)"
              }}
            >
              {/* Tassel */}
              <div className="absolute left-0 top-1/2 w-4 h-16 bg-yellow-600 rounded-r-full -translate-x-1/2 shadow-lg" />
            </motion.div>

            {/* Center Call to Action */}
            <motion.div
              exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.5 } }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className={`p-8 rounded-full border-4 border-yellow-600/50 bg-black/40 backdrop-blur-md shadow-2xl flex flex-col items-center gap-4`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-yellow-600 text-white shadow-inner`}>
                  {theme.sealIcon}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-yellow-500 tracking-widest uppercase mb-1">{theme.title}</h3>
                  <p className="text-xs text-yellow-500/70 uppercase">Tap to start the show</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
