"use client";

import { Sparkles, Heart } from "lucide-react";
import PresentationWrapper from "../PresentationWrapper";

interface Annv001Props {
  names?: string;
  date?: string;
  message?: string;
  animationType?: string;
}

export default function Annv001({
  names = "Sarah & John",
  date = "June 24, 2024",
  message = "Wishing you both a lifetime of love and happiness.", animationType }: Annv001Props) {
  const envelopeTheme = {
    coverBg: "bg-gradient-to-br from-[#fffcf5] to-[#f5ebd0]",
    borderColor: "border-amber-200/50",
    sealBg: "bg-amber-550 bg-gradient-to-br from-amber-500 to-amber-600 text-white",
    sealIcon: <Heart className="w-8 h-8 fill-white text-white" strokeWidth={1.5} />,
    title: "Happy Anniversary",
    subtitle: names,
    textColor: "text-amber-900",
    accentColor: "text-amber-600",
  };

  return (
    <PresentationWrapper animationType={animationType} theme={envelopeTheme} className="max-w-md mx-auto aspect-[4/5]">
      <div className="w-full h-full bg-[#fffcf5] rounded-[2rem] border border-amber-100 overflow-hidden relative group p-12 text-center flex flex-col items-center justify-between">
        {/* Decorative gold border */}
        <div className="absolute inset-4 border-2 border-amber-200/50 rounded-[1.5rem] pointer-events-none" />

        {/* Top Decoration */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-amber-500 fill-amber-100" />
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          <h2 className="font-heading text-sm uppercase tracking-[0.3em] text-amber-600 font-bold">
            Happy Anniversary
          </h2>
          <div className="space-y-4">
            <p className="font-heading text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              {names}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <p className="text-amber-700 font-medium text-lg">{date}</p>
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            </div>
          </div>
          <p className="text-lg text-slate-600 italic font-serif max-w-[80%] mx-auto leading-relaxed">
            "{message}"
          </p>
        </div>

        {/* Bottom Decoration */}
        <div className="relative z-10 pt-8 opacity-40">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-amber-400" />
            ))}
          </div>
        </div>

        {/* Subtle corner patterns */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-amber-50 rounded-br-[4rem] -z-0 opacity-50" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-tl-[6rem] -z-0 opacity-50" />
      </div>
    </PresentationWrapper>
  );
}
