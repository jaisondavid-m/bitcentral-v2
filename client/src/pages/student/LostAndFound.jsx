import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Shield,
  ShieldCheck,
  Tag,
  Phone,
  MessageCircle,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Camera,
  Image as ImageIcon,
  X,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Inbox,
  ArrowRight,
  RefreshCw,
  Trash2,
  Edit3,
  Lock,
  Eye,
  Check,
  Layers,
  CreditCard,
  Laptop,
  KeyRound,
  Wallet,
  BookOpen,
  Shirt,
  Backpack,
  Package,
  Building2,
  Home,
  UserCheck,
  Pin,
  Share2,
} from "lucide-react";
import { useAuth } from "@/context/StudentContext.jsx";
import {
  getLostFoundItems,
  getLostFoundItemById,
  createLostFoundItem,
  updateLostFoundItem,
  updateLostFoundStatus,
  deleteLostFoundItem,
  uploadLostFoundImage,
  submitItemClaim,
  updateClaimStatus,
  getMyLostFound,
} from "@/api/lostFound.js";
import {
  CAMPUS_LOCATIONS,
  ITEM_CATEGORIES,
  CUSTODY_OPTIONS,
  STATUS_LABELS,
} from "@/data/campusLocations.js";

// Helper to get category icon component
function getCategoryIcon(catId) {
  switch (catId) {
    case "id_card":
      return CreditCard;
    case "electronics":
      return Laptop;
    case "keys_cycles":
      return KeyRound;
    case "wallet_money":
      return Wallet;
    case "documents":
      return BookOpen;
    case "clothing":
      return Shirt;
    case "accessories":
      return Backpack;
    default:
      return Package;
  }
}

// Relative time formatting
function formatRelative(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export default function LostAndFound() {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation tabs: 'feed' | 'report' | 'my'
  const activeTabParam = searchParams.get("tab") || "feed";
  const [activeTab, setActiveTab] = useState(activeTabParam);

  // Feed Filter States
  const [itemTypeFilter, setItemTypeFilter] = useState("all"); // 'all' | 'lost' | 'found'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  // Data States
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [myItems, setMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loadingMy, setLoadingMy] = useState(false);

  // Modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [activeItemForClaim, setActiveItemForClaim] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync tab with URL
  useEffect(() => {
    if (activeTabParam && activeTabParam !== activeTab) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Feed Items
  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLostFoundItems({
        type: itemTypeFilter,
        category: selectedCategory,
        location: selectedLocation,
        status: statusFilter,
        q: searchQuery,
      });
      if (res?.success && Array.isArray(res?.data)) {
        setItems(res.data);
        setTotalCount(res.total || res.data.length);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [itemTypeFilter, selectedCategory, selectedLocation, statusFilter, searchQuery]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Fetch My Items & Claims
  const fetchMyData = useCallback(async () => {
    setLoadingMy(true);
    try {
      const res = await getMyLostFound();
      if (res?.success) {
        setMyItems(res.my_items || []);
        setMyClaims(res.my_claims || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMy(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "my") {
      fetchMyData();
    }
  }, [activeTab, fetchMyData]);

  // Check URL if single item requested (e.g. from notification link `/lost-found?id=123`)
  const requestedId = searchParams.get("id");
  useEffect(() => {
    if (requestedId && items.length > 0) {
      const el = document.getElementById(`item-${requestedId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-4", "ring-blue-500", "ring-offset-2");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-blue-500", "ring-offset-2");
        }, 3000);
      }
    }
  }, [requestedId, items]);

  // Handle Mark as Returned / Claimed
  const handleToggleStatus = async (item, newStatus) => {
    try {
      const res = await updateLostFoundStatus(item.id, newStatus);
      if (res?.success) {
        showToast(`Item marked as ${newStatus}! 🎉`);
        fetchFeed();
        if (activeTab === "my") fetchMyData();
      } else {
        showToast(res?.message || "Failed to update status", "error");
      }
    } catch (e) {
      showToast("Error updating status", "error");
    }
  };

  // Handle Delete
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await deleteLostFoundItem(id);
      if (res?.success) {
        showToast("Listing deleted successfully");
        fetchFeed();
        if (activeTab === "my") fetchMyData();
      } else {
        showToast(res?.message || "Failed to delete", "error");
      }
    } catch (e) {
      showToast("Error deleting item", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-18 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3 shadow-xl backdrop-blur-xl border ${
              toastMessage.type === "error"
                ? "bg-rose-500/90 text-white border-rose-400"
                : "bg-emerald-600/90 text-white border-emerald-400"
            }`}
          >
            {toastMessage.type === "error" ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
            <span className="text-sm font-semibold">{toastMessage.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 px-4 pt-10 pb-16 text-white shadow-xl md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(120,180,255,0.25),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.25),transparent)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/20 text-blue-100 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>BIT-CENTRAL Campus Community</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
                Campus Lost & Found Hub
              </h1>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-blue-100/90 leading-relaxed">
                A unified campus platform to report, search, and recover lost student ID cards, keys, gadgets, and personal belongings across BIT Sathy.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowReportModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg hover:bg-blue-50 active:scale-98 transition-all"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Report Lost or Found</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/20 pb-1">
            <button
              onClick={() => handleTabChange("feed")}
              className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-bold transition-all border-b-2 ${
                activeTab === "feed"
                  ? "border-white bg-white/15 text-white backdrop-blur-md"
                  : "border-transparent text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Inbox className="h-4 w-4" />
              <span>Campus Feed ({totalCount})</span>
            </button>

            <button
              onClick={() => handleTabChange("my")}
              className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-bold transition-all border-b-2 ${
                activeTab === "my"
                  ? "border-white bg-white/15 text-white backdrop-blur-md"
                  : "border-transparent text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>My Listings & Claims</span>
              {myItems.length > 0 && (
                <span className="rounded-full bg-blue-500/80 px-2 py-0.5 text-xs text-white">
                  {myItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 -mt-6">
        {activeTab === "feed" ? (
          <div>
            {/* Search & Filter Controls Bar */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 mb-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by item name, roll number, or landmark (e.g. 'Casio fx-991', '7376222', 'SF Block')..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs md:text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:focus:bg-slate-800"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Type Filter Buttons */}
                  <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
                    {[
                      { key: "all", label: "All" },
                      { key: "lost", label: "🔍 Lost" },
                      { key: "found", label: "🎁 Found" },
                    ].map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setItemTypeFilter(t.key)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          itemTypeFilter === t.key
                            ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-white"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Location Selector */}
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id === "all" ? "all" : loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>

                  {/* Status Selector */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <option value="active">Active Only</option>
                    <option value="all">All Statuses</option>
                    <option value="claimed">Claimed & Returned</option>
                    <option value="handed_over">At Security / Admin</option>
                  </select>

                  {/* Refresh */}
                  <button
                    onClick={fetchFeed}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
                    title="Refresh feed"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Category Filter Chips Carousel */}
              <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
                {ITEM_CATEGORIES.map((cat) => {
                  const Icon = getCategoryIcon(cat.id);
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item Grid Feed */}
            {loading && items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                  Scanning campus listings...
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 py-20 px-4 text-center dark:border-slate-800 dark:bg-slate-900/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Inbox className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
                  No listings found
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  {searchQuery || selectedCategory !== "all" || selectedLocation !== "all"
                    ? "Try adjusting your search filters or check back later."
                    : "Be the first to report a lost or found item to help your campus peers."}
                </p>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowReportModal(true);
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Report an Item</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    user={user}
                    onOpenClaim={(itm) => {
                      setActiveItemForClaim(itm);
                      setShowClaimModal(true);
                    }}
                    onImageClick={(imgUrl) => setLightboxImage(imgUrl)}
                    onToggleStatus={handleToggleStatus}
                    onEdit={(itm) => {
                      setEditingItem(itm);
                      setShowReportModal(true);
                    }}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* My Listings & Claims Tab */
          <div className="space-y-8">
            {/* My Items Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Items You Reported ({myItems.length})
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage your lost/found listings and review claims submitted by classmates.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowReportModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Report New</span>
                </button>
              </div>

              {loadingMy ? (
                <div className="py-10 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                </div>
              ) : myItems.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-semibold text-slate-500">
                    You have not posted any lost or found items yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {myItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      user={user}
                      isMyView={true}
                      onImageClick={(imgUrl) => setLightboxImage(imgUrl)}
                      onToggleStatus={handleToggleStatus}
                      onEdit={(itm) => {
                        setEditingItem(itm);
                        setShowReportModal(true);
                      }}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* My Claims Section */}
            <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
              <div className="mb-4">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Claims You Submitted ({myClaims.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track the status of your recovery claims on found items.
                </p>
              </div>

              {myClaims.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-semibold text-slate-500">
                    You have not submitted any claims yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${
                              claim.item_type === "found"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            }`}
                          >
                            {claim.item_type}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {claim.item_title}
                          </h4>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                          Proof provided: {claim.proof_description}
                        </p>
                        <span className="mt-1 block text-[10px] text-slate-400">
                          Submitted on {new Date(claim.created_at).toLocaleDateString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-xl px-3 py-1 text-xs font-bold ${
                            claim.status === "approved"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : claim.status === "rejected"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          Status: {claim.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <ReportItemModal
            itemToEdit={editingItem}
            onClose={() => setShowReportModal(false)}
            onSuccess={(msg) => {
              setShowReportModal(false);
              showToast(msg || "Item saved successfully! 🎉");
              fetchFeed();
              if (activeTab === "my") fetchMyData();
            }}
          />
        )}
      </AnimatePresence>

      {/* Claim Modal */}
      <AnimatePresence>
        {showClaimModal && activeItemForClaim && (
          <ClaimItemModal
            item={activeItemForClaim}
            onClose={() => {
              setShowClaimModal(false);
              setActiveItemForClaim(null);
            }}
            onSuccess={(msg) => {
              setShowClaimModal(false);
              setActiveItemForClaim(null);
              showToast(msg || "Claim submitted! The finder has been notified.", "success");
              fetchFeed();
            }}
          />
        )}
      </AnimatePresence>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt="Enlarged item preview"
                className="max-h-[85vh] w-auto object-contain rounded-2xl"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================
   ITEM CARD COMPONENT
   ========================================================================= */
function ItemCard({
  item,
  user,
  isMyView = false,
  onOpenClaim,
  onImageClick,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  const isLost = item.item_type === "lost";
  const isResolved = item.status === "claimed" || item.status === "closed";
  const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.active;
  const CategoryIcon = getCategoryIcon(item.category);

  // WhatsApp helper link
  const cleanPhone = (item.contact_phone || "").replace(/\D/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
        `Hi! Regarding the ${item.item_type.toUpperCase()} item "${item.title}" posted on BIT-CENTRAL:`
      )}`
    : null;

  return (
    <motion.div
      id={`item-${item.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative flex flex-col justify-between rounded-3xl border transition-all duration-300 ${
        item.is_pinned
          ? "border-amber-300/80 bg-amber-50/30 dark:border-amber-900/60 dark:bg-amber-950/10 shadow-lg shadow-amber-500/5"
          : "border-slate-200/90 bg-white shadow-sm hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div>
        {/* Card Header & Media Container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800/80">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              onClick={() => onImageClick(item.images[0])}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-4">
              <CategoryIcon className="h-12 w-12 stroke-[1.5]" />
              <span className="mt-1 text-[11px] font-semibold text-slate-400">
                No photo attached
              </span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                isLost
                  ? "bg-rose-500 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {isLost ? "🔍 LOST" : "🎁 FOUND"}
            </span>

            {item.is_pinned && (
              <span className="inline-flex items-center gap-1 rounded-xl bg-amber-400 px-2 py-1 text-[10px] font-black text-amber-950 shadow-md">
                <Pin className="h-3 w-3 fill-current" />
                PINNED
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold border shadow-md backdrop-blur-md ${statusInfo.bg}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Photos count indicator */}
          {item.images && item.images.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
              +{item.images.length - 1} more
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Category & ID Fast Match */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <CategoryIcon className="h-3 w-3" />
              {item.category.replace("_", " ").toUpperCase()}
            </span>

            {item.matched_roll_number && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <CreditCard className="h-3 w-3" />
                Roll: {item.matched_roll_number}
              </span>
            )}
          </div>

          <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>

          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Location & Time Chips */}
          <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="font-semibold truncate">
                {item.location_campus}
                {item.location_details ? ` (${item.location_details})` : ""}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {item.date_occurred} {item.time_occurred ? `• ${item.time_occurred}` : ""}
              </span>
              <span>{formatRelative(item.created_at)}</span>
            </div>
          </div>

          {/* Current Custody / Where it is kept */}
          {!isLost && (
            <div className="mt-3 rounded-2xl bg-blue-50/70 p-2.5 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>
                  {item.current_custody === "main_security_gate"
                    ? "Safe at Main Security Gate"
                    : item.current_custody === "dept_office"
                    ? "At Department Office"
                    : item.current_custody === "hostel_warden"
                    ? "With Hostel Warden"
                    : "Safe with Finder"}
                </span>
              </div>
              {item.custody_details && (
                <p className="mt-0.5 text-[11px] text-blue-700/80 dark:text-blue-400/80">
                  {item.custody_details}
                </p>
              )}
            </div>
          )}

          {/* Posted By Details */}
          <div className="mt-3 flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
            <span className="truncate">
              Posted by <b className="text-slate-700 dark:text-slate-300">{item.user_name}</b>
              {item.user_roll_no ? ` (${item.user_roll_no})` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 sm:p-5 pt-0">
        {item.is_my_item ? (
          /* Owner Controls */
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {item.status === "active" ? (
              <button
                onClick={() => onToggleStatus(item, "claimed")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 px-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition active:scale-98"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Mark Recovered</span>
              </button>
            ) : (
              <button
                onClick={() => onToggleStatus(item, "active")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-200 py-2 px-3 text-xs font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 transition"
              >
                <span>Reactivate</span>
              </button>
            )}

            <button
              onClick={() => onEdit(item)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              title="Edit listing"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/40 transition"
              title="Delete listing"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          /* Student Peer Actions */
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Claim button if active & allowed */}
            {!isResolved && item.allow_inapp_claim && (
              <button
                onClick={() => onOpenClaim(item)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 px-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-98"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Claim This Item</span>
              </button>
            )}

            {/* Direct WhatsApp / Phone Contact */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500 py-2.5 px-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition"
                title="Message on WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            {item.contact_phone && !whatsappUrl && (
              <a
                href={`tel:${item.contact_phone}`}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-100 py-2.5 px-3 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition"
                title="Call finder"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* =========================================================================
   REPORT ITEM MODAL (NEW & EDIT)
   ========================================================================= */
function ReportItemModal({ itemToEdit, onClose, onSuccess }) {
  const { user } = useAuth();
  const isEditing = Boolean(itemToEdit?.id);

  const [itemType, setItemType] = useState(itemToEdit?.item_type || "lost");
  const [title, setTitle] = useState(itemToEdit?.title || "");
  const [category, setCategory] = useState(itemToEdit?.category || "id_card");
  const [description, setDescription] = useState(itemToEdit?.description || "");
  const [locationCampus, setLocationCampus] = useState(
    itemToEdit?.location_campus || "Main Block (AS Block)"
  );
  const [locationDetails, setLocationDetails] = useState(
    itemToEdit?.location_details || ""
  );
  const [dateOccurred, setDateOccurred] = useState(
    itemToEdit?.date_occurred || new Date().toISOString().split("T")[0]
  );
  const [timeOccurred, setTimeOccurred] = useState(
    itemToEdit?.time_occurred || ""
  );
  const [images, setImages] = useState(itemToEdit?.images || []);
  const [matchedRollNumber, setMatchedRollNumber] = useState(
    itemToEdit?.matched_roll_number || ""
  );
  const [currentCustody, setCurrentCustody] = useState(
    itemToEdit?.current_custody || "with_finder"
  );
  const [custodyDetails, setCustodyDetails] = useState(
    itemToEdit?.custody_details || ""
  );
  const [secretQuestion, setSecretQuestion] = useState(
    itemToEdit?.secret_question || ""
  );
  const [contactPhone, setContactPhone] = useState(
    itemToEdit?.contact_phone || user?.phone || ""
  );
  const [showPhone, setShowPhone] = useState(
    itemToEdit?.show_phone !== undefined ? itemToEdit.show_phone : true
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle Photo Upload
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 4) {
      setErrorMsg("Maximum 4 images allowed per item.");
      return;
    }

    setUploadingImage(true);
    setErrorMsg("");
    try {
      const res = await uploadLostFoundImage(file);
      if (res?.success && res?.url) {
        setImages((prev) => [...prev, res.url]);
      } else {
        setErrorMsg(res?.message || "Failed to upload photo");
      }
    } catch (err) {
      setErrorMsg("Network error uploading photo");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please enter a title for the item");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Please provide a brief description");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      item_type: itemType,
      title: title.trim(),
      category,
      description: description.trim(),
      location_campus: locationCampus,
      location_details: locationDetails.trim(),
      date_occurred: dateOccurred,
      time_occurred: timeOccurred.trim(),
      images,
      matched_roll_number: matchedRollNumber.trim().toUpperCase(),
      current_custody: itemType === "found" ? currentCustody : "with_finder",
      custody_details: custodyDetails.trim(),
      secret_question: secretQuestion.trim(),
      contact_phone: contactPhone.trim(),
      show_phone: showPhone,
      allow_inapp_claim: true,
    };

    try {
      let res;
      if (isEditing) {
        res = await updateLostFoundItem(itemToEdit.id, payload);
      } else {
        res = await createLostFoundItem(payload);
      }

      if (res?.success) {
        onSuccess(
          isEditing
            ? "Listing updated successfully!"
            : itemType === "found" && matchedRollNumber
            ? `Found report created! Automated alert dispatched for Roll No ${matchedRollNumber}.`
            : "Report created successfully!"
        );
      } else {
        setErrorMsg(res?.message || "Failed to save item");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {isEditing ? "Edit Listing" : "Report Lost or Found Item"}
            </h3>
            <p className="text-xs text-slate-500">
              Provide accurate details to help classmates find or claim items quickly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              What are you reporting?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setItemType("lost")}
                className={`flex items-center justify-center gap-2 rounded-2xl p-3 text-xs font-bold transition border ${
                  itemType === "lost"
                    ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-2 ring-rose-500/30"
                    : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60"
                }`}
              >
                <span>🔍 I Lost an Item</span>
              </button>
              <button
                type="button"
                onClick={() => setItemType("found")}
                className={`flex items-center justify-center gap-2 rounded-2xl p-3 text-xs font-bold transition border ${
                  itemType === "found"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/30"
                    : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60"
                }`}
              >
                <span>🎁 I Found an Item</span>
              </button>
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Casio Scientific Calculator / Student ID"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800"
              >
                {ITEM_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Roll Number Fast-Match if ID Card */}
          {category === "id_card" && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Smart ID-Card Matcher</span>
              </div>
              <p className="mt-0.5 text-[11px] text-blue-700 dark:text-blue-400">
                If the student roll number is visible, enter it below to automatically dispatch a notification to that student!
              </p>
              <input
                type="text"
                value={matchedRollNumber}
                onChange={(e) => setMatchedRollNumber(e.target.value)}
                placeholder="e.g. 7376222AD101"
                className="mt-2 w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-800 dark:bg-slate-900"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, brand, distinct marks, or situation..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          {/* Campus Location & Specific Room */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campus Location *
              </label>
              <select
                value={locationCampus}
                onChange={(e) => setLocationCampus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
              >
                {CAMPUS_LOCATIONS.filter((l) => l.id !== "all").map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specific Room / Landmark
              </label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="e.g., Room SF-204, 2nd row bench"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date {itemType === "lost" ? "Lost" : "Found"} *
              </label>
              <input
                type="date"
                required
                value={dateOccurred}
                onChange={(e) => setDateOccurred(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Approximate Time
              </label>
              <input
                type="text"
                value={timeOccurred}
                onChange={(e) => setTimeOccurred(e.target.value)}
                placeholder="e.g., 2:30 PM (after PT exam)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Current Custody (For Found Items) */}
          {itemType === "found" && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Where is this item currently kept? *
              </label>
              <select
                value={currentCustody}
                onChange={(e) => setCurrentCustody(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
              >
                {CUSTODY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={custodyDetails}
                onChange={(e) => setCustodyDetails(e.target.value)}
                placeholder="Optional custody notes (e.g., 'Handed over to Officer Raman at Main Gate')"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          )}

          {/* Photo Uploader */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Photos (Max 4)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-20 w-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img src={img} alt="Upload preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition">
                  {uploadingImage ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                  ) : (
                    <>
                      <Camera className="h-5 w-5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 mt-1">Add Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    disabled={uploadingImage}
                    className="sr-only"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Verification Secret Question (Optional) */}
          {itemType === "found" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ownership Verification Hint (Optional)
              </label>
              <input
                type="text"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                placeholder="e.g. 'What is the sticker on the back?' or 'Name the brand of keychain'"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. 9843777817"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="showPhoneCheck"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="showPhoneCheck" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Allow students to message on WhatsApp
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-98 transition disabled:opacity-50"
            >
              {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Publish Report"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* =========================================================================
   CLAIM ITEM MODAL
   ========================================================================= */
function ClaimItemModal({ item, onClose, onSuccess }) {
  const { user } = useAuth();
  const [proofDescription, setProofDescription] = useState("");
  const [claimantPhone, setClaimantPhone] = useState(user?.phone || "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofDescription.trim()) {
      setErrorMsg("Please provide proof details or answer the verification question.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await submitItemClaim(item.id, {
        proof_description: proofDescription.trim(),
        claimant_phone: claimantPhone.trim(),
      });

      if (res?.success) {
        onSuccess(res.message);
      } else {
        setErrorMsg(res?.message || "Failed to submit claim");
      }
    } catch (err) {
      setErrorMsg("An error occurred while submitting your claim.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Claim Item: {item.title}
            </h3>
            <p className="text-xs text-slate-500">
              Provide unique identifying details so the finder can verify your ownership.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {item.secret_question && (
            <div className="rounded-2xl bg-amber-50 p-3 text-xs font-semibold text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <span>Finder's Verification Question:</span>
              </div>
              <p className="text-amber-800 dark:text-amber-200">{item.secret_question}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Your Proof / Identifying Details *
            </label>
            <textarea
              required
              rows={4}
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="Describe unique characteristics, contents inside, lock code, wallpapers, or where you lost it..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Your Phone Number for Finder to Contact You
            </label>
            <input
              type="tel"
              value={claimantPhone}
              onChange={(e) => setClaimantPhone(e.target.value)}
              placeholder="e.g. 9843777817"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-98 transition disabled:opacity-50"
            >
              {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>Submit Claim</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
