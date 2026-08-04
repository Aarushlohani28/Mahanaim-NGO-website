export interface CauseItem {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  imageURL: string;
  createdAt: string;
}

export interface NGOEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  imageUrl: string;
  category: string;
  raised: number;
  target: number;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  imageURL: string;
  hoverDescription: string;
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  userId: string;
  amount: number;
  orderId: string;
  paymentId?: string;
  status: "pending" | "Paid" | "failed";
  createdAt: string;
}

export interface ClerkUserItem {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

// Initial seed data
const INITIAL_CAUSES: CauseItem[] = [
  {
    id: "c1",
    title: "Repairing the Kupwad Slums Water Tank",
    description: "The primary drinking water tank for 40 families cracked last week. We need funds to install a 500L Sintex tank before summer hits.",
    raisedAmount: 45000,
    goalAmount: 60000,
    imageURL: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c2",
    title: "Weekend Meals for Station Children",
    description: "Funding Saturday and Sunday hot meals (Dal, Rice, Vegetables) for 25 runaway children living near Miraj Junction.",
    raisedAmount: 82000,
    goalAmount: 100000,
    imageURL: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c3",
    title: "Winter Jackets for Elderly in Sangli",
    description: "Purchasing heavy cotton jackets from the local wholesale market for 50 elderly residents sleeping on the streets.",
    raisedAmount: 120000,
    goalAmount: 150000,
    imageURL: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1000&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_EVENTS: NGOEvent[] = [
  {
    id: "evt-1",
    title: "Annual Blanket & Warmth Distribution Drive for Homeless",
    date: "15 DEC 2026",
    description: "Distributing 1,000+ high-quality woolen blankets and winter clothing to vulnerable homeless individuals across the city.",
    location: "Miraj City Circle & Railway Station Area",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    category: "Winter Drive",
    raised: 45000,
    target: 60000,
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-2",
    title: "Empowering Mothers & Daughters: Women's Day Celebration",
    date: "08 MAR 2026",
    description: "Providing hygiene kits, skill workshops, and educational scholarships to underprivileged women and young girls.",
    location: "Mahanaim Miraj Community Center",
    imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1000&auto=format&fit=crop",
    category: "Women Empowerment",
    raised: 82000,
    target: 100000,
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-3",
    title: "The Thirsty & Hungry are Waiting: Nutritional Meal Support",
    date: "EVERY WEEKEND",
    description: "Serving wholesome, nutritious home-cooked meals every Saturday and Sunday to orphaned children and street dwellers.",
    location: "Mahanaim Orphanage & Care Home",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop",
    category: "Food & Nutrition",
    raised: 120000,
    target: 150000,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    imageURL: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    hoverDescription: "Smiles at the Miraj Winter Blanket Distribution Drive 2026",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-2",
    imageURL: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1000&auto=format&fit=crop",
    hoverDescription: "After-school tutoring session for orphaned children in Sangli",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-3",
    imageURL: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop",
    hoverDescription: "Weekend community kitchen serving fresh warm meals",
    createdAt: new Date().toISOString(),
  },
  {
    id: "gal-4",
    imageURL: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
    hoverDescription: "Clean water tank installation drive at Kupwad Slums",
    createdAt: new Date().toISOString(),
  },
];

// Fallback in-memory stores
let localCausesStore: CauseItem[] = [...INITIAL_CAUSES];
let localEventsStore: NGOEvent[] = [...INITIAL_EVENTS];
let localGalleryStore: GalleryItem[] = [...INITIAL_GALLERY];
let localDonationsStore: DonationRecord[] = [];

/* --- CAUSES CRUD --- */
export async function getCauses(): Promise<CauseItem[]> {
  try {
    const res = await fetch("/api/causes", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.causes && data.causes.length > 0) return data.causes;
    }
  } catch (err) {
    console.warn("API /api/causes fetch error, fallback used:", err);
  }
  return localCausesStore;
}

export async function addCause(causeData: Omit<CauseItem, "id" | "createdAt">): Promise<CauseItem> {
  const newCause: CauseItem = {
    ...causeData,
    id: `cause-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch("/api/causes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(causeData),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.cause) {
        localCausesStore.unshift(data.cause);
        return data.cause;
      }
    }
  } catch (err) {
    console.warn("API /api/causes POST error, fallback used:", err);
  }

  localCausesStore.unshift(newCause);
  return newCause;
}

export async function deleteCause(id: string): Promise<boolean> {
  localCausesStore = localCausesStore.filter((c) => c.id !== id);
  try {
    const res = await fetch(`/api/causes?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.warn("API /api/causes DELETE error:", err);
    return true;
  }
}

/* --- EVENTS CRUD --- */
export async function getEvents(): Promise<NGOEvent[]> {
  try {
    const res = await fetch("/api/events", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.events && data.events.length > 0) return data.events;
    }
  } catch (err) {
    console.warn("API /api/events fetch error, fallback used:", err);
  }
  return localEventsStore;
}

export async function addNGOEvent(
  eventData: Omit<NGOEvent, "id" | "createdAt">,
  imageFile?: File | null
): Promise<NGOEvent> {
  const finalImageUrl = eventData.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop";

  const newEvent: NGOEvent = {
    ...eventData,
    id: `evt-${Date.now()}`,
    imageUrl: finalImageUrl,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...eventData, imageUrl: finalImageUrl }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.event) {
        localEventsStore.unshift(data.event);
        return data.event;
      }
    }
  } catch (err) {
    console.warn("API /api/events POST error, fallback used:", err);
  }

  localEventsStore.unshift(newEvent);
  return newEvent;
}

export async function deleteNGOEvent(id: string): Promise<boolean> {
  localEventsStore = localEventsStore.filter((e) => e.id !== id);
  try {
    const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.warn("API /api/events DELETE error:", err);
    return true;
  }
}

/* --- GALLERY CRUD --- */
export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch("/api/gallery", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.gallery && data.gallery.length > 0) return data.gallery;
    }
  } catch (err) {
    console.warn("API /api/gallery fetch error, fallback used:", err);
  }
  return localGalleryStore;
}

export async function addGalleryItem(itemData: Omit<GalleryItem, "id" | "createdAt">): Promise<GalleryItem> {
  const newItem: GalleryItem = {
    ...itemData,
    id: `gal-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.item) {
        localGalleryStore.unshift(data.item);
        return data.item;
      }
    }
  } catch (err) {
    console.warn("API /api/gallery POST error, fallback used:", err);
  }

  localGalleryStore.unshift(newItem);
  return newItem;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  localGalleryStore = localGalleryStore.filter((g) => g.id !== id);
  try {
    const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.warn("API /api/gallery DELETE error:", err);
    return true;
  }
}

/* --- DONATIONS --- */
export async function createDonationRecord(
  donationData: Omit<DonationRecord, "id" | "createdAt" | "status"> & { orderId: string }
): Promise<DonationRecord> {
  const newDonation: DonationRecord = {
    ...donationData,
    id: `don-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donationData),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.donation) {
        localDonationsStore.push(data.donation);
        return data.donation;
      }
    }
  } catch (err) {
    console.warn("API /api/donations POST error, saving locally:", err);
  }

  localDonationsStore.push(newDonation);
  return newDonation;
}

export async function updateDonationStatusByOrderId(
  orderId: string,
  paymentId: string,
  status: "Paid" | "failed"
): Promise<boolean> {
  const localIndex = localDonationsStore.findIndex((d) => d.orderId === orderId);
  if (localIndex !== -1) {
    localDonationsStore[localIndex].status = status;
    localDonationsStore[localIndex].paymentId = paymentId;
  }
  return true;
}

export async function getDonations(adminToken?: string): Promise<DonationRecord[]> {
  try {
    const headers: HeadersInit = adminToken
      ? { Authorization: `Bearer ${adminToken}` }
      : {};
    const res = await fetch("/api/donations", { cache: "no-store", headers });
    if (res.ok) {
      const data = await res.json();
      if (data.donations && data.donations.length > 0) return data.donations;
    }
  } catch (err) {
    console.warn("API /api/donations fetch error, fallback used:", err);
  }
  return localDonationsStore;
}

export async function getUsers(adminToken?: string): Promise<ClerkUserItem[]> {
  try {
    const headers: HeadersInit = adminToken
      ? { Authorization: `Bearer ${adminToken}` }
      : {};
    const res = await fetch("/api/users", { cache: "no-store", headers });
    if (res.ok) {
      const data = await res.json();
      if (data.users && data.users.length > 0) return data.users;
    }
  } catch (err) {
    console.warn("API /api/users fetch error, returning empty array:", err);
  }
  return [];
}
