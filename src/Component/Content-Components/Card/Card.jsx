import React from 'react'
import Button from '../../Button/Button'
import { useNavigate } from 'react-router-dom';

function Card({ name, link, img, btntext }) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    if (link.startsWith("/")) {
      navigate(link);
    } else {
      window.open(link, "_blank");
    }
  };
  return (
    <div onClick={handleCardClick} className="card border-2 border-blue-500 hover:-translate-y-1 transition-transform cursor-pointer lg:block">
      <div className="hidden md:block">
        <img src={img} loading="lazy" className="block h-auto object-cover rounded-t-lg"/>
      </div>
      <div className="flex flex-col justify-between items-center text-center">
        <h3 className="font-mono text-sm px-1 h-12">{name}</h3>
        <Button text={btntext} color="blue" link={link} />
      </div>
      
    </div>
  )
}

export default Card
