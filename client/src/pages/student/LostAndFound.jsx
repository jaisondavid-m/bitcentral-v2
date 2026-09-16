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
  Home as HomeIcon,
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

// Relative date formatting
function formatRelative(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.round((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export default function LostAndFound() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation tab: 'all' | 'lost' | 'found' | 'my'
  const activeTabParam = searchParams.get("tab") || "all";
  const [activeTab, setActiveTab] = useState(activeTabParam);

  // Filters
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
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Type filter derived from tab
  const computedType = useMemo(() => {
    if (activeTab === "lost") return "lost";
    if (activeTab === "found") return "found";
    return "all";
  }, [activeTab]);

  // Fetch Feed Items
  const fetchFeed = useCallback(async () => {
    if (activeTab === "my") return;
    setLoading(true);
    try {
      const res = await getLostFoundItems({
        type: computedType,
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
  }, [computedType, selectedCategory, selectedLocation, statusFilter, searchQuery, activeTab]);

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

  // Status toggle handler
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

  // Delete handler
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;
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

  // Claim approve/reject
  const handleClaimStatusChange = async (claimId, status) => {
    try {
      const res = await updateClaimStatus(claimId, status);
      if (res?.success) {
        showToast(`Claim marked as ${status}`);
        fetchMyData();
        fetchFeed();
      } else {
        showToast(res?.message || "Failed to update claim", "error");
      }
    } catch (e) {
      showToast("Error updating claim", "error");
    }
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedLocation !== "all" ||
    statusFilter !== "active" ||
    searchQuery.trim() !== "";

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedLocation("all");
    setStatusFilter("active");
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6 sm:py-10 dark:bg-black font-sans text-slate-800 dark:text-slate-100">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-18 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3 shadow-xl backdrop-blur-xl border ${
              toastMessage.type === "error"
                ? "bg-rose-600 text-white border-rose-500"
                : "bg-emerald-600 text-white border-emerald-500"
            }`}
          >
            {toastMessage.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span className="text-xs font-bold">{toastMessage.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>BIT Campus Hub</span>
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Lost & Found
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Search, report, and recover student ID cards, keys, devices, and personal items across campus.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setShowReportModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Report an Item</span>
          </button>
        </div>

        {/* Navigation Tabs (Segmented Control) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl bg-gray-200/80 p-1 dark:bg-zinc-800/80">
            {[
              { key: "all", label: "All Items" },
              { key: "lost", label: "🔍 Lost" },
              { key: "found", label: "🎁 Found" },
              { key: "my", label: `My Activity ${myItems.length > 0 ? `(${myItems.length})` : ""}` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-white text-blue-600 shadow-xs dark:bg-zinc-900 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-medium text-slate-400">
            {activeTab !== "my" && (
              <span>
                Showing <b>{items.length}</b> {items.length === 1 ? "listing" : "listings"}
              </span>
            )}
          </div>
        </div>

        {/* Filter Controls Bar (Only when not in My Activity) */}
        {activeTab !== "my" && (
          <div className="mt-4 rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item, student name, roll number, or landmark..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-xs sm:text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800/80 dark:focus:bg-zinc-800"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filters Group */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 cursor-pointer"
                >
                  {ITEM_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Location Dropdown */}
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 cursor-pointer"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id === "all" ? "all" : loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="all">All Statuses</option>
                  <option value="claimed">Claimed</option>
                  <option value="handed_over">At Security Gate</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="rounded-xl border border-dashed border-gray-300 px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-zinc-700 dark:text-rose-400 dark:hover:bg-rose-950/40 transition"
                    title="Reset all filters"
                  >
                    Reset
                  </button>
                )}

                <button
                  onClick={fetchFeed}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-slate-500 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-400 transition cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-500" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="mt-6">
          {activeTab !== "my" ? (
            /* Feed List */
            loading && items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <RefreshCw className="h-7 w-7 animate-spin text-blue-600" />
                <p className="mt-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                  Loading campus listings...
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 px-4 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-slate-400 dark:bg-zinc-800 dark:text-slate-500">
                  <Inbox className="h-7 w-7" />
                </div>
                <h3 className="mt-3.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                  No listings found
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-400">
                  {hasActiveFilters
                    ? "Try clearing or changing your search filters."
                    : "No items have been reported in this category yet."}
                </p>
                {hasActiveFilters ? (
                  <button
                    onClick={resetFilters}
                    className="mt-4 rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-slate-300 transition"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowReportModal(true);
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Report Item</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <CleanItemCard
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
            )
          ) : (
            /* My Activity Tab */
            <div className="space-y-8">
              {/* My Reported Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Items You Reported ({myItems.length})
                    </h2>
                    <p className="text-xs text-slate-400">
                      Manage your listings, change status, and review claims received.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowReportModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Report New</span>
                  </button>
                </div>

                {loadingMy ? (
                  <div className="py-12 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                  </div>
                ) : myItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-slate-400">
                      You haven't posted any lost or found items yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {myItems.map((item) => (
                      <CleanItemCard
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

              {/* Claims Received on My Items */}
              {myItems.some((it) => it.claims && it.claims.length > 0) && (
                <div className="border-t border-gray-200 pt-6 dark:border-zinc-800">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3">
                    Claims Received from Classmates
                  </h2>
                  <div className="space-y-3">
                    {myItems
                      .flatMap((it) => (it.claims || []).map((c) => ({ ...c, itemTitle: it.title })))
                      .map((claim) => (
                        <div
                          key={claim.id}
                          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                {claim.claimant_name} ({claim.claimant_roll_no || claim.claimant_email})
                              </span>
                              <span className="text-[11px] text-slate-400">on item: <b>{claim.itemTitle}</b></span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                              Proof: {claim.proof_description}
                            </p>
                            {claim.claimant_phone && (
                              <a
                                href={`https://wa.me/91${claim.claimant_phone.replace(/\D/g, "").slice(-10)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                              >
                                <MessageCircle className="h-3 w-3" />
                                <span>WhatsApp {claim.claimant_phone}</span>
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {claim.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleClaimStatusChange(claim.id, "approved")}
                                  className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                                >
                                  Approve & Return
                                </button>
                                <button
                                  onClick={() => handleClaimStatusChange(claim.id, "rejected")}
                                  className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-gray-100 dark:border-zinc-700 dark:text-slate-300"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span
                                className={`rounded-xl px-2.5 py-1 text-xs font-bold uppercase ${
                                  claim.status === "approved"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                }`}
                              >
                                {claim.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Claims Submitted by User */}
              <div className="border-t border-gray-200 pt-6 dark:border-zinc-800">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3">
                  Claims You Submitted ({myClaims.length})
                </h2>

                {myClaims.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-slate-400">
                      You haven't submitted any recovery claims yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myClaims.map((claim) => (
                      <div
                        key={claim.id}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${
                                claim.item_type === "found"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              }`}
                            >
                              {claim.item_type}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {claim.item_title}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                            Your proof: {claim.proof_description}
                          </p>
                        </div>

                        <span
                          className={`self-start sm:self-auto rounded-xl px-2.5 py-1 text-[11px] font-bold uppercase ${
                            claim.status === "approved"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : claim.status === "rejected"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          Status: {claim.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <CleanReportModal
            itemToEdit={editingItem}
            onClose={() => setShowReportModal(false)}
            onSuccess={(msg) => {
              setShowReportModal(false);
              showToast(msg || "Item published successfully!");
              fetchFeed();
              if (activeTab === "my") fetchMyData();
            }}
          />
        )}
      </AnimatePresence>

      {/* Claim Modal */}
      <AnimatePresence>
        {showClaimModal && activeItemForClaim && (
          <CleanClaimModal
            item={activeItemForClaim}
            onClose={() => {
              setShowClaimModal(false);
              setActiveItemForClaim(null);
            }}
            onSuccess={(msg) => {
              setShowClaimModal(false);
              setActiveItemForClaim(null);
              showToast(msg || "Claim submitted to finder!");
              fetchFeed();
            }}
          />
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt="preview"
                className="max-h-[80vh] w-auto object-contain rounded-xl"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* =========================================================================
   CLEAN ITEM CARD COMPONENT
   ========================================================================= */
function CleanItemCard({
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

  // WhatsApp link
  const cleanPhone = (item.contact_phone || "").replace(/\D/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
        `Hi! Regarding the ${item.item_type.toUpperCase()} item "${item.title}" posted on BIT-CENTRAL:`
      )}`
    : null;

  return (
    <div
      className={`group flex flex-col justify-between rounded-2xl border transition-all duration-200 ${
        item.is_pinned
          ? "border-amber-300 bg-amber-50/20 dark:border-amber-800/80 dark:bg-amber-950/10 shadow-sm"
          : "border-gray-200/90 bg-white hover:border-gray-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-zinc-700"
      }`}
    >
      <div>
        {/* Photo or Clean Icon Box */}
        {item.images && item.images.length > 0 ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-zinc-800">
            <img
              src={item.images[0]}
              alt={item.title}
              onClick={() => onImageClick(item.images[0])}
              className="h-full w-full object-cover cursor-pointer hover:scale-102 transition-transform duration-300"
            />
            {item.images.length > 1 && (
              <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                +{item.images.length - 1}
              </span>
            )}
          </div>
        ) : null}

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Top Pill Row */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  isLost
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                }`}
              >
                {isLost ? "LOST" : "FOUND"}
              </span>

              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-slate-300">
                <CategoryIcon className="h-3 w-3" />
                {item.category.replace("_", " ")}
              </span>
            </div>

            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${statusInfo.bg}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
            {item.title}
          </h3>

          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* ID Card Roll Number Fast Match */}
          {item.matched_roll_number && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Roll No: {item.matched_roll_number}</span>
            </div>
          )}

          {/* Location & Time */}
          <div className="mt-3.5 space-y-1 text-xs text-slate-500 dark:text-slate-400 border-t border-gray-100 pt-3 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 font-medium truncate">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="truncate">
                {item.location_campus}
                {item.location_details ? ` (${item.location_details})` : ""}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>{item.date_occurred}</span>
              <span>{formatRelative(item.created_at)}</span>
            </div>
          </div>

          {/* Custody (for found items) */}
          {!isLost && (
            <div className="mt-2.5 rounded-xl bg-gray-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800/80 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span className="truncate">
                {item.current_custody === "main_security_gate"
                  ? "At Main Security Gate"
                  : item.current_custody === "dept_office"
                  ? "At Department Office"
                  : item.current_custody === "hostel_warden"
                  ? "With Hostel Warden"
                  : "Safe with Finder"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 sm:p-5 pt-0">
        {item.is_my_item ? (
          <div className="flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-zinc-800">
            {item.status === "active" ? (
              <button
                onClick={() => onToggleStatus(item, "claimed")}
                className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                Mark Resolved
              </button>
            ) : (
              <button
                onClick={() => onToggleStatus(item, "active")}
                className="flex-1 rounded-xl bg-gray-100 py-2 text-xs font-bold text-slate-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-slate-300 transition"
              >
                Reactivate
              </button>
            )}

            <button
              onClick={() => onEdit(item)}
              className="rounded-xl border border-gray-200 p-2 text-slate-500 hover:bg-gray-100 dark:border-zinc-700 dark:text-slate-300"
              title="Edit"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-zinc-800">
            {!isResolved && item.allow_inapp_claim && (
              <button
                onClick={() => onOpenClaim(item)}
                className="flex-1 rounded-xl bg-blue-600 py-2 px-3 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Claim Item
              </button>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center gap-1"
                title="WhatsApp Finder"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            {item.contact_phone && !whatsappUrl && (
              <a
                href={`tel:${item.contact_phone}`}
                className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-slate-300 transition"
              >
                Call
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   CLEAN REPORT MODAL
   ========================================================================= */
function CleanReportModal({ itemToEdit, onClose, onSuccess }) {
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

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 4) {
      setErrorMsg("Max 4 images allowed");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please enter an item title");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Please provide a description");
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
        onSuccess(isEditing ? "Updated listing!" : "Published listing!");
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
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="relative my-6 w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isEditing ? "Edit Item" : "Report an Item"}
            </h3>
            <p className="text-xs text-slate-400">
              Provide clear details so the item can be identified quickly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Item Type Segmented */}
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setItemType("lost")}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                itemType === "lost"
                  ? "bg-white text-rose-600 shadow-xs dark:bg-zinc-900 dark:text-rose-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              🔍 I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setItemType("found")}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                itemType === "found"
                  ? "bg-white text-emerald-600 shadow-xs dark:bg-zinc-900 dark:text-emerald-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              🎁 I Found Something
            </button>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Blue Titan Bottle, Casio FX-991"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
              >
                {ITEM_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Smart Roll Matcher if ID Card */}
          {category === "id_card" && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
              <label className="block text-xs font-bold text-blue-900 dark:text-blue-300">
                Student Roll Number (Auto-Notification)
              </label>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
                Entering roll number will automatically dispatch a notification to that student.
              </p>
              <input
                type="text"
                value={matchedRollNumber}
                onChange={(e) => setMatchedRollNumber(e.target.value)}
                placeholder="e.g. 7376222AD101"
                className="mt-1.5 w-full rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider dark:border-blue-800 dark:bg-zinc-900"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Color, brand, identifying marks, condition..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          {/* Location & Room */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campus Location *
              </label>
              <select
                value={locationCampus}
                onChange={(e) => setLocationCampus(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
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
                Room / Landmark
              </label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="e.g. SF-204 2nd bench, Library 1st floor"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
          </div>

          {/* Date */}
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
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Approx Time
              </label>
              <input
                type="text"
                value={timeOccurred}
                onChange={(e) => setTimeOccurred(e.target.value)}
                placeholder="e.g. Morning, 2:30 PM"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
          </div>

          {/* Custody (Found only) */}
          {itemType === "found" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Where is this item kept?
              </label>
              <select
                value={currentCustody}
                onChange={(e) => setCurrentCustody(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
              >
                {CUSTODY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Photos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Photos (Max 4)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-16 w-16 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700"
                >
                  <img src={img} alt="preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {images.length < 4 && (
                <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800">
                  {uploadingImage ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <>
                      <Camera className="h-4 w-4 text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-400 mt-0.5">Upload</span>
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

          {/* Contact Details */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. 9843777817"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="showPhoneClean"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
              <label htmlFor="showPhoneClean" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Show WhatsApp button to students
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : isEditing ? "Save Changes" : "Publish Listing"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* =========================================================================
   CLEAN CLAIM MODAL
   ========================================================================= */
function CleanClaimModal({ item, onClose, onSuccess }) {
  const { user } = useAuth();
  const [proofDescription, setProofDescription] = useState("");
  const [claimantPhone, setClaimantPhone] = useState(user?.phone || "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofDescription.trim()) {
      setErrorMsg("Please describe your proof or identifying marks");
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
      setErrorMsg("Error submitting claim");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Claim: {item.title}
            </h3>
            <p className="text-xs text-slate-400">
              Provide unique details to verify you are the owner.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {item.secret_question && (
            <div className="rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200">
              <b>Finder's Question:</b> {item.secret_question}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Your Proof / Identifying Details *
            </label>
            <textarea
              required
              rows={3}
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="Describe unique characteristics, color, contents inside, lock codes, or where you lost it..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Your Contact Phone Number
            </label>
            <input
              type="tel"
              value={claimantPhone}
              onChange={(e) => setClaimantPhone(e.target.value)}
              placeholder="e.g. 9843777817"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Send Claim"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
