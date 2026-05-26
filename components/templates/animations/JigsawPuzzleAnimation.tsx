"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EnvelopeTheme } from "../CardEnvelope";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
}

export default function JigsawPuzzleAnimation({ children, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [pieces, setPieces] = useState<{id: number, x: number, y: number, r: number, delay: number}[]>([]);

  useEffect(() => {
    // Generate puzzle pieces scatter data
    const p = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      r: Math.random() * 180 - 90,
      delay: Math.random() * 1.5
    }));
    setPieces(p);
  }, []);

  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden flex items-center justify-center bg-slate-100">
      
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMjBoMjBWMEgwem0xOSAxOUgxVjFoMTh2MTh6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-50 z-0" />

      {/* The Puzzle Cover overlay */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
            exit={{ opacity: 0, transition: { duration: 2.5 } }}
          >
            <div className={`absolute inset-0 flex flex-wrap ${!isGradient ? theme.coverBg : ""}`} style={{ background: isGradient ? theme.coverBg : undefined }}>
              {pieces.map((piece, i) => (
                <motion.div
                  key={piece.id}
                  className="w-1/4 h-1/4 border-[0.5px] border-white/20 backdrop-blur-sm relative"
                  exit={{ 
                    x: piece.x, 
                    y: piece.y, 
                    rotate: piece.r, 
                    opacity: 0, 
                    scale: 1.5,
                    filter: "blur(10px)",
                    transition: { duration: 1.5, delay: piece.delay, ease: "easeIn" } 
                  }}
                >
                  {/* Just some fake puzzle tabs to look puzzle-ish */}
                  {i % 2 === 0 && <div className="absolute top-1/2 -right-3 w-6 h-6 bg-current rounded-full opacity-10" />}
                  {i % 3 === 0 && <div className="absolute -bottom-3 left-1/2 w-6 h-6 bg-current rounded-full opacity-10" />}
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
              className="absolute bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-white"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme.sealBg} shadow-inner mb-4`}>
                {theme.sealIcon}
              </div>
              <h3 className={`text-2xl font-black ${theme.textColor} text-center`}>{theme.title}</h3>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Tap to solve puzzle
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Card */}
      <motion.div
        initial={false}
        animate={isOpen ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(20px)" }}
        transition={{ duration: 1.5, delay: isOpen ? 1 : 0 }}
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
