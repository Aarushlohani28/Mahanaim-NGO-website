"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Heart, ShieldCheck, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-background text-foreground border-b border-border/60 overflow-hidden py-10 sm:py-12 lg:py-14 transition-colors duration-300">
      {/* Subtle organic ambient background gradients */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase shadow-sm">
              <span className="w-2 h-2 bg-primary rounded-full inline-block animate-pulse" />
              <span>Spread Love.... Spread Peace....</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.12] tracking-tight">
              Sheltering & nurturing children in{" "}
              <span className="text-primary italic font-serif font-normal underline decoration-primary/30 underline-offset-8">
                Maharashtra.
              </span>
            </h1>

            {/* Subtext Description */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
              Mahanaim NGO operates a 24/7 care facility on Station Road, Miraj. We provide 
              secure housing, three wholesome meals a day, medical care, and schooling for children who have 
              nowhere else to go.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/donate"
                className="w-full sm:w-auto bg-primary hover:bg-rose-700 text-white font-semibold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 text-sm"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Fund a child&apos;s meal (₹50)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href="https://www.google.com/maps/search/?api=1&query=Mahanaim+NGO+Station+Road+Miraj+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-border text-foreground hover:bg-secondary font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm active:scale-95 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span>View on Map</span>
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>80G Tax Exempted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>100% Transparent Direct Aid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Reg. NGO in Miraj, Sangli</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Hero Photo Frame */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/4.5] sm:aspect-[4/4.8] rounded-3xl overflow-hidden shadow-xl border border-border bg-card group">
              <Image
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop"
                alt="Children playing and learning at Mahanaim Miraj"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Bottom Vignette & Information */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span>Station Road, Miraj</span>
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg drop-shadow-md">
                    Mahanaim Children Sanctuary & Care Home
                  </h3>
                  <p className="text-zinc-300 text-xs">
                    Safe haven providing education, nutrition, and love 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
