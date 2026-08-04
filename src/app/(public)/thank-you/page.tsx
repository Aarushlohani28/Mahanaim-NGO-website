"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, Sparkles, Home, Mail, Download, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id") || "";
  const orderId = searchParams.get("order_id") || "";
  
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Email status state
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Stop confetti after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendEmailReceipt = async () => {
    if (!orderId && !paymentId) {
      setEmailError("No donation transaction ID found.");
      return;
    }

    setSendingEmail(true);
    setEmailError("");

    try {
      const res = await fetch("/api/donations/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId || paymentId,
          paymentId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send email");
      }

      setEmailSentSuccess(true);
    } catch (err: any) {
      console.error("Send email error:", err);
      setEmailError(err.message || "Failed to send email receipt.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!orderId && !paymentId) return;
    const targetOrderId = orderId || paymentId;
    window.open(`/api/donations/pdf-receipt?orderId=${encodeURIComponent(targetOrderId)}&paymentId=${encodeURIComponent(paymentId)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 via-white to-cream-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Confetti Explosion */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          colors={['#D9232D', '#0D9488', '#FBBF24', '#F472B6', '#10B981']}
        />
      )}

      {/* Main Card */}
      <div className="w-full max-w-xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-cream-200 text-center relative z-10 animate-scaleUp">
        
        {/* Floating Hearts Decoration */}
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-brandRed-100 rounded-full flex items-center justify-center animate-bounce shadow-sm delay-75">
          <Heart className="w-8 h-8 fill-brandRed-500 text-brandRed-500" />
        </div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center animate-bounce shadow-sm delay-150" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-6 h-6 text-gold-500" />
        </div>

        {/* Header Content */}
        <div className="space-y-6">
          
          <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center shadow-inner mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="w-10 h-10 fill-emerald-500 text-emerald-500" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Thank You!
          </h1>
          
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Your generosity brings <span className="font-bold text-brandRed-500">warmth</span>, <span className="font-bold text-gold-600">hope</span>, and transformational care to the children of Mahanaim Miraj NGO.
          </p>

          {(paymentId || orderId) && (
            <div className="bg-cream-50 py-3 px-5 rounded-2xl border border-cream-200 inline-flex flex-col gap-1 text-xs font-mono text-gray-500">
              {paymentId && <div>Payment ID: <strong className="text-gray-800">{paymentId}</strong></div>}
              {orderId && <div>Order ID: <strong className="text-gray-800">{orderId}</strong></div>}
            </div>
          )}

          {/* Feedback Toasts */}
          {emailSentSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Receipt sent successfully! Please check your email inbox and spam folder.</span>
            </div>
          )}

          {emailError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs font-medium animate-fadeIn">
              {emailError}
            </div>
          )}

          {/* 3 ACTION BUTTONS */}
          <div className="pt-6 space-y-3">
            
            {/* Button 1: Send Receipt on Email */}
            <button
              onClick={handleSendEmailReceipt}
              disabled={sendingEmail || emailSentSuccess}
              className={`w-full font-bold py-4 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-3 transition-all duration-200 ${
                emailSentSuccess
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default"
                  : "bg-brandTeal-600 hover:bg-brandTeal-700 text-white shadow-brandTeal-200 hover:-translate-y-0.5"
              }`}
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending Receipt...</span>
                </>
              ) : emailSentSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Email Receipt Sent ✓</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Send Receipt on Email</span>
                </>
              )}
            </button>

            {/* Button 2: Download Receipt */}
            <button
              onClick={handleDownloadReceipt}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5 text-gold-400" />
              <span>Download Receipt (PDF)</span>
            </button>

            {/* Button 3: Go Back Home */}
            <Link
              href="/"
              className="w-full bg-cream-100 hover:bg-cream-200 text-gray-800 font-bold py-4 px-6 rounded-2xl border border-cream-300 flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5 text-gray-600" />
              <span>Go Back Home</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}
