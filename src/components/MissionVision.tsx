import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, ArrowRight, ShieldCheck } from "lucide-react";

export default function MissionVision() {
  return (
    <section id="mission" className="py-16 md:py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Image */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-secondary p-4 border border-border shadow-xl dark:shadow-glassDark">
              <Image
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1000&auto=format&fit=crop"
                alt="Children holding hands in unity"
                fill
                className="object-cover rounded-2xl"
              />

              {/* Floating Shield Badge */}
              <div className="absolute top-6 right-6 bg-gold-500 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Transparent NGO</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mission & Vision Content */}
          <div className="lg:col-span-6 space-y-6">

            {/* Pill Tag */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
              Welcome To Mahanaim Miraj
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              You&apos;re the Hope of{" "}
              <br className="hidden sm:inline" />
              <span className="text-gold-500">Others.</span>
            </h2>

            <p className="text-muted-foreground text-base leading-relaxed">
              Mahanaim Miraj was established with a singular heartbeat: to ensure no child suffers the pain of abandonment. We shelter orphaned boys and girls, providing them with a secure home, warm meals, healthcare, formal schooling, and moral foundation.
            </p>

            {/* Mission & Vision Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">

              {/* Our Mission */}
              <div className="bg-card border border-border p-5 rounded-2xl space-y-2 shadow-sm dark:shadow-cardDark">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-600 dark:text-gold-400 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-card-foreground text-base">Our Mission</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  To provide immediate sanctuary, psychological healing, and comprehensive education for orphaned &amp; abandoned youth.
                </p>
              </div>

              {/* Our Vision */}
              <div className="bg-card border border-border p-5 rounded-2xl space-y-2 shadow-sm dark:shadow-cardDark">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-skyAccent-500/20 text-skyAccent-600 dark:text-skyAccent-500 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-card-foreground text-base">Our Vision</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  We believe charity is a lifetime investment into self-sufficient, empowered young men and women.
                </p>
              </div>

            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Link
                href="/#causes"
                className="bg-brandRed-500 hover:bg-brandRed-600 text-white font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 text-sm hover:-translate-y-0.5 transform"
              >
                <span>Discover More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
