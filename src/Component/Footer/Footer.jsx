// import React from 'react'

// function Footer() {
//   return (
//     <div className='bg-blue-700 text-white text-center p-3' style={{display:"fixed",bottom:"0px"}}>
//        <p>&copy; All rights Reserved</p>
//        <a href="https://www.linkedin.com/in/jaison-david-m-a14072360/" target="_blank"><p className='font-bold'>Crafted by an average 1st-year boy</p></a>
//     </div>
//   )
// }

// export default Footer
import React from "react";

export default function Footer(){
  return (
    <footer className="bg-blue-700 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        

        <p className="text-sm">
          © {new Date().getFullYear()} BIT CENTRAL . All rights reserved.
        </p>
        
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>
      </div>
    </footer>
  );
};
