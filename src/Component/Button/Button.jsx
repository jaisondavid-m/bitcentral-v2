import React from 'react'
import './Button.css'

function Button({text,color,link}) {

  const handleClick = (l) => {
    window.open(l, "_blank");
  };

  return (
    <div>
      <a onClick={()=>handleClick(link)}><button style={{backgroundColor:color}} className='btn' >{text}</button></a>
    </div>
  )
}

export default Button
