import { useState } from 'react'
import Card from './Content-Components/Card/Card'
import NavBar from './Component/NavBar/NavBar'
import data from "../Data/Data.json"
import './App.css'

function App() {

  return(
    <div>
      <NavBar/>
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
    </div>
  )
}

export default App
