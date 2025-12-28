import React from 'react'
import { auth, signInWithGoogle, logout } from "../../Authentication/firebase.js";

function Login() {
  return (
    <div className=' w-[90%] rounded-4xl sm:w-[60%] lg:w-[40%] border-2 mx-auto mt-20 md:w-[90%]'>
      <h1 className='bg-blue-500 rounded-t-4xl text-white text-4xl p-4 font-bold text-center'>Login To BIT Central</h1>
      <div className='flex bg-blue-500 text-white rounded-2xl p-2 m-15 w-max mx-auto'>
        <img src="https://img.icons8.com/?size=96&id=17949&format=png" className='h-8'/>
        <button className='cursor-pointer' onClick={signInWithGoogle} >SignIn With Google</button>
      </div>
    </div>
  )
}

export default Login
