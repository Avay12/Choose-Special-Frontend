"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function GiftBoxAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center perspective-[1200px]">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="giftbox"
            className="absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
            exit={{ opacity: 0, transition: { delay: 1, duration: 0.5 } }}
          >
            {/* Box Body */}
            <motion.div
              className={`absolute bottom-12 w-[80%] h-[60%] rounded-2xl shadow-2xl border-4 ${theme.borderColor || "border-white/30"} ${!isGradient ? theme.coverBg : ""}`}
              style={{ background: isGradient ? theme.coverBg : undefined }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0, transition: { duration: 0.8, ease: "anticipate" } }}
            >
              {/* Vertical Ribbon */}
              <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 ${theme.sealBg} opacity-80 shadow-md`} />
            </motion.div>

            {/* Box Lid */}
            <motion.div
              className={`absolute bottom-[calc(60%+3rem)] w-[84%] h-[15%] rounded-xl shadow-xl border-4 z-20 ${theme.borderColor || "border-white/40"} ${!isGradient ? theme.coverBg : ""}`}
              style={{ background: isGradient ? theme.coverBg : undefined }}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ 
                y: -150, 
                rotateX: -45, 
                rotateZ: 10,
                opacity: 0, 
                transition: { duration: 0.8, ease: "anticipate" } 
              }}
            >
              {/* Vertical Ribbon on Lid */}
              <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 ${theme.sealBg} opacity-80 shadow-md`} />
              
              {/* Horizontal Ribbon on Lid */}
              <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 ${theme.sealBg} opacity-80 shadow-md`} />
              
              {/* Bow / Seal */}
              <motion.div 
                className={`absolute left-1/2 -translate-x-1/2 -top-10 w-20 h-20 rounded-full flex items-center justify-center border-4 border-white/80 shadow-lg ${theme.sealBg} z-30`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {theme.sealIcon}
              </motion.div>
            </motion.div>

            {/* Tap to open prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-24 text-center z-50 w-full"
            >
              <h3 className={`text-2xl font-black mb-2 ${theme.textColor} drop-shadow-md`}>{theme.title}</h3>
              <p className={`text-xs font-bold uppercase tracking-widest ${theme.textColor} opacity-80`}>Tap to Unbox</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Content rising out */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 15, stiffness: 60, delay: isOpen ? 0.6 : 0 }}
        className="w-full h-full relative z-10"
      >
        {children}

        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
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
