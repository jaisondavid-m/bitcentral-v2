import React from 'react';

const mealLabels = {
  breakfast: { title: 'Breakfast', icon: '🍳' },
  lunch: { title: 'Lunch', icon: '🍱' },
  tea: { title: 'Tea Break', icon: '☕' },
  dinner: { title: 'Dinner', icon: '🍽️' },
};

export const MealCard = ({ type, items = [], isActive }) => {
  const config = mealLabels[type];

  return (
    <div
      className={`relative rounded-lg border overflow-hidden transition-all ${isActive ? 'border-blue-300 shadow-lg bg-blue-50' : 'border-slate-200 shadow bg-white hover:shadow-md'}`}
    >
      
      <div className={`px-4 py-3 border-b ${isActive ? 'border-blue-200 bg-white' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <h3 className="text-base md:text-lg font-semibold text-slate-900">
              {config.title}
            </h3>
          </div>
          
          {isActive && ( <span className="bg-blue-500 text-white text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wide">Active / Upcoming</span>)}
        
        </div>
      </div>


      <div className="p-4">
        {items.length > 0 ? (
          <>
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className={`flex items-start gap-2 ${isActive ? 'text-slate-800' : 'text-slate-700'}`}>
                  <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? 'bg-blue-500' : 'bg-slate-400'}`} />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className={`mt-3 pt-3 border-t ${isActive ? 'border-blue-200' : 'border-slate-200'}`}>
              <p className={`text-xs text-center ${isActive ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-400 text-sm">No items available</p>
          </div>
        )}
      </div>
    </div>
  );
};