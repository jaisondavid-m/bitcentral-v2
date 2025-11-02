import { useState } from 'react'
import NavBar from './Component/NavBar/NavBar'
import './App.css'
import Footer from './Component/Footer/Footer'
import Home from './Pages/Home/Home'
import Contact from './Pages/Contact/Contact'
import About from './Pages/About/About'
import { Route,Routes,Navigate, useLocation } from 'react-router-dom'

function App() {



  return(
    <div>

      
      <NavBar/>
      <Routes>
        
        <Route path='/' element={<Navigate to="/home" />}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/about' element={<About/>}/>
        
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
