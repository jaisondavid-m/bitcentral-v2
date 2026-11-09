import React from "react";
import { useNavigate } from "react-router-dom";
import DynamicIcon from "@/components/common/DynamicIcon.jsx";
import { ArrowUpRight } from "lucide-react";
import { haptics } from "@/utils/haptics.js";

export function Card({ id, name, description, link, img, icon, btntext }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    haptics.action();
    if (link?.startsWith("/")) {
      navigate(link);
    } else if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <article
      onClick={handleNavigate}
      className="group flex flex-col justify-between h-full overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-900 bg-white p-3.5 sm:p-4.5 md:p-5 shadow-[2px_2px_0px_#18181b] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] cursor-pointer dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff] dark:hover:shadow-[4px_4px_0px_#ffffff] dark:active:shadow-[1px_1px_0px_#ffffff]"
      aria-label={`Open ${name}`}
    >
      <div className="flex-1 flex flex-col">
        {/* Desktop / Tablet image & icon container */}
        <div className="hidden sm:block relative w-full h-40 sm:h-44 md:h-48 lg:h-52 mx-auto overflow-hidden rounded-xl border border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800/60 shadow-[1.5px_1.5px_0px_#18181b] dark:shadow-[1.5px_1.5px_0px_#ffffff] mb-3 sm:mb-3.5 shrink-0">
          {img ? (
            <img
              src={img}
              alt={name}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50/70 dark:bg-zinc-800/80">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border border-zinc-900 bg-white text-blue-600 shadow-[2px_2px_0px_#18181b] transition-transform duration-200 group-hover:scale-110 dark:border-white dark:bg-[#111827] dark:text-blue-400 dark:shadow-[2px_2px_0px_#ffffff]">
                <DynamicIcon
                  name={icon || "Award"}
                  className="h-6 w-6 sm:h-7 sm:w-7"
                />
              </div>
            </div>
          )}
        </div>

        {/* Feature Title */}
        <h3 className="line-clamp-2 sm:line-clamp-1 text-xs font-black sm:text-base tracking-tight text-zinc-900 dark:text-zinc-50 min-h-[2.25rem] sm:min-h-0">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="hidden sm:block mt-1 line-clamp-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
        className="mt-3 sm:mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border border-zinc-900 bg-blue-600 px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] transition-all hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-white dark:shadow-[2px_2px_0px_#ffffff] cursor-pointer"
        aria-label={`${btntext || "Open"} ${name}`}
      >
        <span>{btntext || "Open"}</span>
        <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
      </button>
    </article>
  );
}

export default Card;
