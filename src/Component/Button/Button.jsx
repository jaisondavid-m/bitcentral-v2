import React from 'react'
import './Button.css'

function Button({text,color,link}) {
  return (
    <div>
      <a href={link} target="_blank" ><button style={{backgroundColor:color}} className='btn' >{text}</button></a>
    </div>
  )
}

export default Button
