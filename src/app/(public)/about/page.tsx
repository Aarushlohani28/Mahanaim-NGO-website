"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, ShieldCheck, Heart, BookOpen, Utensils, Home, ArrowRight, Award, Volume2, VolumeX, Sparkles } from "lucide-react";
import StatCounters from "@/components/StatCounters";

export default function AboutPage() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const pillars = [
    {
      title: "24/7 Secure Shelter",
      desc: "Safe, clean dormitory housing with dedicated housemothers and around-the-clock protection for all resident children.",
      icon: Home,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
    },
    {
      title: "Nutritional Meals",
      desc: "Three fresh, hot, nutrient-dense meals every single day, along with clean drinking water and healthy afternoon snacks.",
      icon: Utensils,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
    {
      title: "Quality Education",
      desc: "Enrollment in local schools, daily after-school tutoring, textbooks, uniforms, school bags, and computer literacy classes.",
      icon: BookOpen,
      color: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
    },
    {
      title: "Healthcare & Counseling",
      desc: "Regular medical checkups, routine vaccinations, dental care, and compassionate trauma-informed emotional counseling.",
      icon: Heart,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      
      {/* 1. Page Header with Side-by-Side Video Showcase */}
      <section className="relative bg-[#111418] text-white py-14 sm:py-18 lg:py-20 overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Clear Text & Header Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-teal-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/15">
                <ShieldCheck className="w-4 h-4 text-teal-300" />
                <span>Registered 24/7 Care Facility</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
                About <span className="text-teal-300 italic font-serif font-normal">Mahanaim NGO</span>
              </h1>

              <p className="text-zinc-300 text-base sm:text-lg font-normal leading-relaxed">
                Dedicated to providing shelter, nutrition, education, and lifelong hope to orphaned and underprivileged children in Miraj, Maharashtra.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm font-semibold text-zinc-300">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>24/7 Care &amp; Shelter</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Miraj, Maharashtra</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Visibility Video Player */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black group">
                <video
                  ref={videoRef}
                  src="/about-tour.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Audio Mute/Unmute Toggle */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 z-20 bg-black/80 hover:bg-black text-white px-4 py-2 rounded-full border border-white/25 shadow-xl backdrop-blur-md transition-all flex items-center gap-2 text-xs font-bold active:scale-95"
                  title={isMuted ? "Click to Unmute Video" : "Click to Mute Video"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-400" />
                      <span>Unmute Video</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Mute Video</span>
                    </>
                  )}
                </button>
                
                {/* Tag Badge */}
                <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Video Tour • Facility Highlights</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Photo & Main Story Section */}
      <section className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Photo Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-border bg-card">
              <Image
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1000&auto=format&fit=crop"
                alt="Children at Mahanaim NGO Miraj"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="font-bold text-lg">Mahanaim Children Sanctuary</p>
                  <p className="text-xs text-zinc-300">Station Road, Miraj, Maharashtra</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 right-4 sm:right-8 bg-card text-card-foreground p-4 sm:p-5 rounded-2xl shadow-xl border border-border flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-foreground leading-none">12+ Years</p>
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">Dedicated Service</p>
              </div>
            </div>
          </div>

          {/* Story Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Our Journey &amp; Heartbeat</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Transforming Lives with <span className="text-primary italic font-serif font-normal">Love &amp; Dignity</span>
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
              Mahanaim NGO was established with a singular heartbeat: to ensure no child suffers the pain of abandonment or neglect. Located on Station Road in Miraj, Maharashtra, we shelter boys and girls, providing them with a secure home, wholesome meals, comprehensive healthcare, and formal schooling.
            </p>

            <p className="text-muted-foreground text-base leading-relaxed font-normal">
              Beyond basic survival, we nurture every child&apos;s talent, build moral character, and instill self-confidence so they can grow into empowered, self-sufficient members of society.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Core Pillars (What We Do) */}
      <section className="py-16 sm:py-20 bg-card text-card-foreground border-y border-border/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Core Pillars</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              What We Do
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
              Every initiative at Mahanaim NGO is crafted to provide a safe, holistic environment for children in need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-background p-6 rounded-3xl border border-border/80 space-y-4 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Vision & Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Our Purpose &amp; Guiding Star</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Our Vision &amp; Mission
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Vision Card */}
          <div className="bg-card p-8 sm:p-10 rounded-3xl border border-border/80 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-13 h-13 p-3 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 inline-flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-normal">
                We envision a society where no child is left helpless, uneducated, or unloved. We believe charity is not temporary relief, but a lifetime investment into creating self-sufficient, confident, and compassionate adults who uplift their communities.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90 font-medium pt-4 border-t border-border/50">
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Zero child abandonment in our region</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>100% school graduation &amp; vocational readiness</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Lifelong emotional and social mentorship</span>
              </li>
            </ul>
          </div>

          {/* Mission Card */}
          <div className="bg-card p-8 sm:p-10 rounded-3xl border border-border/80 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-13 h-13 p-3 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 inline-flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-normal">
                To provide immediate sanctuary, psychological healing, wholesome nutrition, and quality education for orphaned, abandoned, and vulnerable youth. We are committed to complete financial transparency and grassroots community empowerment.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90 font-medium pt-4 border-t border-border/50">
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>Provide safe 24/7 care and family atmosphere</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>Nurture mental health, moral character, and education</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>100% transparent donor accounting</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. Statistics Banner */}
      <StatCounters hideAboutButton={true} />

      {/* 6. Call to Action Banner */}
      <section className="py-16 sm:py-20 bg-[#111418] text-white text-center border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Be the Difference in a Child&apos;s Life Today
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Your generous support ensures that children in Miraj receive food, shelter, education, and a warm family environment.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/donate"
              className="bg-primary hover:bg-rose-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-md transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate Now</span>
            </Link>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-full border border-white/20 transition-all text-sm flex items-center gap-2 active:scale-95"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
