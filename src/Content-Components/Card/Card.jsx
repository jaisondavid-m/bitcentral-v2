import React, { useRef , useEffect} from 'react'
import Button from '../../Component/Button/Button'
import './Card.css'


function Card({name,link,img,btntext}) {


  return (
    <div className='card'>
      <div className="img">
        <img src={img} alt="" style={{display:"block",height:"300px", width:"max-content",borderRadius:"10px"}}/>
        <hr style={{marginTop:"20px"}}/>
      </div>
      <div className="cardbottom">
        <h3>{name}</h3>
        <Button text={btntext} color="blue" link={link} className="cardBTN"/>
      </div>
    </div>
  )
}
export default Card