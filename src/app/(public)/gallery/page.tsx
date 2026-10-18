"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getGallery, GalleryItem } from "@/lib/dataStore";
import { Camera, Heart, Sparkles } from "lucide-react";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await getGallery();
        setItems(data);
      } catch (err) {
        console.error("Error loading gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  return (
    <div className="bg-background text-foreground py-14 sm:py-20 min-h-screen border-b border-border/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
            <Camera className="w-4 h-4 text-primary" />
            <span>Mahanaim Miraj Photo Gallery</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Moments of <span className="text-primary italic font-serif font-normal">Hope &amp; Care</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
            Real stories from our winter blanket distribution drives, children&apos;s tutoring sessions, and daily community kitchen in Miraj, Maharashtra.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-secondary/40 rounded-3xl" />
            ))}
          </div>
        ) : (
          /* Responsive Gallery Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group relative overflow-hidden rounded-3xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all duration-500 aspect-[4/3] cursor-pointer"
              >
                {/* Image */}
                <Image
                  src={item.imageURL}
                  alt={item.hoverDescription || "Mahanaim Miraj NGO community drive"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Description slide-up card */}
                <div className="absolute inset-x-0 bottom-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider border border-white/20">
                    <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                    <span>Drive Memory</span>
                  </div>
                  <p className="text-white text-sm sm:text-base font-semibold leading-snug drop-shadow-md">
                    {item.hoverDescription || "Mahanaim Miraj Community Drive"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
