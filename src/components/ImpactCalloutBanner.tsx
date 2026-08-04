import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function ImpactCalloutBanner() {
  return (
    <section className="bg-sage-500 py-8 text-white relative overflow-hidden">
      {/* Decorative Blur Circles */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-gold-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-400 bg-white/10 px-4 py-1.5 rounded-full inline-block">
              Help Us Raise Them Up
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
              Your donation means a lot to them. <br className="hidden sm:inline" />
              Donate what you can.
            </h2>

            <p className="text-sage-100 text-sm sm:text-base max-w-xl">
              Even a small contribution of ₹500 provides a child with shelter, warm winter blankets, and nutritional support for an entire week.
            </p>

            <div className="pt-4">
              <Link
                href="/donate"
                className="bg-brandRed-500 hover:bg-brandRed-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2 text-base"
              >
                <Heart className="w-5 h-5 fill-white" />
                Start Donating Now
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop"
                alt="Happy orphan child"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
