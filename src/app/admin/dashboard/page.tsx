"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  PlusCircle, Image as ImageIcon, Calendar, MapPin, Heart, LogOut, 
  CheckCircle2, RefreshCw, FileText, Trash2, Camera, Target, Layers,
  Users, Download, Search, Filter, ArrowUpDown
} from "lucide-react";
import { 
  getEvents, addNGOEvent, deleteNGOEvent, NGOEvent,
  getCauses, addCause, deleteCause, CauseItem,
  getGallery, addGalleryItem, deleteGalleryItem, GalleryItem,
  getDonations, DonationRecord,
  getUsers, ClerkUserItem
} from "@/lib/dataStore";
import imageCompression from "browser-image-compression";
import * as XLSX from "xlsx";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"causes" | "events" | "gallery" | "donations" | "users">("causes");

  // Loading & Feedback
  const [loadingData, setLoadingData] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Data lists
  const [causesList, setCausesList] = useState<CauseItem[]>([]);
  const [eventsList, setEventsList] = useState<NGOEvent[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [donationsList, setDonationsList] = useState<DonationRecord[]>([]);
  const [usersList, setUsersList] = useState<ClerkUserItem[]>([]);

  // Filtering & Sorting State
  const [donationsSearch, setDonationsSearch] = useState("");
  const [donationsFilterStatus, setDonationsFilterStatus] = useState("All"); // All, Paid, pending, failed
  const [usersSearch, setUsersSearch] = useState("");

  // 1. Cause Form State
  const [causeTitle, setCauseTitle] = useState("");
  const [causeDesc, setCauseDesc] = useState("");
  const [causeGoal, setCauseGoal] = useState<number>(100000);
  const [causeRaised, setCauseRaised] = useState<number>(0);
  const [causeImageFile, setCauseImageFile] = useState<File | null>(null);

  // 2. Event Form State
  const [evtTitle, setEvtTitle] = useState("");
  const [evtDate, setEvtDate] = useState("");
  const [evtCategory, setEvtCategory] = useState("Winter Drive");
  const [evtLocation, setEvtLocation] = useState("Miraj City & Surrounding Areas");
  const [evtDesc, setEvtDesc] = useState("");
  const [evtTarget, setEvtTarget] = useState<number>(50000);
  const [evtImageFile, setEvtImageFile] = useState<File | null>(null);

  // 3. Gallery Form State
  const [galImageFile, setGalImageFile] = useState<File | null>(null);
  const [galHoverDesc, setGalHoverDesc] = useState("");


  const getAdminToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("mahanaim_admin_token") : null;

  useEffect(() => {
    // Auth Check
    const token = getAdminToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    const token = getAdminToken();
    try {
      const [cList, eList, gList, dList, uList] = await Promise.all([
        getCauses(),
        getEvents(),
        getGallery(),
        getDonations(token || ""),
        getUsers(token || ""),
      ]);
      setCausesList(cList);
      setEventsList(eList);
      setGalleryList(gList);
      setDonationsList(dList);
      setUsersList(uList);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeleteDonation = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction record?")) return;
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/donations?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDonationsList((prev) => prev.filter((d) => d.id !== id));
        setSuccessMsg("Transaction record deleted successfully.");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user account? This action is permanent.")) return;
    const token = getAdminToken();
    try {
      const res = await fetch(`/api/users?id=${encodeURIComponent(userId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsersList((prev) => prev.filter((u) => u.id !== userId));
        setSuccessMsg("User account deleted successfully.");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // --- UPLOAD HELPER (ImgBB + Compression) ---
  const uploadImageToImgBB = async (file: File): Promise<string> => {
    try {
      // 1. Compress Image (Max 2MB, Max 1920px width/height to save bandwidth)
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp", // Convert to WebP for massive performance gain
      };
      const compressedFile = await imageCompression(file, options);
      
      // 2. Upload to ImgBB
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error("Missing ImgBB API Key in .env.local (NEXT_PUBLIC_IMGBB_API_KEY)");
      }
      
      const formData = new FormData();
      formData.append("image", compressedFile);
      
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  // --- CRUD: CAUSES ---
  const handleCreateCause = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!causeTitle || !causeDesc || !causeImageFile) {
      alert("Please fill all fields and select an image.");
      return;
    }
    
    setPublishing(true);
    setSuccessMsg("");
    try {
      const uploadedUrl = await uploadImageToImgBB(causeImageFile);
      
      await addCause({
        title: causeTitle,
        description: causeDesc,
        goalAmount: Number(causeGoal) || 100000,
        raisedAmount: Number(causeRaised) || 0,
        imageURL: uploadedUrl,
      });
      setSuccessMsg("🎉 Cause successfully published!");
      setCauseTitle("");
      setCauseDesc("");
      setCauseImageFile(null);
      loadDashboardData();
    } catch (err: any) {
      console.error("Cause creation error:", err);
      alert(err.message || "Failed to upload image or create cause.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteCause = async (id: string) => {
    if (confirm("Are you sure you want to delete this cause?")) {
      await deleteCause(id);
      loadDashboardData();
    }
  };

  // --- CRUD: EVENTS ---
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle || !evtDate || !evtDesc || !evtImageFile) {
      alert("Please fill all fields and select an image.");
      return;
    }
    setPublishing(true);
    setSuccessMsg("");
    try {
      const uploadedUrl = await uploadImageToImgBB(evtImageFile);
      
      await addNGOEvent({
        title: evtTitle,
        date: evtDate,
        category: evtCategory,
        location: evtLocation,
        description: evtDesc,
        imageUrl: uploadedUrl,
        raised: 0,
        target: Number(evtTarget) || 50000,
      });
      setSuccessMsg("🎉 Drive/Event successfully published!");
      setEvtTitle("");
      setEvtDate("");
      setEvtDesc("");
      setEvtImageFile(null);
      loadDashboardData();
    } catch (err: any) {
      console.error("Event creation error:", err);
      alert(err.message || "Failed to upload image or create event.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event drive?")) {
      await deleteNGOEvent(id);
      loadDashboardData();
    }
  };

  // --- CRUD: GALLERY ---
  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galImageFile) {
      alert("Please select an image.");
      return;
    }
    setPublishing(true);
    setSuccessMsg("");
    try {
      const uploadedUrl = await uploadImageToImgBB(galImageFile);
      
      await addGalleryItem({
        imageURL: uploadedUrl,
        hoverDescription: galHoverDesc,
      });
      setSuccessMsg("🎉 Photo added to Gallery!");
      setGalImageFile(null);
      setGalHoverDesc("");
      loadDashboardData();
    } catch (err: any) {
      console.error("Gallery creation error:", err);
      alert(err.message || "Failed to upload image or add to gallery.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm("Are you sure you want to delete this photo from the gallery?")) {
      await deleteGalleryItem(id);
      loadDashboardData();
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mahanaim_admin_token");
    }
    router.push("/admin/login");
  };

  // --- EXPORT TO EXCEL ---
  const exportToExcel = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-cream-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Mahanaim NGO Official Logo"
                width={180}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">
                Staff Admin Portal
              </h1>
              <p className="text-xs text-brandTeal-600 font-semibold italic">
                Spread Love.... Spread Peace....
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="p-2.5 text-gray-600 hover:text-gold-600 bg-cream-100 hover:bg-cream-200 rounded-full transition-colors text-xs font-semibold flex items-center gap-1.5 px-4"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-5 py-2.5 rounded-full text-xs transition-colors flex items-center gap-2 border border-red-200"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 border-b border-cream-300 pb-4">
          <button
            onClick={() => setActiveTab("causes")}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "causes"
                ? "bg-gold-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-cream-200 border border-cream-200"
            }`}
          >
            <Target className="w-4 h-4" /> Causes ({causesList.length})
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "events"
                ? "bg-gold-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-cream-200 border border-cream-200"
            }`}
          >
            <Calendar className="w-4 h-4" /> Events & Drives ({eventsList.length})
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "gallery"
                ? "bg-gold-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-cream-200 border border-cream-200"
            }`}
          >
            <Camera className="w-4 h-4" /> Photo Gallery ({galleryList.length})
          </button>

          <button
            onClick={() => setActiveTab("donations")}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "donations"
                ? "bg-gold-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-cream-200 border border-cream-200"
            }`}
          >
            <FileText className="w-4 h-4" /> Transactions ({donationsList.length})
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "users"
                ? "bg-gold-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-cream-200 border border-cream-200"
            }`}
          >
            <Users className="w-4 h-4" /> Users ({usersList.length})
          </button>
        </div>

        {/* Global Success Feedback */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: CAUSES MANAGEMENT */}
        {activeTab === "causes" && (
          <div className="space-y-8">
            {/* Add Cause Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-lg max-w-3xl space-y-6">
              <h2 className="text-xl font-extrabold text-brandDark flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-gold-500" /> Create New NGO Cause
              </h2>
              <form onSubmit={handleCreateCause} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Cause Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Repairing Kupwad Slums Water Tank"
                    value={causeTitle}
                    onChange={(e) => setCauseTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Goal Amount (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      placeholder="100000"
                      value={causeGoal}
                      onChange={(e) => setCauseGoal(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Already Raised (₹ INR)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={causeRaised}
                      onChange={(e) => setCauseRaised(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Image Upload *</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setCauseImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the cause, urgency, and targeted impact..."
                    value={causeDesc}
                    onChange={(e) => setCauseDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={publishing}
                  className="bg-gold-500 hover:bg-gold-600 text-white font-bold py-3.5 px-8 rounded-full shadow text-sm transition-all"
                >
                  {publishing ? "Publishing..." : "Add Cause"}
                </button>
              </form>
            </div>

            {/* Existing Causes List */}
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-brandDark">Existing Causes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {causesList.map((c) => (
                  <div key={c.id} className="border border-cream-300 rounded-2xl p-4 bg-cream-50/50 space-y-3 relative group">
                    <div className="relative h-40 w-full rounded-xl overflow-hidden">
                      <Image src={c.imageURL} alt={c.title} fill className="object-cover" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base">{c.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{c.description}</p>
                    <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-cream-200">
                      <span>Raised: ₹{c.raisedAmount.toLocaleString("en-IN")}</span>
                      <span>Goal: ₹{c.goalAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCause(c.id)}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors border border-red-200 mt-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Cause
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTS MANAGEMENT */}
        {activeTab === "events" && (
          <div className="space-y-8">
            {/* Add Event Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-lg max-w-3xl space-y-6">
              <h2 className="text-xl font-extrabold text-brandDark flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-gold-500" /> Create New Community Event / Drive
              </h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Winter Blanket Distribution Drive 2026"
                    value={evtTitle}
                    onChange={(e) => setEvtTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Date *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15 DEC 2026"
                      value={evtDate}
                      onChange={(e) => setEvtDate(e.target.value)}
                      className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Miraj Railway Station"
                      value={evtLocation}
                      onChange={(e) => setEvtLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Target (₹ INR)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={evtTarget}
                      onChange={(e) => setEvtTarget(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Image Upload *</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setEvtImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detailed description of the drive..."
                    value={evtDesc}
                    onChange={(e) => setEvtDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={publishing}
                  className="bg-gold-500 hover:bg-gold-600 text-white font-bold py-3.5 px-8 rounded-full shadow text-sm transition-all"
                >
                  {publishing ? "Publishing..." : "Add Event Drive"}
                </button>
              </form>
            </div>

            {/* Existing Events List */}
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-brandDark">Existing Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventsList.map((evt) => (
                  <div key={evt.id} className="border border-cream-300 rounded-2xl p-4 bg-cream-50/50 space-y-3 relative">
                    <div className="relative h-40 w-full rounded-xl overflow-hidden">
                      <Image src={evt.imageUrl} alt={evt.title} fill className="object-cover" />
                    </div>
                    <div className="text-xs font-mono font-bold text-gold-600">{evt.date.toUpperCase()}</div>
                    <h4 className="font-bold text-gray-900 text-base">{evt.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{evt.description}</p>
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors border border-red-200 mt-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Event
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY MANAGEMENT */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            {/* Add Gallery Photo Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-lg max-w-3xl space-y-6">
              <h2 className="text-xl font-extrabold text-brandDark flex items-center gap-2">
                <Camera className="w-5 h-5 text-gold-500" /> Add Photo to Gallery
              </h2>
              <form onSubmit={handleCreateGallery} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Image Upload *</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setGalImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Hover Overlay Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Smiles at the Miraj Blanket Distribution Drive"
                    value={galHoverDesc}
                    onChange={(e) => setGalHoverDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={publishing}
                  className="bg-gold-500 hover:bg-gold-600 text-white font-bold py-3.5 px-8 rounded-full shadow text-sm transition-all"
                >
                  {publishing ? "Saving..." : "Add to Gallery"}
                </button>
              </form>
            </div>

            {/* Existing Gallery List */}
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-brandDark">Current Gallery Photos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {galleryList.map((g) => (
                  <div key={g.id} className="border border-cream-300 rounded-2xl p-3 bg-cream-50/50 space-y-2 relative group">
                    <div className="relative h-36 w-full rounded-xl overflow-hidden">
                      <Image src={g.imageURL} alt={g.hoverDescription} fill className="object-cover" />
                    </div>
                    <p className="text-xs text-gray-700 font-medium line-clamp-2">{g.hoverDescription || "No description"}</p>
                    <button
                      onClick={() => handleDeleteGallery(g.id)}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WEBHOOK TRANSACTIONS */}
        {activeTab === "donations" && (() => {
          const filteredDonations = donationsList.map(don => {
            const user = usersList.find(u => u.id === don.userId);
            return { ...don, user };
          }).filter(don => {
            const s = donationsSearch.toLowerCase().trim();
            const matchesSearch = 
              !s ||
              (don.user?.fullName && don.user.fullName.toLowerCase().includes(s)) ||
              (don.user?.email && don.user.email.toLowerCase().includes(s)) ||
              (don.orderId && don.orderId.toLowerCase().includes(s)) ||
              (don.paymentId && don.paymentId.toLowerCase().includes(s));
            const matchesStatus = donationsFilterStatus === "All" || don.status.toLowerCase() === donationsFilterStatus.toLowerCase();
            return Boolean(matchesSearch && matchesStatus);
          }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Always sort newest first

          // Custom export mapping to include user details
          const handleExportTransactions = () => {
            const exportData = filteredDonations.map(d => ({
              Date: new Date(d.createdAt).toLocaleString(),
              Name: d.user?.fullName || "Unknown",
              Email: d.user?.email || "N/A",
              Phone: d.user?.phone || "N/A",
              Amount: d.amount,
              Status: d.status,
              OrderID: d.orderId,
              PaymentID: d.paymentId || "N/A"
            }));
            exportToExcel(exportData, "Transactions");
          };

          return (
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream-200 pb-6">
                <div>
                  <h3 className="font-bold text-xl text-brandDark">Transactions & Donations</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Showing {filteredDonations.length} results</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input 
                      type="text"
                      placeholder="Search name, email, order ID..."
                      value={donationsSearch}
                      onChange={(e) => setDonationsSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-cream-50 border border-cream-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-gold-500 w-full md:w-64 transition-all"
                    />
                  </div>
                  
                  <div className="relative">
                    <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <select
                      value={donationsFilterStatus}
                      onChange={(e) => setDonationsFilterStatus(e.target.value)}
                      className="pl-9 pr-8 py-2 bg-cream-50 border border-cream-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-gold-500 appearance-none font-semibold cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExportTransactions}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-4 py-2 rounded-full text-xs flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Export Filtered
                  </button>
                </div>
              </div>

              {filteredDonations.length === 0 ? (
                <div className="text-center py-16 bg-cream-50 rounded-2xl border border-dashed border-cream-300">
                  <h3 className="text-lg font-bold text-brandDark mb-2">No transactions found.</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Try adjusting your search or filter settings.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-cream-200 text-gray-400 font-semibold uppercase tracking-wider">
                        <th className="pb-3 px-2">Date</th>
                        <th className="pb-3 px-2">Donor Details</th>
                        <th className="pb-3 px-2">Amount</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2">Order / Payment ID</th>
                        <th className="pb-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {filteredDonations.map((don) => (
                        <tr key={don.id} className="hover:bg-cream-50 transition-colors">
                          <td className="py-3 px-2 text-gray-500 font-mono text-[10px]">
                            {new Date(don.createdAt).toLocaleDateString()}<br/>
                            {new Date(don.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-2">
                            <div className="font-bold text-gray-900 text-sm">{don.user?.fullName || "Unknown Donor"}</div>
                            <div className="text-gray-500 text-[11px]">{don.user?.email || "No email"}</div>
                            {don.user?.phone && <div className="text-gray-400 text-[10px]">{don.user.phone}</div>}
                          </td>
                          <td className="py-3 px-2 font-extrabold text-gold-600 text-sm">
                            ₹{don.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${don.status.toLowerCase() === "paid" ? "bg-emerald-100 text-emerald-700" : don.status.toLowerCase() === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                              {don.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-mono text-[11px] text-gray-500">
                            <div className="font-semibold text-gray-700">Ord: {don.orderId}</div>
                            <div>Pay: {don.paymentId || "Pending Webhook"}</div>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => handleDeleteDonation(don.id)}
                              title="Delete Transaction"
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}

        {/* TAB 5: USERS */}
        {activeTab === "users" && (() => {
          const filteredUsers = usersList.filter(user => 
            user.fullName?.toLowerCase().includes(usersSearch.toLowerCase()) ||
            user.email?.toLowerCase().includes(usersSearch.toLowerCase())
          ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest first

          return (
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream-200 pb-6">
                <div>
                  <h3 className="font-bold text-xl text-brandDark">Registered Accounts</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Showing {filteredUsers.length} total users</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input 
                      type="text"
                      placeholder="Search by name or email..."
                      value={usersSearch}
                      onChange={(e) => setUsersSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-cream-50 border border-cream-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brandTeal-500 w-full md:w-64 transition-all"
                    />
                  </div>

                  <button
                    onClick={() => exportToExcel(filteredUsers, "Registered_Users")}
                    className="bg-brandTeal-50 hover:bg-brandTeal-100 text-brandTeal-700 border border-brandTeal-200 font-bold px-4 py-2 rounded-full text-xs flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Export Users
                  </button>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 bg-cream-50 rounded-2xl border border-dashed border-cream-300">
                  <h3 className="text-lg font-bold text-brandDark mb-2">No users found.</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-cream-200 text-gray-400 font-semibold uppercase tracking-wider">
                        <th className="pb-3 px-2">Account ID</th>
                        <th className="pb-3 px-2">Name</th>
                        <th className="pb-3 px-2">Email Address</th>
                        <th className="pb-3 px-2">Joined Date</th>
                        <th className="pb-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-brandTeal-50/30 transition-colors">
                          <td className="py-3 px-2 font-mono text-[10px] text-gray-400">{user.id}</td>
                          <td className="py-3 px-2 font-bold text-gray-900 text-sm">
                            {user.fullName || <span className="italic text-gray-400">Unnamed User</span>}
                          </td>
                          <td className="py-3 px-2 text-gray-700 font-medium">{user.email}</td>
                          <td className="py-3 px-2 text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete User Account"
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}

      </div>
    </div>
  );
}
