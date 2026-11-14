import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { DEFAULT_DEPARTMENTS_LIST } from "./adminConstants.js";

export function DepartmentSelect({
  value = "ALL",
  onChange,
  label = "Department",
  isMulti = true,
  customOptions = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableDepts = useMemo(() => {
    const baseList = customOptions && customOptions.length > 0 ? customOptions : DEFAULT_DEPARTMENTS_LIST;
    const hasAll = baseList.some((d) => d.code === "ALL");
    return hasAll ? baseList : [{ code: "ALL", name: "All Departments" }, ...baseList];
  }, [customOptions]);

  const selectedCodes = useMemo(() => {
    if (!value || value.toUpperCase() === "ALL") return ["ALL"];
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }, [value]);

  const isAll = selectedCodes.includes("ALL");

  const filteredDepts = useMemo(() => {
    if (!search.trim()) return availableDepts;
    const q = search.toLowerCase();
    return availableDepts.filter(
      (d) => d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
    );
  }, [availableDepts, search]);

  const handleToggleCode = (code) => {
    if (!isMulti) {
      onChange(code);
      setIsOpen(false);
      return;
    }

    if (code === "ALL") {
      onChange("ALL");
      return;
    }

    let next = selectedCodes.filter((c) => c !== "ALL");
    if (next.includes(code)) {
      next = next.filter((c) => c !== code);
    } else {
      next.push(code);
    }

    if (next.length === 0) {
      onChange("ALL");
    } else {
      onChange(next.join(", "));
    }
  };

  const displayText = useMemo(() => {
    if (isAll) return "All Departments";
    if (selectedCodes.length === 1) {
      const found = availableDepts.find((d) => d.code === selectedCodes[0]);
      return found ? found.name : selectedCodes[0];
    }
    return `${selectedCodes.length} Departments Selected (${selectedCodes.join(", ")})`;
  }, [isAll, selectedCodes, availableDepts]);

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      {label && (
        <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between rounded-xl border border-zinc-900 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-900 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer text-left"
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-full min-w-[280px] rounded-xl border-2 border-zinc-900 bg-white shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[4px_4px_0px_#ffffff] p-2 animate-in fade-in zoom-in-95 duration-100">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter department code or name..."
              className="w-full rounded-lg border border-zinc-300 bg-zinc-50 pl-8 pr-2.5 py-1.5 text-xs font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1">
            {filteredDepts.map((d) => {
              const isSelected = isAll ? d.code === "ALL" : selectedCodes.includes(d.code);
              return (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => handleToggleCode(d.code)}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-bold text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "hover:bg-zinc-100 text-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className="truncate pr-2">
                    <span className="font-mono uppercase font-black mr-1.5">[{d.code}]</span>
                    {d.name}
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
