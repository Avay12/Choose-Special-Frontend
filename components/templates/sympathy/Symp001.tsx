"use client";

import { motion } from "framer-motion";
import { Flower2, Wind, Heart } from "lucide-react";

interface Symp001Props {
  name?: string;
  message?: string;
}

export default function Symp001({
  name = "Recipient",
  message = "Wishing you strength and comfort during this difficult time. Please know that you are in our thoughts and hearts.",
}: Symp001Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[400px] mx-auto min-h-[580px] bg-[#fdfdfd] border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden relative group p-12 text-center flex flex-col items-center justify-center gap-10"
    >
      {/* Subtle Calming Background Animation */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-100 rounded-full blur-3xl"
        />
      </div>

      {/* Top Banner section */}
      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        <div className="relative">
          <Flower2
            className="w-16 h-16 text-slate-400 group-hover:scale-105 transition-transform duration-1000"
            strokeWidth={0.5}
          />
          <motion.div
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Wind className="w-6 h-6 text-slate-300" strokeWidth={1} />
          </motion.div>
        </div>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-10 flex-1 flex flex-col items-center justify-center">
        <div className="relative group text-slate-800">
          <h3 className="font-serif text-5xl md:text-6xl text-slate-700 tracking-tight leading-none mb-4 italic transition-all duration-700">
            With Deepest <br /> Sympathy
          </h3>
        </div>

        <div className="space-y-6 pt-4">
          <p className="text-xl text-slate-500 font-serif italic max-w-[300px] mx-auto leading-relaxed px-4 transition-all duration-500 hover:text-slate-700">
            "{message}"
          </p>
        </div>
      </div>

      {/* Bottom Icon section */}
      <div className="relative z-10 mt-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 text-slate-400 opacity-60">
          <div className="h-[1px] w-8 bg-slate-300" />
          <Heart className="w-5 h-5 fill-slate-100" />
          <div className="h-[1px] w-8 bg-slate-300" />
        </div>
        <p className="text-[10px] font-bold tracking-[0.5em] text-slate-300 uppercase">
          A CHOOSE SPECIAL SUPPORT CARD
        </p>
      </div>

      {/* Soft corner patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#fafafa] rounded-bl-[4rem] -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#fafafa] rounded-tr-[4rem] -z-10" />
    </motion.div>
  );
}
