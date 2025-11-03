import React, { useEffect, useState } from 'react'

function DigitalClock() {

  const[time,setTime]=useState(new Date());

  useEffect(()=>{
    const intervalId=setInterval(()=>{
      setTime(new Date());
    },1000)


    return ()=>{
      clearInterval(intervalId);
    }

  },[]);

  function formatTime(){
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const meridium= hours>12 ? "PM" : "AM";
    hours=hours%12 || 12;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${meridium}`;
  }
  function padZero(number){
    return (number<10 ? "0" : "") + number;
  }


  return (
    <div className="clock-container">
        <div className="clock " style={{color:"blue", fontWeight:"bold", textAlign:"center", marginTop:"1em"}}>
            <span>{formatTime()}</span>
        </div>
    </div>
  )
}

export default DigitalClock