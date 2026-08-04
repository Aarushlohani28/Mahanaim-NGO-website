"use client";

import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Heart, CreditCard, Download, Mail, CheckCircle2, ShieldCheck, 
  Calendar, ArrowLeft, Loader2, FileText, Sparkles, LogIn 
} from "lucide-react";
import { DonationRecord } from "@/lib/dataStore";

export default function MyDonationsPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Email status per donation ID
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isSignedIn && user) {
      loadUserDonations();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, user]);

  const loadUserDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/donations/my-donations", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setDonations(data.donations || []);
      }
    } catch (err) {
      console.error("Failed to load user donations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (orderId: string, paymentId?: string) => {
    window.open(`/api/donations/pdf-receipt?orderId=${encodeURIComponent(orderId)}&paymentId=${encodeURIComponent(paymentId || "")}`, "_blank");
  };

  const handleSendEmail = async (orderId: string, paymentId?: string, amount?: number) => {
    setSendingEmailId(orderId);
    setEmailStatus((prev) => ({ ...prev, [orderId]: "" }));

    try {
      const res = await fetch("/api/donations/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentId: paymentId || `pay_${Date.now()}`,
          email: user?.primaryEmailAddress?.emailAddress,
          donorName: user?.fullName || user?.firstName || "Donor",
          amount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send email");
      }

      setEmailStatus((prev) => ({ ...prev, [orderId]: "Receipt Sent ✓" }));
    } catch (err: any) {
      setEmailStatus((prev) => ({ ...prev, [orderId]: err.message || "Failed" }));
    } finally {
      setSendingEmailId(null);
    }
  };

  // Calculate totals
  const totalDonated = donations
    .filter((d) => d.status.toLowerCase() === "paid")
    .reduce((sum, d) => sum + d.amount, 0);

  const successfulDonationsCount = donations.filter((d) => d.status.toLowerCase() === "paid").length;

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-brandRed-500 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading your donation history...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-cream-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-brandRed-50 rounded-full flex items-center justify-center mx-auto text-brandRed-500">
            <Heart className="w-8 h-8 fill-brandRed-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Donor Account Required</h2>
          <p className="text-gray-600 text-sm">
            Please sign in to view your donation history, total contribution summary, and download 80G tax receipts.
          </p>
          <button
            onClick={() => openSignIn()}
            className="w-full bg-brandRed-500 hover:bg-brandRed-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In / Sign Up</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-brandRed-500 transition-colors bg-white px-4 py-2 rounded-full border border-cream-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-brandRed-500 hover:bg-brandRed-600 px-5 py-2.5 rounded-full shadow-md transition-all"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Make a Donation</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brandRed-50 text-brandRed-600 text-xs font-bold rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Donor Impact Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Donations</h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, <strong className="text-gray-800">{user.fullName || user.firstName}</strong> ({user.primaryEmailAddress?.emailAddress}).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Summary Stat Card 1 */}
            <div className="bg-gradient-to-br from-brandRed-50 to-cream-100 border border-brandRed-200 p-5 rounded-2xl min-w-[200px]">
              <div className="text-xs font-bold text-brandRed-600 uppercase tracking-wider mb-1">Total Donated</div>
              <div className="text-3xl font-extrabold text-brandRed-600">
                ₹{totalDonated.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-gray-500 font-medium mt-1">Across {successfulDonationsCount} paid donation(s)</div>
            </div>

            {/* Summary Stat Card 2 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-2xl min-w-[200px]">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 80G Tax Benefits
              </div>
              <div className="text-xl font-bold text-emerald-800 mt-1">50% Deduction</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Eligible under Sec 80G</div>
            </div>
          </div>
        </div>

        {/* TABULAR BREAKDOWN TABLE */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-cream-200 pb-4">
            <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brandRed-500" />
              <span>Donation History & Breakdown</span>
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-cream-100 px-3 py-1 rounded-full">
              {donations.length} total records
            </span>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-16 bg-cream-50 rounded-2xl border border-dashed border-cream-200 space-y-3">
              <Heart className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">No donation records found.</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                You haven't made any donations yet. Your contributions help support orphaned children and community welfare.
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-brandRed-500 text-white font-bold text-xs py-2.5 px-6 rounded-full shadow-sm hover:bg-brandRed-600 transition-all mt-2"
              >
                Make Your First Donation
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-cream-200 text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Payment Ref</th>
                    <th className="pb-3 px-3">Amount</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions / Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {donations.map((don) => {
                    const isPaid = don.status.toLowerCase() === "paid";
                    return (
                      <tr key={don.id} className="hover:bg-cream-50 transition-colors">
                        <td className="py-4 px-3 text-gray-600 font-mono text-[11px]">
                          {new Date(don.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-3 font-mono font-semibold text-gray-800 text-[11px]">
                          {don.orderId}
                        </td>
                        <td className="py-4 px-3 font-mono text-gray-500 text-[11px]">
                          {don.paymentId || <span className="italic text-gray-400">Pending</span>}
                        </td>
                        <td className="py-4 px-3 font-extrabold text-brandRed-600 text-sm">
                          ₹{don.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 px-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-700"
                                : don.status.toLowerCase() === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {don.status}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Download PDF Button */}
                            <button
                              onClick={() => handleDownloadPDF(don.orderId, don.paymentId)}
                              title="Download PDF 80G Receipt"
                              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5 transition-all shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5 text-gold-400" />
                              <span>PDF</span>
                            </button>

                            {/* Email Receipt Button */}
                            <button
                              onClick={() => handleSendEmail(don.orderId, don.paymentId, don.amount)}
                              disabled={sendingEmailId === don.orderId}
                              title="Send Receipt to Email"
                              className="bg-brandTeal-50 hover:bg-brandTeal-100 text-brandTeal-700 border border-brandTeal-200 font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5 transition-all shadow-sm"
                            >
                              {sendingEmailId === don.orderId ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Mail className="w-3.5 h-3.5" />
                              )}
                              <span>Email</span>
                            </button>

                            {emailStatus[don.orderId] && (
                              <span className="text-[10px] font-bold text-emerald-600">
                                {emailStatus[don.orderId]}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
