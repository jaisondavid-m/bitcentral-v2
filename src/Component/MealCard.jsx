import React from 'react';

const mealLabels = {
  breakfast: { title: 'Breakfast', icon: '☀️', time: '7:00 – 8:30 AM' },
  lunch:     { title: 'Lunch',     icon: '🌤️', time: '12:20 – 1:30 PM' },
  dinner:    { title: 'Dinner',    icon: '🌙', time: '7:00 – 8:30 PM' },
};

export const MealCard = ({ type, items = [], isActive, isServingNow = false }) => {
  const config = mealLabels[type] ?? { title: type, icon: '🍽️', time: '' };

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 dark:bg-slate-900
        ${isActive
          ? 'border-blue-300 shadow-xl ring-1 ring-blue-200 dark:border-blue-800 dark:ring-blue-900/60'
          : 'border-slate-200 shadow-sm hover:shadow-md dark:border-slate-700'
        }`}
    >
      <div className={`flex items-center justify-between border-b px-4 py-3 sm:px-5
        ${isActive
          ? 'border-blue-500/30 bg-linear-to-r from-blue-700 to-cyan-600'
          : 'border-slate-100 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl">{config.icon}</span>
          <div>
            <h3 className={`text-sm font-bold leading-none sm:text-base ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
              {config.title}
            </h3>
            <p className={`text-xs mt-0.5 ${isActive ? 'text-[#e8c547]/70' : 'text-slate-400'}`}>
              {config.time}
            </p>
          </div>
        </div>
        {isServingNow ? (
          <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            Serving now
          </span>
        ) : (
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? 'border border-white/30 bg-white/10 text-white' : 'border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      <div className="px-4 py-1.5 sm:px-5 sm:py-2">
        {items.length > 0 ? (
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