"use client";

import { Gem, MapPin, Calendar, Clock } from "lucide-react";
import PresentationWrapper from "../PresentationWrapper";

interface Wed001Props {
  names?: string;
  date?: string;
  time?: string;
  location?: string;
  venue?: string;
  city?: string;
  animationType?: string;
}

export default function Wed001({
  names = "Charlotte & Arthur",
  date = "September 14, 2024",
  time = "4:00 PM",
  location = "Elmwood Manor",
  venue = "The Gardens",
  city = "Oakwood, CT", animationType }: Wed001Props) {
  const envelopeTheme = {
    coverBg: "bg-gradient-to-br from-stone-50 via-[#fafafa] to-slate-100",
    borderColor: "border-slate-200/50",
    sealBg: "bg-gradient-to-br from-slate-800 to-slate-950 text-white",
    sealIcon: <Gem className="w-8 h-8 text-white fill-white/10" strokeWidth={1.5} />,
    title: "Wedding Invitation",
    subtitle: names,
    textColor: "text-slate-800",
    accentColor: "text-slate-500",
  };

  return (
    <PresentationWrapper animationType={animationType} theme={envelopeTheme} className="max-w-[420px] mx-auto min-h-[580px]">
      <div className="w-full h-full bg-[#fafafa] rounded-[1rem] border border-slate-200 overflow-hidden relative group p-12 text-center flex flex-col items-center justify-between">
        {/* Decorative sophisticated linear pattern top & bottom */}
        <div className="absolute top-0 inset-x-0 h-16 pointer-events-none p-4 opacity-10">
          <div className="w-full h-full border-t border-x border-slate-900 rounded-t-xl flex justify-center items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-slate-900" />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none p-4 opacity-10">
          <div className="w-full h-full border-b border-x border-slate-900 rounded-b-xl flex justify-center items-center gap-2" />
        </div>

        {/* Intro section */}
        <div className="relative z-10 pt-10 space-y-4">
          <Gem className="w-8 h-8 text-slate-800 mx-auto" />
          <h2 className="font-heading text-xs uppercase tracking-[0.5em] text-slate-400 font-bold">
            Please Join Us For The Wedding Of
          </h2>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-12">
          <div className="space-y-4">
            <h3 className="font-serif text-5xl md:text-6xl text-slate-900 tracking-tight leading-none mb-4">
              {names.split(" & ").map((name, i, arr) => (
                <span key={i} className="block">
                  {name}
                  {i < arr.length - 1 && (
                    <span className="block text-2xl font-sans font-light my-2 text-slate-300">
                      &
                    </span>
                  )}
                </span>
              ))}
            </h3>
          </div>

          {/* Date and Details Section w/ Icons */}
          <div className="flex flex-col gap-6 pt-4 border-y border-slate-100 py-8">
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-1 group/item transition-transform duration-300 hover:scale-105">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold tracking-widest text-slate-800 uppercase">
                  {date}
                </span>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
              <div className="flex flex-col items-center gap-1 group/item transition-transform duration-300 hover:scale-105">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold tracking-widest text-slate-800 uppercase">
                  {time}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 px-4 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 mb-1" />
              <p className="text-sm font-serif italic text-slate-900 font-medium">
                {venue} at {location}
              </p>
              <p className="text-xs font-bold tracking-widest uppercase opacity-70">
                {city}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom RSVP Info */}
        <div className="relative z-10 pb-8 mt-auto flex flex-col items-center gap-4">
          <div className="h-[1px] w-12 bg-slate-300" />
          <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase">
            RSVP BY AUGUST FIRST
          </p>
          <div className="h-[1px] w-12 bg-slate-300" />
        </div>

        {/* Subtle corner patterns */}
        <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-slate-100 rounded-tl-xl -z-0" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-slate-100 rounded-br-xl -z-0" />
      </div>
    </PresentationWrapper>
  );
}
