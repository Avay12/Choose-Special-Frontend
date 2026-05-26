"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function PolaroidDropAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-neutral-200">
      
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-transparent" />

      {/* The polaroid photo container */}
      <motion.div
        initial={{ y: -500, rotate: -15, scale: 0.8 }}
        animate={{ y: 0, rotate: 0, scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 60 }}
        className="relative w-[90%] h-[90%] bg-white p-4 pb-20 rounded-sm shadow-2xl flex flex-col"
      >
        {/* The photo area (contains the card) */}
        <div className="relative w-full h-full bg-zinc-900 rounded-sm overflow-hidden overflow-y-auto custom-scrollbar">
          
          {/* Card Content developing */}
          <motion.div
            initial={false}
            animate={isOpen ? { opacity: 1, filter: "sepia(0) contrast(1) brightness(1) blur(0px)" } : { opacity: 0, filter: "sepia(1) contrast(2) brightness(2) blur(10px)" }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="w-full h-full relative z-10"
          >
            {children}
          </motion.div>

          {/* Developing Overlay */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                exit={{ opacity: 0, transition: { duration: 3 } }}
                className="absolute inset-0 bg-zinc-800 z-20 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <div className={`p-4 rounded-full border border-white/20 mb-4 bg-white/5`}>
                  {theme.sealIcon}
                </div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Tap to develop
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Polaroid caption area */}
        <div className="absolute bottom-6 left-0 right-0 text-center px-4">
          <p className="font-writing text-2xl text-slate-800 -rotate-2 inline-block">
            {theme.title}
          </p>
        </div>

        {isOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, scale: 1.1, rotate: -45 }}
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 z-50 p-2.5 rounded-full bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/30 shadow-lg text-slate-800 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
