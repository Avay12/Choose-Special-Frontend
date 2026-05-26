"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function CyberGlitchAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-black">
      
      {/* Glitch Overlay */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer bg-zinc-950"
            onClick={() => setIsOpen(true)}
            exit={{ 
              opacity: [1, 0.8, 1, 0, 0.5, 0], 
              scale: [1, 1.05, 0.95, 1.1, 1],
              filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(-90deg)", "blur(10px)"],
              transition: { duration: 0.8, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } 
            }}
          >
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
            
            {/* Glitch text elements */}
            <motion.div 
              animate={{ x: [-2, 2, -1, 3, 0], y: [1, -2, 2, -1, 0] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
              className="relative z-20 flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-none border-2 border-green-500 bg-black flex items-center justify-center mb-6 relative overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                <div className="absolute inset-0 bg-green-500/20 mix-blend-screen" />
                {theme.sealIcon}
              </div>
              
              <h3 className="text-3xl font-mono font-bold text-green-500 tracking-widest uppercase relative">
                {theme.title}
                <span className="absolute top-0 left-0 -ml-[2px] text-red-500 opacity-70 mix-blend-screen -z-10">{theme.title}</span>
                <span className="absolute top-0 left-0 ml-[2px] text-blue-500 opacity-70 mix-blend-screen -z-10">{theme.title}</span>
              </h3>
              
              <div className="mt-8 px-4 py-1 border border-green-500/50 bg-green-950/30">
                <p className="text-[10px] font-mono text-green-400 uppercase tracking-widest">
                  {'>'} SYSTEM.UNLOCK()
                </p>
              </div>
            </motion.div>
            
            {/* Random binary rain effect in background */}
            <div className="absolute inset-0 overflow-hidden opacity-20 text-green-500 font-mono text-xs whitespace-pre-wrap break-all pointer-events-none">
              {Array.from({ length: 50 }).map(() => "01001101 01100001 01110100 01110010 01101001 01111000 ").join("")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The actual card */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 1.05, opacity: 0 }}
        transition={{ duration: 0.5, delay: isOpen ? 0.6 : 0 }}
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
