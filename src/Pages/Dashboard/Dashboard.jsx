import React from 'react'
import { logout } from '../../Authentication/firebase.js'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from '../../Authentication/firebase.js';
import profile from "../../../public/CardImgs/profile.jpg"

function Dashboard() {

    const [user] = useAuthState(auth);
    if (!user) {
    navigate("/login");  
    return null;
  }


    return (

        <div className=''>
            <h1 className='my-5 text-center text-4xl'>Hi , {user.displayName}</h1>
            <div className='border-2 font-bold gap-y-5 w-[90%] md:w-[60%] sm:w-[60%] lg:w-[40%] mx-auto p-5 flex flex-col justify-center mt-5 border-blue-400 text-blue-500'>
                <img src={(user.photoURL)?(user.photoURL):profile} className='h-50 w-50 mx-auto rounded-full border-2' />
                <h1 className=''>Name : {user.displayName}</h1>
                <h1>Email : {user.email}</h1>
                <h1>Email Verified : {user.emailVerified ? "Yes ✅" : "No ❌"}</h1>
                <h1>First Login to Our Page :{new Date(Number(user.metadata.createdAt)).toLocaleString()}</h1>
                <h1>Last Login At :{new Date(Number(user.metadata.lastLoginAt)).toLocaleString()}</h1>
            </div>
            <button className='bg-blue-500 text-white rounded-2xl p-2 mx-auto mt-10 w-20 flex justify-center ' onClick={logout}>Logout</button>
        </div>
        
    )
}

export default Dashboard
