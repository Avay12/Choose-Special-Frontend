"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/authStore";
import { User as UserIcon, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/occasions/anniversary", label: "Anniversary" },
  { href: "/occasions/valentine", label: "Valentine" },
  { href: "/occasions/wedding", label: "Wedding" },
  { href: "/occasions/birthday", label: "Birthday" },
  { href: "/occasions", label: "Occasions" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  const cart = useStore((state) => state.cart);
  const favorites = useStore((state) => state.favorites);
  const setSearchOpen = useStore((state) => state.setSearchOpen);
  const { user, logout } = useAuthStore();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 flex flex-col items-center pointer-events-none",
        isScrolled ? "pt-4 px-4" : "pt-0 px-0",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto w-full flex items-center justify-between transition-all duration-500",
          isScrolled
            ? "max-w-5xl glass backdrop-blur-md shadow-lg rounded-full py-3 px-6 md:px-8"
            : "max-w-full bg-transparent py-5 px-4 md:px-8",
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src={`/logo-cs.png`}
            alt="Choose Special"
            width={100}
            height={100}
            className="w-9 object-contain"
          />
          <span className="font-heading font-bold text-xl tracking-tight text-foreground">
            Choose<span className="text-primary">Special</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground/80",
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle className="hidden sm:flex" />

          <button
            className="p-2 text-foreground/80 hover:text-primary transition-colors hidden sm:block"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </button>
          {user && (
            <>
              <Link
                href="/favorites"
                className="p-2 text-foreground/80 hover:text-primary transition-colors hidden sm:block relative"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="p-2 text-foreground/80 hover:text-primary transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden lg:flex flex-col items-end group/profile"
              >
                {/* <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1 group-hover/profile:text-primary transition-colors">
                  Profile
                </span> */}
                {/* <span className="text-sm font-bold text-foreground leading-none group-hover/profile:text-primary transition-colors">
                  {user.name}
                </span> */}
              </Link>
              <div className="flex items-center gap-1.5 ml-1">
                <Link
                  href="/dashboard"
                  className="p-2.5 bg-primary/5 hover:bg-primary/15 text-primary rounded-full transition-all border border-primary/10 shadow-sm"
                  title="Your Dashboard"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
                <div className="w-[1px] h-6 bg-border mx-1" />
                <button
                  onClick={() => logout()}
                  className="p-2.5 bg-card shadow-sm border border-border rounded-full hover:shadow-md hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all group/logout"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
            >
              <UserIcon className="w-4 h-4" />
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 md:hidden text-foreground/80 hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className={cn(
              "md:hidden pointer-events-auto w-full transition-all duration-300 overflow-hidden",
              isScrolled
                ? "max-w-5xl mt-2 glass backdrop-blur-md shadow-lg rounded-[2rem]"
                : "glass border-t mt-3",
            )}
          >
            <nav className="p-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-muted/80",
                    pathname === link.href
                      ? "bg-muted text-primary"
                      : "text-foreground/80",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border mt-2">
                {/* Theme toggle in mobile menu */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-foreground/80">
                    Dark Mode
                  </span>
                  <ThemeToggle size="sm" />
                </div>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm font-bold text-primary py-2"
                    >
                      <UserIcon className="w-4 h-4" /> My Dashboard ({user.name}
                      )
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-foreground/80 py-2"
                    >
                      <Heart className="w-4 h-4" /> Favorites
                      {favorites.length > 0 && (
                        <span className="ml-auto text-xs font-bold bg-primary text-white rounded-full px-1.5 py-0.5">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-foreground/80 py-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Cart
                      {cartItemCount > 0 && (
                        <span className="ml-auto text-xs font-bold bg-primary text-white rounded-full px-1.5 py-0.5">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-sm font-bold text-red-500 py-2 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-bold text-primary py-2"
                  >
                    <UserIcon className="w-4 h-4" /> Login / Register
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
