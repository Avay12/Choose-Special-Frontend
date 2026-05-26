"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function VinylRecordAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-zinc-900">
      
      {/* Card Content (Slides out from sleeve) */}
      <motion.div
        initial={false}
        animate={isOpen ? { x: 0, scale: 1, opacity: 1 } : { x: "40%", scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 80, delay: isOpen ? 0.8 : 0 }}
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

      {/* Record Sleeve */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="sleeve"
            className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
            exit={{ x: "-100%", opacity: 0, transition: { duration: 1, delay: 0.5, ease: "anticipate" } }}
          >
            {/* The Record itself rolling out */}
            <motion.div 
              className="absolute w-[80%] aspect-square rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-2xl flex items-center justify-center"
              initial={{ x: 0, rotate: 0 }}
              exit={{ x: "60%", rotate: 360, opacity: 0, transition: { duration: 1.5, ease: "easeOut" } }}
            >
              {/* Grooves */}
              <div className="absolute inset-4 rounded-full border border-zinc-800" />
              <div className="absolute inset-8 rounded-full border border-zinc-800" />
              <div className="absolute inset-12 rounded-full border border-zinc-800" />
              
              {/* Record Label */}
              <div className={`w-1/3 aspect-square rounded-full ${!isGradient ? theme.coverBg : ""} flex items-center justify-center border-4 border-zinc-900`} style={{ background: isGradient ? theme.coverBg : undefined }}>
                 <div className="w-4 h-4 rounded-full bg-zinc-950" />
              </div>
            </motion.div>

            {/* The Sleeve Cover */}
            <motion.div 
              className={`absolute w-[85%] aspect-square rounded-md shadow-2xl border-l-8 border-r-2 border-t-2 border-b-2 border-white/10 ${!isGradient ? theme.coverBg : ""} flex flex-col items-center justify-center p-8 text-center overflow-hidden z-20`}
              style={{ background: isGradient ? theme.coverBg : undefined }}
              exit={{ x: "-20%", transition: { duration: 0.8 } }}
            >
               {/* Distressed vintage overlay */}
               <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle,transparent_20%,#000_120%)]" />
               
               <div className={`w-24 h-24 rounded-full flex items-center justify-center ${theme.sealBg} shadow-2xl mb-6 relative z-10 border-4 border-white/20`}>
                 {theme.sealIcon}
               </div>
               <h3 className={`text-4xl font-black tracking-tighter ${theme.textColor} relative z-10`}>
                 {theme.title}
               </h3>
               <p className={`mt-auto text-xs font-bold uppercase tracking-widest ${theme.textColor} opacity-60 relative z-10`}>
                 Tap to Play Record
               </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
