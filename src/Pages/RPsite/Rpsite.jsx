import React, { useState } from 'react'
import FullScreenLoader from '../../Component/Loader/FullScreenLoader';

function Rpsite() {
  const [loading,setLoading] = useState(true);
  return (
    <div>
      {loading && <FullScreenLoader/>}
      <iframe className='w-screen h-screen block border-none' id="rewardFrame" src="https://script.google.com/macros/s/AKfycbz9D8blougMP6HmgszDaNjOx4NC_Yw7KHXESkFStT04SfsOerz_tasibYhPX_2pBxQEKA/exec" onLoad={() => setTimeout(() => setLoading(false), 500)} title="RP Site"></iframe>
    </div>
  )
}

export default Rpsite
