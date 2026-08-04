"use client";

import HeroSection from "@/components/HeroSection";
import StatCounters from "@/components/StatCounters";
import PopularCauses from "@/components/PopularCauses";
import ServicesGrid from "@/components/ServicesGrid";
import UpcomingEvents from "@/components/UpcomingEvents";
import ImpactCalloutBanner from "@/components/ImpactCalloutBanner";

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatCounters />
      <PopularCauses />
      <ServicesGrid />
      <UpcomingEvents />
      <ImpactCalloutBanner />
    </div>
  );
}
