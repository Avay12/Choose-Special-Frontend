import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import DevTools from "@/components/DevTools";
import SonnerToaster from "@/components/SonnerToaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Choose Special - Share Smiles and Celebrate Special Moments",
  description:
    "Share smiles and celebrate special moments with our premium, handcrafted Choose Special Moments.",
  icons: {
    icon: "/logo-cs.png",
    shortcut: "/logo-cs.png",
    apple: "/logo-cs.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          geistSans.variable,
          geistMono.variable,
          outfit.variable,
          "min-h-screen flex flex-col bg-background text-foreground",
        )}
      >
        <ThemeProvider>
          <DevTools />
          <SonnerToaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
