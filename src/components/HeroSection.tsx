"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-background text-foreground border-b border-border/40 overflow-hidden flex items-center py-8 sm:py-10 lg:py-12">
      {/* Background subtle ambient glows */}
      <div className="absolute top-1/4 right-10 w-[400px] h-[400px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 left-10 w-[350px] h-[350px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        {/* Asymmetric 12-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Tightened Typography & Main CTA */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-xl border border-black/5 dark:border-white/10 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase shadow-apple">
              <span className="w-2 h-2 bg-primary rounded-full inline-block animate-pulse"></span>
              Spread Love.... Spread Peace....
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.05] tracking-tight max-w-4xl">
              Sheltering & nurturing children in{" "}
              <span className="text-primary italic font-serif font-normal">
                Maharashtra.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-normal">
              Mahanaim NGO operates a 24/7 care facility on Station Road, Miraj. We provide 
              secure housing, three wholesome meals a day, medical care, and schooling for children who have 
              nowhere else to go. 
            </p>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-3.5">
              <Link
                href="/donate"
                className="bg-primary hover:bg-red-600 text-white font-medium px-7 py-3 rounded-full shadow-apple hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2.5 text-sm"
              >
                Fund a child's meal (₹50)
              </Link>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Mahanaim+NGO+Station+Road+Miraj+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-black/10 dark:border-white/15 text-foreground hover:bg-secondary/80 font-semibold transition-all duration-200 flex items-center gap-2 text-sm shadow-apple hover:scale-[1.02] active:scale-95"
              >
                <MapPin className="w-4 h-4 text-primary" />
                View on Map
              </a>
            </div>

          </div>

          {/* Right Column: Hero Image Card */}
          <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] aspect-[4/4.6] rounded-3xl overflow-hidden shadow-apple hover:shadow-appleHover border border-black/5 dark:border-white/10 bg-card transition-all duration-500 group">
              <Image
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop"
                alt="Children playing at Mahanaim Miraj"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                <div>
                  <p className="text-white font-semibold text-sm tracking-tight">Mahanaim Children Home</p>
                  <p className="text-zinc-300 text-xs mt-0.5">Miraj, Maharashtra</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
