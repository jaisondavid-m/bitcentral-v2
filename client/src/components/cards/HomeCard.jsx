import React from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";
import DynamicIcon from "@/components/common/DynamicIcon.jsx";

export function Card({ id, name, description, link, img, icon, btntext }) {
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
    <article
      onClick={handleNavigate}
      className="group flex flex-col justify-between h-full overflow-hidden rounded-xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer sm:rounded-2xl dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/40"
      aria-label={`Open ${name}`}
    >
      <div>
        {/* Image / Icon container (Hidden on mobile for classic UI, displayed on tablet & desktop) */}
        <div className="hidden sm:block relative w-full max-w-[200px] sm:max-w-[210px] aspect-square mx-auto overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 mb-2.5 shrink-0">
          {img ? (
            <img
              src={img}
              alt={name}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-blue-100/70 via-blue-50/50 to-blue-50/20 dark:from-blue-950/50 dark:via-blue-950/20 dark:to-slate-900/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-200/80 bg-white shadow-sm transition-transform group-hover:scale-110 dark:border-blue-800 dark:bg-slate-900">
                <DynamicIcon
                  name={icon || "Award"}
                  className="h-5.5 w-5.5 text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Feature Title */}
        <h3 className="line-clamp-2 sm:line-clamp-1 text-xs font-semibold sm:text-base sm:font-bold text-slate-900 dark:text-slate-100 min-h-[2rem] sm:min-h-0">
          {name}
        </h3>

        {description && (
          <p className="hidden sm:block mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400 leading-snug">
            {description}
          </p>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNavigate();
        }}
        className="mt-2 sm:mt-3 inline-flex w-full items-center justify-center rounded-lg sm:rounded-xl bg-blue-600 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer dark:focus:ring-offset-slate-950"
        aria-label={`${btntext || "View"} ${name}`}
      >
        {btntext || "View"}
      </button>
    </article>
  );
}

export default Card;