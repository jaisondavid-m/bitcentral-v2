import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios.js';
import { MealCard } from '../../Component/MealCard/MealCard.jsx';
import { MessMenuSkeleton } from '../../Component/MealCard/MealCardSkeleton.jsx';

const MEAL_ORDER = ['breakfast', 'lunch', 'tea', 'dinner'];

export default function MessMenu() {
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
          params: {
            hostel,
            date: selectedDate
          }
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

    return [
      ...MEAL_ORDER.slice(idx),
      ...MEAL_ORDER.slice(0, idx)
    ];
  }, [messResponse]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
      {/* Header */}
      <header className="py-10 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Hostel <span className="text-blue-600">Mess Menu</span>
          </h1>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Hostel Switch */}
        <div className="flex bg-slate-100 rounded-2xl p-1 w-fit">
          <button
            onClick={() => setHostel('boys')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              hostel === 'boys'
                ? 'bg-white text-blue-600 shadow'
                : 'text-slate-500'
            }`}
          >
            👦 Boys
          </button>

          <button
            onClick={() => setHostel('girls')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              hostel === 'girls'
                ? 'bg-white text-pink-600 shadow'
                : 'text-slate-500'
            }`}
          >
            👧 Girls
          </button>
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <MessMenuSkeleton />
      ) : error ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-24 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-slate-800">{error}</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderedMeals.map((meal) => (
            <MealCard
              key={meal}
              type={meal}
              items={messResponse?.data?.[meal] || []}
              isActive={messResponse?.activeMeal === meal}
              timeRange=""
            />
          ))}
        </div>
      )}
    </div>
  );
}
