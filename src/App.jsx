import { useState } from 'react'
import NavBar from './Component/NavBar/NavBar'
import './App.css'
import Footer from './Component/Footer/Footer'
import Home from './Pages/Home/Home'
import Contact from './Pages/Contact/Contact'
import About from './Pages/About/About'
import { Route,Routes,Navigate, useLocation } from 'react-router-dom'
import Login from './Pages/Login/Login'
import { auth} from "./Firebase";
import { useEffect } from 'react'

function App() {

  const [user,setUser]=useState();

   useEffect(()=>{
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
   })

   const location=useLocation();
   const hideLayout = location.pathname === '/' || location.pathname === '/login';



  return(
    <div>

      {!hideLayout && <NavBar/>}

      <Routes>
        <Route path='/' element={user ? <Navigate to="/home" /> : <Login />}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/contact' element={user ? <Contact/> : <Navigate to="/" />}/>
        <Route path='/about' element={user ? <About/> : <Navigate to="/" />}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      {!hideLayout && <Footer/>}
    </div>
  )
}

export default App
