import React from "react";
import { useNavigate } from "react-router-dom";

export function Card({ name, link, img, btntext }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (link?.startsWith("/")) {
      navigate(link); 
    } else {
      window.open(link, "_blank");
    }
  };
  return (
    <div onClick={handleNavigate} className="group flex flex-col overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer sm:rounded-xl">
      <div className="hidden sm:flex aspect-video w-full overflow-hidden bg-slate-100 items-center justify-center">
        {img ? (
          <img src={img} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-105"/>
        ) : (
          <h1 className="text-center text-lg font-semibold text-slate-500">{name}</h1>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base sm:min-h-[3rem]">{name}</h3>
        <div className="flex-1" />
        
        <button onClick={(e) => {e.stopPropagation();handleNavigate();}} className="mt-2 inline-flex items-center cursor-pointer justify-center rounded-lg border border-slate-300 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-3 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm">
          {btntext || "View"}
        </button>
        
      </div>
    </div>
  );
}