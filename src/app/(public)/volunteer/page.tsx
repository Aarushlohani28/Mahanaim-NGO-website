"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, User, Phone, Mail, MapPin, Briefcase, Calendar, HeartHandshake, FileText, AlertCircle, Loader2 } from "lucide-react";
import { AVAILABLE_DAYS, AVAILABILITY_TIMES, AREAS_OF_INTEREST } from "@/lib/dataStore";

export default function VolunteerRegistrationPage() {
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
      <div className="min-h-[70vh] bg-cream-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-brandDark mb-4">
          Thank you for volunteering!
        </h1>
        <p className="text-gray-600 max-w-md mx-auto text-lg mb-8">
          Your application has been received. Our team will review your details and contact you soon regarding upcoming opportunities.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="bg-brandTeal-600 hover:bg-brandTeal-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 py-12 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-brandTeal-50 text-brandTeal-700 border border-brandTeal-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <HeartHandshake className="w-4 h-4" /> Become a Volunteer
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brandDark tracking-tight mb-6">
            Join Our Mission
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Your time and skills can make a profound difference in someone's life. Join the Mahanaim family and help us spread love and peace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Informational Sidebar (Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Volunteer?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4 text-gold-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Direct Impact</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Help feed, educate, and empower vulnerable communities directly.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brandTeal-100 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-brandTeal-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Grow Personally</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Develop new skills, gain experience, and build empathy.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Join a Community</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Meet like-minded individuals dedicated to social good.</p>
                  </div>
                </li>
              </ul>
              
              <hr className="my-6 border-cream-200" />
              
              <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
                <h4 className="font-bold text-brandDark text-sm mb-2">Have Questions?</h4>
                <p className="text-xs text-gray-600 mb-3">
                  If you need help or have questions about volunteering, please contact us.
                </p>
                <a href="tel:+919876543210" className="flex items-center gap-2 text-brandTeal-600 font-bold text-sm hover:text-brandTeal-800">
                  <Phone className="w-4 h-4" /> +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-cream-200 shadow-xl relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-cream-200 pb-4">
                Volunteer Application Form
              </h2>

              {errorMsg && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800">
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
                  <h3 className="text-sm font-bold text-brandTeal-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> 1. Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-cream-50/50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:border-brandTeal-500 focus:ring-1 focus:ring-brandTeal-500 transition-all"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-cream-50/50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:border-brandTeal-500 focus:ring-1 focus:ring-brandTeal-500 transition-all"
                          placeholder="e.g. +91 9876543210"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-cream-50/50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:border-brandTeal-500 focus:ring-1 focus:ring-brandTeal-500 transition-all"
                          placeholder="e.g. rahul@example.com"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Address / City <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <textarea
                          name="address"
                          required
                          rows={2}
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-cream-50/50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:border-brandTeal-500 focus:ring-1 focus:ring-brandTeal-500 transition-all resize-y min-h-[80px]"
                          placeholder="Provide your locality and city..."
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 2: Availability */}
                <section>
                  <h3 className="text-sm font-bold text-brandTeal-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> 2. Availability
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2.5">Available Days <span className="text-red-500">*</span></label>
                      <div className="flex flex-wrap gap-2.5">
                        {AVAILABLE_DAYS.map((day) => {
                          const isSelected = formData.availableDays.includes(day);
                          return (
                            <button
                              type="button"
                              key={day}
                              onClick={() => toggleArrayItem("availableDays", day)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                isSelected 
                                  ? "bg-brandTeal-600 border-brandTeal-600 text-white shadow-md" 
                                  : "bg-white border-cream-300 text-gray-600 hover:bg-cream-50 hover:border-brandTeal-300"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      {formData.availableDays.length === 0 && (
                        <p className="text-[11px] text-amber-600 font-medium mt-2">Please select at least one day.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2.5">Preferred Time Slot</label>
                      <select
                        name="availabilityTime"
                        value={formData.availabilityTime}
                        onChange={handleInputChange}
                        className="w-full md:w-64 px-4 py-3 bg-cream-50/50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:border-brandTeal-500 focus:ring-1 focus:ring-brandTeal-500 transition-all appearance-none cursor-pointer"
                      >
                        {AVAILABILITY_TIMES.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {/* SECTION 3: Interests */}
                <section>
                  <h3 className="text-sm font-bold text-brandTeal-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4" /> 3. Areas of Interest
                  </h3>
                  <label className="block text-xs font-bold text-gray-700 mb-3">What would you like to help with?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AREAS_OF_INTEREST.map((interest) => {
                      const isSelected = formData.areasOfInterest.includes(interest);
                      return (
                        <div
                          key={interest}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() => toggleArrayItem("areasOfInterest", interest)}
                          onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggleArrayItem("areasOfInterest", interest)}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                            isSelected 
                              ? "bg-brandTeal-50 border-brandTeal-400" 
                              : "bg-white border-cream-200 hover:border-brandTeal-200 hover:bg-cream-50/50"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? "bg-brandTeal-600 border-brandTeal-600" : "bg-white border-gray-300"
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? "text-brandTeal-900" : "text-gray-700"}`}>
                            {interest}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* SECTION 4: About You */}
                <section>
                  <h3 className="text-sm font-bold text-brandTeal-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> 4. About You (Optional)
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Occupation / Profession</label>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-cream-50/50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:border-brandTeal-500 focus:ring-1 focus:ring-brandTeal-500 transition-all"
                          placeholder="e.g. Teacher, Student, Doctor..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Special Skills</label>
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-cream-50/50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:border-brandTeal-500 focus:ring-1 focus:ring-brandTeal-500 transition-all"
                          placeholder="e.g. First aid, Fluency in local languages..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Why would you like to volunteer?</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 pointer-events-none">
                          <FileText className="h-4 w-4 text-gray-400" />
                        </div>
                        <textarea
                          name="message"
                          rows={3}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-cream-50/50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:border-brandTeal-500 focus:ring-1 focus:ring-brandTeal-500 transition-all resize-y"
                          placeholder="Share a brief message about your motivation..."
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION 5: Consent */}
                <section className="bg-cream-100/50 p-5 rounded-2xl border border-cream-200">
                  <label className="flex items-start gap-3 cursor-pointer select-none group">
                    <div className="mt-0.5">
                      <input
                        type="checkbox"
                        name="consentToContact"
                        required
                        checked={formData.consentToContact}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-gray-300 text-brandTeal-600 focus:ring-brandTeal-500 cursor-pointer accent-brandTeal-600"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 group-hover:text-brandTeal-700 transition-colors">
                        I agree to be contacted by Mahanaim NGO regarding volunteer opportunities. <span className="text-red-500">*</span>
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Your data will be kept secure and used only for volunteer management.
                      </p>
                    </div>
                  </label>
                </section>

                {/* Submit Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || formData.availableDays.length === 0 || !formData.consentToContact}
                    className="w-full md:w-auto bg-primary hover:bg-rose-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Volunteer Application
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
