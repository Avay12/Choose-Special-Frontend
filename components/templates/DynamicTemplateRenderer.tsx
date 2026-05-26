"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import PresentationWrapper from "./PresentationWrapper";

type DynamicTemplateRendererProps = {
  templateName: string;
  layout?: Record<string, unknown>;
  data: Record<string, unknown>;
};

function getString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function getObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function resolveTheme(theme: string) {
  switch (theme) {
    case "romantic":
      return {
        bg: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        accent: "rgba(255, 255, 255, 0.55)",
      };
    case "party":
      return {
        bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        accent: "rgba(255, 255, 255, 0.45)",
      };
    case "calm":
      return {
        bg: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        accent: "rgba(255, 255, 255, 0.4)",
      };
    default:
      return {
        bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        accent: "rgba(255, 255, 255, 0.5)",
      };
  }
}

export default function DynamicTemplateRenderer({
  templateName,
  layout,
  data,
}: DynamicTemplateRendererProps) {
  const layoutObj = getObject(layout);
  const meta = getObject(layoutObj.meta);
  const style = getObject(layoutObj.style);

  const theme = getString(style.theme, "default");
  const palette = resolveTheme(theme);

  const displayName =
    getString(data.name) ||
    getString(data.names) ||
    getString(data.recipientName) ||
    "Friend";
  const message =
    getString(data.message) ||
    getString(data.note) ||
    "Wishing you a beautiful day filled with joy.";
  const occasion =
    getString(data.occasion) || getString(data.category) || templateName;

  const headline =
    getString(meta.headline) ||
    `A special ${occasion.toLowerCase()} message for ${displayName}`;

  const envelopeTheme = {
    coverBg: palette.bg,
    borderColor: "border-white/80",
    sealBg: "bg-white text-slate-800",
    sealIcon: <Gift className="w-8 h-8 text-slate-700" strokeWidth={1.5} />,
    title: occasion ? `A Special ${occasion}` : "A Special Greeting",
    subtitle: displayName,
    textColor: "text-slate-800",
    accentColor: "text-slate-650",
  };

  return (
    <PresentationWrapper animationType={data?.animationType} theme={envelopeTheme} className="w-full h-full min-h-[520px] rounded-[3rem]">
      <div
        className="w-full h-full min-h-[520px] rounded-[3rem] border-8 border-white/80 overflow-hidden relative text-slate-900"
        style={{ background: palette.bg }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-20 w-72 h-72 rounded-full blur-2xl"
          style={{ backgroundColor: palette.accent }}
        />
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [-8, 10, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: palette.accent }}
        />

        <div className="relative z-10 h-full flex flex-col justify-center items-center px-8 text-center gap-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] uppercase tracking-[0.25em] font-bold text-slate-700/70"
          >
            Dynamic Template
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black leading-tight max-w-[24rem]"
          >
            {headline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg font-medium text-slate-800/90 max-w-[24rem]"
          >
            {message}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="px-4 py-2 rounded-full bg-white/65 backdrop-blur-sm text-xs font-bold uppercase tracking-[0.2em]"
          >
            {templateName}
          </motion.div>
        </div>
      </div>
    </PresentationWrapper>
  );
}
