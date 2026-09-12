import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/StudentContext.jsx";
import { Navigate, Link } from "react-router-dom";
import {
  getDashboardRewards,
  getDashboardMess,
  getDashboardLeaves,
} from "@/api/axios.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader,
  Calendar,
  Sparkles,
  Sun,
  Coffee,
  Moon,
  Utensils,
  CreditCard,
  Gift,
  Users,
  Heart,
  Zap,
  LayoutGrid,
  Boxes,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getMealIcon = (mealType) => {
  switch (mealType?.toLowerCase()) {
    case "breakfast":
      return Coffee;
    case "lunch":
      return Sun;
    case "dinner":
      return Moon;
    default:
      return Utensils;
  }
};

const quickActions = [
  {
    to: "/rpsite",
    icon: Sparkles,
    label: "Reward Points",
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40",
  },
  {
    to: "/mess",
    icon: Utensils,
    label: "Mess Menu",
    color: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 border-sky-100 dark:border-sky-900/40",
  },
  {
    to: "/faculty-directory",
    icon: Users,
    label: "Faculty Directory",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40",
  },
  {
    to: "/support-dev",
    icon: Heart,
    label: "Support BIT-CENTRAL",
    color: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/40",
  },
];

/* ─── animation variants ──────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.05 } } };

const bannerVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 280, damping: 28 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: "spring", stiffness: 280, damping: 28 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  }),
};

/* ═══════════════════════════════════════════════════════════════ */
function Dashboard() {
  const { user, profile, student, loading: authLoading } = useAuth();
  const [hostel, setHostel] = useState("boys");

  // Split states for non-blocking parallel loading
  const [rewardsData, setRewardsData] = useState(null);
  const [rewardsLoading, setRewardsLoading] = useState(true);

  const [messData, setMessData] = useState(null);
  const [messLoading, setMessLoading] = useState(true);

  const [leavesData, setLeavesData] = useState([]);
  const [leavesLoading, setLeavesLoading] = useState(true);

  const [[page, direction], setPage] = useState([0, 1]);
  const activeCard = ((page % 2) + 2) % 2; // 0: Mess Menu, 1: Upcoming Leaves

  const paginate = (newDirection) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  };

  // 1. Fetch Rewards
  const loadRewards = async () => {
    try {
      const res = await getDashboardRewards();
      if (res) {
        setRewardsData(res);
      }
    } catch (err) {
      console.error("Failed to load rewards:", err);
    } finally {
      setRewardsLoading(false);
    }
  };

  // 2. Fetch Mess Menu (Lightweight & responsive to hostel toggle)
  const loadMess = async (selectedHostel = hostel) => {
    setMessLoading(true);
    try {
      const res = await getDashboardMess(selectedHostel);
      if (res) {
        setMessData(res);
      }
    } catch (err) {
      console.error("Failed to load mess menu:", err);
    } finally {
      setMessLoading(false);
    }
  };

  // 3. Fetch Upcoming Leaves (Lightweight)
  const loadLeaves = async () => {
    try {
      const res = await getDashboardLeaves();
      if (Array.isArray(res)) {
        setLeavesData(res);
      }
    } catch (err) {
      console.error("Failed to load leaves:", err);
    } finally {
      setLeavesLoading(false);
    }
  };

  // Trigger independent parallel fetches on mount
  useEffect(() => {
    if (user) {
      loadRewards();
      loadMess(hostel);
      loadLeaves();
    }
  }, [user]);

  // When hostel toggle changes, fetch only mess menu without blocking
  const handleHostelChange = (newHostel) => {
    if (newHostel === hostel) return;
    setHostel(newHostel);
    loadMess(newHostel);
  };

  // Infinite auto-slide: Mess Menu for 10s, then Upcoming Leaves for 6s
  useEffect(() => {
    const duration = activeCard === 0 ? 10000 : 6000;
    const timer = setTimeout(() => {
      paginate(1);
    }, duration);

    return () => clearTimeout(timer);
  }, [page, activeCard]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#060912]">
        <Loader className="h-7 w-7 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  const displayName =
    profile?.display_name ||
    profile?.name ||
    student?.displayName ||
    user?.displayName ||
    "Student";
  const rewards = rewardsData?.rewards || {
    total: "0",
    balance: "0",
    redeemed: "0",
  };
  const mess = messData;
  const leaves = leavesData || [];

  const MealIcon = getMealIcon(mess?.meal_type);

  // ── Sub-render: Mess Menu Card ──
  const renderMessCard = () => (
    <div className="w-full h-full rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 space-y-2 flex flex-col justify-between">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-xl bg-blue-50/90 text-blue-600 border border-blue-100/80 dark:bg-blue-950/40 dark:border-blue-900/40 dark:text-blue-400">
            <MealIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
            {mess?.meal_type || "Lunch"} Menu
          </h2>
        </div>

        {/* Right Controls: Boys/Girls Toggle & View All Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Boys / Girls toggle */}
          <div className="flex items-center gap-0.5 rounded-xl bg-slate-100/90 p-0.5 dark:bg-slate-800">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleHostelChange("boys");
              }}
              className={`rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold transition-all ${
                hostel === "boys"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              Boys
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleHostelChange("girls");
              }}
              className={`rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold transition-all ${
                hostel === "girls"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              Girls
            </button>
          </div>

          <Link
            to="/mess"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-0.5 rounded-xl bg-blue-50 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide text-blue-600 border border-blue-200/60 transition-all hover:bg-blue-100 hover:text-blue-700 active:scale-95 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 shrink-0"
          >
            <span>View All</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Menu items or Shimmer Skeleton */}
      {messLoading ? (
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-8.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {mess?.items && mess.items.length > 0 ? (
            mess.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-1.5 sm:gap-2 rounded-xl bg-slate-50/80 px-2.5 py-1.5 text-[11px] sm:text-[11.5px] font-bold text-slate-800 border border-slate-100/80 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 shadow-2xs min-h-[32px] sm:min-h-[34px]"
              >
                <span className="mt-1 h-1.5 w-1.5 sm:h-2 sm:w-2 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span className="leading-tight break-words flex-1 line-clamp-2">{item}</span>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-3 text-center text-xs text-slate-400">
              No menu items available.
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ── Sub-render: Upcoming Leaves Card ──
  const renderLeavesCard = () => (
    <div className="w-full h-full rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 space-y-2 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/80 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-xl bg-blue-50/90 text-blue-600 border border-blue-100/80 dark:bg-blue-950/40 dark:border-blue-900/40 dark:text-blue-400">
            <Calendar className="h-4 w-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
            Upcoming Leaves
          </h3>
        </div>
        <Link
          to="/leavedetails"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-0.5 rounded-xl bg-blue-50 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide text-blue-600 border border-blue-200/60 transition-all hover:bg-blue-100 hover:text-blue-700 active:scale-95 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 shrink-0"
        >
          <span>View All</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {leavesLoading ? (
        <div className="space-y-2">
          <div className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
        </div>
      ) : (
        <div className="space-y-1.5 sm:space-y-2">
          {leaves && leaves.length > 0 ? (
            leaves.slice(0, 2).map((leave, idx) => (
              <div
                key={idx}
                className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/70 p-2 sm:p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800/50 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {leave.name}
                  </h4>
                  <span className="flex-shrink-0 rounded-md sm:rounded-lg bg-blue-50 px-1.5 sm:px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-bold text-blue-700 border border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                    {leave.days_count} {leave.days_count === 1 ? "Day" : "Days"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10.5px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="h-3 w-3 flex-shrink-0 text-blue-500" />
                    <span className="truncate">
                      {formatDate(leave.from_date)}
                      {leave.from_half_day ? ` (${leave.from_half_day})` : ""}
                      {leave.to_date && leave.to_date !== leave.from_date
                        ? ` – ${formatDate(leave.to_date)}`
                        : ""}
                    </span>
                  </div>
                  {leave.day && (
                    <span className="flex-shrink-0 font-bold text-slate-700 dark:text-slate-300 ml-2">
                      {leave.day}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-slate-500 py-3">No upcoming leaves</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 lg:pb-8 text-slate-900 dark:bg-[#060912] dark:text-slate-100 flex flex-col items-center justify-start">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-6xl px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 lg:pt-5 pb-6 space-y-5 sm:space-y-6 lg:space-y-5">
        
        {/* ── 1. Top Greeting Header ──────────────────────────────────── */}
        <section className="flex items-start sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-200/60 dark:border-slate-800/60 sm:pb-3">
          <div className="space-y-0.5">
            <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-blue-600 border border-blue-200/50 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900/40">
              WELCOME BACK!!
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              {displayName}
            </h1>
          </div>

          <Link
            to="/tools"
            className="mt-1 sm:mt-0 inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:from-blue-700 hover:to-indigo-800 active:scale-95 transition-all shrink-0 hover:shadow-sm"
          >
            <Boxes className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Campus Utilities</span>
          </Link>
        </section>

        {/* ── Main Content Grid (Mobile: 1 Column, Desktop: 12 Columns) ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start"
        >
          
          {/* ════════ LEFT COLUMN (Reward Points, Quick Actions with balanced spacing, Explore) ════════ */}
          <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-4.5 lg:space-y-6.5">
            
            {/* ── 1. REWARD POINTS SECTION ────────────────────────────────── */}
            <motion.section variants={fadeUp} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    REWARD POINTS
                  </h2>
                </div>
                {rewardsLoading ? (
                  <div className="h-4 w-20 rounded-md bg-slate-200/80 dark:bg-slate-800/80 animate-pulse" />
                ) : (
                  <span className="rounded-md bg-slate-100/90 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    Total: <strong className="text-slate-800 dark:text-slate-200">{rewards.total || "0"}</strong> pts
                  </span>
                )}
              </div>

              {rewardsLoading ? (
                /* Skeleton Loader for Reward Points */
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                    <div className="h-20 sm:h-22 rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white p-3.5 sm:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 animate-pulse flex flex-col justify-between">
                      <div className="h-3.5 w-14 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-6 w-20 rounded bg-emerald-100 dark:bg-emerald-950/60" />
                    </div>
                    <div className="h-20 sm:h-22 rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white p-3.5 sm:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 animate-pulse flex flex-col justify-between">
                      <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                  <div className="h-9 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70 animate-pulse" />
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                    {/* Balance */}
                    <div className="rounded-2xl sm:rounded-3xl border border-emerald-300 bg-white p-3.5 sm:p-4 shadow-sm dark:border-emerald-700/60 dark:bg-slate-900/90 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          Balance
                        </span>
                        <div className="flex h-5 w-5 items-center justify-center text-emerald-500 dark:text-emerald-400">
                          <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                      <div className="mt-1 sm:mt-1.5 flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                          {rewards.balance || "0"}
                        </span>
                        <span className="text-xs font-medium text-emerald-500">pts</span>
                      </div>
                    </div>

                    {/* Redeemed */}
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                          Redeemed
                        </span>
                        <div className="flex h-5 w-5 items-center justify-center text-purple-500 dark:text-purple-400">
                          <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                      <div className="mt-1 sm:mt-1.5 flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                          {rewards.redeemed || "0"}
                        </span>
                        <span className="text-xs font-medium text-slate-400">pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Catchy Action Link to /rpsite */}
                  <Link
                    to="/rpsite"
                    className="group flex items-center justify-between rounded-2xl border border-blue-100/90 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50/70 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-800 transition-all hover:border-blue-300 hover:shadow-2xs active:scale-[0.99] dark:border-blue-900/40 dark:from-blue-950/30 dark:via-slate-900/60 dark:to-indigo-950/20 dark:text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                      <span>Check Internal Marks & RP</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[11px] sm:text-xs font-extrabold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      <span>View Details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                </div>
              )}
            </motion.section>

            {/* ── MOBILE ONLY: AUTO-SLIDING BANNER TRACK ── */}
            <motion.section variants={fadeUp} className="space-y-2 lg:hidden">
              <div className="relative overflow-hidden h-[210px] sm:h-[216px]">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={page}
                    custom={direction}
                    variants={bannerVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, { offset, velocity }) => {
                      const swipe = Math.abs(offset.x) * velocity.x;
                      if (swipe < -80 || offset.x < -35) {
                        paginate(1);
                      } else if (swipe > 80 || offset.x > 35) {
                        paginate(-1);
                      }
                    }}
                    className="cursor-grab active:cursor-grabbing w-full h-full"
                  >
                    {activeCard === 0 ? renderMessCard() : renderLeavesCard()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Minimal Slide Indicators */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <button
                  onClick={() => {
                    if (activeCard !== 0) paginate(-1);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeCard === 0
                      ? "w-5 bg-blue-600 dark:bg-blue-400"
                      : "w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                  }`}
                  aria-label="Mess Menu"
                />
                <button
                  onClick={() => {
                    if (activeCard !== 1) paginate(1);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeCard === 1
                      ? "w-5 bg-blue-600 dark:bg-blue-400"
                      : "w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                  }`}
                  aria-label="Upcoming Leaves"
                />
              </div>
            </motion.section>

            {/* ── 2. QUICK ACTIONS SECTION ── */}
            <motion.section variants={fadeUp} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  QUICK ACTIONS
                </h2>
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
                {quickActions.map(({ to, icon: Icon, label, color }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-2.5 sm:p-3.5 text-center shadow-sm transition-all hover:scale-105 active:scale-95 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
                  >
                    <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border ${color} shadow-2xs transition-transform group-hover:scale-110`}>
                      <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight text-center line-clamp-2 w-full">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.section>

            {/* ── 3. EXPLORE CAMPUS UTILITIES SECTION ── */}
            <motion.section variants={fadeUp} className="space-y-2">
              <Link
                to="/tools"
                className="group relative flex items-center justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/70 p-3.5 sm:p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md active:scale-[0.99] dark:border-slate-800 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm transition-transform group-hover:scale-110">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Explore Campus Utilities
                      </h3>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        All Tools
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                      Mess Menu, Exam Hall Finder, RP Details & more
                    </p>
                  </div>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-all group-hover:translate-x-1 group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-500">
                  <ChevronRight className="h-4.5 w-4.5" />
                </div>
              </Link>
            </motion.section>
          </div>

          {/* ════════ RIGHT COLUMN (Mess Menu & Upcoming Leaves with reduced gap) ════════ */}
          <div className="hidden lg:flex lg:flex-col lg:col-span-5 space-y-3.5 sm:space-y-4">
            <motion.section variants={fadeUp} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Utensils className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  MESS MENU
                </h2>
              </div>
              {renderMessCard()}
            </motion.section>

            <motion.section variants={fadeUp} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  UPCOMING LEAVES
                </h2>
              </div>
              {renderLeavesCard()}
            </motion.section>
          </div>

        </motion.div>
      </div>
    </main>
  );
}

export default Dashboard;