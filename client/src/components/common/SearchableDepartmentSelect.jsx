import React, { useState, useRef, useEffect, useMemo } from "react";
import { GraduationCap, Search, Check, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchableDepartmentSelect({
  departments = [],
  value,
  onChange,
  placeholder = "Type to search department or year...",
  allowUnmapped = false,
  unmappedLabel = "-- No Department Assigned (Unmapped) --",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Find currently selected department object
  const selectedDept = useMemo(() => {
    if (!value) return null;
    return departments.find((d) => String(d.id) === String(value)) || null;
  }, [departments, value]);

  // Filter departments based on search query
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return departments;
    const q = searchQuery.toLowerCase().trim();
    return departments.filter((dept) => {
      const code = (dept.code || "").toLowerCase();
      const year = (dept.year || "").toLowerCase();
      const name = (dept.name || "").toLowerCase();
      const displayName = (dept.display_name || "").toLowerCase();
      const fullName = (dept.full_name || "").toLowerCase();
      return (
        code.includes(q) ||
        year.includes(q) ||
        name.includes(q) ||
        displayName.includes(q) ||
        fullName.includes(q)
      );
    });
  }, [departments, searchQuery]);

  const handleSelect = (deptId) => {
    onChange(String(deptId));
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40 px-3.5 py-2.5 text-left text-xs transition-all hover:bg-white dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          {selectedDept ? (
            <div className="min-w-0 truncate">
              <span className="font-bold text-slate-900 dark:text-white block truncate">
                {selectedDept.display_name || `${selectedDept.code} - ${selectedDept.year}`}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {selectedDept.name}
              </span>
            </div>
          ) : allowUnmapped && (!value || value === "0" || value === "") ? (
            <span className="font-medium text-slate-500 dark:text-slate-400 truncate">
              {unmappedLabel}
            </span>
          ) : (
            <span className="font-medium text-slate-400 truncate">
              Select department...
            </span>
          )}
        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
          }`}
        />
      </button>

      {/* Floating Searchable Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-1.5 max-h-72 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Search Bar Input */}
            <div className="relative mb-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Department List Options */}
            <div className="max-h-52 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {allowUnmapped && (
                <button
                  type="button"
                  onClick={() => handleSelect("")}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer ${
                    !value || value === "0" || value === ""
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-bold"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="truncate">{unmappedLabel}</span>
                  {(!value || value === "0" || value === "") && (
                    <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  )}
                </button>
              )}

              {filteredDepartments.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400 italic">
                  No matching department found
                </div>
              ) : (
                filteredDepartments.map((dept) => {
                  const isSelected = String(dept.id) === String(value);
                  return (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => handleSelect(dept.id)}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-bold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {dept.code} - {dept.year}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {dept.name}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
