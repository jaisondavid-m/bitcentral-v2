import './Home.css'
import Card from '../../Component/Content-Components/Card/Card'
import data from "../../../Data/Data.json"

import React, { useState } from 'react'

function Home() {

  const [sreach,Setsreach]=useState("");

  const handleSreach=(e)=>{
    Setsreach(e.target.value);
  }

  const FilteredData = data.cards.filter((cards)=>
    cards.name.trim().toLowerCase().includes(sreach.toLowerCase())
  )

  return (
    <div>
      <div className='txt border-b-2  text-center font-bold md:text-blue-900 md:text-4xl text-blue-500 text-2xl p-2'><p>Welcome To BIT Centeral</p></div>
      <input type="text"
       placeholder='Sreach...'
       onChange={handleSreach}
       className="block cosmic-input w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto my-6 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-300 hover:border-slate-400 focus:outline-none focus:border-transparent focus:ring-4 focus:ring-blue-500/50 shadow-lg hover:shadow-xl focus:shadow-2xl transition-all duration-300 ease-in-out placeholder:text-slate-400 text-slate-800 font-medium"
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