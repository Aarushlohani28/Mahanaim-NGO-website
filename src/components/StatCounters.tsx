import React from "react";
import Link from "next/link";
import { ArrowRight, Info, HeartHandshake, IndianRupee, Users, Award } from "lucide-react";

interface StatCountersProps {
  hideAboutButton?: boolean;
}

export default function StatCounters({ hideAboutButton = false }: StatCountersProps) {
  const stats = [
    {
      label: "TOTAL CAMPAIGNS",
      value: "240+",
      sub: "Drives Completed",
      icon: HeartHandshake,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
    },
    {
      label: "TOTAL FUNDS RAISED",
      value: "₹1.8M+",
      sub: "100% Direct Impact",
      icon: IndianRupee,
      color: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
    },
    {
      label: "HAPPY VOLUNTEERS",
      value: "850+",
      sub: "Grassroots Network",
      icon: Users,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
    {
      label: "YEARS OF SERVICE",
      value: "12+",
      sub: "Since 2014 in Miraj",
      icon: Award,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    },
  ];

  return (
    <section className="bg-card text-card-foreground border-b border-border/60 py-12 sm:py-16 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* KPI Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-secondary/40 hover:bg-secondary/70 border border-border/80 rounded-3xl p-5 sm:p-7 text-center flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 ${st.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                    {st.value}
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {st.label}
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground font-medium pt-2 border-t border-border/50 w-full mt-3">
                  {st.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Journey Callout */}
        {!hideAboutButton && (
          <div className="mt-8 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/30 rounded-3xl p-6 border border-border/60">
            <div className="text-center sm:text-left">
              <h4 className="text-base font-bold text-foreground">
                Want to know more about our journey, story, and impact?
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Read how Mahanaim Miraj grew from a small neighborhood initiative into a registered home.
              </p>
            </div>
            
            <Link
              href="/about"
              className="bg-foreground text-background hover:opacity-90 font-semibold px-6 py-3 rounded-full shadow-sm transition-all flex items-center gap-2 text-xs sm:text-sm shrink-0 active:scale-95 group"
            >
              <Info className="w-4 h-4 text-primary" />
              <span>About Our Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
