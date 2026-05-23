"use client";

import { Smile, Sparkles, Heart } from "lucide-react";
import CardEnvelope from "../CardEnvelope";

interface Ty001Props {
  name?: string;
  message?: string;
}

export default function Ty001({
  name = "Friend",
  message = "Just wanted to say a heartfelt thank you for your support. It means the world to me.",
}: Ty001Props) {
  const envelopeTheme = {
    coverBg: "bg-gradient-to-br from-[#2d5a57] via-teal-700 to-teal-800",
    borderColor: "border-teal-600/40",
    sealBg: "bg-white text-teal-700",
    sealIcon: <Heart className="w-8 h-8 fill-teal-100 text-teal-600" strokeWidth={1.5} />,
    title: "A Note of Thanks",
    subtitle: name,
    textColor: "text-white",
    accentColor: "text-teal-200",
  };

  return (
    <CardEnvelope theme={envelopeTheme} className="max-w-[400px] mx-auto aspect-[4/5]">
      <div className="w-full h-full bg-[#f8f9fa] rounded-[2.5rem] border border-teal-100 overflow-hidden relative group p-12 text-center flex flex-col items-center justify-between">
        {/* Decorative center pattern background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full border border-teal-200/50 opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full border border-teal-200/50 opacity-10 pointer-events-none" />

        {/* Top Banner section */}
        <div className="relative z-10 w-full flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-teal-300" />
          <h2 className="font-heading text-sm uppercase tracking-[0.4em] text-teal-600 font-bold">
            Gratitude
          </h2>
          <div className="h-[1px] w-12 bg-teal-300" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8 flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <h3 className="font-serif text-6xl md:text-7xl font-medium text-[#2d5a57] tracking-tight leading-none mb-4 italic drop-shadow-sm">
              Thank <br /> You
            </h3>
            <div className="absolute -top-4 -left-8 group-hover:-rotate-12 transition-transform duration-500">
              <Sparkles className="w-8 h-8 text-teal-400 fill-teal-100" />
            </div>
            <div className="absolute -bottom-4 -right-8 group-hover:rotate-12 transition-transform duration-500 delay-75">
              <Heart
                className="w-8 h-8 text-pink-400 fill-pink-100"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="font-heading text-2xl font-bold text-teal-800">
              Dear {name},
            </h4>
            <p className="text-lg text-slate-600 italic font-serif max-w-xs mx-auto leading-relaxed px-4 opacity-100 group-hover:opacity-100 transition-opacity">
              "{message}"
            </p>
          </div>
        </div>

        {/* Bottom Icon section */}
        <div className="relative z-10 mt-auto flex flex-col items-center gap-4 pt-10">
          <div className="group/smile relative">
            <div className="absolute -inset-4 bg-teal-400/10 rounded-full blur-xl scale-0 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            <Smile
              className="w-16 h-16 text-teal-700/80 transition-transform duration-500 hover:scale-110 hover:-rotate-3"
              strokeWidth={1}
            />
          </div>
          <p className="text-[10px] font-bold tracking-[0.4em] text-teal-400 uppercase">
            A JOY GREETLY SPECIAL
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-teal-50 to-transparent rounded-br-[4rem] -z-0 opacity-80" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-teal-50 to-transparent rounded-tl-[4rem] -z-0 opacity-80" />
      </div>
    </CardEnvelope>
  );
}
