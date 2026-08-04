"use client";

import React, { useRef } from "react";
import { BookOpen, Utensils, HeartPulse, ChevronLeft, ChevronRight } from "lucide-react";

export default function ServicesGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      id: "s1",
      code: "01 // EDUCATION",
      title: "Daily Education & Tutoring",
      desc: "Every child at Mahanaim Miraj attends the local district school. We cover 100% of tuition, uniforms, and after-school tutoring for 42 children.",
      icon: BookOpen,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "s2",
      code: "02 // NUTRITION",
      title: "Centralized Kitchen",
      desc: "Fresh, hot meals prepared three times a day using locally sourced ingredients, ensuring zero malnutrition among residential children.",
      icon: Utensils,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "s3",
      code: "03 // HEALTHCARE",
      title: "Medical Coverage",
      desc: "Weekly pediatric checkups, routine vaccinations, and emergency hospital coverage for all residents and homeless youth in Sangli.",
      icon: HeartPulse,
      color: "text-primary bg-primary/10 border-primary/20",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border/40 relative transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border/40 pb-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              How we utilize your <span className="text-primary italic font-serif font-normal">funds in Miraj.</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-lg leading-relaxed font-normal">
              We don't believe in generic aid. Our operations are hyper-focused on core necessities for abandoned children and homeless in Sangli district.
            </p>
          </div>

          {/* Desktop Scroll Navigation Arrows */}
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
        </div>

        {/* Sideways Scrollable Row of 3 Similar Sized Boxes */}
        <div
          ref={scrollRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 pt-2 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 scroll-smooth"
        >
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="w-[330px] sm:w-[380px] lg:w-[420px] shrink-0 snap-start flex flex-col justify-between bg-card/90 dark:bg-card/70 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-apple rounded-3xl p-8 hover:shadow-appleHover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  {/* Icon Badge */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-transform duration-300 group-hover:scale-110 ${svc.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Code Tag */}
                  <div className="text-xs font-mono font-semibold tracking-wider text-muted-foreground mb-2">
                    {svc.code}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-extrabold text-foreground mb-3 leading-snug">
                    {svc.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                    {svc.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground/80">Direct Impact Program</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
