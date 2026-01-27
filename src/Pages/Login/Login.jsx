import React, { useEffect, useState } from 'react'
import { auth, signInWithGoogle, logout } from "../../Authentication/firebase.js";

function Login() {

  const [disabled,setDisabled] = useState(true);

  useEffect(()=>{
    const timer = setTimeout(() => {
      setDisabled(false);
    }, 2000);
    return () => clearTimeout(timer);
  },[])

  return (
    <div className="w-[90%] sm:w-[60%] lg:w-[40%] md:w-[90%] border-2 rounded-4xl mx-auto mt-20">
      
      <h1 className="bg-blue-500 rounded-t-4xl text-white text-4xl p-4 font-bold text-center">Login To BIT Central</h1>

      <p className="text-center text-sm text-gray-600 mt-4 px-4">
        Continue with your <span className="font-semibold text-blue-600">bitsathy.ac.in</span> mail ID
        for a better experience.
      </p>
      <div className={`flex items-center gap-2 mb-10 rounded-2xl px-4 py-2 mt-6 w-max mx-auto transition ${disabled ? 'bg-gray-400 cursor-not-allowed opacity-60' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
        <img src="https://img.icons8.com/?size=96&id=17949&format=png" className="h-8" alt="Google"/>
        <button className="font-medium" disabled={disabled} onClick={!disabled ? signInWithGoogle : undefined} >
          {disabled ? 'Please wait...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}

export default Login;
