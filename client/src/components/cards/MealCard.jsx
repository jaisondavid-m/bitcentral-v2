import React from 'react';

const mealLabels = {
  breakfast: { title: 'Breakfast', icon: '☀️', time: '7:00 – 8:30 AM' },
  lunch:     { title: 'Lunch',     icon: '🌤️', time: '12:20 – 1:30 PM' },
  dinner:    { title: 'Dinner',    icon: '🌙', time: '7:00 – 8:30 PM' },
};

export const MealCard = ({ type, items = [], isActive, isServingNow = false, isDefaultMenu = false, closure = null }) => {
  const config = mealLabels[type] ?? { title: type, icon: '🍽️', time: '' };
  const isClosed = Boolean(closure?.is_closed);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] transition-all duration-200 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] ${
        isActive ? 'ring-2 ring-blue-600 shadow-[5px_5px_0px_#18181b] dark:shadow-[5px_5px_0px_#ffffff]' : ''
      }`}
    >
      <div
        className={`flex items-center justify-between border-b border-zinc-900 px-4 py-3 sm:px-5 dark:border-white ${
          isClosed
            ? 'bg-rose-600 text-white'
            : isActive
            ? 'bg-blue-600 text-white'
            : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl">{isClosed ? '🚫' : config.icon}</span>
          <div>
            <h3 className="text-sm font-black leading-none sm:text-base tracking-tight">
              {config.title}
            </h3>
            <p className={`text-xs mt-0.5 font-semibold ${isClosed || isActive ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
              {config.time}
            </p>
          </div>
        </div>

        {isClosed ? (
          <span className="rounded-md border border-zinc-900 bg-white px-2.5 py-0.5 text-xs font-black text-rose-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]">
            Mess Closed
          </span>
        ) : isDefaultMenu ? (
          <span className="rounded-md border border-zinc-900 bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-amber-950 dark:text-amber-200 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
            Default
          </span>
        ) : isServingNow ? (
          <span className="rounded-md border border-zinc-900 bg-emerald-500 px-2.5 py-0.5 text-xs font-black text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff] animate-pulse">
            Serving now
          </span>
        ) : (
          <span className="rounded-md border border-zinc-900 bg-white px-2 py-0.5 text-xs font-bold text-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-900 dark:text-white dark:shadow-[1.5px_1.5px_0px_#ffffff]">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {isClosed ? (
        <div className="border-b border-zinc-900 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-800 dark:border-white dark:bg-rose-950/40 dark:text-rose-200 sm:px-5">
          ⚠️ Mess is not serving meals during this closure period.
        </div>
      ) : isDefaultMenu ? (
        <div className="border-b border-zinc-900 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 dark:border-white dark:bg-amber-950/40 dark:text-amber-200 sm:px-5">
          Default menu is displayed because real-time schedule is pending.
        </div>
      ) : null}

      <div className="px-4 py-3 sm:px-5 sm:py-4">
        {isClosed ? (
          <div className="flex flex-col items-center justify-center py-6 text-center sm:py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-900 bg-rose-100 text-2xl shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-rose-950">
              🚫
            </div>
            <h4 className="mt-3 text-base font-black text-rose-600 dark:text-rose-400">
              {closure.reason || 'Mess Closed'}
            </h4>
            {closure.notes && (
              <p className="mt-1 max-w-sm text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                {closure.notes}
              </p>
            )}
          </div>
        ) : items.length > 0 ? (
          <>
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 py-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-zinc-900 bg-blue-50 text-[10px] font-black text-blue-700 dark:border-white dark:bg-zinc-800 dark:text-blue-300">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-black text-zinc-500 dark:text-zinc-400 text-right">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8 text-zinc-400 dark:text-zinc-500 sm:py-10">
            <span className="text-3xl">🍽️</span>
            <p className="text-sm font-bold">No menu items recorded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCard;
