"use client";

import { useState, useEffect } from "react";
import { Baby, Stars, Cloud } from "lucide-react";
import CardEnvelope from "../CardEnvelope";

interface Baby001Props {
  name?: string;
  parents?: string;
  date?: string;
  time?: string;
  location?: string;
}

export default function Baby001({
  name = "Baby Johnson",
  parents = "Mary & Mark",
  date = "October 20, 2024",
  time = "2:00 PM",
  location = "The Tea Garden, Elmwood",
}: Baby001Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const envelopeTheme = {
    coverBg: "bg-gradient-to-br from-[#fdf2f8] via-purple-100 to-[#eff6ff]",
    borderColor: "border-pink-200/30",
    sealBg: "bg-white text-blue-400 shadow-sm",
    sealIcon: <Baby className="w-8 h-8 text-blue-400 fill-blue-50" strokeWidth={1.5} />,
    title: "A Baby Shower",
    subtitle: `Honoring ${parents}`,
    textColor: "text-slate-800",
    accentColor: "text-blue-500",
  };

  return (
    <CardEnvelope theme={envelopeTheme} className="max-w-[400px] mx-auto min-h-[580px]">
      <div className="w-full h-full bg-gradient-to-br from-[#fdf2f8] via-[#f0fdf4] to-[#eff6ff] rounded-[3rem] border-8 border-white overflow-hidden relative group p-12 text-center flex flex-col items-center justify-center gap-10">
        {/* Soft Floating Circles Background Animation */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          {isMounted &&
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none animate-pulse bg-pink-300"
                style={{
                  width: `${20 + i * 10}px`,
                  height: `${20 + i * 10}px`,
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 80}%`,
                  backgroundColor: i % 2 === 0 ? "#f9a8d4" : "#93c5fd",
                }}
              />
            ))}
        </div>

        {/* Top Banner section */}
        <div className="relative z-10 w-full flex flex-col items-center gap-4">
          <div className="p-4 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white">
            <Baby
              className="w-12 h-12 text-blue-400 fill-blue-50 group-hover:scale-110 transition-transform duration-500"
              strokeWidth={1}
            />
          </div>
          <h2 className="font-heading text-[10px] uppercase tracking-[0.5em] text-slate-400 font-black pt-4">
            A Sweet New Arrival
          </h2>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6 flex-1 flex flex-col items-center justify-center pt-4">
          <div className="relative group text-slate-800">
            <h3 className="font-heading text-4xl md:text-5xl font-black tracking-tight leading-none mb-4 lowercase drop-shadow-sm group-hover:-rotate-3 transition-transform duration-500">
              Baby Shower <br />{" "}
              <span className="uppercase text-6xl md:text-7xl font-sans font-light tracking-tighter opacity-10">
                HONORING
              </span>
            </h3>
          </div>

          <div className="space-y-6 pt-4">
            <h4 className="font-serif text-3xl font-medium text-slate-800 border-b-2 border-slate-100 pb-2 inline-block italic">
              {parents}
            </h4>

            <div className="space-y-4 pt-4 border-t border-slate-100/50">
              <div className="flex flex-col items-center gap-1 group/item transition-all duration-300 hover:scale-105">
                <Stars className="w-4 h-4 text-yellow-400 fill-yellow-200" />
                <span className="text-xs font-bold tracking-widest text-slate-800 uppercase">
                  {date}
                </span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {time}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 text-slate-600">
                <p className="text-sm font-serif italic text-slate-800 font-medium">
                  {location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Badge section */}
        <div className="relative z-10 mt-auto flex flex-col items-center gap-4">
          <div className="flex gap-4 p-4 bg-white/60 backdrop-blur-md rounded-full shadow-sm border border-white/50 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-200 to-blue-200 rounded-full flex items-center justify-center p-2">
              <Cloud className="w-full h-full text-white" fill="white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                JOYFUL MOMENTS
              </p>
              <div className="flex gap-1">
                <Stars className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                <Stars className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                <Stars className="w-2 h-2 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          </div>
          <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-4">
            A JOY GREETLY COLLECTION
          </p>
        </div>
      </div>
    </CardEnvelope>
  );
}
