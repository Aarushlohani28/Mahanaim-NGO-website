"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, MapPin, Phone, ArrowUpRight, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111418] text-[#9CA3AF] pt-16 pb-12 border-t border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Column 1: Organization & Mission (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Mahanaim NGO Official Logo"
                width={200}
                height={55}
                className="h-11 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-teal-400 font-semibold italic tracking-wide">
              Spread Love.... Spread Peace....
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed font-normal">
              Mahanaim NGO is a registered non-profit organization in Miraj, Maharashtra dedicated to rescuing, sheltering, and nurturing abandoned children with 24/7 care, warm meals, healthcare, and education.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Registered & Operating 24/7 in Miraj</span>
            </div>
          </div>

          {/* Column 2: Quick Links (col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/#causes" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>Our Causes</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>Community Drives</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-white transition-colors flex items-center gap-1.5 text-rose-400 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>Online Donation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tax & 80G Legal Exemption (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tax & 80G Exemption</span>
            </h4>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5 text-xs text-zinc-300">
              <p className="font-bold text-white text-sm">
                50% Tax Exemption
              </p>
              <p className="leading-relaxed text-zinc-400">
                Donations to Mahanaim Miraj NGO are eligible for tax deduction under Section 80G of the Indian Income Tax Act.
              </p>
              <div className="pt-2 border-t border-white/10 font-mono text-[11px] text-teal-300">
                REG NO: MAH/MIR/NGO/80G-2014-98
              </div>
            </div>
          </div>

          {/* Column 4: Contact NGO (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Mahanaim Children&apos;s Sanctuary, Station Road, Miraj, Sangli District, Maharashtra - 416410
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <a href="mailto:contact@mahanaimmiraj.org" className="hover:text-white transition-colors">
                  contact@mahanaimmiraj.org
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 Mahanaim Miraj NGO. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy &amp; Terms
            </Link>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">
              About Our NGO
            </Link>
            <Link href="/donate" className="hover:text-zinc-300 transition-colors">
              80G Tax Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
