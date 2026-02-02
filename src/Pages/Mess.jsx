import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import { MealCard } from '../Component/MealCard.jsx';
import { MessMenuSkeleton } from '../Component/Skeltons/MealCardSkeleton.jsx';
import { useNavigate } from "react-router-dom";

const MEAL_ORDER = ['breakfast', 'lunch', 'tea', 'dinner'];

export default function MessMenu() {
  const navigate = useNavigate();
  const [hostel, setHostel] = useState('boys');
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [messResponse, setMessResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMess = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/mess', {
          params: { hostel, date: selectedDate }
        });
        setMessResponse(res.data);
      } catch (err) {
        setError('No mess data available');
        setMessResponse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMess();
  }, [hostel, selectedDate]);

  const orderedMeals = useMemo(() => {
    if (!messResponse?.activeMeal) return MEAL_ORDER;
    const idx = MEAL_ORDER.indexOf(messResponse.activeMeal);
    if (idx === -1) return MEAL_ORDER;
    return [...MEAL_ORDER.slice(idx), ...MEAL_ORDER.slice(0, idx)];
  }, [messResponse]);

  return (
    <div className="min-h-screen bg-slate-50 py-4 px-3 md:py-6 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow border border-slate-200 p-4 md:p-5 mb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Hostel Mess Menu
              </h1>
              {messResponse?.data?.day && (
                <p className="text-sm text-slate-500 mt-1">
                  {messResponse.data.day}, {messResponse.date}
                </p>
              )}
            </div>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition text-sm"
            />
          </div>

          {/* Hostel Switch */}
          <div className="mt-4 flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setHostel('boys')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                hostel === 'boys'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👦 Boys Hostel
            </button>
            <button
              onClick={() => setHostel('girls')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                hostel === 'girls'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👧 Girls Hostel
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <MessMenuSkeleton />
        ) : error ? (
          <div className="bg-white rounded-lg p-10 text-center shadow border border-slate-200">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="text-slate-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {orderedMeals.map((meal) => (
              <MealCard
                key={meal}
                type={meal}
                items={messResponse?.data?.[meal] || []}
                isActive={messResponse?.activeMeal === meal}
              />
            ))}
          </div>
        )}
      </div>
      <button onClick={() => navigate("/")} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all">⬅ Home</button>
    </div>
  );
}