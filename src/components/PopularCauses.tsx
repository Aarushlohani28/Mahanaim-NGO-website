"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, ChevronLeft, ChevronRight, Heart } from "lucide-react";

export default function PopularCauses() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const causes = [
    {
      id: "c1",
      title: "Repairing the Kupwad Slums Water Tank",
      desc: "The primary drinking water tank for 40 families cracked last week. We need funds to install a 500L Sintex tank before summer hits.",
      raised: 45000,
      goal: 60000,
      image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
      tag: "Urgent Relief",
      deadline: "2 Days Left"
    },
    {
      id: "c2",
      title: "Weekend Meals for Station Children",
      desc: "Funding Saturday and Sunday hot meals (Dal, Rice, Vegetables) for 25 runaway children living near Miraj Junction.",
      raised: 82000,
      goal: 100000,
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
      tag: "Nutrition",
      deadline: "Ongoing"
    },
    {
      id: "c3",
      title: "Winter Jackets for Elderly in Sangli",
      desc: "Purchasing heavy cotton jackets from the local wholesale market for 50 elderly residents sleeping on the streets.",
      raised: 120000,
      goal: 150000,
      image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1000&auto=format&fit=crop",
      tag: "Winter Drive",
      deadline: "Dec 1st"
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="causes" className="py-24 lg:py-32 bg-background border-b border-border/40 relative transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border/40 pb-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Current Immediate Needs
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-lg leading-relaxed font-normal">
              We operate on a zero-buffer policy. These are the exact funds we need this week to keep our community programs running in Miraj.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Scroll Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll Left"
                className="p-2.5 rounded-full bg-secondary/80 hover:bg-secondary text-foreground border border-black/5 dark:border-white/10 transition-all shadow-apple active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll Right"
                className="p-2.5 rounded-full bg-secondary/80 hover:bg-secondary text-foreground border border-black/5 dark:border-white/10 transition-all shadow-apple active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link href="/donate" className="text-sm font-semibold text-foreground hover:text-primary flex items-center gap-1.5 group transition-colors">
              View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Sideways Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 pt-2 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 scroll-smooth"
        >
          {causes.map((cause) => {
            const deficit = cause.goal - cause.raised;
            const progressPercent = Math.min(100, Math.round((cause.raised / cause.goal) * 100));

            return (
              <div
                key={cause.id}
                className="w-[330px] sm:w-[380px] lg:w-[420px] shrink-0 snap-start flex flex-col justify-between bg-card/90 dark:bg-card/70 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-apple rounded-3xl p-7 hover:shadow-appleHover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  {/* Image Container with Rounded Edges */}
                  <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-6 shadow-sm">
                    <Image
                      src={cause.image}
                      alt={cause.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                      <span className="bg-black/60 dark:bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-white/10">
                        {cause.tag}
                      </span>
                      <span className="bg-black/60 dark:bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> {cause.deadline}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug line-clamp-2 min-h-[3.5rem]">
                    {cause.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-normal mt-2.5">
                    {cause.desc}
                  </p>
                </div>

                {/* Data Metrics & CTA */}
                <div className="pt-6 mt-4 border-t border-border/40 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-mono">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-secondary/80 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-secondary/40 p-2.5 rounded-2xl border border-black/5 dark:border-white/5">
                      <div className="text-[10px] text-muted-foreground uppercase font-semibold">Raised</div>
                      <div className="font-mono text-sm font-bold text-foreground">₹{cause.raised.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="bg-secondary/40 p-2.5 rounded-2xl border border-black/5 dark:border-white/5">
                      <div className="text-[10px] text-muted-foreground uppercase font-semibold">Goal</div>
                      <div className="font-mono text-sm font-bold text-foreground/80">₹{cause.goal.toLocaleString("en-IN")}</div>
                    </div>
                    <div className="bg-red-500/10 dark:bg-red-500/20 p-2.5 rounded-2xl border border-red-500/20">
                      <div className="text-[10px] text-primary uppercase font-bold">Deficit</div>
                      <div className="font-mono text-sm font-bold text-primary">₹{deficit.toLocaleString("en-IN")}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href="/donate"
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-red-600 text-white text-xs font-semibold py-3 rounded-full transition-all shadow-apple hover:scale-[1.02] active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    Fund Deficit
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Bonus 4th Card: Browse all completed drives */}
          <div className="w-[280px] sm:w-[320px] shrink-0 snap-start flex flex-col justify-center items-center text-center bg-transparent border-2 border-dashed border-border/80 rounded-3xl p-8 hover:border-foreground/40 hover:bg-card/40 transition-all group">
            <div className="w-14 h-14 rounded-full bg-secondary/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-6 h-6 text-foreground" />
            </div>
            <h4 className="text-lg font-bold text-foreground mb-2">Browse All Drives</h4>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Explore 12 past completed drives and ongoing initiatives.
            </p>
            <Link
              href="/donate"
              className="text-xs font-semibold text-foreground hover:text-primary bg-secondary/80 hover:bg-secondary px-5 py-2.5 rounded-full transition-all border border-black/5 dark:border-white/10 active:scale-95"
            >
              View All Drives
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
