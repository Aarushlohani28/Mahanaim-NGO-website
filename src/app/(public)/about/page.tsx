"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, ShieldCheck, Heart, BookOpen, Utensils, Home, ArrowRight, Award, Volume2, VolumeX } from "lucide-react";
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

  return (
    <div className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      
      {/* 1. Page Header with Side-by-Side High-Visibility Video Showcase */}
      <section className="relative bg-slate-900 text-white py-8 lg:py-12 overflow-hidden border-b border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brandRed-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Clear Text & Header Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-gold-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/15">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Registered 24/7 Care Facility</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                About <span className="text-gold-400 italic font-serif">Mahanaim NGO</span>
              </h1>

              <p className="text-gray-200 text-lg sm:text-xl font-normal leading-relaxed">
                Dedicated to providing shelter, nutrition, education, and hope to orphaned and underprivileged children in Miraj, Maharashtra.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm font-semibold text-gray-300">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  24/7 Care & Shelter
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-400"></span>
                  Miraj, Maharashtra
                </div>
              </div>
            </div>

            {/* Right Column: High-Visibility Video Showcase Player */}
            <div className="lg:col-span-6 relative">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black group">
                <video
                  ref={videoRef}
                  src="/about-tour.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-100"
                />
                
                {/* Audio Mute/Unmute Toggle Overlay Button */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 z-20 bg-black/80 hover:bg-black text-white px-4 py-2 rounded-full border border-white/25 shadow-xl backdrop-blur-md transition-all flex items-center gap-2 text-xs font-bold hover:scale-105"
                  title={isMuted ? "Click to Unmute Video" : "Click to Mute Video"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-red-400" />
                      <span>Unmute Video</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Mute Video</span>
                    </>
                  )}
                </button>
                
                {/* Video Tag Badge */}
                <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>Video Tour • Facility Highlights</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Photo & Main Story Section */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Photo Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-cream-200 dark:bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1000&auto=format&fit=crop"
                alt="Children at Mahanaim NGO Miraj"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="font-bold text-lg">Mahanaim Children Sanctuary</p>
                  <p className="text-xs text-gray-300">Station Road, Miraj, Maharashtra</p>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-cream-200 dark:border-slate-700 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">12+ Years</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">Dedicated Service</p>
              </div>
            </div>
          </div>

          {/* Story & Introduction */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-brandRed-500/10 text-brandRed-600 dark:text-brandRed-400 text-xs font-bold uppercase tracking-wider">
              Our Journey & Heartbeat
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Transforming Lives with <span className="text-brandRed-500 dark:text-brandRed-400">Love & Dignity</span>
            </h2>

            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              Mahanaim NGO was established with a singular heartbeat: to ensure no child suffers the pain of abandonment or neglect. Located on Station Road in Miraj, Maharashtra, we shelter boys and girls, providing them with a secure home, wholesome meals, comprehensive healthcare, and formal schooling.
            </p>

            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              Beyond basic survival, we nurture every child's talent, build moral character, and instill self-confidence so they can grow into empowered, self-sufficient members of society.
            </p>
          </div>

        </div>
      </section>

      {/* 3. What We Do Section */}
      <section className="py-8 bg-transparent dark:bg-transparent border-y border-cream-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
            <div className="inline-block px-4 py-1 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
              Core Pillars
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              What We Do
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Every initiative at Mahanaim NGO is crafted to provide a safe, holistic environment for children in need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-cream-100/70 dark:bg-slate-800/60 p-6 rounded-3xl border border-cream-200 dark:border-slate-700/60 space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brandRed-500/10 text-brandRed-600 dark:text-brandRed-400 flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">24/7 Secure Shelter</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Safe, clean dormitory housing with dedicated housemothers and around-the-clock protection for all resident children.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-cream-100/70 dark:bg-slate-800/60 p-6 rounded-3xl border border-cream-200 dark:border-slate-700/60 space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nutritional Meals</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Three fresh, hot, nutrient-dense meals every single day, along with clean drinking water and healthy afternoon snacks.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-cream-100/70 dark:bg-slate-800/60 p-6 rounded-3xl border border-cream-200 dark:border-slate-700/60 space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quality Education</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Enrollment in local schools, daily after-school tutoring, textbooks, uniforms, school bags, and computer literacy classes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-cream-100/70 dark:bg-slate-800/60 p-6 rounded-3xl border border-cream-200 dark:border-slate-700/60 space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Healthcare & Counseling</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Regular medical checkups, routine vaccinations, dental care, and compassionate trauma-informed emotional counseling.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Vision & Mission Section */}
      <section className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-block px-4 py-1 rounded-full bg-brandTeal-600/10 text-brandTeal-700 dark:text-brandTeal-300 text-xs font-bold uppercase tracking-wider">
            Our Purpose & Guiding Star
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Our Vision & Our Mission
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Vision Card */}
          <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-900 dark:to-slate-800/80 p-8 sm:p-10 rounded-3xl border border-amber-200/60 dark:border-amber-500/20 shadow-md space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-14 h-14 rounded-2xl bg-gold-500 text-white flex items-center justify-center shadow-lg">
              <Eye className="w-7 h-7" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Our Vision</h3>

            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              We envision a society where no child is left helpless, uneducated, or unloved. We believe charity is not a mere temporary relief, but a lifetime investment into creating self-sufficient, confident, and compassionate adults who uplift their communities.
            </p>

            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 pt-2 font-medium">
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
                Zero child abandonment in our region
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
                100% high school graduation & vocational readiness
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
                Lifelong emotional and social mentorship
              </li>
            </ul>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-white to-rose-50/50 dark:from-slate-900 dark:to-slate-800/80 p-8 sm:p-10 rounded-3xl border border-rose-200/60 dark:border-rose-500/20 shadow-md space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brandRed-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-brandRed-500 text-white flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Our Mission</h3>

            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              To provide immediate sanctuary, psychological healing, wholesome nutrition, and quality education for orphaned, abandoned, and vulnerable youth. We are committed to complete financial transparency and grassroots community empowerment.
            </p>

            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 pt-2 font-medium">
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-brandRed-500" />
                Provide safe 24/7 care and family atmosphere
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-brandRed-500" />
                Nurture mental health and moral values
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-brandRed-500" />
                100% transparent donor accounting
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. Statistics Banner (Hide redundant About Us button since we are on the About page) */}
      <StatCounters hideAboutButton={true} />

      {/* 6. Call to Action Banner */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Be the Difference in a Child's Life Today
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Your generous support ensures that children in Miraj receive food, shelter, education, and a warm family environment.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/donate"
              className="bg-brandRed-500 hover:bg-brandRed-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-red-500/25 transition-all text-sm flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate Now</span>
            </Link>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-full border border-white/20 transition-all text-sm flex items-center gap-2"
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
