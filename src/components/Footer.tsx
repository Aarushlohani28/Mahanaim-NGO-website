"use client";

import React from "react";
import Link from "next/link";
import { Heart, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-footerDark text-gray-300 pt-16 pb-8 border-t border-gray-800" style={{colorScheme: 'dark'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Column 1: About NGO */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Mahanaim NGO Official Logo"
                width={200}
                height={55}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-brandTeal-100 italic font-semibold">
              Spread Love.... Spread Peace....
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Mahanaim NGO is a registered non-profit organization dedicated to rescuing, sheltering, and nurturing abandoned children. We run community drives including winter blanket distribution, hunger relief, and women’s empowerment across Maharashtra.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gold-500">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-gold-500 transition-colors flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-500" /> Home Page
                </Link>
              </li>
              <li>
                <Link href="/#mission" className="hover:text-gold-500 transition-colors flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-500" /> Our Mission & Vision
                </Link>
              </li>
              <li>
                <Link href="/#causes" className="hover:text-gold-500 transition-colors flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-500" /> Featured Causes
                </Link>
              </li>
              <li>
                <Link href="/#events" className="hover:text-gold-500 transition-colors flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-500" /> Winter & Event Drives
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-gold-500 transition-colors flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-500" /> Automated UPI Donation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Mission & Transparency */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gold-500">
              Tax & Legal Information
            </h3>
            <div className="bg-gray-800/60 p-4 rounded-xl space-y-2 text-xs border border-gray-700/50">
              <p className="text-white font-semibold">100% Tax Benefit Under 80G</p>
              <p className="text-gray-400">
                All donations to Mahanaim Miraj NGO are tax exempt under Section 80G of the Indian Income Tax Act.
              </p>
              <p className="text-gold-400 font-mono text-[11px] pt-1">
                REG NO: MAH/MIR/NGO/80G-2014-98
              </p>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-gold-500">
              Contact NGO
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <span>Mahanaim Children’s Care Home, Station Road, Miraj, Sangli District, Maharashtra - 416410</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <span>+91 98765 43210 / +91 0233 221100</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span>contact@mahanaimmiraj.org</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Mahanaim Miraj NGO. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">80G Tax Exemption Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
