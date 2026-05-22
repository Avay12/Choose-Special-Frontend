"use client";

import { motion } from "framer-motion";
import { GraduationCap, Trophy, ArrowUpRight } from "lucide-react";

interface Grad001Props {
  name?: string;
  degree?: string;
  classYear?: string;
  message?: string;
}

export default function Grad001({
  name = "James Wilson",
  degree = "Bachelor of Architecture",
  classYear = "Class of 2024",
  message = "Dream big, work hard, and never stop growing. The best is yet to come!",
}: Grad001Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[400px] mx-auto min-h-[580px] bg-white border-[12px] border-[#0f172a] rounded-[2rem] shadow-2xl overflow-hidden relative group p-12 text-center flex flex-col items-center justify-between"
    >
      {/* Dynamic Stripe Background Shapes */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-[#f8fafc] -z-10 skew-x-12 translate-x-[20%]" />
      <div className="absolute bottom-0 left-0 w-[20%] h-full bg-[#f1f5f9] -z-10 -skew-x-12 -translate-x-[20%]" />

      {/* Top Banner section */}
      <div className="relative z-10 w-full flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-[#0f172a] rounded-2xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-xl overflow-hidden relative">
          <GraduationCap className="w-12 h-12 text-white" strokeWidth={1} />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent" />
        </div>
        <h2 className="font-heading text-[10px] uppercase tracking-[0.5em] text-[#0f172a]/40 font-black pt-4 italic underline decoration-blue-500 underline-offset-8">
          Commencement 2024
        </h2>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-8 flex-1 flex flex-col items-center justify-center pt-8">
        <div className="relative group text-[#0f172a]">
          <h3 className="font-heading text-6xl md:text-7xl font-black tracking-tighter leading-none mb-4 uppercase drop-shadow-sm transition-all duration-500 group-hover:scale-105">
            BRAVO!
          </h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-bold tracking-[0.2em] text-[#0f172a] uppercase border-y-2 border-[#0f172a] py-1 px-4">
              {classYear}
            </span>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <h4 className="font-serif text-3xl font-medium text-slate-800 tracking-tight italic">
            {name}
          </h4>

          <div className="space-y-4 pt-4 border-t border-slate-100 flex flex-col items-center">
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg inline-flex items-center gap-2 group-hover:scale-110 transition-transform duration-500">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">
                {degree}
              </span>
            </div>
            <p className="text-lg text-slate-600 font-medium italic max-w-[280px] mx-auto leading-relaxed px-4 pt-4">
              "{message}"
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Badge section */}
      <div className="relative z-10 mt-auto flex flex-col items-center gap-4">
        <div className="flex gap-4 p-4 bg-[#0f172a] rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-500 group-hover:-rotate-3 text-white">
          <div className="text-left">
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase italic">
              Onward & Upward
            </p>
            <div className="flex items-center gap-2 pt-1">
              <p className="text-white text-xs font-bold tracking-widest uppercase">
                The Next Chapter
              </p>
              <motion.div
                animate={{ y: [0, -5, 0], x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowUpRight className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
        <p className="text-[10px] font-bold tracking-[0.4em] text-slate-300 uppercase mt-4">
          CHOOSE SPECIAL GRADUATE EDITION
        </p>
      </div>
    </motion.div>
  );
}
