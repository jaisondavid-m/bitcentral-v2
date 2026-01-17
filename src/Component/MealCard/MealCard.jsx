
import React from 'react';

const mealLabels = {
  breakfast: { title: 'Breakfast', icon: '🍳', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  lunch: { title: 'Lunch', icon: '🍱', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  tea: { title: 'Tea Break', icon: '☕', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  dinner: { title: 'Dinner', icon: '🍽️', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
};

export const MealCard = ({ type, items = [], isActive, timeRange }) => {
  const config = mealLabels[type];

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-300 rounded-2xl border-2 p-6 h-full ${
        isActive 
          ? `${config.color} ring-4 ring-offset-2 ring-blue-500/20 shadow-xl scale-[1.02]` 
          : 'bg-white border-slate-100 shadow-sm opacity-90'
      }`}
    >
      {isActive && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
          Current / Next Meal
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl" role="img" aria-label={type}>{config.icon}</span>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{config.title}</h3>
          <p className="text-sm font-medium text-slate-500">{timeRange}</p>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-700">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="text-sm md:text-base">{item}</span>
          </li>
        ))}
      </ul>

      {!items.length && <p className="text-slate-400 italic text-sm">No items listed</p>}
    </div>
  );
};
