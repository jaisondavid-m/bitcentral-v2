import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/api/axios.js";
import { MealCard } from "@/components/cards/MealCard.jsx";
import MealCardSkeleton from "@/components/cards/MealCardSkeleton.jsx";

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
  const [isDefaultMenu, setIsDefaultMenu] = useState(false);
  const [closures, setClosures] = useState({});
  const [isDayClosed, setIsDayClosed] = useState(false);
  const [dayClosureReason, setDayClosureReason] = useState("");
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
      setIsDefaultMenu(Boolean(data?.default_menu));
      setClosures(data?.closures ?? {});
      setIsDayClosed(Boolean(data?.is_day_closed));
      setDayClosureReason(data?.day_closure_reason || "");

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
      setIsDefaultMenu(false);
      setClosures({});
      setIsDayClosed(false);
      setDayClosureReason("");
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
  const currentClosure = closures?.[activeTab] ?? null;

  const closedMealsList = useMemo(() => {
    return MEAL_ORDER.filter((m) => closures?.[m]?.is_closed);
  }, [closures]);

  const hasAnyClosure = closedMealsList.length > 0;

  const totalItems = useMemo(() => {
    return MEAL_ORDER.reduce((sum, meal) => sum + (menu?.[meal]?.length ?? 0), 0);
  }, [menu]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] px-3 py-4 dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors sm:px-4 sm:py-6 md:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-zinc-900 bg-white p-4 shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[4px_4px_0px_#ffffff] sm:p-5 md:p-6 mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-black leading-tight text-zinc-900 dark:text-zinc-50 tracking-tight sm:text-3xl">Mess Menu</h1>
              {isDefaultMenu ? (
                <p className="mt-1.5 inline-flex rounded-md border border-zinc-900 bg-amber-50 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-amber-800 dark:border-white dark:bg-amber-950/60 dark:text-amber-200">
                  Default menu template
                </p>
              ) : null}
            </div>

            <div className="w-full md:w-auto md:min-w-60">
              <label className="mb-1 block text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Date Selector
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-2 text-sm font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] outline-none dark:border-white dark:bg-zinc-800 dark:text-white dark:shadow-[2px_2px_0px_#ffffff]"
                />
                <button
                  onClick={() => setSelectedDate(todayIST())}
                  className="rounded-xl border border-zinc-900 bg-blue-600 px-3.5 py-2 text-xs font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer whitespace-nowrap"
                >
                  Today
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-900 bg-blue-50/70 p-1 dark:border-white dark:bg-zinc-800/80 shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#ffffff]">
              <div className="flex gap-1">
                {hostelTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setHostel(tab.key)}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-black transition cursor-pointer ${
                      hostel === tab.key
                        ? "bg-blue-600 text-white border border-zinc-900 dark:border-white shadow-[1px_1px_0px_#18181b] dark:shadow-[1px_1px_0px_#ffffff]"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-blue-50/70 p-1 dark:border-white dark:bg-zinc-800/80 shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#ffffff]">
              <div className="grid grid-cols-3 gap-1">
                {MEAL_ORDER.map((meal) => {
                  const mealIsClosed = Boolean(closures?.[meal]?.is_closed);
                  return (
                    <button
                      key={meal}
                      onClick={() => setActiveTab(meal)}
                      className={`relative rounded-lg px-1.5 py-1.5 text-[11px] font-black leading-tight transition cursor-pointer sm:px-2 sm:text-xs ${
                        activeTab === meal
                          ? mealIsClosed
                            ? "bg-red-600 text-white border border-zinc-900 dark:border-white shadow-[1px_1px_0px_#18181b] dark:shadow-[1px_1px_0px_#ffffff]"
                            : "bg-blue-600 text-white border border-zinc-900 dark:border-white shadow-[1px_1px_0px_#18181b] dark:shadow-[1px_1px_0px_#ffffff]"
                          : mealIsClosed
                          ? "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                      }`}
                    >
                      <span className="mr-1">{MEAL_META[meal].icon}</span>
                      {MEAL_META[meal].label}
                      {mealIsClosed && (
                        <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {hasAnyClosure && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-red-900 shadow-xs dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              <span className="text-lg">📢</span>
              <div className="flex-1 text-xs">
                <p className="font-bold text-red-800 dark:text-red-300">
                  Mess Closure Notice
                </p>
                <p className="mt-0.5 text-red-700 dark:text-red-200">
                  {dayClosureReason || "Mess is closed for certain meals on this date."}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
                  {closedMealsList.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-red-300 bg-white px-2 py-0.5 font-bold uppercase tracking-wide text-red-700 dark:border-red-800 dark:bg-red-900/60 dark:text-red-200"
                    >
                      {m} Closed
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
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
              isDefaultMenu={isDefaultMenu}
              closure={currentClosure}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessMenu;