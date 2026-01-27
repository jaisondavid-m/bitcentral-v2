import './Home.css'
import Card from '../../Component/Content-Components/Card/Card'
import data from "../../../Data/Data.json"
import DigitalClock from '../../Component/Clock/DigitalClock'
import React, { useState } from 'react'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from '../../Authentication/firebase.js';
//🍵☕🍚🍞

function Home() {

  const [sreach,Setsreach]=useState("");
  const [user] = useAuthState(auth);

  const handleSreach=(e)=>{
    Setsreach(e.target.value)
  }

  const FilteredData = data.cards.filter((card) => {
    const searchLower = sreach.toLowerCase().trim();
    const nameMatch = card.name.toLowerCase().includes(searchLower);
    const keywordsMatch = card.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchLower)
    );
    return nameMatch || keywordsMatch;
  });
  const welcomeText = `Hi ${user?.displayName || "there"}`;

  return (
    <div>
      <div className="welcome-wrap">
        <p className="welcome-text" style={{ "--chars": welcomeText.length }} >{welcomeText}</p>
        <span className="welcome-sub">Welcome back !!</span>
      </div>
      <DigitalClock/>
      <input type="text" placeholder="Search..." onChange={handleSreach}
        className="block w-[80%] max-w-md mx-auto px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400 text-gray-900"
      />
      <div className="cardContainer">

        {
          FilteredData.map((card, index) => (
            <Card
              key={index}
              name={card.name}
              link={card.link}
              img={card.img}
              btntext={card.btntext}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Home