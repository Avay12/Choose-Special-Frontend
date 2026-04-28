"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/contexts/ThemeProvider";

export default function SonnerToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
}
