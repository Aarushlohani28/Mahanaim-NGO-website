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
    <div className="bg-background text-foreground py-14 sm:py-20 min-h-screen border-b border-border/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Mahanaim Miraj Community Drives</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Our Drives &amp; <span className="text-primary italic font-serif font-normal">Events Schedule</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
            Join us on the ground or contribute remotely. Below are our active upcoming distribution drives and completed community initiatives in Miraj, Maharashtra.
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
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active &amp; Upcoming Drives ({activeEvents.length})</span>
                </h2>
              </div>

              {activeEvents.length === 0 ? (
                <div className="p-10 text-center bg-card rounded-3xl border border-border text-muted-foreground">
                  No active drives right now. All current drives have been fully funded!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeEvents.map((evt) => {
                    const progressPercent = Math.min(100, Math.round((evt.raised / (evt.target || 1)) * 100));

                    return (
                      <div
                        key={evt.id}
                        className="flex flex-col justify-between bg-card text-card-foreground border border-border/80 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                      >
                        <div className="space-y-4">
                          {/* Image with badges */}
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

                          <h3 className="text-xl font-bold text-foreground leading-snug line-clamp-2 min-h-[3.25rem]">
                            {evt.title}
                          </h3>

                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-normal">
                            {evt.description}
                          </p>
                        </div>

                        <div className="pt-6 mt-6 border-t border-border/60 space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-foreground font-mono font-bold">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-2xl border border-border/50">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                <IndianRupee className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <span className="text-xs font-semibold text-muted-foreground uppercase">Target</span>
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
                            <span>Sponsor This Drive</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ── Completed Drives Section ── */}
            {completedEvents.length > 0 && (
              <section className="space-y-8 pt-8">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <span>Completed &amp; Fulfilled Drives ({completedEvents.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {completedEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="flex flex-col justify-between bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-7 opacity-75 hover:opacity-100 transition-all duration-300 group"
                    >
                      <div className="space-y-4">
                        <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-secondary shadow-inner">
                          <Image
                            src={evt.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop"}
                            alt={evt.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            className="object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-emerald-600 text-white text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Goal Met
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-foreground leading-snug line-clamp-2 min-h-[3.25rem]">
                          {evt.title}
                        </h3>

                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-normal">
                          {evt.description}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
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
