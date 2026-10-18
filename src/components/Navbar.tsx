"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, User, PhoneCall, Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const clerkAppearance = resolvedTheme === "dark" ? { baseTheme: dark } : {};

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Causes", href: "/#causes" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && !href.startsWith("/#") && pathname === href) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* ── Top Announcement & Trust Bar ── */}
      <div className="bg-[#111418] text-[#9CA3AF] text-[11px] py-1.5 px-4 font-medium tracking-tight border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-200 font-semibold tracking-wide">
              Mahanaim NGO:
            </span>
            <span className="hidden sm:inline italic text-zinc-300">
              Spread Love.... Spread Peace....
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="tel:+919876543210"
              className="hover:text-white transition-colors flex items-center gap-1.5 text-zinc-300"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>+91 98765 43210</span>
            </a>
            <span className="hidden md:inline text-zinc-600">|</span>
            <span className="hidden md:inline text-zinc-400">
              Miraj, Maharashtra, India
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-xl bg-background/90 shadow-sm border-b border-border/80 py-2.5"
            : "backdrop-blur-md bg-background/80 border-b border-border/50 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <Image
              src="/logo.png"
              alt="Mahanaim NGO Official Logo"
              width={190}
              height={50}
              priority
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] dark:brightness-110"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-1 xl:gap-2 font-semibold text-base">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 xl:px-5 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                    active
                      ? "text-primary font-bold bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-foreground hover:bg-secondary transition-all border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
              title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            {/* Desktop Auth / User Button */}
            <div className="hidden sm:flex items-center gap-2">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="text-xs font-semibold text-foreground hover:text-primary px-3.5 py-2 rounded-full bg-secondary/80 hover:bg-secondary transition-all border border-border flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Login</span>
                </Link>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center">
                  <UserButton afterSignOutUrl="/" appearance={clerkAppearance} />
                </div>
              </SignedIn>
            </div>

            {/* Secondary CTA: Volunteer — hidden on small desktops to save space */}
            <Link
              href="/volunteer"
              className="hidden xl:flex bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-4 py-2.5 rounded-full text-sm shadow-sm active:scale-95 transition-all duration-200 items-center gap-1.5 shrink-0 border border-emerald-200"
            >
              <User className="w-3.5 h-3.5" />
              <span>Volunteer</span>
            </Link>

            {/* Primary CTA: Donate Now */}
            <Link
              href="/donate"
              className="bg-primary hover:bg-rose-700 text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-2 shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donate Now</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-secondary transition-colors border border-border"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-2xl border-b border-border shadow-xl transition-all duration-300 animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}

              <SignedIn>
                <Link
                  href="/my-donations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 flex items-center justify-between transition-colors"
                >
                  <span>My Donations</span>
                  <ArrowUpRight className="w-4 h-4 text-primary" />
                </Link>
              </SignedIn>

              <Link
                href="/volunteer"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between transition-colors ${
                  pathname === "/volunteer"
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <span>Volunteer</span>
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </Link>

              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl text-sm font-semibold text-foreground bg-secondary/60 hover:bg-secondary flex items-center justify-between transition-colors mt-2"
                >
                  <span>LOGIN / SIGNUP</span>
                  <User className="w-4 h-4 text-muted-foreground" />
                </Link>
              </SignedOut>
            </nav>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Emergency / Support:</span>
              <a href="tel:+919876543210" className="text-primary font-bold">
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
