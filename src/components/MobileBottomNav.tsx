"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Home, Heart, Calendar, MessageSquare, User, LogOut, Receipt, X } from "lucide-react";

export default function MobileBottomNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAccountClick = () => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      setIsAccountOpen((prev) => !prev);
    }
  };

  const toggleChatbot = () => {
    window.dispatchEvent(new CustomEvent("toggle-chatbot"));
  };

  return (
    <>
      {/* ── Mobile Account Drawer / Modal ── */}
      {isAccountOpen && isSignedIn && user && (
        <div className="md:hidden fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-appleHover rounded-3xl p-6 w-full max-w-sm space-y-5 animate-in slide-in-from-bottom-5 duration-300">
            {/* User Profile Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || "User Profile"}
                    width={44}
                    height={44}
                    className="rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {user.firstName?.[0] || "U"}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-foreground text-base leading-tight">
                    {user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Valued Donor")}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAccountOpen(false)}
                className="p-2 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close Account Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Options */}
            <div className="space-y-2">
              <Link
                href="/my-donations"
                onClick={() => setIsAccountOpen(false)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary/60 hover:bg-secondary text-foreground font-semibold text-sm transition-all"
              >
                <Receipt className="w-5 h-5 text-primary" />
                <span>View My Donations</span>
              </Link>

              <button
                onClick={() => {
                  setIsAccountOpen(false);
                  signOut(() => router.push("/"));
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-primary font-semibold text-sm transition-all"
              >
                <LogOut className="w-5 h-5 text-primary" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Mobile Bottom Nav Bar ── */}
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
            flex items-center justify-between px-5 py-2.5
            w-full max-w-md mx-auto
            transition-all duration-500
            ${isScrolled ? "rounded-none rounded-t-3xl pb-safe" : "rounded-full"}
          `}
        >
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          <Link
            href="/events"
            className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Drives</span>
          </Link>

          {/* Floating Center Donate FAB */}
          <div className="relative -top-4">
            <Link
              href="/donate"
              className="flex items-center justify-center w-14 h-14 bg-primary hover:bg-red-600 text-white rounded-full shadow-apple hover:scale-105 active:scale-95 transition-all"
              aria-label="Donate Now"
            >
              <Heart className="w-6 h-6 fill-white" />
            </Link>
          </div>

          <button
            onClick={toggleChatbot}
            className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="AI Chat Assistant"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-semibold">AI Assistant</span>
          </button>

          <button
            onClick={handleAccountClick}
            className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Account Menu"
          >
            {isSignedIn && user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Account"
                width={22}
                height={22}
                className="rounded-full object-cover border border-border"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
            <span className="text-[10px] font-semibold">Account</span>
          </button>
        </nav>
      </div>
    </>
  );
}
