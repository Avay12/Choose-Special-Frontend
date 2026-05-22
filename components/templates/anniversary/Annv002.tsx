"use client";

import { motion } from "framer-motion";

interface Annv002Props {
  names?: string;
  year?: string;
  years?: number;
}

export default function Annv002({
  names = "Emily & David",
  year = "2024",
  years = 10,
}: Annv002Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[400px] mx-auto aspect-[4/5] bg-white text-slate-900 border border-slate-100 shadow-2xl overflow-hidden p-12 flex flex-col justify-between"
    >
      {/* Central Modern Typography Section */}
      <div className="flex-1 flex flex-col items-start gap-8 pt-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-6xl md:text-7xl font-black text-slate-100 select-none">
            ANNV
          </h2>
          <div className="h-[2px] w-full bg-slate-100" />
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold tracking-[0.5em] text-slate-400">
              CELEBRATING
            </span>
            <span className="text-xl font-black text-slate-500">{year}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-3xl md:text-4xl text-slate-800 font-medium italic">
            {names}
          </h3>
          <p className="text-slate-500 font-medium tracking-wide">
            Commemorating{" "}
            <span className="text-slate-800 font-bold underline decoration-slate-200 underline-offset-4">
              {years} wonderful years
            </span>{" "}
            together.
          </p>
        </div>
      </div>

      {/* Bottom Geometric Design */}
      <div className="flex justify-between items-end">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center p-4">
          <div className="w-full h-full border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{years}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            Choose Special <br /> Anniversary Edition
          </p>
        </div>
      </div>

      {/* Small Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-slate-50/50 -z-10 translate-x-[20%] skew-x-12" />
    </motion.div>
  );
}
