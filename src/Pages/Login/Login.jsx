import React from 'react'
import { signInWithGoogle } from "./../../Firebase";

function Login() {
  return (
    <div className=' w-[90%] md:w-[60%] sm:w-[60%] lg:w-[40%] border-2 mx-auto mt-20'>
      <h1 className='bg-blue-500 text-white text-4xl p-4 font-bold text-center'>Login</h1>
      <div className='flex bg-blue-500 text-white rounded-2xl p-2 m-15 w-max mx-auto'>
        <img src="https://img.icons8.com/?size=96&id=17949&format=png" className='h-8'/>
        <button onClick={signInWithGoogle} >SignIn With Google</button>
      </div>
    </div>
  )
}

export default Login