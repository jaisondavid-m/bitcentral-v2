import React, { useState, useEffect, useMemo } from 'react';
import { HostelType, MEAL_TIMINGS } from './constants.js';
import { 
  getActiveMeal, 
  getMessDataByDate, 
  formatDateToISO
} from '../../utlis/dateUtlis.js';
import { MealCard } from '../../Component/MealCard/MealCard.jsx';

export default function MessMenu() {
  const [activeTab, setActiveTab] = useState(HostelType.BOYS);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const currentMealType = useMemo(() => getActiveMeal(currentTime), [currentTime]);

  const displayedData = useMemo(() => {
    return getMessDataByDate(activeTab, selectedDate);
  }, [activeTab, selectedDate]);

  const isSelectedDateToday = useMemo(() => {
    const today = new Date();
    return selectedDate.getDate() === today.getDate() &&
           selectedDate.getMonth() === today.getMonth() &&
           selectedDate.getFullYear() === today.getFullYear();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    if (!e.target.value) return;
    const [year, month, day] = e.target.value.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
  };

  const mealSections = ['breakfast', 'lunch', 'tea', 'dinner'];

  // Sort meals to show current/upcoming meal first
  const sortedMealSections = useMemo(() => {
    if (!isSelectedDateToday || !currentMealType) {
      return mealSections;
    }
    
    const currentIndex = mealSections.indexOf(currentMealType);
    if (currentIndex === -1) {
      return mealSections;
    }
    
    // Reorder array to put current meal first, followed by remaining meals in order
    return [
      ...mealSections.slice(currentIndex),
      ...mealSections.slice(0, currentIndex)
    ];
  }, [isSelectedDateToday, currentMealType]);

  return (
    <div className="min-h-screen pb-20 max-w-6xl mx-auto px-4 md:px-8">
      <header className="py-8 md:py-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Hostel <span className="text-blue-600">Mess</span> Details
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="date-picker" className="hidden sm:inline text-sm font-semibold text-slate-600">Change Date:</label>
            <input 
              id="date-picker"
              type="date"
              value={formatDateToISO(selectedDate)}
              onChange={handleDateChange}
              className="px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors shadow-sm bg-white font-medium text-slate-800"
            />
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-1 rounded-[20px] flex w-full md:w-fit shadow-lg border border-white/50 backdrop-blur-xl">
        <div 
            className={`absolute top-1 bottom-1 rounded-[16px] bg-gradient-to-br from-white via-white to-slate-50 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            activeTab === HostelType.BOYS ? 'left-1 right-1/2 mr-0.5' : 'left-1/2 right-1 ml-0.5'
            }`}
            style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}
        />
        
        <button 
            onClick={() => setActiveTab(HostelType.BOYS)}
            className={`relative z-10 flex-1 md:w-48 py-3.5 rounded-[16px] text-sm font-semibold transition-all duration-500 ease-out ${
            activeTab === HostelType.BOYS 
                ? 'text-blue-600 scale-[1.01]' 
                : 'text-slate-400 hover:text-slate-600 active:scale-[0.98]'
            }`}
        >
            <span className="inline-block transition-transform duration-300 hover:scale-110">
            👦
            </span>
            {' '}
            <span className="tracking-tight">Boys Mess</span>
        </button>
        
        <button 
            onClick={() => setActiveTab(HostelType.GIRLS)}
            className={`relative z-10 flex-1 md:w-48 py-3.5 rounded-[16px] text-sm font-semibold transition-all duration-500 ease-out ${
            activeTab === HostelType.GIRLS 
                ? 'text-pink-600 scale-[1.01]' 
                : 'text-slate-400 hover:text-slate-600 active:scale-[0.98]'
            }`}
        >
            <span className="inline-block transition-transform duration-300 hover:scale-110">
            👧
            </span>
            {' '}
            <span className="tracking-tight">Girls Mess</span>
        </button>
        </div>
      </header>

      <main className="transition-all duration-500">
        {!displayedData ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-slate-800">No data available</h3>
            <p className="text-slate-500 text-center max-w-sm mt-2">
              We couldn't find mess details for the selected date. Please pick another date or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {sortedMealSections.map((meal) => {
              const isCurrent = isSelectedDateToday && currentMealType === meal;
              const timeRange = `${MEAL_TIMINGS[meal].start} - ${MEAL_TIMINGS[meal].end}`;
              
              return (
                <MealCard 
                  key={meal}
                  type={meal}
                  items={displayedData[meal]}
                  isActive={isCurrent}
                  timeRange={timeRange}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}   