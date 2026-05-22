"use client";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeProvider";

const FOOTER_LINKS = [
  {
    title: "Occasions",
    links: [
      { label: "Valentine", href: "/occasions/valentine" },
      { label: "Anniversary", href: "/occasions/anniversary" },
      { label: "Wedding", href: "/occasions/wedding" },
      { label: "Birthdays", href: "/occasions/birthdays" },
      { label: "Thank You", href: "/occasions/thank-you" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
];

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="bg-muted text-muted-foreground pt-16 pb-8 border-t">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 mb-4 group inline-flex"
            >
              <Image
                src={`/logo-cs.png`}
                alt="Choose Special"
                width={100}
                height={100}
                className="w-12 object-contain"
              />
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                Choose<span className="text-primary">Special</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs mb-6">
              Share smiles and celebrate special moments with our premium,
              handcrafted greeting cards.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-background rounded-full hover:text-primary hover:-translate-y-1 transition-all shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-background rounded-full hover:text-primary hover:-translate-y-1 transition-all shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-background rounded-full hover:text-primary hover:-translate-y-1 transition-all shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-foreground mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} Choose Special. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
