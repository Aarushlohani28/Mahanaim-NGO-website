"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  HeartHandshake,
  FileText,
  AlertCircle,
  Loader2,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AVAILABLE_DAYS, AVAILABILITY_TIMES, AREAS_OF_INTEREST } from "@/lib/dataStore";
import { useTheme } from "@/components/ThemeProvider";

export default function VolunteerRegistrationPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    availableDays: [] as string[],
    availabilityTime: "Flexible",
    areasOfInterest: [] as string[],
    skills: "",
    occupation: "",
    message: "",
    consentToContact: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleArrayItem = (field: "availableDays" | "areasOfInterest", item: string) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter((i) => i !== item) };
      } else {
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application.");
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-[75vh] bg-background text-foreground flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
        <div className="bg-card text-card-foreground max-w-lg w-full p-8 sm:p-10 rounded-3xl border border-border shadow-apple space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Thank You for Volunteering!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Your application has been received. Our team will review your details and contact you soon regarding upcoming community programs in Miraj.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-primary hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-apple text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Return to Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setFormData({
                  name: "",
                  phone: "",
                  email: "",
                  address: "",
                  availableDays: [],
                  availabilityTime: "Flexible",
                  areasOfInterest: [],
                  skills: "",
                  occupation: "",
                  message: "",
                  consentToContact: false,
                });
              }}
              className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-3 px-6 rounded-full border border-border text-sm transition-all flex items-center justify-center"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-12 lg:py-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-secondary text-foreground border border-border px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              <HeartHandshake className="w-4 h-4 text-primary" />
              <span>Become a Volunteer</span>
            </div>

            {/* In-page Theme Toggle Button */}
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/80 hover:bg-secondary text-foreground border border-border transition-all shadow-sm active:scale-95"
                title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle theme on volunteer page"
              >
                {resolvedTheme === "dark" ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span className="hidden sm:inline">Dark Mode</span>
                  </>
                )}
              </button>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Join Our Mission
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed">
            Your time and skills make a profound difference in someone's life. Join the Mahanaim family and help us spread love and peace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Informational Sidebar (Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card text-card-foreground rounded-3xl p-6 md:p-8 border border-border shadow-apple sticky top-24 transition-colors">
              <h3 className="text-xl font-bold text-foreground mb-4">Why Volunteer?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Direct Impact</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Help feed, educate, and empower vulnerable communities directly.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Grow Personally</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Develop new skills, gain experience, and build empathy.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Join a Community</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Meet like-minded individuals dedicated to social good.</p>
                  </div>
                </li>
              </ul>
              
              <hr className="my-6 border-border" />
              
              <div className="bg-secondary/40 dark:bg-secondary/30 p-4 rounded-2xl border border-border space-y-2">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Have Questions?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you need help or have questions about volunteering, contact our team:
                </p>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2 text-primary font-bold text-xs sm:text-sm hover:underline pt-1"
                >
                  <Phone className="w-4 h-4" /> +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-8">
            <div className="bg-card text-card-foreground rounded-3xl p-6 md:p-10 border border-border shadow-apple relative overflow-hidden transition-colors">
              {/* Decorative subtle background aura */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  Volunteer Application Form
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Free Registration</span>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <h4 className="font-bold text-sm">Submission Error</h4>
                    <p className="text-xs mt-1">{errorMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* SECTION 1: Personal Information */}
                <section>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> 1. Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Phone Number <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="e.g. +91 9876543210"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-foreground mb-1.5">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="e.g. rahul@example.com"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-foreground mb-1.5">
                        Address / City <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 pointer-events-none">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <textarea
                          name="address"
                          required
                          rows={2}
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y min-h-[80px]"
                          placeholder="Provide your locality and city..."
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 2: Availability (Interactive Day Buttons) */}
                <section>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> 2. Availability
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="block text-xs font-bold text-foreground">
                          Available Days <span className="text-primary">*</span>
                        </label>
                        <span className="text-[11px] text-muted-foreground">
                          {formData.availableDays.length > 0
                            ? `${formData.availableDays.length} selected`
                            : "Select one or more"}
                        </span>
                      </div>

                      {/* Day selection pill buttons with dynamic dark/light theme */}
                      <div className="flex flex-wrap gap-2.5">
                        {AVAILABLE_DAYS.map((day) => {
                          const isSelected = formData.availableDays.includes(day);
                          return (
                            <button
                              type="button"
                              key={day}
                              onClick={() => toggleArrayItem("availableDays", day)}
                              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer select-none ${
                                isSelected 
                                  ? "bg-primary border-primary text-white shadow-apple transform scale-[1.02]" 
                                  : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border-border hover:border-primary/40"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      {formData.availableDays.length === 0 && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-2">
                          Please select at least one available day.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-2">Preferred Time Slot</label>
                      <select
                        name="availabilityTime"
                        value={formData.availabilityTime}
                        onChange={handleInputChange}
                        className="w-full md:w-64 px-4 py-3 bg-background border border-border text-foreground rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                      >
                        {AVAILABILITY_TIMES.map((time) => (
                          <option key={time} value={time} className="bg-card text-foreground">
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {/* SECTION 3: Areas of Interest (Interactive Option Buttons) */}
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4" /> 3. Areas of Interest
                    </h3>
                    <span className="text-[11px] text-muted-foreground">
                      {formData.areasOfInterest.length > 0 ? `${formData.areasOfInterest.length} selected` : "Select all that apply"}
                    </span>
                  </div>
                  <label className="block text-xs font-bold text-foreground mb-3">
                    What would you like to help with?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AREAS_OF_INTEREST.map((interest) => {
                      const isSelected = formData.areasOfInterest.includes(interest);
                      return (
                        <button
                          type="button"
                          key={interest}
                          role="checkbox"
                          aria-checked={isSelected}
                          onClick={() => toggleArrayItem("areasOfInterest", interest)}
                          className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none ${
                            isSelected 
                              ? "bg-primary/10 dark:bg-primary/15 border-primary text-foreground shadow-sm" 
                              : "bg-secondary/30 dark:bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/70 hover:border-primary/40"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? "bg-primary border-primary text-white" : "bg-background border-border"
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                            {interest}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* SECTION 4: About You */}
                <section>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> 4. About You (Optional)
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">Occupation / Profession</label>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="e.g. Teacher, Student, Doctor..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">Special Skills</label>
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="e.g. First aid, Social work, Teaching..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">Why would you like to volunteer?</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 pointer-events-none">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <textarea
                          name="message"
                          rows={3}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
                          placeholder="Share a brief message about your motivation..."
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 5: Consent */}
                <section className="bg-secondary/40 dark:bg-secondary/30 p-5 rounded-2xl border border-border">
                  <label className="flex items-start gap-3 cursor-pointer select-none group">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        name="consentToContact"
                        required
                        checked={formData.consentToContact}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        I agree to be contacted by Mahanaim NGO regarding volunteer opportunities. <span className="text-primary">*</span>
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your contact data is protected and used strictly for NGO volunteer coordination.
                      </p>
                    </div>
                  </label>
                </section>

                {/* Submit Action (Primary Themed Button) */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-muted-foreground text-center sm:text-left">
                    <span>Questions? Call </span>
                    <a href="tel:+919876543210" className="text-primary font-semibold hover:underline">
                      +91 98765 43210
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || formData.availableDays.length === 0 || !formData.consentToContact}
                    className="w-full sm:w-auto bg-primary hover:bg-rose-600 dark:hover:bg-rose-500 text-white font-bold py-4 px-10 rounded-full shadow-apple hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <span>Submit Volunteer Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
