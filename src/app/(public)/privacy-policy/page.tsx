import React from "react";
import { ShieldCheck, Lock, FileText, HeartHandshake } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground py-14 sm:py-20 min-h-screen border-b border-border/60 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Legal &amp; Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Privacy &amp; <span className="text-primary italic font-serif font-normal">Data Protection</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Your trust and privacy are paramount to us. This policy outlines how Mahanaim Miraj NGO collects, utilizes, and safeguards your donor information.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-card text-card-foreground p-8 sm:p-12 rounded-3xl border border-border/80 shadow-sm space-y-8 leading-relaxed text-sm">
          
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-muted-foreground">
              When you make a donation, volunteer, or contact our organization, we collect essential information including your name, email address, phone number, and PAN card number (mandated by the Indian Income Tax Department for issuing Section 80G tax exemption receipts).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>2. How We Use Your Information</span>
            </h2>
            <p className="text-muted-foreground">
              Your data is used solely for processing charitable donations, delivering instant 80G tax certificates, and providing periodic impact reports about our community drives in Miraj, Maharashtra. We strictly never sell, rent, or trade your personal information with third-party marketers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>3. Payment Gateway &amp; Financial Security</span>
            </h2>
            <p className="text-muted-foreground">
              All electronic donations are processed through Razorpay, a PCI-DSS certified secure payment gateway. Mahanaim NGO never stores your UPI PIN, credit/debit card numbers, CVV, or net banking passwords on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>4. 80G Tax Exemption Compliance</span>
            </h2>
            <p className="text-muted-foreground">
              PAN details submitted during donation are securely stored in encrypted formats and reported to the Income Tax Department in compliance with official NGO regulatory guidelines.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-border/60">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              5. Contact &amp; Grievance Redressal
            </h2>
            <p className="text-muted-foreground">
              If you have any questions regarding your data, receipts, or privacy preferences, please contact our administrative desk:
            </p>
            <div className="bg-secondary/50 p-4 rounded-2xl border border-border/50 text-xs space-y-1 font-medium">
              <div><strong className="text-foreground">Official Email:</strong> privacy@mahanaimmiraj.org</div>
              <div><strong className="text-foreground">Support Helpline:</strong> +91 98765 43210</div>
              <div><strong className="text-foreground">Registered Address:</strong> Mahanaim Children Sanctuary, Station Road, Miraj, Sangli District, Maharashtra - 416410</div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
