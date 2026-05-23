"use client";

import { useAuthStore } from "@/store/authStore";
import {
  Bell,
  Settings,
  Users,
  Info,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeProvider";

export function MobileHeader() {
  const { user, logout } = useAuthStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="flex md:hidden w-full items-center justify-between h-14 bg-card border-b border-border px-4 fixed top-0 z-50">
      {/* Logo Left */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <Image
          src={`/logo-cs.png`}
          alt="Choose Special"
          width={100}
          height={100}
          className="h-12 w-12 object-contain"
        />
        <span className="text-lg font-bold tracking-tight text-foreground">
          Choose<span className="text-primary">Special</span>
        </span>
      </Link>

      {/* Controls Right */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Theme Toggle */}
        <ThemeToggle size="sm" />

        {/* Mobile Notifications */}
        <div className="relative">
          <button
            className="relative p-2 hover:bg-primary/8 rounded-xl transition-colors text-muted-foreground hover:text-primary"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="w-[22px] h-[22px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-card"></span>
          </button>
        </div>

        {/* Mobile User Profile Dropdown */}
        <div className="relative">
          <button
            className="inline-flex items-center justify-center p-1"
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary hover:opacity-90 transition-opacity flex items-center justify-center text-white shadow-md shadow-primary/30">
              <span className="text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </button>

          {isProfileMenuOpen && (
            <>
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl z-50">
                {/* User info header */}
                <div className="px-4 py-3 bg-primary/5">
                  <p className="text-sm font-bold text-foreground truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "user@choosespecial.com"}
                  </p>
                </div>

                <div className="h-[1px] w-full bg-border"></div>

                {/* Settings */}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/8 hover:text-primary"
                >
                  <Settings className="w-[18px] h-[18px] mr-3 text-muted-foreground" />
                  Settings
                </Link>

                {/* Cart */}
                <Link
                  href="/dashboard/cart"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/8 hover:text-primary"
                >
                  <ShoppingCart className="w-[18px] h-[18px] mr-3 text-muted-foreground" />
                  My Cart
                </Link>

                {/* Referrals */}
                <Link
                  href="/dashboard/referral"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/8 hover:text-primary"
                >
                  <Users className="w-[18px] h-[18px] mr-3 text-muted-foreground" />
                  Referrals
                </Link>

                {/* About Us */}
                <Link
                  href="/dashboard/about"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/8 hover:text-primary"
                >
                  <Info className="w-[18px] h-[18px] mr-3 text-muted-foreground" />
                  About Us
                </Link>

                <div className="h-[1px] w-full bg-border"></div>

                {/* Logout */}
                <button
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="w-[18px] h-[18px] mr-3" />
                  Logout
                </button>
              </div>

              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileMenuOpen(false)}
              ></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
