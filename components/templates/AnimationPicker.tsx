"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Gift, 
  Wand2, 
  Clapperboard, 
  BookOpen, 
  Ticket, 
  Lightbulb, 
  ArrowDownToLine, 
  FoldHorizontal, 
  Cloud,
  Library,
  Disc3,
  Camera,
  Rocket,
  MessageSquare,
  Lock,
  Flower,
  Stamp,
  Puzzle,
  Cpu
} from "lucide-react";

export type AnimationType = 
  | "envelope" 
  | "gift-box" 
  | "magic-reveal" 
  | "curtain-drop" 
  | "book-flip" 
  | "scratch-off" 
  | "spotlight" 
  | "slide-sleeve" 
  | "origami" 
  | "floating"
  | "pop-up-book"
  | "vinyl-record"
  | "polaroid-drop"
  | "starfield-warp"
  | "bottle-message"
  | "treasure-chest"
  | "lotus-bloom"
  | "wax-peel"
  | "jigsaw-puzzle"
  | "cyber-glitch";

interface AnimationOption {
  id: AnimationType;
  name: string;
  price: number;
  icon: React.ReactNode;
  description: string;
}

export const ANIMATION_OPTIONS: AnimationOption[] = [
  { id: "envelope", name: "Classic Envelope", price: 0, icon: <Mail className="w-5 h-5" />, description: "Traditional sliding panels with a pulsing seal." },
  { id: "slide-sleeve", name: "Sleek Sleeve", price: 0.5, icon: <ArrowDownToLine className="w-5 h-5" />, description: "A minimalist frosted sleeve slides down." },
  { id: "scratch-off", name: "Scratch Reveal", price: 0.5, icon: <Ticket className="w-5 h-5" />, description: "A textured layer dissolves to reveal the card." },
  { id: "gift-box", name: "Gift Box", price: 1.0, icon: <Gift className="w-5 h-5" />, description: "A 3D box lid pops off, card rises up." },
  { id: "curtain-drop", name: "Theater Curtains", price: 1.0, icon: <Clapperboard className="w-5 h-5" />, description: "Elegant velvet curtains part to the sides." },
  { id: "spotlight", name: "Spotlight", price: 1.0, icon: <Lightbulb className="w-5 h-5" />, description: "A roaming spotlight illuminates the dark." },
  { id: "floating", name: "Floating Confetti", price: 1.0, icon: <Cloud className="w-5 h-5" />, description: "Card floats down surrounded by confetti." },
  { id: "magic-reveal", name: "Magic Reveal", price: 1.5, icon: <Wand2 className="w-5 h-5" />, description: "Magical particles burst and dissolve." },
  { id: "book-flip", name: "Book Flip", price: 1.5, icon: <BookOpen className="w-5 h-5" />, description: "A vintage cover flips open gracefully." },
  { id: "origami", name: "Origami Unfold", price: 1.5, icon: <FoldHorizontal className="w-5 h-5" />, description: "Geometric panels unfold sequentially." },
  { id: "pop-up-book", name: "Pop-up Book", price: 2.0, icon: <Library className="w-5 h-5" />, description: "Card springs up like a 3D pop-up book." },
  { id: "vinyl-record", name: "Vinyl Record", price: 1.5, icon: <Disc3 className="w-5 h-5" />, description: "Card slides out of a vintage record sleeve." },
  { id: "polaroid-drop", name: "Polaroid Drop", price: 1.0, icon: <Camera className="w-5 h-5" />, description: "A polaroid develops into your card." },
  { id: "starfield-warp", name: "Starfield Warp", price: 1.5, icon: <Rocket className="w-5 h-5" />, description: "Fly through hyperspace to reveal the card." },
  { id: "bottle-message", name: "Message in Bottle", price: 2.0, icon: <MessageSquare className="w-5 h-5" />, description: "A glass bottle uncorks and unrolls." },
  { id: "treasure-chest", name: "Treasure Chest", price: 1.5, icon: <Lock className="w-5 h-5" />, description: "A golden chest unlocks to reveal the card." },
  { id: "lotus-bloom", name: "Lotus Bloom", price: 2.0, icon: <Flower className="w-5 h-5" />, description: "Beautiful floral petals unfold from the center." },
  { id: "wax-peel", name: "Wax Seal Peel", price: 1.0, icon: <Stamp className="w-5 h-5" />, description: "Close up of a wax seal peeling away." },
  { id: "jigsaw-puzzle", name: "Jigsaw Puzzle", price: 1.5, icon: <Puzzle className="w-5 h-5" />, description: "Puzzle pieces fly in and assemble." },
  { id: "cyber-glitch", name: "Cyber Glitch", price: 1.0, icon: <Cpu className="w-5 h-5" />, description: "Modern glitch effect with neon static." },
];

interface AnimationPickerProps {
  value: AnimationType;
  onChange: (value: AnimationType) => void;
}

export default function AnimationPicker({ value, onChange }: AnimationPickerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Presentation Style
        </label>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ANIMATION_OPTIONS.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.id)}
            className={`cursor-pointer p-4 rounded-[1.25rem] border-2 transition-all flex items-start gap-4 ${
              value === option.id 
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10" 
                : "border-border/50 bg-card hover:border-primary/30"
            }`}
          >
            <div className={`p-2 rounded-xl flex-shrink-0 ${value === option.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
              {option.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h4 className={`font-bold truncate ${value === option.id ? "text-primary" : "text-foreground"}`}>
                  {option.name}
                </h4>
                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                  option.price > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                }`}>
                  {option.price > 0 ? `+$${option.price.toFixed(2)}` : "FREE"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {option.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
