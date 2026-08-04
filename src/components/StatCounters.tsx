import React from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

interface StatCountersProps {
  hideAboutButton?: boolean;
}

export default function StatCounters({ hideAboutButton = false }: StatCountersProps) {
  const stats = [
    { label: "Total Campaigns", value: "240+" },
    { label: "Total Fund Raised", value: "₹1.8M+" },
    { label: "Happy Volunteers", value: "850+" },
    { label: "Years of Service", value: "12+" },
  ];

  return (
    <section className="bg-gold-500 dark:bg-amber-600 text-white py-6 shadow-md relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-white/20">
          {stats.map((st, idx) => (
            <div key={idx} className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-sm">
                {st.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-cream-100 uppercase tracking-wider">
                {st.label}
              </div>
            </div>
          ))}
        </div>

        {/* About Us Button below KPI */}
        {!hideAboutButton && (
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <span className="text-sm sm:text-base font-medium text-cream-100">
              Want to know more about our journey, story, and impact?
            </span>
            <Link
              href="/about"
              className="bg-white dark:bg-slate-900 text-gold-700 dark:text-gold-400 hover:bg-cream-100 dark:hover:bg-slate-800 font-bold px-7 py-3 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm group border border-transparent dark:border-amber-500/30"
            >
              <Info className="w-4 h-4 text-gold-600 dark:text-gold-400 group-hover:scale-110 transition-transform" />
              <span>About Us</span>
              <ArrowRight className="w-4 h-4 text-gold-600 dark:text-gold-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
