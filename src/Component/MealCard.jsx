import React from "react";

const mealLabels = {
  breakfast: { title: "Breakfast", icon: "🍳" },
  lunch: { title: "Lunch", icon: "🍱" },
  dinner: { title: "Dinner", icon: "🍽️" },
};

export const MealCard = ({ type, items = [], isActive }) => {
  const config = mealLabels[type];

  return (
    <div
      className={`rounded-xl bg-white transition-all
        ${isActive ? "ring-2 ring-blue-400 shadow-lg" : "shadow-sm hover:shadow-md"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <h3 className="text-lg font-semibold text-slate-900">
            {config.title}
          </h3>
        </div>

        {isActive && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        {items.length > 0 ? (
          <>
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs text-slate-500 text-right">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-400 text-center py-6">
            No items available
          </p>
        )}
      </div>
    </div>
  );
};
