import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";
import api from "../api/axios.js";
import { Card } from "../Component/HomeCard.jsx";
import { HomeCardSkeleton } from "../Component/Skeltons/HomeCardSkeleton.jsx";
import SearchBar from "../Component/SearchBar.jsx";

function Home() {
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [user] = useAuthState(auth);
  const recognitionRef = useRef(null);



  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await api.get("/cards");
        setCards(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cards");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice search is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const filteredCards = cards.filter((card) => {
    const query = search.toLowerCase().trim();
    return (
      card.name.toLowerCase().includes(query) ||
      card.keywords.some((k) => k.toLowerCase().includes(query))
    );
  });

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <SearchBar search={search} setSearch={setSearch} />
        {loading ? (
          <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <HomeCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {filteredCards.map((card, index) => (
              <Card
                key={card.id || index}
                name={card.name}
                link={card.link}
                img={card.img}
                btntext={card.btntext}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-base text-gray-500 sm:text-lg">No Site Found</p>
            {search && (
              <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                Try adjusting your search
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;