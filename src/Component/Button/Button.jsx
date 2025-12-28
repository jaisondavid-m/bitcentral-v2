import React from 'react'
import { useNavigate } from 'react-router-dom';

function Button({text,color,link}) {
  const navigate = useNavigate();

  const handleClick = (l) => {
    if (link.startsWith("/")) {
      navigate(link);
    }
    else{
      window.open(l, "_blank");
    }
  };

  return (
    <div className='text-sm font-mono lg:text-xl lg:p-5'>
      <a  onClick={()=>handleClick(link)}><button className='rounded-xl border border-blue-500 p-1  tracking-tight text-white' style={{backgroundColor:color}}>{text}</button></a>
    </div>
  )
}

export default Button
