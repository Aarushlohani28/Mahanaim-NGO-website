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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={350}
          gravity={0.15}
          colors={['#E11D48', '#0D9488', '#F59E0B', '#3B82F6', '#10B981']}
        />
      )}

      {/* Main Thank You Card */}
      <div className="w-full max-w-xl bg-card text-card-foreground rounded-3xl p-8 sm:p-12 shadow-2xl border border-border/80 text-center relative z-10 animate-scaleUp">
        
        {/* Floating Heart Icon Decoration */}
        <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
          <Heart className="w-10 h-10 fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20 inline-block">
              Contribution Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Thank You for Your Gift!
            </h1>
          </div>
          
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-normal">
            Your generous support brings <span className="font-bold text-primary">warmth</span>, <span className="font-bold text-amber-600 dark:text-amber-400">shelter</span>, and transformational hope to the orphaned children of Mahanaim Miraj NGO.
          </p>

          {(paymentId || orderId) && (
            <div className="bg-secondary/60 p-4 rounded-2xl border border-border flex flex-col gap-1 text-xs font-mono text-muted-foreground">
              {paymentId && <div>Payment Ref: <strong className="text-foreground">{paymentId}</strong></div>}
              {orderId && <div>Order ID: <strong className="text-foreground">{orderId}</strong></div>}
            </div>
          )}

          {/* Feedback Messages */}
          {emailSentSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>80G Receipt sent successfully! Please check your email inbox.</span>
            </div>
          )}

          {emailError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 p-3 rounded-2xl text-xs font-medium animate-fadeIn">
              {emailError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            
            {/* Button 1: Send Receipt to Email */}
            <button
              onClick={handleSendEmailReceipt}
              disabled={sendingEmail || emailSentSuccess}
              className={`w-full font-bold py-3.5 px-6 rounded-full shadow-sm flex items-center justify-center gap-2.5 text-xs sm:text-sm transition-all active:scale-95 ${
                emailSentSuccess
                  ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 cursor-default"
                  : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20"
              }`}
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Receipt...</span>
                </>
              ) : emailSentSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Email Receipt Sent ✓</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send 80G Receipt to My Email</span>
                </>
              )}
            </button>

            {/* Button 2: Download PDF */}
            <button
              onClick={handleDownloadReceipt}
              className="w-full bg-foreground text-background font-bold py-3.5 px-6 rounded-full shadow-sm flex items-center justify-center gap-2.5 text-xs sm:text-sm transition-all hover:opacity-90 active:scale-95"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>Download 80G Tax Receipt (PDF)</span>
            </button>

            {/* Button 3: Return Home */}
            <Link
              href="/"
              className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-3.5 px-6 rounded-full border border-border flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95"
            >
              <Home className="w-4 h-4 text-muted-foreground" />
              <span>Return to Home</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>

          </div>

        </div>
      </div>

    </div>
  );
}
