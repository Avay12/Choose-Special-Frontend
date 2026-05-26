"use client";

import React from "react";
import { EnvelopeTheme } from "./CardEnvelope";
import { AnimationType } from "./AnimationPicker";

// Import existing and new animations
import CardEnvelope from "./CardEnvelope";
import GiftBoxAnimation from "./animations/GiftBoxAnimation";
import MagicRevealAnimation from "./animations/MagicRevealAnimation";
import CurtainDropAnimation from "./animations/CurtainDropAnimation";
import BookFlipAnimation from "./animations/BookFlipAnimation";
import ScratchOffAnimation from "./animations/ScratchOffAnimation";
import SpotlightAnimation from "./animations/SpotlightAnimation";
import SlideSleeveAnimation from "./animations/SlideSleeveAnimation";
import OrigamiAnimation from "./animations/OrigamiAnimation";
import FloatingAnimation from "./animations/FloatingAnimation";
import PopupBookAnimation from "./animations/PopupBookAnimation";
import VinylRecordAnimation from "./animations/VinylRecordAnimation";
import PolaroidDropAnimation from "./animations/PolaroidDropAnimation";
import StarfieldWarpAnimation from "./animations/StarfieldWarpAnimation";
import BottleMessageAnimation from "./animations/BottleMessageAnimation";
import TreasureChestAnimation from "./animations/TreasureChestAnimation";
import LotusBloomAnimation from "./animations/LotusBloomAnimation";
import WaxPeelAnimation from "./animations/WaxPeelAnimation";
import JigsawPuzzleAnimation from "./animations/JigsawPuzzleAnimation";
import CyberGlitchAnimation from "./animations/CyberGlitchAnimation";

interface Props {
  children: React.ReactNode;
  theme: EnvelopeTheme;
  animationType?: AnimationType | string;
  className?: string;
}

export default function PresentationWrapper({ children, theme, animationType, className = "" }: Props) {
  // Determine which animation to render based on the provided type
  const type = animationType || "envelope";

  const wrappedChildren = <div className={`w-full h-full ${className}`}>{children}</div>;

  switch (type) {
    case "gift-box":
      return <GiftBoxAnimation theme={theme}>{wrappedChildren}</GiftBoxAnimation>;
    case "magic-reveal":
      return <MagicRevealAnimation theme={theme}>{wrappedChildren}</MagicRevealAnimation>;
    case "curtain-drop":
      return <CurtainDropAnimation theme={theme}>{wrappedChildren}</CurtainDropAnimation>;
    case "book-flip":
      return <BookFlipAnimation theme={theme}>{wrappedChildren}</BookFlipAnimation>;
    case "scratch-off":
      return <ScratchOffAnimation theme={theme}>{wrappedChildren}</ScratchOffAnimation>;
    case "spotlight":
      return <SpotlightAnimation theme={theme}>{wrappedChildren}</SpotlightAnimation>;
    case "slide-sleeve":
      return <SlideSleeveAnimation theme={theme}>{wrappedChildren}</SlideSleeveAnimation>;
    case "origami":
      return <OrigamiAnimation theme={theme}>{wrappedChildren}</OrigamiAnimation>;
    case "floating":
      return <FloatingAnimation theme={theme}>{wrappedChildren}</FloatingAnimation>;
    case "pop-up-book":
      return <PopupBookAnimation theme={theme}>{wrappedChildren}</PopupBookAnimation>;
    case "vinyl-record":
      return <VinylRecordAnimation theme={theme}>{wrappedChildren}</VinylRecordAnimation>;
    case "polaroid-drop":
      return <PolaroidDropAnimation theme={theme}>{wrappedChildren}</PolaroidDropAnimation>;
    case "starfield-warp":
      return <StarfieldWarpAnimation theme={theme}>{wrappedChildren}</StarfieldWarpAnimation>;
    case "bottle-message":
      return <BottleMessageAnimation theme={theme}>{wrappedChildren}</BottleMessageAnimation>;
    case "treasure-chest":
      return <TreasureChestAnimation theme={theme}>{wrappedChildren}</TreasureChestAnimation>;
    case "lotus-bloom":
      return <LotusBloomAnimation theme={theme}>{wrappedChildren}</LotusBloomAnimation>;
    case "wax-peel":
      return <WaxPeelAnimation theme={theme}>{wrappedChildren}</WaxPeelAnimation>;
    case "jigsaw-puzzle":
      return <JigsawPuzzleAnimation theme={theme}>{wrappedChildren}</JigsawPuzzleAnimation>;
    case "cyber-glitch":
      return <CyberGlitchAnimation theme={theme}>{wrappedChildren}</CyberGlitchAnimation>;
    case "envelope":
    default:
      return <CardEnvelope theme={theme} className={className}>{children}</CardEnvelope>;
  }
}
