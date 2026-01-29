import './Home.css'
import Card from '../../Component/HomeCard/Card.jsx'
import DigitalClock from '../../Component/Clock/DigitalClock'
import React, { useState, useEffect } from 'react'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from '../../Authentication/firebase.js';
import api from '../../api/axios.js'
import FullScreenLoader from '../../Component/Loader/FullScreenLoader.jsx'

function Home() {
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await api.get("/cards");
        setCards(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch cards");
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  const filteredCards = cards.filter(card => {
    const query = search.toLowerCase().trim();
    return card.name.toLowerCase().includes(query) || card.keywords.some(k => k.toLowerCase().includes(query));
  });

  const welcomeText = `Hi ${user?.displayName || "there"}`;

  if (loading) return <FullScreenLoader/>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>

  return (
    <div>
      <div className="welcome-wrap">
        <p className="welcome-text" style={{ "--chars": welcomeText.length }}>{welcomeText}</p>
        <span className="welcome-sub">Welcome back !!</span>
      </div>
      <DigitalClock/>
      <input
        type="text"
        placeholder="Search..."
        onChange={e => setSearch(e.target.value)}
        className="block w-[80%] max-w-md mx-auto px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400 text-gray-900"
      />
      <div className="cardContainer">
        {filteredCards.map((card, i) => (
          <Card key={i} name={card.name} link={card.link} img={card.img} btntext={card.btntext} />
        ))}
      </div>
    </div>
  )
}

export default Home