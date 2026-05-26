"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function TreasureChestAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-amber-950 perspective-[1500px]">
      
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
            exit={{ opacity: 0, transition: { duration: 1, delay: 0.5 } }}
          >
            {/* Chest Glow */}
            <motion.div 
              animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute w-64 h-64 bg-amber-500/20 blur-[60px] rounded-full"
            />

            {/* Chest */}
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 200, opacity: 0, transition: { duration: 0.8 } }}
              className="relative w-64 h-48 flex flex-col items-center"
            >
              {/* Chest Lid */}
              <motion.div
                exit={{ rotateX: -110, y: -20, transition: { duration: 0.8, ease: "easeOut" } }}
                className="w-full h-24 bg-amber-800 rounded-t-full border-4 border-b-2 border-amber-600 shadow-inner relative origin-bottom transform-style-3d overflow-hidden"
              >
                 {/* Wood planks */}
                 <div className="absolute inset-x-0 top-1/3 h-1 bg-amber-950/40" />
                 <div className="absolute inset-x-0 top-2/3 h-1 bg-amber-950/40" />
                 
                 {/* Metal bands */}
                 <div className="absolute inset-y-0 left-8 w-4 bg-zinc-700 border-x border-zinc-900" />
                 <div className="absolute inset-y-0 right-8 w-4 bg-zinc-700 border-x border-zinc-900" />
              </motion.div>

              {/* Chest Body */}
              <div className="w-full h-24 bg-amber-800 border-4 border-t-2 border-amber-600 shadow-2xl relative overflow-hidden">
                 {/* Wood planks */}
                 <div className="absolute inset-x-0 top-1/3 h-1 bg-amber-950/40" />
                 <div className="absolute inset-x-0 top-2/3 h-1 bg-amber-950/40" />
                 
                 {/* Metal bands */}
                 <div className="absolute inset-y-0 left-8 w-4 bg-zinc-700 border-x border-zinc-900" />
                 <div className="absolute inset-y-0 right-8 w-4 bg-zinc-700 border-x border-zinc-900" />

                 {/* Lock */}
                 <motion.div 
                   exit={{ rotate: 90, scale: 0, opacity: 0 }}
                   className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-16 bg-yellow-500 rounded-b-xl border-2 border-yellow-700 flex items-center justify-center shadow-lg z-10"
                 >
                   <div className="w-4 h-6 bg-amber-950 rounded-full" />
                 </motion.div>
              </div>

              {/* Theme seal hovering above */}
              <motion.div
                exit={{ y: -100, opacity: 0 }}
                className={`absolute -top-16 w-16 h-16 rounded-full flex items-center justify-center ${theme.sealBg} shadow-[0_0_30px_rgba(251,191,36,0.6)] border-2 border-yellow-300`}
              >
                {theme.sealIcon}
              </motion.div>
            </motion.div>
            
            <p className="mt-12 text-amber-500 text-xs font-bold uppercase tracking-[0.4em] drop-shadow-md">
              Unlock Treasure
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rising Card Content */}
      <motion.div
        initial={false}
        animate={isOpen ? { y: 0, opacity: 1, scale: 1 } : { y: 150, opacity: 0, scale: 0.5 }}
        transition={{ duration: 1, delay: isOpen ? 0.6 : 0, type: "spring", damping: 15 }}
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
