"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function BottleMessageAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-cyan-900 perspective-[1000px]">
      
      {/* Water Background effect */}
      <motion.div 
        animate={{ y: ["-5%", "5%"] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-b from-cyan-800 to-blue-950 opacity-80 z-0"
      />

      {/* The Bottle Container */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
            exit={{ opacity: 0, transition: { duration: 1, delay: 0.5 } }}
          >
            <motion.div
              initial={{ x: -300, rotateZ: -45, y: 50 }}
              animate={{ x: 0, rotateZ: 10, y: 0 }}
              exit={{ scale: 2, filter: "blur(20px)", opacity: 0, transition: { duration: 1 } }}
              transition={{ type: "spring", damping: 12 }}
              className="relative w-[300px] h-[100px] flex items-center"
            >
              {/* Bottle Body */}
              <div className="absolute right-0 w-[240px] h-[100px] rounded-[2rem] rounded-l-3xl bg-cyan-200/20 backdrop-blur-sm border-2 border-white/40 shadow-[inset_0_-10px_20px_rgba(255,255,255,0.2)] overflow-hidden">
                {/* Scroll inside bottle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[70px] bg-[#f5ebd0] rounded-sm border border-amber-900/20 shadow-inner flex items-center justify-center">
                   <div className="w-[80%] h-[20%] border-t border-b border-amber-900/20 opacity-50" />
                </div>
                {/* Glass reflection */}
                <div className="absolute top-2 left-4 right-8 h-4 bg-white/40 rounded-full blur-[2px]" />
              </div>
              
              {/* Bottle Neck */}
              <div className="absolute left-[30px] w-[50px] h-[40px] bg-cyan-200/20 backdrop-blur-sm border-2 border-r-0 border-white/40" />
              
              {/* Bottle Cork */}
              <motion.div 
                exit={{ x: -100, y: -50, rotate: -120, opacity: 0, transition: { duration: 0.5 } }}
                className="absolute left-[10px] w-[20px] h-[36px] bg-amber-800 rounded-l-sm border-2 border-amber-950/50" 
              />
              
              {/* Label */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2 w-16 h-16 bg-[#f5ebd0] rounded-full border-2 border-amber-900/20 flex flex-col items-center justify-center shadow-lg transform -rotate-12">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.sealBg} shadow-inner`}>
                  {theme.sealIcon}
                </div>
              </div>
            </motion.div>
            
            <p className="absolute bottom-24 text-cyan-200 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
              Tap to uncork
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unrolled Card Content */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1, rotateY: 0 } : { scale: 0.1, opacity: 0, rotateY: 90 }}
        transition={{ duration: 1, delay: isOpen ? 0.8 : 0, type: "spring", damping: 15 }}
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
