"use client";

import React from "react";
import Link from "next/link";
import { Heart, User, PhoneCall, Sun, Moon } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { resolvedTheme, theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  /**
   * Clerk's `appearance` prop is updated every render based on `resolvedTheme`.
   * `resolvedTheme` accounts for the system preference when "system" is selected,
   * unlike `theme` which may return "system" as a string.
   */
  const clerkAppearance = resolvedTheme === "dark" ? { baseTheme: dark } : {};

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/75 dark:bg-black/75 border-b border-black/10 dark:border-white/10 saturate-180 transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900/80 dark:bg-zinc-900/80 text-zinc-300 text-[11px] py-1.5 px-4 text-center font-medium tracking-tight flex justify-between items-center max-w-7xl mx-auto border-b border-white/10 backdrop-blur-md">
        <span className="hidden sm:inline flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Mahanaim NGO: Spread Love.... Spread Peace....
        </span>
        <span className="sm:hidden flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Mahanaim NGO: Spread Love & Peace
        </span>
        <div className="flex items-center gap-4 text-[11px] opacity-90">
          <a href="tel:+919876543210" className="hover:text-white transition-colors flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-emerald-400" /> +91 98765 43210
          </a>
          <span className="hidden md:inline text-zinc-600">|</span>
          <span className="hidden md:inline">Miraj, Maharashtra, India</span>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* NGO Official Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Mahanaim NGO Logo"
            width={200}
            height={55}
            priority
            className="h-11 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-300 dark:brightness-110"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 font-medium text-[13px] tracking-tight">
          <Link href="/" className="text-foreground font-semibold hover:opacity-80 transition-opacity">
            HOME
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            ABOUT US
          </Link>
          <Link href="/#causes" className="text-muted-foreground hover:text-foreground transition-colors">
            OUR CAUSES
          </Link>
          <Link href="/#events" className="text-muted-foreground hover:text-foreground transition-colors">
            EVENTS &amp; DRIVES
          </Link>
          <Link href="/gallery" className="text-muted-foreground hover:text-foreground transition-colors">
            GALLERY
          </Link>
          <Link href="/donate" className="text-muted-foreground hover:text-foreground transition-colors">
            DONATIONS
          </Link>
          <SignedIn>
            <Link href="/my-donations" className="text-primary font-semibold hover:opacity-80 transition-opacity">
              MY DONATIONS
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-xs bg-secondary/80 hover:bg-secondary px-3.5 py-1.5 rounded-full text-foreground font-semibold transition-all border border-black/5 dark:border-white/10"
            >
              LOGIN / SIGNUP
            </Link>
          </SignedOut>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-foreground hover:bg-secondary/80 transition-all border border-black/5 dark:border-white/10 shadow-apple active:scale-95"
            title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 animate-fadeIn" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600 animate-fadeIn" />
            )}
          </button>

          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link
                href="/sign-in"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/80"
                title="Sign In"
              >
                <User className="w-4 h-4" />
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={clerkAppearance}
              />
            </SignedIn>

            <Link
              href="/donate"
              className="bg-primary hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-full text-xs sm:text-sm shadow-apple hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              Donate Now
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
