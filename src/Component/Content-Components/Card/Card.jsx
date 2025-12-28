import React, { useRef , useEffect} from 'react'
import Button from '../../Button/Button'
import './Card.css'


function Card({name,link,img,btntext}) {


  return (
    <div className='card lg:block '>
      <div className="img">
        <img src={img} alt="" className='h-auto display' style={{display:"block",height:"auto"}}/>
        {/* <hr style={{marginTop:"20px"}}/> */}
      </div>
      <div className="flex flex-col cardbottom justify-between items-center">
        <h3 className='font-mono text-sm px-1 h-12'>{name}</h3>
        <Button text={btntext} color="blue" link={link} className=""/>
      </div>
    </div>
  )
}
export default Card