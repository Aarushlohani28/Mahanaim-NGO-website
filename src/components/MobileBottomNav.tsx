"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Home, Heart, Calendar, MessageSquare, User, LogOut, Receipt, X } from "lucide-react";

export default function MobileBottomNav() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

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
          <div className="bg-card border border-border shadow-2xl rounded-3xl p-6 w-full max-w-sm space-y-5 animate-in slide-in-from-bottom-5 duration-300">
            {/* User Profile Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User Profile"}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {user.firstName?.[0] || "U"}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-foreground text-sm leading-tight">
                    {user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Valued Donor")}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate max-w-[170px]">
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
                <Receipt className="w-4 h-4 text-primary" />
                <span>View My Donations</span>
              </Link>

              <button
                onClick={() => {
                  setIsAccountOpen(false);
                  signOut(() => router.push("/"));
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-primary font-semibold text-sm transition-all"
              >
                <LogOut className="w-4 h-4 text-primary" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Mobile Floating Bottom Nav Bar ── */}
      <div className="md:hidden fixed z-50 bottom-4 left-4 right-4 flex justify-center">
        <nav className="bg-background/90 dark:bg-card/90 backdrop-blur-2xl border border-border shadow-xl rounded-full px-3 py-2 flex items-center justify-around w-full max-w-sm mx-auto">
          {/* Home */}
          <Link
            href="/"
            className={`w-12 flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
              pathname === "/" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] leading-none">Home</span>
          </Link>

          {/* Drives / Events */}
          <Link
            href="/events"
            className={`w-12 flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
              pathname === "/events" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] leading-none">Drives</span>
          </Link>

          {/* Center Floating Donate Button */}
          <div className="relative -top-4 shrink-0 -my-3">
            <Link
              href="/donate"
              className="flex items-center justify-center w-13 h-13 p-3.5 bg-primary hover:bg-rose-700 text-white rounded-full shadow-lg border-4 border-background active:scale-95 transition-all"
              aria-label="Donate Now"
            >
              <Heart className="w-5 h-5 fill-white" />
            </Link>
          </div>

          {/* AI Assistant */}
          <button
            onClick={toggleChatbot}
            className="w-12 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors py-1"
            aria-label="AI Chat Assistant"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] leading-none">Assistant</span>
          </button>

          {/* Account */}
          <button
            onClick={handleAccountClick}
            className={`w-12 flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
              pathname === "/my-donations" ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Account Menu"
          >
            {isSignedIn && user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Account"
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-border"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
            <span className="text-[10px] leading-none">Account</span>
          </button>
        </nav>
      </div>
    </>
  );
}
