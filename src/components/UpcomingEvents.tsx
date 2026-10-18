"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEvents, NGOEvent } from "@/lib/dataStore";
import { ArrowUpRight, MapPin, CalendarDays, IndianRupee, Heart, Sparkles } from "lucide-react";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<NGOEvent[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section id="events" className="py-16 sm:py-20 lg:py-24 bg-background text-foreground border-b border-border/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/60 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Ground Action</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              Community <span className="text-primary italic font-serif font-normal">Schedule</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
              Join us on the ground or support remotely. Here is our confirmed schedule for upcoming distribution drives in the Sangli district.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors bg-secondary/60 hover:bg-secondary px-5 py-2.5 rounded-full border border-border shrink-0 shadow-sm"
          >
            <span>Browse All Drives</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Event Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-secondary/40 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col justify-between bg-card text-card-foreground border border-border/80 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="space-y-4">
                  {/* Event Image */}
                  <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-secondary shadow-inner">
                    <Image
                      src={evt.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop"}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 uppercase tracking-wider">
                        <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{evt.date}</span>
                      </span>
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-300" />
                        <span className="truncate max-w-[120px]">{evt.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground leading-snug line-clamp-2 min-h-[3.5rem]">
                    {evt.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-normal">
                    {evt.description}
                  </p>
                </div>

                {/* Target Metric & CTA */}
                <div className="pt-6 mt-6 border-t border-border/60 space-y-4">
                  <div className="bg-secondary/50 p-3.5 rounded-2xl border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <IndianRupee className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Target Budget</span>
                    </div>
                    <span className="font-mono text-base font-bold text-foreground">
                      ₹{evt.target.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link
                    href="/donate"
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold py-3 rounded-full transition-all duration-200 shadow-sm active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Contribute to Drive</span>
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
