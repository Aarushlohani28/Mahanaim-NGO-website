"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  PlusCircle, Image as ImageIcon, Calendar, MapPin, Heart, LogOut, 
  CheckCircle2, RefreshCw, FileText, Trash2, Camera, Target, Layers,
  Users, Download, Search, Filter, ArrowUpDown, HeartHandshake,
  UserCheck, Clock, Edit3, Eye, Save, X, Phone, Mail, CheckCircle
} from "lucide-react";
import { 
  getEvents, addNGOEvent, deleteNGOEvent, NGOEvent,
  getCauses, addCause, deleteCause, CauseItem,
  getGallery, addGalleryItem, deleteGalleryItem, GalleryItem,
  getDonations, DonationRecord,
  getUsers, ClerkUserItem,
  getVolunteers, updateVolunteerAdmin, deleteVolunteer,
  Volunteer, VolunteerStatus, AVAILABLE_DAYS, AREAS_OF_INTEREST, VOLUNTEER_STATUSES
} from "@/lib/dataStore";
import imageCompression from "browser-image-compression";
import * as XLSX from "xlsx";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"causes" | "events" | "gallery" | "donations" | "users" | "volunteers">("causes");

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
  const [volunteersList, setVolunteersList] = useState<Volunteer[]>([]);

  // Filtering & Sorting State
  const [donationsSearch, setDonationsSearch] = useState("");
  const [donationsFilterStatus, setDonationsFilterStatus] = useState("All"); // All, Paid, pending, failed
  const [usersSearch, setUsersSearch] = useState("");

  // Volunteers Filtering & Modal State
  const [volunteersSearch, setVolunteersSearch] = useState("");
  const [volunteersFilterStatus, setVolunteersFilterStatus] = useState("PENDING");
  const [volunteersFilterDay, setVolunteersFilterDay] = useState("All");
  const [volunteersFilterInterest, setVolunteersFilterInterest] = useState("All");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [modalStatus, setModalStatus] = useState<VolunteerStatus>("PENDING");
  const [modalNotes, setModalNotes] = useState("");
  const [savingVolunteerNotes, setSavingVolunteerNotes] = useState(false);

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
      const [cList, eList, gList, dList, uList, vList] = await Promise.all([
        getCauses(),
        getEvents(),
        getGallery(),
        getDonations(token || ""),
        getUsers(token || ""),
        getVolunteers(token || ""),
      ]);
      setCausesList(cList);
      setEventsList(eList);
      setGalleryList(gList);
      setDonationsList(dList);
      setUsersList(uList);
      setVolunteersList(vList);
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

  // --- VOLUNTEERS HANDLERS ---
  const handleOpenVolunteerModal = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setModalStatus(volunteer.status);
    setModalNotes(volunteer.adminNotes || "");
  };

  const handleCloseVolunteerModal = () => {
    setSelectedVolunteer(null);
  };

  const handleSaveVolunteerModal = async () => {
    if (!selectedVolunteer) return;
    setSavingVolunteerNotes(true);
    const token = getAdminToken();
    try {
      const ok = await updateVolunteerAdmin(
        selectedVolunteer.id,
        { status: modalStatus, adminNotes: modalNotes },
        token || ""
      );
      if (ok) {
        setVolunteersList((prev) =>
          prev.map((v) =>
            v.id === selectedVolunteer.id
              ? { ...v, status: modalStatus, adminNotes: modalNotes, updatedAt: new Date().toISOString() }
              : v
          )
        );
        setSelectedVolunteer((prev) =>
          prev ? { ...prev, status: modalStatus, adminNotes: modalNotes } : null
        );
        setSuccessMsg("Volunteer application updated successfully.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        alert("Failed to update volunteer record. Please verify admin token.");
      }
    } catch (err) {
      console.error("Failed to update volunteer:", err);
    } finally {
      setSavingVolunteerNotes(false);
    }
  };

  const handleDeleteVolunteer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this volunteer application?")) return;
    const token = getAdminToken();
    try {
      const ok = await deleteVolunteer(id, token || "");
      if (ok) {
        setVolunteersList((prev) => prev.filter((v) => v.id !== id));
        if (selectedVolunteer?.id === id) setSelectedVolunteer(null);
        setSuccessMsg("Volunteer application deleted.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        alert("Failed to delete volunteer. Please verify admin credentials.");
      }
    } catch (err) {
      console.error("Failed to delete volunteer:", err);
    }
  };

  const handleMarkContacted = async (id: string) => {
    if (!window.confirm("Have you contacted this volunteer?")) return;
    const token = getAdminToken();
    try {
      const ok = await updateVolunteerAdmin(id, { status: "CONTACTED" }, token || "");
      if (ok) {
        setVolunteersList((prev) =>
          prev.map((v) => (v.id === id ? { ...v, status: "CONTACTED", updatedAt: new Date().toISOString() } : v))
        );
        setSuccessMsg("Volunteer marked as contacted.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        alert("Failed to update status. Please verify admin credentials.");
      }
    } catch (err) {
      console.error("Failed to mark contacted:", err);
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

          <button
            onClick={() => setActiveTab("volunteers")}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "volunteers"
                ? "bg-gold-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-cream-200 border border-cream-200"
            }`}
          >
            <HeartHandshake className="w-4 h-4" /> Volunteers ({volunteersList.length})
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

        {/* TAB 6: VOLUNTEERS */}
        {activeTab === "volunteers" && (() => {
          const filteredVolunteers = volunteersList.filter((vol) => {
            const matchesSearch =
              !volunteersSearch ||
              vol.name.toLowerCase().includes(volunteersSearch.toLowerCase()) ||
              vol.phone.toLowerCase().includes(volunteersSearch.toLowerCase()) ||
              vol.email.toLowerCase().includes(volunteersSearch.toLowerCase());

            const matchesStatus =
              volunteersFilterStatus === "All" || vol.status === volunteersFilterStatus;

            const matchesDay =
              volunteersFilterDay === "All" || vol.availableDays.includes(volunteersFilterDay);

            const matchesInterest =
              volunteersFilterInterest === "All" || vol.areasOfInterest.includes(volunteersFilterInterest);

            return matchesSearch && matchesStatus && matchesDay && matchesInterest;
          }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          const pendingCount = volunteersList.filter((v) => v.status === "PENDING").length;
          const approvedCount = volunteersList.filter((v) => v.status === "APPROVED").length;
          const contactedCount = volunteersList.filter((v) => v.status === "CONTACTED").length;

          const getStatusBadge = (status: VolunteerStatus) => {
            switch (status) {
              case "APPROVED":
                return "bg-emerald-100 text-emerald-800 border-emerald-200";
              case "PENDING":
                return "bg-amber-100 text-amber-800 border-amber-200";
              case "CONTACTED":
                return "bg-blue-100 text-blue-800 border-blue-200";
              case "REJECTED":
                return "bg-red-100 text-red-800 border-red-200";
              case "INACTIVE":
                return "bg-gray-100 text-gray-700 border-gray-200";
              default:
                return "bg-gray-100 text-gray-800 border-gray-200";
            }
          };

          return (
            <div className="space-y-6">
              {/* Top Volunteer Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Total Volunteers
                  </div>
                  <div className="text-3xl font-extrabold text-brandDark">
                    {volunteersList.length}
                  </div>
                </div>

                <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-sm">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Pending Review
                  </div>
                  <div className="text-3xl font-extrabold text-amber-800">
                    {pendingCount}
                  </div>
                </div>

                <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 shadow-sm">
                  <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Approved
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-800">
                    {approvedCount}
                  </div>
                </div>

                <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 shadow-sm">
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                    Contacted
                  </div>
                  <div className="text-3xl font-extrabold text-blue-800">
                    {contactedCount}
                  </div>
                </div>
              </div>

              {/* Main Table Card */}
              <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-6">
                
                {/* Search & Filter Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cream-200 pb-6">
                  <div>
                    <h3 className="font-bold text-xl text-brandDark">Volunteer Registrations</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Showing {filteredVolunteers.length} of {volunteersList.length} applications
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search name, phone, email..."
                        value={volunteersSearch}
                        onChange={(e) => setVolunteersSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-cream-50 border border-cream-300 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-gold-500 w-full sm:w-56 transition-all"
                      />
                    </div>

                    {/* Status Filter */}
                    <select
                      value={volunteersFilterStatus}
                      onChange={(e) => setVolunteersFilterStatus(e.target.value)}
                      className="px-3 py-2 bg-cream-50 border border-cream-300 rounded-full text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      <option value="All">All Statuses</option>
                      {VOLUNTEER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    {/* Available Day Filter */}
                    <select
                      value={volunteersFilterDay}
                      onChange={(e) => setVolunteersFilterDay(e.target.value)}
                      className="px-3 py-2 bg-cream-50 border border-cream-300 rounded-full text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      <option value="All">All Days</option>
                      {AVAILABLE_DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    {/* Area of Interest Filter */}
                    <select
                      value={volunteersFilterInterest}
                      onChange={(e) => setVolunteersFilterInterest(e.target.value)}
                      className="px-3 py-2 bg-cream-50 border border-cream-300 rounded-full text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold-500 max-w-[160px]"
                    >
                      <option value="All">All Interests</option>
                      {AREAS_OF_INTEREST.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>

                    {/* Export to Excel */}
                    <button
                      onClick={() => exportToExcel(filteredVolunteers, "Mahanaim_Volunteers")}
                      className="bg-gold-50 hover:bg-gold-100 text-gold-800 border border-gold-300 font-bold px-4 py-2 rounded-full text-xs flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Export Excel
                    </button>
                  </div>
                </div>

                {/* Volunteers Table */}
                {filteredVolunteers.length === 0 ? (
                  <div className="text-center py-16 bg-cream-50 rounded-2xl border border-dashed border-cream-300">
                    <HeartHandshake className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-base font-bold text-brandDark mb-1">No volunteer records found</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Try adjusting your search query or filter settings.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-cream-200 text-gray-400 font-semibold uppercase tracking-wider">
                          <th className="pb-3 px-3">Date</th>
                          <th className="pb-3 px-3">Volunteer</th>
                          <th className="pb-3 px-3">Contact</th>
                          <th className="pb-3 px-3">Available Days</th>
                          <th className="pb-3 px-3">Areas of Interest</th>
                          <th className="pb-3 px-3">Status</th>
                          <th className="pb-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-100">
                        {filteredVolunteers.map((vol) => (
                          <tr key={vol.id} className="hover:bg-cream-50/80 transition-colors">
                            <td className="py-3.5 px-3 text-gray-500 font-mono text-[11px]">
                              {new Date(vol.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="font-bold text-gray-900 text-sm">{vol.name}</div>
                              {vol.occupation && (
                                <div className="text-[11px] text-gray-500">{vol.occupation}</div>
                              )}
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="font-semibold text-gray-800">{vol.phone}</div>
                              {vol.email && (
                                <div className="text-[11px] text-gray-500 truncate max-w-[150px]">
                                  {vol.email}
                                </div>
                              )}
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {vol.availableDays.map((d) => (
                                  <span
                                    key={d}
                                    className="bg-cream-200 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                  >
                                    {d.slice(0, 3)}
                                  </span>
                                ))}
                              </div>
                              {vol.availabilityTime && (
                                <span className="text-[10px] text-gold-700 font-medium block mt-0.5">
                                  {vol.availabilityTime}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {vol.areasOfInterest.slice(0, 2).map((a) => (
                                  <span
                                    key={a}
                                    className="bg-brandTeal-50 text-brandTeal-700 border border-brandTeal-200 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                  >
                                    {a}
                                  </span>
                                ))}
                                {vol.areasOfInterest.length > 2 && (
                                  <span className="text-[10px] text-gray-400 font-semibold px-1 py-0.5">
                                    +{vol.areasOfInterest.length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                                  vol.status
                                )}`}
                              >
                                {vol.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenVolunteerModal(vol)}
                                  className="bg-gold-50 hover:bg-gold-100 text-gold-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-all border border-gold-200"
                                  title="View Volunteer Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Details</span>
                                </button>
                                {vol.status === "PENDING" && (
                                  <button
                                    onClick={() => handleMarkContacted(vol.id)}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-all border border-blue-200"
                                    title="Mark as Contacted"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Contacted</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteVolunteer(vol.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Volunteer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </div>

      {/* VOLUNTEER DETAIL MODAL */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden relative max-h-[90vh] flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-cream-100 p-6 border-b border-cream-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gold-500 text-white flex items-center justify-center font-bold">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    {selectedVolunteer.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Registered on {new Date(selectedVolunteer.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseVolunteerModal}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-cream-200 rounded-full transition-colors"
                aria-label="Close Volunteer Detail Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
              
              {/* 1. PERSONAL INFORMATION */}
              <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 space-y-3">
                <div className="font-bold text-gray-900 text-xs uppercase tracking-wider text-gold-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold-600" /> Personal Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Phone Number:</span>
                    <a
                      href={`tel:${selectedVolunteer.phone}`}
                      className="font-bold text-gray-900 text-sm hover:text-gold-600 flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedVolunteer.phone}
                    </a>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[11px]">Email Address:</span>
                    {selectedVolunteer.email ? (
                      <a
                        href={`mailto:${selectedVolunteer.email}`}
                        className="font-bold text-gray-900 text-sm hover:text-gold-600 flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        {selectedVolunteer.email}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-gray-400 block text-[11px]">Address / City:</span>
                    <span className="font-semibold text-gray-800 text-xs mt-0.5 block">
                      {selectedVolunteer.address}
                    </span>
                  </div>

                  {selectedVolunteer.occupation && (
                    <div>
                      <span className="text-gray-400 block text-[11px]">Profession / Occupation:</span>
                      <span className="font-bold text-gray-900">{selectedVolunteer.occupation}</span>
                    </div>
                  )}

                  {selectedVolunteer.skills && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 block text-[11px]">Skills &amp; Expertise:</span>
                      <span className="font-semibold text-gray-800">{selectedVolunteer.skills}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. AVAILABILITY & INTERESTS */}
              <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 space-y-3">
                <div className="font-bold text-gray-900 text-xs uppercase tracking-wider text-brandTeal-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brandTeal-600" /> Availability &amp; Preferences
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400 block text-[11px] mb-1">Available Days:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVolunteer.availableDays.map((d) => (
                        <span
                          key={d}
                          className="bg-white text-gray-800 border border-cream-300 text-xs font-bold px-3 py-1 rounded-full shadow-2xs"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-gray-400 block text-[11px] mb-1">Preferred Time Slot:</span>
                    <span className="bg-gold-100 text-gold-800 font-bold px-3 py-1 rounded-full text-xs inline-block">
                      {selectedVolunteer.availabilityTime || "Flexible"}
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-gray-400 block text-[11px] mb-1">Areas of Interest:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVolunteer.areasOfInterest.map((a) => (
                        <span
                          key={a}
                          className="bg-brandTeal-100 text-brandTeal-800 border border-brandTeal-200 text-xs font-bold px-3 py-1 rounded-full"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedVolunteer.message && (
                    <div className="pt-2 border-t border-cream-200">
                      <span className="text-gray-400 block text-[11px] mb-1">Reason / Note from Volunteer:</span>
                      <p className="bg-white p-3 rounded-xl border border-cream-200 text-gray-800 leading-relaxed italic">
                        &ldquo;{selectedVolunteer.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. ADMIN MANAGEMENT (STATUS & NOTES) */}
              <div className="bg-white p-5 rounded-2xl border-2 border-gold-400/40 shadow-sm space-y-4">
                <div className="font-bold text-gray-900 text-xs uppercase tracking-wider text-gold-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-gold-600" /> Admin Application Management
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    ID: {selectedVolunteer.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Application Status:
                    </label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value as VolunteerStatus)}
                      className="w-full px-4 py-2.5 bg-cream-50 border border-cream-300 rounded-2xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    >
                      {VOLUNTEER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 sm:pt-0">
                    <span className="text-[11px] text-gray-400 block">Contact Consent:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] border border-emerald-200 mt-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Consented to be contacted
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Internal Admin Notes &amp; Follow-up Logs:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add interview notes, call summary, or assigned team..."
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    className="w-full p-3 bg-cream-50 border border-cream-300 rounded-2xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  <button
                    onClick={handleCloseVolunteerModal}
                    className="px-5 py-2.5 rounded-full border border-cream-300 text-gray-700 hover:bg-cream-100 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveVolunteerModal}
                    disabled={savingVolunteerNotes}
                    className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingVolunteerNotes ? "Saving..." : "Save Status & Notes"}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

