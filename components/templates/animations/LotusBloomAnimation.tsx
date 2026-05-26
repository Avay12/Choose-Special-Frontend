"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function LotusBloomAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-teal-50">
      
      {/* Background radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-100/50 to-transparent z-0" />

      {/* The Lotus Container */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
            onClick={() => setIsOpen(true)}
            exit={{ opacity: 0, transition: { duration: 1.5, delay: 0.8 } }}
          >
            <div className="relative w-64 h-64 flex items-center justify-center">
              
              {/* Petals */}
              {[...Array(8)].map((_, i) => {
                const rotation = i * 45;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-16 h-32 origin-bottom"
                    style={{ rotate: rotation }}
                    exit={{ 
                      rotateX: -90, 
                      y: 50,
                      opacity: 0, 
                      transition: { duration: 1.2, ease: "easeInOut" } 
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-pink-400 to-pink-200 rounded-t-full opacity-80 mix-blend-multiply border border-pink-300" />
                  </motion.div>
                );
              })}

              {/* Inner Petals */}
              {[...Array(8)].map((_, i) => {
                const rotation = i * 45 + 22.5;
                return (
                  <motion.div
                    key={`inner-${i}`}
                    className="absolute w-12 h-24 origin-bottom"
                    style={{ rotate: rotation }}
                    exit={{ 
                      rotateX: -80, 
                      y: 30,
                      opacity: 0, 
                      transition: { duration: 1, ease: "easeInOut", delay: 0.2 } 
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-rose-300 to-rose-100 rounded-t-full opacity-90 border border-rose-200 shadow-inner" />
                  </motion.div>
                );
              })}

              {/* Center Seal */}
              <motion.div
                exit={{ scale: 3, opacity: 0, transition: { duration: 0.8, delay: 0.4 } }}
                className={`absolute w-16 h-16 rounded-full flex items-center justify-center ${theme.sealBg} shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10`}
              >
                {theme.sealIcon}
              </motion.div>
            </div>
            
            <p className="mt-12 text-teal-800 text-xs font-bold uppercase tracking-[0.3em] opacity-60 animate-pulse">
              Tap to Bloom
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emerging Card Content */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ duration: 1.5, delay: isOpen ? 0.6 : 0, ease: [0.22, 1, 0.36, 1] }}
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
