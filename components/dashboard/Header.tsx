"use client";

import { useAuthStore } from "@/store/authStore";
import {
  Bell,
  Settings,
  ShoppingCart,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className="fixed top-0 z-40 w-full md:w-[calc(100%-16rem)] bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Page indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase">
            Dashboard
          </p>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Theme Toggle */}
          <ThemeToggle size="sm" />

          {/* Notification Bell */}
          <button className="relative h-9 w-9 flex items-center justify-center rounded-xl bg-primary/8 text-muted-foreground hover:bg-primary/15 hover:text-primary transition-all group">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-card animate-pulse"></span>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Profile Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-2xl hover:bg-primary/8 transition-all group"
            >
              {/* Avatar */}
              <div className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-black text-sm shadow-md shadow-primary/30">
                {initials}
              </div>

              {/* Name & Role */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-foreground leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest leading-tight">
                  {user?.role === "admin" ? "Administrator" : "Member"}
                </p>
              </div>

              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground hidden md:block transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden">
                {/* User Info Block */}
                <div className="flex items-center gap-4 p-5 bg-primary/5 border-b border-border">
                  <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-black text-lg shadow-lg shadow-primary/30">
                    {initials}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-foreground truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {user?.email || "user@choosespecial.com"}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                      {user?.role === "admin" ? "Admin" : "Member"}
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="p-2 space-y-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-primary/8 hover:text-primary transition-all group"
                  >
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    Profile Settings
                  </Link>

                  <Link
                    href="/dashboard/cart"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-primary/8 hover:text-primary transition-all group"
                  >
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    My Cart
                  </Link>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all group"
                  >
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                      <LogOut className="h-4 w-4 text-red-400" />
                    </div>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
