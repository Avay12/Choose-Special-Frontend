"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function BookFlipAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden perspective-[2000px] bg-stone-100 flex items-center justify-center">
      
      {/* Book Container */}
      <motion.div 
        className="relative w-full h-full max-w-sm max-h-[600px]"
        animate={isOpen ? { x: "25%" } : { x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Right page (Card Content) */}
        <div className="absolute inset-0 bg-white rounded-r-2xl shadow-xl overflow-hidden origin-left z-10 border-r-4 border-t-4 border-b-4 border-stone-200">
          <div className="w-full h-full p-2 bg-gradient-to-r from-stone-200/50 to-transparent">
            {children}
            
            {isOpen && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                whileHover={{ opacity: 1, scale: 1.1, rotate: -45 }}
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-stone-200 hover:bg-stone-300 shadow-md text-stone-700 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Left page (Book Cover) */}
        <motion.div
          className={`absolute inset-0 origin-left z-20 rounded-r-2xl shadow-2xl border-r border-t border-b border-black/20 ${!isGradient ? theme.coverBg : ""}`}
          style={{ 
            background: isGradient ? theme.coverBg : undefined,
            transformStyle: "preserve-3d",
            cursor: isOpen ? "default" : "pointer"
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isOpen ? -170 : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => !isOpen && setIsOpen(true)}
        >
          {/* Front of cover */}
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 border-l-[16px] border-black/20">
            {/* Book Spine effect */}
            <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-black/40 via-transparent to-black/10 mix-blend-overlay" />
            
            <div className={`w-full h-full border-2 ${theme.borderColor || "border-white/30"} p-4 flex flex-col items-center justify-between`}>
              <div className="mt-8 text-center">
                <span className={`text-[10px] uppercase tracking-[0.4em] font-bold opacity-60 ${theme.accentColor || theme.textColor}`}>
                  Chapter One
                </span>
                <h3 className={`text-3xl font-serif font-black mt-4 leading-tight ${theme.textColor}`}>
                  {theme.title}
                </h3>
              </div>
              
              <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 border-white/50 ${theme.sealBg} shadow-lg`}>
                {theme.sealIcon}
              </div>
              
              <div className="mb-8">
                <p className={`text-xs font-bold uppercase tracking-widest ${theme.textColor} opacity-80 animate-pulse`}>Open Book</p>
              </div>
            </div>
          </div>

          {/* Back of cover (inside left page) */}
          <div 
            className="absolute inset-0 bg-stone-100 rounded-l-2xl border-l-4 border-stone-300 backface-hidden"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <div className="w-full h-full p-8 border-r-[16px] border-black/10 bg-gradient-to-l from-stone-200/50 to-transparent flex items-center justify-center">
               <div className="opacity-10 pointer-events-none">
                 {theme.sealIcon}
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
