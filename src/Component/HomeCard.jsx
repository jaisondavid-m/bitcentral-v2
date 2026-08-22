import React from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
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
    }).catch(() => {});
  };

  const handleNavigate = () => {
    trackClick();

    if (link?.startsWith("/")) {
      navigate(link);
    } else {
      window.open(link, "_blank");
    }
  };

  const isExternal = !link?.startsWith("/");

  return (
    <article
      onClick={handleNavigate}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      aria-label={`Open ${name}`}
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800/60 relative">
        {img ? (
          <img
            src={img}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center p-4 text-center">
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">{name}</span>
          </div>
        )}

        {isExternal && (
          <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/60 backdrop-blur-md text-white border border-white/20 opacity-80 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 space-y-3 justify-between">
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {name}
        </h3>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 group-hover:bg-blue-600 dark:bg-slate-800 dark:group-hover:bg-blue-600 text-slate-700 group-hover:text-white dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          aria-label={`${btntext || "Open"} ${name}`}
        >
          <span>{btntext || "Open Portal"}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}