"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEvents, NGOEvent } from "@/lib/dataStore";
import { CalendarDays, MapPin, IndianRupee, Heart, CheckCircle2, Sparkles } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<NGOEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error loading events page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const activeEvents = events.filter((e) => e.raised < e.target);
  const completedEvents = events.filter((e) => e.raised >= e.target);

  return (
    <div className="bg-background text-foreground py-16 md:py-24 min-h-screen border-b border-border/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 text-muted-foreground border border-black/5 dark:border-white/10 text-xs font-semibold uppercase tracking-wider shadow-apple">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Mahanaim Miraj Community Drives</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Our Drives & <span className="text-primary italic font-serif font-normal">Events Schedule</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed font-normal">
            Join us on the ground or contribute remotely. Below are our active upcoming distribution drives and past fulfilled community initiatives in Miraj, Maharashtra.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-secondary/40 rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            {/* ── Active Drives Section ── */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  Active & Upcoming Drives ({activeEvents.length})
                </h2>
              </div>

              {activeEvents.length === 0 ? (
                <div className="p-8 text-center bg-card rounded-3xl border border-border text-muted-foreground">
                  No active drives right now. All current drives have been fully funded!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeEvents.map((evt) => {
                    const progressPercent = Math.min(100, Math.round((evt.raised / evt.target) * 100));

                    return (
                      <div
                        key={evt.id}
                        className="flex flex-col justify-between bg-card/90 dark:bg-card/70 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-apple rounded-3xl p-7 hover:shadow-appleHover transition-all duration-300 hover:-translate-y-1 group"
                      >
                        <div>
                          {/* Image with badges */}
                          <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-6 shadow-sm">
                            <Image
                              src={evt.imageUrl}
                              alt={evt.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
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

                          <h3 className="text-xl font-extrabold text-foreground leading-snug line-clamp-2 min-h-[3.25rem]">
                            {evt.title}
                          </h3>

                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-normal mt-2.5">
                            {evt.description}
                          </p>
                        </div>

                        <div className="pt-6 mt-4 border-t border-border/40 space-y-4">
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

                          <div className="flex items-center justify-between bg-secondary/40 p-3 rounded-2xl border border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                <IndianRupee className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <span className="text-xs font-semibold text-muted-foreground uppercase">Target</span>
                            </div>
                            <span className="font-mono text-base font-bold text-foreground">₹{evt.target.toLocaleString("en-IN")}</span>
                          </div>

                          <Link
                            href="/donate"
                            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-red-600 text-white text-xs font-semibold py-3 rounded-full transition-all shadow-apple hover:scale-[1.02] active:scale-95"
                          >
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            Sponsor This Drive
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ── Completed Drives Section (Greyed-out visual effect) ── */}
            {completedEvents.length > 0 && (
              <section className="space-y-8 pt-8">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    Completed & Fulfilled Drives ({completedEvents.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {completedEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="flex flex-col justify-between bg-card/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-apple rounded-3xl p-7 opacity-60 grayscale filter hover:grayscale-0 hover:opacity-100 transition-all duration-300 group"
                    >
                      <div>
                        <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-6 shadow-sm">
                          <Image
                            src={evt.imageUrl}
                            alt={evt.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-emerald-500/90 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Goal Met
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-extrabold text-foreground leading-snug line-clamp-2 min-h-[3.25rem]">
                          {evt.title}
                        </h3>

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-normal mt-2.5">
                          {evt.description}
                        </p>
                      </div>

                      <div className="pt-6 mt-4 border-t border-border/40 flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> 100% Fully Funded
                        </span>
                        <span className="font-mono text-sm font-bold text-foreground">
                          ₹{evt.target.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

      </div>
    </div>
  );
}
