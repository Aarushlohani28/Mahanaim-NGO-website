"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEvents, NGOEvent } from "@/lib/dataStore";
import { ArrowUpRight, MapPin, CalendarDays, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<NGOEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="events" className="py-24 lg:py-32 bg-background border-t border-border/40 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border/40 pb-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Community <span className="text-primary italic font-serif font-normal">Schedule</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mt-3 leading-relaxed font-normal">
              Join us on the ground. Here is our confirmed schedule for upcoming distribution drives in the Sangli district.
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

            {events.length > 3 && (
              <Link
                href="/events"
                className="text-sm font-semibold text-foreground hover:text-primary flex items-center gap-1.5 group transition-colors"
              >
                Browse All Drives <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-secondary/40 rounded-3xl w-[380px] shrink-0" />
            ))}
          </div>
        ) : (
          /* Sideways Scrollable Row of 3 Similar Sized Boxes */
          <div
            ref={scrollRef}
            className="flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 pt-2 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 scroll-smooth"
          >
            {events.map((evt) => (
              <div
                key={evt.id}
                className="w-[330px] sm:w-[380px] lg:w-[420px] shrink-0 snap-start flex flex-col justify-between bg-card/90 dark:bg-card/70 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-apple rounded-3xl p-7 hover:shadow-appleHover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  {/* Event Image with Rounded Edges */}
                  <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-6 shadow-sm">
                    <Image
                      src={evt.imageUrl}
                      alt={evt.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                      <span className="bg-black/60 dark:bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-emerald-400" />
                        {evt.date.toUpperCase()}
                      </span>
                      <span className="bg-black/60 dark:bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {evt.location}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug line-clamp-2 min-h-[3.5rem]">
                    {evt.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-normal mt-2.5">
                    {evt.description}
                  </p>
                </div>

                {/* Target Metric & CTA */}
                <div className="pt-6 mt-4 border-t border-border/40 space-y-4">
                  <div className="bg-secondary/40 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <IndianRupee className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Target</span>
                    </div>
                    <span className="font-mono text-lg font-bold text-foreground">₹{evt.target.toLocaleString("en-IN")}</span>
                  </div>

                  <Link
                    href="/donate"
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-red-600 text-white text-xs font-semibold py-3 rounded-full transition-all shadow-apple hover:scale-[1.02] active:scale-95"
                  >
                    Contribute to Drive
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
