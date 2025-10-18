import './Home.css'
import Card from '../../Component/Content-Components/Card/Card'
import data from "../../../Data/data"

import React from 'react'

function Home({name,link,img}) {
  return (
    <div className="cardContainer">
        {
        data.cards.map((card,index)=>(
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
  )
}

export default Home