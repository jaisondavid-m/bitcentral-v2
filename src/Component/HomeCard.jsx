import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export function Card({ id, name, link, img, btntext }) {
  const navigate = useNavigate();

  const trackClick = () => {
    if (!id) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || api.defaults.baseURL || window.location.origin;
    const endpoint = new URL(`/cards/${id}/click`, baseUrl).toString();

    if (navigator.sendBeacon) {
      const body = new Blob(["{}"], { type: "application/json" });
      navigator.sendBeacon(endpoint, body);
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{}",
      keepalive: true,
    }).catch(() => { });
  };

  const handleNavigate = () => {
    trackClick();

    if (link?.startsWith("/")) {
      navigate(link);
    } else {
      window.open(link, "_blank");
    }
  };
  return (
    <article onClick={handleNavigate} className="group flex flex-col overflow-hidden rounded-lg border border-blue-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer sm:rounded-xl dark:border-blue-900 dark:bg-slate-950 dark:shadow-blue-950/30" aria-label={`Open ${name}`}>
      <div className="hidden sm:flex aspect-video w-full overflow-hidden bg-slate-100 items-center justify-center dark:bg-slate-900">
        {img ? (
          <img src={img} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" decoding="async" />
        ) : (
          <p className="text-center text-lg font-semibold text-slate-500 dark:text-slate-300">{name}</p>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base sm:min-h-[3rem] dark:text-slate-100">{name}</h3>
        <div className="flex-1" />

        <button onClick={(e) => { e.stopPropagation(); handleNavigate(); }} className="mt-2 inline-flex items-center cursor-pointer justify-center rounded-lg border border-slate-300 bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-3 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm dark:border-blue-900 dark:focus:ring-offset-slate-950" aria-label={`${btntext || "View"} ${name}`}>
          {btntext || "View"}
        </button>

      </div>
    </article>
  );
}