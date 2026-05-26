"use client";

import { PartyPopper, Star, Stars } from "lucide-react";
import PresentationWrapper from "../PresentationWrapper";

interface Cong001Props {
  name?: string;
  achievement?: string;
  message?: string;
  animationType?: string;
}

export default function Cong001({
  name = "Winner",
  achievement = "Your Graduation",
  message = "So incredibly proud of everything you've achieved. The future is yours!", animationType }: Cong001Props) {
  const envelopeTheme = {
    coverBg: "bg-gradient-to-br from-amber-450 via-yellow-500 to-amber-600",
    borderColor: "border-yellow-300/40",
    sealBg: "bg-slate-900 text-white",
    sealIcon: <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" strokeWidth={1.5} />,
    title: "Congratulations!",
    subtitle: name,
    textColor: "text-white",
    accentColor: "text-yellow-200",
  };

  return (
    <PresentationWrapper animationType={animationType} theme={envelopeTheme} className="max-w-[400px] mx-auto aspect-[4/5]">
      <div className="w-full h-full bg-[#fff] rounded-[2.5rem] border border-slate-100 overflow-hidden relative group p-12 text-center flex flex-col items-center justify-between">
        {/* Dynamic Golden Background Shapes */}
        <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-[8rem] -z-10 translate-x-[10%] -translate-y-[10%]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[30%] bg-gradient-to-tr from-amber-50 to-transparent rounded-tr-[6rem] -z-10 -translate-x-[10%] translate-y-[10%]" />

        {/* Top Banner section */}
        <div className="relative z-10 w-full flex items-center justify-center gap-4">
          <Stars className="w-8 h-8 text-amber-500 fill-amber-300" />
          <h2 className="font-heading text-sm uppercase tracking-[0.5em] text-amber-600 font-black">
            Success
          </h2>
          <Stars className="w-8 h-8 text-amber-500 fill-amber-300" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8 flex-1 flex flex-col items-center justify-center">
          <div className="relative group">
            <h3 className="font-heading text-6xl md:text-7xl font-black text-slate-800 tracking-tighter leading-none mb-4 uppercase drop-shadow-sm group-hover:scale-105 transition-transform duration-500">
              BRAVO!
            </h3>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-2 border-amber-300 rounded-[2rem] rotate-3 -z-10 scale-0 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-2 border-amber-300 rounded-[2rem] -rotate-3 -z-10 scale-0 group-hover:scale-110 transition-transform duration-1000 delay-150" />
          </div>

          <div className="space-y-4 pt-4">
            <div className="px-6 py-2 bg-amber-100/50 rounded-full inline-block border border-amber-200">
              <h4 className="font-heading text-sm uppercase tracking-[0.3em] font-bold text-amber-800">
                Congrats on {achievement}
              </h4>
            </div>

            <h4 className="font-serif text-3xl font-medium text-slate-900 border-b-4 border-amber-200 inline-block pb-2">
              {name}
            </h4>

            <p className="text-lg text-slate-600 font-medium italic max-w-xs mx-auto leading-relaxed px-4 pt-4">
              "{message}"
            </p>
          </div>
        </div>

        {/* Bottom Icon section */}
        <div className="relative z-10 mt-auto flex flex-col items-center gap-4 pt-10">
          <div className="relative group/popper">
            <PartyPopper
              className="w-16 h-16 text-amber-600 fill-amber-50 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12"
              strokeWidth={1}
            />
            <div className="absolute -top-4 -right-4 flex gap-1 scale-0 group-hover:scale-110 transition-transform duration-500 delay-300">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 delay-75" />
            </div>
          </div>
          <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase">
            CELEBRATE THE ACHIEVEMENT
          </p>
        </div>
      </div>
    </PresentationWrapper>
  );
}
