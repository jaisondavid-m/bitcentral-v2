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
      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 dark:bg-slate-900
        ${isClosed
          ? 'border-red-300 shadow-md ring-1 ring-red-200/50 dark:border-red-900/60 dark:ring-red-900/30'
          : isActive
          ? 'border-blue-300 shadow-xl ring-1 ring-blue-200 dark:border-blue-800 dark:ring-blue-900/60'
          : 'border-slate-200 shadow-sm hover:shadow-md dark:border-slate-700'
        }`}
    >
      <div className={`flex items-center justify-between border-b px-4 py-3 sm:px-5
        ${isClosed
          ? 'border-red-200/50 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white dark:border-red-900/60'
          : isActive
          ? 'border-blue-500/30 bg-linear-to-r from-blue-700 to-cyan-600'
          : 'border-slate-100 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl">{isClosed ? '🚫' : config.icon}</span>
          <div>
            <h3 className={`text-sm font-bold leading-none sm:text-base ${isClosed || isActive ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
              {config.title}
            </h3>
            <p className={`text-xs mt-0.5 ${isClosed ? 'text-red-100' : isActive ? 'text-[#e8c547]/70' : 'text-slate-400'}`}>
              {config.time}
            </p>
          </div>
        </div>
        {isClosed ? (
          <span className="rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-bold text-white shadow-xs backdrop-blur-sm">
            Mess Closed
          </span>
        ) : isDefaultMenu ? (
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${isActive ? 'border-amber-200/40 bg-amber-400/15 text-amber-100' : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300'}`}>
            Default menu
          </span>
        ) : isServingNow ? (
          <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            Serving now
          </span>
        ) : (
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? 'border border-white/30 bg-white/10 text-white' : 'border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {isClosed ? (
        <div className="border-b border-red-200 bg-red-50/80 px-4 py-2 text-[11px] font-semibold text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 sm:px-5">
          ⚠️ Mess is not serving meals during this holiday / closure period.
        </div>
      ) : isDefaultMenu ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300 sm:px-5">
          Default menu is displayed because the original data has not been updated.
        </div>
      ) : null}

      <div className="px-4 py-3 sm:px-5 sm:py-4">
        {isClosed ? (
          <div className="flex flex-col items-center justify-center py-6 text-center sm:py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl shadow-inner dark:bg-red-950/80">
              🚫
            </div>
            <h4 className="mt-3 text-base font-bold text-red-600 dark:text-red-400">
              {closure.reason || 'Mess Closed for Holiday'}
            </h4>
            {closure.notes ? (
              <p className="mt-1.5 max-w-sm text-xs font-medium text-slate-600 dark:text-slate-300">
                {closure.notes}
              </p>
            ) : null}
            <div className="mt-3.5 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50/90 px-3.5 py-1.5 text-[11px] font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-300">
              <span>📅</span>
              <span>
                {closure.start_date} ({closure.start_meal}) &rarr; {closure.end_date} ({closure.end_meal})
              </span>
            </div>
          </div>
        ) : items.length > 0 ? (
          <>
            <ul className="space-y-0">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-800">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-800 sm:h-6 sm:w-6">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-snug font-medium text-slate-700 dark:text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-right pb-1">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-8 text-slate-400 dark:text-slate-500 sm:py-10">
            <span className="text-3xl">🍽️</span>
            <p className="text-sm">No items available for this meal</p>
          </div>
        )}
      </div>
    </div>
  );
};