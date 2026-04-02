import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import { MealCard } from "../Component/MealCard.jsx";
import MealCardSkeleton from "../Component/MealCardSkeleton.jsx";

const MEAL_ORDER = ["breakfast", "lunch", "dinner"];

const MEAL_META = {
  breakfast: { label: "Breakfast", icon: "☀️" },
  lunch: { label: "Lunch", icon: "🌤️" },
  dinner: { label: "Dinner", icon: "🌙" },
};

function todayIST() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function formatDate(date) {
  const [y, m, d] = date.split("-");
  return new Date(+y, +m - 1, +d).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const hostelTabs = [
  { key: "boys", label: "Boys" },
  { key: "girls", label: "Girls" },
];

const MessMenu = () => {
  const [menu, setMenu] = useState({});
  const [dayLabel, setDayLabel] = useState("");
  const [currentMeal, setCurrentMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("breakfast");
  const [hostel, setHostel] = useState("boys");
  const [selectedDate, setSelectedDate] = useState(todayIST);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/mess", {
        params: { hostel, date: selectedDate },
      });

      const data = res?.data ?? {};
      setMenu(data?.full_menu ?? {});
      setDayLabel(data?.day ?? "");

      const active = data?.current_meal?.meal_type?.toLowerCase?.();
      if (active && MEAL_ORDER.includes(active)) {
        setCurrentMeal(active);
        setActiveTab(active);
      } else {
        setCurrentMeal(null);
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      setMenu({});
      setCurrentMeal(null);
      setError("Unable to load menu for the selected date.");
    } finally {
      setLoading(false);
    }
  }, [hostel, selectedDate]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const isToday = selectedDate === todayIST();
  const selectedItems = menu?.[activeTab] ?? [];

  const totalItems = useMemo(() => {
    return MEAL_ORDER.reduce((sum, meal) => sum + (menu?.[meal]?.length ?? 0), 0);
  }, [menu]);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-sky-50 to-slate-100 px-3 py-3 dark:from-[#090b16] dark:via-[#0f172a] dark:to-[#04050b] sm:px-4 sm:py-4 md:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-blue-200/70 bg-white/85 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/85 sm:p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-800 dark:text-slate-100 sm:text-3xl">Mess Menu</h1>
            </div>

            <div className="w-full md:w-auto md:min-w-60">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                Date Selector
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                />
                <button
                  onClick={() => setSelectedDate(todayIST())}
                  className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Today
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70">
              <div className="flex gap-1">
                {hostelTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setHostel(tab.key)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      hostel === tab.key
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-600 hover:bg-white hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70">
              <div className="grid grid-cols-3 gap-1">
                {MEAL_ORDER.map((meal) => (
                  <button
                    key={meal}
                    onClick={() => setActiveTab(meal)}
                    className={`rounded-lg px-1.5 py-2 text-[11px] font-semibold leading-tight transition sm:px-2 sm:text-xs ${
                      activeTab === meal
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-600 hover:bg-white hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                    }`}
                  >
                    <span className="mr-1">{MEAL_META[meal].icon}</span>{MEAL_META[meal].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          {loading ? (
            <MealCardSkeleton />
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-center shadow dark:border-red-900 dark:bg-red-950/50">
              <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p>
              <button
                onClick={fetchMenu}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <MealCard
              type={activeTab}
              items={selectedItems}
              isActive={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessMenu;