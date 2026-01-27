import React, { useEffect, useState } from 'react'

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function formatTime() {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const meridium = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${meridium}`;
  }

  function padZero(num) {
    return (num < 10 ? "0" : "") + num;
  }

  return (
    <div className="top-clock">
      {formatTime()}
    </div>
  )
}

export default DigitalClock
