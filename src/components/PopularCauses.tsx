"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Heart, Sparkles } from "lucide-react";
import { getCauses, CauseItem } from "@/lib/dataStore";

export default function PopularCauses() {
  const [causes, setCauses] = useState<CauseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCauses();
        setCauses(data);
      } catch (err) {
        console.error("Error loading causes:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section id="causes" className="py-16 sm:py-20 lg:py-24 bg-background border-b border-border/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/60 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Direct Community Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              Current Immediate Needs
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
              We operate on a transparent, zero-buffer policy. These are the exact funds needed to sustain our shelter and community welfare programs in Miraj.
            </p>
          </div>

          <Link
            href="/donate"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors bg-secondary/60 hover:bg-secondary px-5 py-2.5 rounded-full border border-border shrink-0 shadow-sm"
          >
            <span>View All Campaigns</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Campaign Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-secondary/40 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {causes.map((cause, idx) => {
              const deficit = Math.max(0, cause.goalAmount - cause.raisedAmount);
              const progressPercent = Math.min(
                100,
                Math.round((cause.raisedAmount / (cause.goalAmount || 1)) * 100)
              );

              // Descriptive tags for items
              const tag = idx === 0 ? "Urgent Relief" : idx === 1 ? "Daily Nutrition" : "Winter Protection";
              const deadline = idx === 0 ? "2 Days Left" : idx === 1 ? "Ongoing Support" : "Seasonal Need";

              return (
                <div
                  key={cause.id}
                  className="flex flex-col justify-between bg-card text-card-foreground border border-border/80 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="space-y-4">
                    {/* Image with Tag & Deadline */}
                    <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-secondary shadow-inner">
                      <Image
                        src={cause.imageURL || "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop"}
                        alt={cause.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                        <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">
                          {tag}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-300" />
                          <span>{deadline}</span>
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground leading-snug line-clamp-2 min-h-[3.5rem]">
                      {cause.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-normal">
                      {cause.description}
                    </p>
                  </div>

                  {/* Progress & Metrics */}
                  <div className="pt-6 mt-6 border-t border-border/60 space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="text-foreground font-mono font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* 3 Metric Pills */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="bg-secondary/50 p-2.5 rounded-2xl border border-border/50">
                        <div className="text-[10px] text-muted-foreground uppercase font-semibold">Raised</div>
                        <div className="font-mono text-xs sm:text-sm font-bold text-foreground">
                          ₹{cause.raisedAmount.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="bg-secondary/50 p-2.5 rounded-2xl border border-border/50">
                        <div className="text-[10px] text-muted-foreground uppercase font-semibold">Goal</div>
                        <div className="font-mono text-xs sm:text-sm font-bold text-foreground/80">
                          ₹{cause.goalAmount.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="bg-rose-500/10 dark:bg-rose-500/20 p-2.5 rounded-2xl border border-rose-500/20">
                        <div className="text-[10px] text-primary uppercase font-bold">Deficit</div>
                        <div className="font-mono text-xs sm:text-sm font-bold text-primary">
                          ₹{deficit.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="/donate"
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold py-3 rounded-full transition-all duration-200 shadow-sm active:scale-95"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Fund This Need</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
