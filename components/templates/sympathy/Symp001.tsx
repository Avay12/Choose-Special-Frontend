"use client";

import { Flower2, Wind, Heart } from "lucide-react";
import CardEnvelope from "../CardEnvelope";

interface Symp001Props {
  name?: string;
  message?: string;
}

export default function Symp001({
  name = "Recipient",
  message = "Wishing you strength and comfort during this difficult time. Please know that you are in our thoughts and hearts.",
}: Symp001Props) {
  const envelopeTheme = {
    coverBg: "bg-gradient-to-br from-slate-100 via-zinc-100 to-slate-200",
    borderColor: "border-slate-200/50",
    sealBg: "bg-white text-slate-400 border border-slate-200 shadow-sm",
    sealIcon: <Flower2 className="w-8 h-8 text-slate-400" strokeWidth={1.5} />,
    title: "Thinking of You",
    subtitle: name,
    textColor: "text-slate-700",
    accentColor: "text-slate-500",
  };

  return (
    <CardEnvelope
      theme={envelopeTheme}
      className="max-w-[400px] mx-auto min-h-[580px]"
    >
      <div className="w-full h-full bg-[#fdfdfd] border border-slate-200 rounded-[2.5rem] overflow-hidden relative group p-12 text-center flex flex-col items-center justify-center gap-10">
        {/* Subtle Calming Background Animation */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-slate-100 rounded-full blur-3xl" />
        </div>

        {/* Top Banner section */}
        <div className="relative z-10 w-full flex flex-col items-center gap-6">
          <div className="relative">
            <Flower2
              className="w-16 h-16 text-slate-400 group-hover:scale-105 transition-transform duration-1000"
              strokeWidth={0.5}
            />
            <div className="absolute -top-2 -right-2">
              <Wind className="w-6 h-6 text-slate-300" strokeWidth={1} />
            </div>
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
            A JOY GREETLY SUPPORT CARD
          </p>
        </div>

        {/* Soft corner patterns */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#fafafa] rounded-bl-[4rem] -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#fafafa] rounded-tr-[4rem] -z-10" />
      </div>
    </CardEnvelope>
  );
}
