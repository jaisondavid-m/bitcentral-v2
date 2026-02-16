import React, { useState } from 'react'
import FullScreenLoader from '../Component/FullScreenLoader';
import { useNavigate } from "react-router-dom";

function Rpsite() {
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();
  return (
    <div>
      {loading && <FullScreenLoader/>}
      <iframe className='w-screen h-screen block border-none' id="rewardFrame" src="https://script.google.com/macros/s/AKfycbzyDfs25UGZnrRfXQbtcXkCh6C0WrXc2KR0zbh3smbA6Q7JEE7_0hrL9S_Go5npZpMXGQ/exec" onLoad={() => setTimeout(() => setLoading(false), 500)} title="RP Site"></iframe>
      <button onClick={() => navigate("/")} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all">⬅ Home</button>
    </div>
  )
}

export default Rpsite
