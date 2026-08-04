"use client";

import React, { useState, useEffect } from "react";
import { Heart, ShieldCheck, FileCheck, Phone, Mail, User, CreditCard, Sparkles, CheckCircle2, Lock, LogIn } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import RazorpayModal from "@/components/RazorpayModal";

export default function DonatePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrderData, setActiveOrderData] = useState<{
    donorName: string;
    email: string;
    phone: string;
    pan: string;
    amount: number;
    orderId: string;
  } | null>(null);

  const presets = [500, 1000, 2500, 5000, 10000];

  // Auto-populate donor information from Clerk User profile
  useEffect(() => {
    if (isSignedIn && user) {
      if (user.fullName) setDonorName(user.fullName);
      else if (user.firstName) setDonorName(user.firstName);

      if (user.primaryEmailAddress?.emailAddress) {
        setEmail(user.primaryEmailAddress.emailAddress);
      }

      if (user.primaryPhoneNumber?.phoneNumber) {
        setPhone(user.primaryPhoneNumber.phoneNumber);
      } else if (user.phoneNumbers && user.phoneNumbers.length > 0) {
        setPhone(user.phoneNumbers[0].phoneNumber);
      }
    }
  }, [isSignedIn, user]);

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const num = parseFloat(e.target.value);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // 1. COMPULSORY CHECK: Must be signed in via Google / Clerk
    if (!isSignedIn || !user) {
      setErrorMsg("Authentication Required: You must sign in with Google before making a donation.");
      openSignIn();
      return;
    }

    // 2. COMPULSORY CHECK: Must have a valid phone number
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg("Phone Number Required: Please enter a valid 10-digit phone number to receive your payment updates and 80G tax receipt.");
      return;
    }

    const finalAmt = customAmount ? parseFloat(customAmount) : amount;

    if (!finalAmt || finalAmt <= 0) {
      setErrorMsg("Please select or enter a valid donation amount.");
      return;
    }

    const finalName = donorName.trim() || user.fullName || user.firstName || "Generous Donor";
    const finalEmail = email.trim() || user.primaryEmailAddress?.emailAddress || "";

    setLoading(true);

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          donorName: finalName,
          email: finalEmail,
          phone: cleanPhone,
          pan,
          amount: finalAmt,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order creation failed");
      }

      // 3. Initialize REAL Razorpay Checkout
      const options = {
        key: data.key, // NEXT_PUBLIC_RAZORPAY_KEY_ID
        amount: data.amount * 100, // in paise
        currency: "INR",
        name: "Mahanaim Miraj NGO",
        description: "Donation for Orphaned Children",
        image: "/logo.png",
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            await fetch("/api/donations/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                donorName: finalName,
                email: finalEmail,
                phone: cleanPhone,
                pan,
                amount: data.amount,
              }),
            });
          } catch (confirmErr) {
            console.warn("Failed to confirm donation status:", confirmErr);
          }

          // Redirect to Thank You page
          window.location.href = `/thank-you?payment_id=${response.razorpay_payment_id}&order_id=${data.orderId}`;
        },
        prefill: {
          name: finalName,
          email: finalEmail,
          contact: cleanPhone,
        },
        notes: {
          pan: pan || "N/A",
        },
        theme: {
          color: "#D9232D", // Brand Red
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMsg(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
      
    } catch (err: any) {
      console.error("Donation submit error:", err);
      setErrorMsg(err.message || "Failed to launch donation gateway. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream-100 py-12 md:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>Support Mahanaim Miraj NGO</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brandDark tracking-tight">
            Make an Impact <span className="text-gold-500">Today</span>
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Your generous contribution directly funds safe shelter, warm meals, healthcare, and schooling for abandoned children across Miraj.
          </p>
        </div>

        {/* Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Donation Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-cream-200 shadow-xl space-y-8">

            {/* Authentication Status Banner */}
            {isLoaded && (
              <div>
                {isSignedIn && user ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold block">Authenticated as {user.fullName || user.firstName}</span>
                        <span className="text-emerald-700">{user.primaryEmailAddress?.emailAddress}</span>
                      </div>
                    </div>
                    <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Verified User
                    </span>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="font-bold block">Sign-in Required</span>
                        <span className="text-amber-800">You must log in with Google before donating.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openSignIn()}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <LogIn className="w-4 h-4" /> Sign In with Google
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmitDonation} className="space-y-6">
              
              {/* Step 1: Select Amount */}
              <div className="space-y-3">
                <label className="block font-bold text-gray-900 text-sm">
                  1. Select Donation Amount (₹ INR)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectPreset(val)}
                      className={`py-3 rounded-2xl text-sm font-bold border transition-all ${
                        amount === val && !customAmount
                          ? "bg-brandRed-500 text-white border-brandRed-500 shadow-md scale-105"
                          : "bg-cream-50 text-gray-700 border-cream-300 hover:border-brandRed-500"
                      }`}
                    >
                      ₹{val.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                <div className="relative pt-2">
                  <span className="absolute inset-y-0 left-0 pl-4 top-2 flex items-center text-gray-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Or enter custom amount in ₹"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full pl-9 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Step 2: Donor Details */}
              <div className="space-y-4 pt-2">
                <label className="block font-bold text-gray-900 text-sm">
                  2. Donor Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="rajesh@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-800 block mb-1">
                      Phone Number (Compulsory) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gold-600 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-cream-50 border-2 border-gold-400/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Required for Razorpay payment verification & receipt pings.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">PAN Card (For 80G Tax Receipt)</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="ABCDE1234F"
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase())}
                        maxLength={10}
                        className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-4 bg-red-50 text-red-600 text-xs font-semibold rounded-2xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              {isSignedIn ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brandRed-500 hover:bg-brandRed-600 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-cardHover text-base transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  {loading ? "Initializing Razorpay UPI..." : `Donate ₹${(customAmount ? parseFloat(customAmount) || 0 : amount).toLocaleString("en-IN")} via Dynamic UPI`}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openSignIn()}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-full shadow-lg text-base transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In with Google to Donate
                </button>
              )}

            </form>
          </div>

          {/* Side Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 80G Tax Benefit Card */}
            <div className="bg-sage-600 text-white p-8 rounded-3xl shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">100% 80G Tax Benefit</h3>
              <p className="text-xs text-sage-100 leading-relaxed">
                Mahanaim Miraj NGO is registered under Section 80G of the Income Tax Act. 50% of your donation is eligible for tax deduction. An automated tax receipt will be issued to your email.
              </p>
              <ul className="space-y-2 text-xs font-medium pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" /> Instant Digital Receipt Generated
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-400" /> Valid for IT Return Filing in India
                </li>
              </ul>
            </div>

            {/* NGO Direct Contact Box */}
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gold-600 uppercase">
                <ShieldCheck className="w-4 h-4" /> Need assistance with donation?
              </div>
              <p className="text-xs text-gray-600">
                Contact our Mahanaim Miraj accounts team directly:
              </p>
              <div className="text-xs font-semibold text-gray-800 space-y-1">
                <div>📞 +91 98765 43210</div>
                <div>✉️ donate@mahanaimmiraj.org</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Razorpay UPI Modal */}
      {activeOrderData && (
        <RazorpayModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          donationData={activeOrderData}
        />
      )}
    </div>
  );
}
