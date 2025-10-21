import './Home.css'
import Card from '../../Component/Content-Components/Card/Card'
import data from "../../../Data/Data.json"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from './../../Firebase';

import React from 'react'

function Home({ name, link, img }) {

  const [user] = useAuthState(auth);

  return (
    <div>
      <div className='border-b-2 w-max-5 text-center font-bold text-blue-900 text-4xl mx-auto m-5 p-3'>Welcome {user ? user.displayName : "Guest"}</div>
      <div className="cardContainer">

        {
          data.cards.map((card, index) => (
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