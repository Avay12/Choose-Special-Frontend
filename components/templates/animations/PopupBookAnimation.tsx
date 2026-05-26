"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function PopupBookAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center perspective-[2000px] bg-amber-50">
      
      {/* Table Surface */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-900/10 to-transparent" />

      {/* Book Base (Flat on table when closed, opens up) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="book-base"
            className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
            exit={{ opacity: 0, transition: { duration: 1, delay: 0.5 } }}
          >
            <motion.div 
              className={`w-[80%] h-[60%] rounded-xl shadow-2xl border-4 border-amber-900/20 flex flex-col items-center justify-center ${!isGradient ? theme.coverBg : ""}`}
              style={{ background: isGradient ? theme.coverBg : undefined }}
              initial={{ rotateX: 60, y: 100, scale: 0.9 }}
              animate={{ rotateX: 50, y: 80, scale: 1 }}
              whileHover={{ rotateX: 45, y: 70 }}
              exit={{ rotateX: 90, y: 200, opacity: 0, transition: { duration: 0.8 } }}
            >
               <div className={`w-20 h-20 rounded-full flex items-center justify-center ${theme.sealBg} shadow-2xl mb-4 border-4 border-white/50`}>
                 {theme.sealIcon}
               </div>
               <h3 className={`text-3xl font-serif font-black ${theme.textColor} drop-shadow-md transform -skew-x-6`}>
                 {theme.title}
               </h3>
               <p className={`mt-4 text-xs font-bold uppercase tracking-widest ${theme.textColor} opacity-80 animate-pulse`}>
                 Tap to open Pop-up
               </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up Card Content */}
      <motion.div
        initial={false}
        animate={isOpen ? { rotateX: 0, y: 0, opacity: 1, scale: 1 } : { rotateX: -90, y: 100, opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", damping: 15, stiffness: 60, delay: isOpen ? 0.3 : 0 }}
        className="w-full h-full relative z-10 origin-bottom"
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
