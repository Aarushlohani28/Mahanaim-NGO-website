import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-cream-100 py-12 md:py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-600 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>Legal & Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brandDark tracking-tight">
            Privacy <span className="text-gold-500">Policy</span>
          </h1>
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
            Your privacy is extremely important to us. This policy outlines how Mahanaim Miraj NGO collects, uses, and protects your personal information.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-cream-200 shadow-xl space-y-8 text-gray-700 leading-relaxed text-sm">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Information We Collect</h2>
            <p>
              When you make a donation, sign up as a volunteer, or contact us, we may collect personal information such as your name, email address, phone number, and PAN card number (required for 80G tax exemption receipts).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. How We Use Your Information</h2>
            <p>
              We use your information exclusively to processing donations, issuing tax receipts, and sending updates regarding our events and community drives. We do NOT sell, rent, or lease your personal information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Payment Security</h2>
            <p>
              We use Razorpay as our payment gateway for UPI and card transactions. Razorpay is a highly secure, PCI-DSS compliant platform. We do not store your UPI PIN, banking passwords, or full credit card numbers on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. 80G Tax Exemption Data</h2>
            <p>
              If you provide your PAN number for a tax receipt, we securely store it and transmit it only to the Income Tax Department of India for compliance purposes as mandated by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">5. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact our administrative team at:
              <br />
              <strong className="text-gray-900">Email:</strong> privacy@mahanaimmiraj.org
              <br />
              <strong className="text-gray-900">Phone:</strong> +91 98765 43210
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
