"use client";

import { useState, useEffect } from "react";
import { Snowflake, Cloud, Sparkles } from "lucide-react";
import PresentationWrapper from "../PresentationWrapper";

interface Sea001Props {
  season?: string;
  message?: string;
  animationType?: string;
}

export default function Sea001({
  season = "Winter",
  message = "Wishing you warmth, peace, and many joyful moments this season.", animationType }: Sea001Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const envelopeTheme = {
    coverBg: "bg-gradient-to-b from-[#0b1329] via-[#101c3d] to-[#1e293b]",
    borderColor: "border-slate-800/60",
    sealBg: "bg-white/10 text-white backdrop-blur-md",
    sealIcon: <Snowflake className="w-8 h-8 text-blue-200" strokeWidth={1.5} />,
    title: "Warm Holiday Greetings",
    subtitle: `${season} Wishes`,
    textColor: "text-white",
    accentColor: "text-blue-300",
  };

  return (
    <PresentationWrapper animationType={animationType} theme={envelopeTheme} className="max-w-[400px] mx-auto min-h-[580px]">
      <div className="w-full h-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] rounded-[3rem] border-4 border-slate-700/50 overflow-hidden relative group p-12 text-center flex flex-col items-center justify-center gap-12">
        {/* Snowfall background animation */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {isMounted &&
            [...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                }}
              >
                <Snowflake className="w-4 h-4 text-white/40" />
              </div>
            ))}
        </div>

        {/* Top Banner section */}
        <div className="relative z-10 w-full flex flex-col items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <Snowflake
              className="w-10 h-10 text-white fill-white/10 group-hover:rotate-180 transition-transform duration-1000"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="font-heading text-xs uppercase tracking-[0.5em] text-white/50 font-black pt-4">
            Seasonal Greetings
          </h2>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8 flex-1 flex flex-col items-center justify-center">
          <div className="relative group text-white">
            <h3 className="font-heading text-6xl md:text-7xl font-black tracking-tighter leading-none mb-4 uppercase drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]">
              {season} <br /> MAGIC
            </h3>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-8 bg-blue-400/50" />
              <Sparkles className="w-5 h-5 text-blue-300" />
              <div className="h-[2px] w-8 bg-blue-400/50" />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-xl text-blue-100/80 font-serif italic max-w-[280px] mx-auto leading-relaxed px-4 transition-all duration-500 hover:scale-105">
              "{message}"
            </p>
          </div>
        </div>

        {/* Bottom Icon section */}
        <div className="relative z-10 mt-auto flex flex-col items-center gap-4">
          <div className="relative group/bottom flex flex-col items-center">
            <Cloud
              className="w-16 h-16 text-white/20 fill-white/5 transition-all duration-700 hover:scale-110 hover:-rotate-3"
              strokeWidth={1}
            />
            <div className="absolute -bottom-4 w-12 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent blur-sm" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase mt-2">
            FESTIVE LIGHTS COLLECTION
          </p>
        </div>
      </div>
    </PresentationWrapper>
  );
}
