import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { auth } from "./Authentication/firebase.js"

import NavBar from './Component/NavBar/NavBar'
import Footer from './Component/Footer/Footer'

import Login from './Pages/Login/Login.jsx'
import Dashboard from './Pages/Dashboard/Dashboard.jsx'
import Home from './Pages/Home/Home.jsx'
import About from './Pages/About/About.jsx'
import Rpsite from './Pages/RPsite/Rpsite.jsx'
import SemOne from './Pages/Sem1material/SemOne.jsx'
import './App.css'

function App() {

   const [user,setUser]=useState();

   useEffect(()=>{
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
   })

  return(
    <div>
      {user && <NavBar/>}
          <Routes>
             <Route path='/' element={user ? <Navigate to="/home" /> : <Login />}/>
             <Route path='/dashboard' element={user ? <Dashboard/> : <Login />}/>
            <Route path='/home' element={user?<Home/>:<Login />}/>
            <Route path='/rpsite' element={user?<Rpsite/>:<Login />}/>
            <Route path='/about' element={user?<About/>:<Login />}/>
            <Route path='/profile' element={user?<Dashboard/>:<Login />}/>
            <Route path='/sem1mat' element={user?<SemOne/>:<Login />}/>
          </Routes>
       {user && <Footer/>}
    </div>
  )
}

export default App