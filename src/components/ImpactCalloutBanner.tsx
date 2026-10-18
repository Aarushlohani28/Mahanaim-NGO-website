import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ImpactCalloutBanner() {
  return (
    <section className="bg-gradient-to-br from-[#0F766E] to-[#115E59] dark:from-[#0D5953] dark:to-[#083330] text-white py-16 sm:py-20 relative overflow-hidden transition-colors duration-300">
      {/* Subtle organic lighting circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Text & Conversion */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-teal-100 border border-white/15 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Help Us Raise Them Up</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-white">
              Your donation means a lot to them. <br className="hidden sm:inline" />
              <span className="text-teal-200 italic font-serif font-normal">
                Donate what you can.
              </span>
            </h2>

            <p className="text-teal-50 text-base sm:text-lg max-w-xl leading-relaxed font-normal opacity-95">
              Even a small contribution of ₹500 provides a child with shelter, warm winter blankets, and nutritional support for an entire week in Miraj.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/donate"
                className="w-full sm:w-auto bg-primary hover:bg-rose-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 text-base"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Start Donating Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-teal-100 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-200" /> 80G Tax Deductible
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-200" /> Instant PDF Receipt
              </span>
            </div>
          </div>

          {/* Right Image Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3.8] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/20 group">
              <Image
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop"
                alt="Happy orphan child at Mahanaim Miraj"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  Mahanaim Child Care Community
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
