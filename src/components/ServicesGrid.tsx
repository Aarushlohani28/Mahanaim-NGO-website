import React from "react";
import { BookOpen, Utensils, HeartPulse, CheckCircle2 } from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      id: "s1",
      step: "01",
      title: "Daily Education & Tutoring",
      desc: "Every child at Mahanaim Miraj attends the local district school. We cover 100% of tuition fees, uniforms, textbooks, and provide daily after-school tutoring for 42 residential children.",
      icon: BookOpen,
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
      benefits: ["100% School Enrollment", "Daily Homework Tutoring", "Computer & Literacy Classes"],
    },
    {
      id: "s2",
      step: "02",
      title: "Centralized Kitchen & Nutrition",
      desc: "Fresh, hot, wholesome meals prepared three times a day using locally sourced grains and fresh vegetables, ensuring zero malnutrition and healthy physical development.",
      icon: Utensils,
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
      benefits: ["3 Balanced Meals Daily", "Clean RO Filtered Water", "Seasonal Fruit & Milk"],
    },
    {
      id: "s3",
      step: "03",
      title: "Comprehensive Medical Coverage",
      desc: "Weekly pediatric health checkups, routine vaccinations, dental care, emergency hospitalization coverage, and trauma-informed psychological counseling for every child.",
      icon: HeartPulse,
      iconColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
      benefits: ["Pediatric Checkups", "Emergency Care Fund", "Trauma Counseling"],
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-card text-card-foreground border-b border-border/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Transparent Fund Allocation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            How we utilize your <span className="text-primary italic font-serif font-normal">funds in Miraj.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
            We operate with strict financial discipline. Your donations are directly allocated to core survival and empowerment pillars for orphaned youth in the Sangli district.
          </p>
        </div>

        {/* 3 Coherent Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="flex flex-col justify-between bg-background border border-border/80 rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="space-y-5">
                  {/* Top Row: Icon + Step Number */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${svc.iconColor}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-mono text-2xl font-black text-muted-foreground/30">
                      {svc.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                    {svc.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                    {svc.desc}
                  </p>
                </div>

                {/* Key Program Highlights */}
                <div className="pt-6 mt-6 border-t border-border/50 space-y-2.5">
                  {svc.benefits.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs font-medium text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
