import React from 'react'
import './Button.css'

function Button({text,color,link}) {

  const handleClick = (l) => {
    if(l!="https://bitcenteral.netlify.app/rpsite"){
      window.open(l, "_blank");
    }
    else{
      window.open(l, "_self");
    }
  };

  return (
    <div>
      <a onClick={()=>handleClick(link)}><button style={{backgroundColor:color}} className='btn' >{text}</button></a>
    </div>
  )
}

export default Button
