"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Heart, Calendar, Image as ImageIcon, User } from "lucide-react";

export default function MobileBottomNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed z-50 transition-all duration-500 ease-in-out flex justify-center ${
        isScrolled
          ? "bottom-0 left-0 right-0 px-0 pb-0"
          : "bottom-6 left-4 right-4"
      }`}
    >
      <nav
        className={`
          bg-white/75 dark:bg-black/75
          backdrop-blur-2xl
          saturate-180
          border border-black/10 dark:border-white/15
          shadow-appleHover
          flex items-center justify-between px-6 py-3
          w-full max-w-md mx-auto
          transition-all duration-500
          ${isScrolled ? "rounded-none rounded-t-3xl pb-safe" : "rounded-full"}
        `}
      >
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        <Link
          href="/#events"
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
        >
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-bold">Events</span>
        </Link>

        {/* Floating Center Donate FAB */}
        <div className="relative -top-5">
          <Link
            href="/donate"
            className="flex items-center justify-center w-16 h-16 bg-brandRed-500 hover:bg-brandRed-600 text-white rounded-full shadow-cardHover shadow-brandRed-500/30 transform hover:scale-105 transition-all"
            aria-label="Donate Now"
          >
            <Heart className="w-7 h-7 fill-white" />
          </Link>
        </div>

        <Link
          href="/gallery"
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
        >
          <ImageIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold">Gallery</span>
        </Link>

        <Link
          href="/sign-in"
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">Account</span>
        </Link>
      </nav>
    </div>
  );
}
