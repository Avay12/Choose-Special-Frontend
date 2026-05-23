"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";

export interface EnvelopeTheme {
  coverBg: string; // Tailwind background utility or custom linear-gradient
  borderColor?: string; // Border color utility
  sealBg: string; // Background color for the seal circle
  sealIcon: React.ReactNode;
  title: string;
  subtitle?: string;
  textColor: string; // Base text color class
  accentColor?: string; // Accent color class
}

interface CardEnvelopeProps {
  children: React.ReactNode;
  theme: EnvelopeTheme;
  className?: string;
}

export default function CardEnvelope({ children, theme, className = "" }: CardEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const isGradient = theme.coverBg.includes("gradient") && (theme.coverBg.includes("#") || theme.coverBg.includes("rgb"));

  return (
    <div className={`relative w-full h-full min-h-[520px] rounded-[2rem] overflow-hidden ${className}`}>
      {/* Closed Envelope Cover */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="envelope"
            className={`absolute inset-0 z-40 flex flex-col justify-between items-center p-12 cursor-pointer border-8 ${theme.borderColor || "border-white"} shadow-2xl rounded-[inherit] overflow-hidden ${!isGradient ? theme.coverBg : ""}`}
            style={{ background: isGradient ? theme.coverBg : undefined }}
            onClick={handleOpen}
            exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.3 } }}
          >
            {/* Top panel sliding up */}
            <motion.div
              className={`absolute top-0 inset-x-0 h-1/2 border-b border-white/20 ${!isGradient ? theme.coverBg : ""}`}
              style={{ background: isGradient ? theme.coverBg : undefined, originY: 0 }}
              exit={{ 
                y: "-100%", 
                opacity: 0, 
                scaleY: 0.85, 
                transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } 
              }}
            />

            {/* Bottom panel sliding down */}
            <motion.div
              className={`absolute bottom-0 inset-x-0 h-1/2 border-t border-white/20 ${!isGradient ? theme.coverBg : ""}`}
              style={{ background: isGradient ? theme.coverBg : undefined, originY: 1 }}
              exit={{ 
                y: "100%", 
                opacity: 0, 
                scaleY: 0.85, 
                transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } 
              }}
            />

            {/* Envelope content */}
            <div className="relative z-10 w-full flex flex-col items-center justify-between h-full py-4 text-center select-none">
              {/* Envelope Header */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0, transition: { duration: 0.4 } }}
                className="space-y-2"
              >
                <span className={`text-[10px] uppercase tracking-[0.4em] font-bold opacity-60 ${theme.accentColor || theme.textColor}`}>
                  A Special Greeting
                </span>
                <h3 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight ${theme.textColor}`}>
                  {theme.title}
                </h3>
              </motion.div>

              {/* Pulsing Middle Seal */}
              <motion.div
                exit={{ scale: 0, opacity: 0, rotate: 45, transition: { duration: 0.4 } }}
                className="my-auto flex flex-col items-center justify-center gap-4 relative"
              >
                {/* Outer pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute w-24 h-24 rounded-full border-2 border-current opacity-30 ${theme.accentColor || theme.textColor}`}
                />
                
                {/* Inner dashed pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className={`absolute w-20 h-20 rounded-full border border-dashed border-current opacity-50 ${theme.accentColor || theme.textColor}`}
                />

                {/* Seal roundel */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-shadow duration-300 hover:shadow-2xl border-4 border-white/80 ${theme.sealBg}`}
                >
                  {theme.sealIcon}
                </motion.div>

                {/* Interaction prompt */}
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className={`text-[10px] font-bold uppercase tracking-[0.25em] opacity-80 ${theme.textColor}`}
                >
                  Tap to open
                </motion.span>
              </motion.div>

              {/* Envelope Footer */}
              {theme.subtitle && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0, transition: { duration: 0.4 } }}
                  className={`text-sm font-medium italic ${theme.textColor} opacity-70 max-w-[280px] line-clamp-2`}
                >
                  For {theme.subtitle}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opened Greeting Card Wrapper */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.92, opacity: 0, y: 24 }}
        transition={{ type: "spring", damping: 18, stiffness: 75, delay: isOpen ? 0.35 : 0 }}
        className="w-full h-full relative"
      >
        {children}

        {/* Close/Re-pack button */}
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            whileHover={{ opacity: 1, scale: 1.1, rotate: -45 }}
            onClick={handleClose}
            className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/30 shadow-lg text-slate-800 transition-all duration-300"
            title="Close Card"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
