import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Mic, MicOff, Search, X } from "lucide-react";
import { haptics } from "@/utils/haptics.js";

function SearchBar({
  search,
  setSearch,
  isSearching = false,
  placeholder = "Search resources, marks, portals...",
  isDark = false,
  className = "",
}) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearch(transcript);
        setIsListening(false);
        setError("");
        haptics.success();
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
        haptics.error();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [setSearch]);

  const toggleVoiceSearch = useCallback(() => {
    haptics.selection();
    if (!recognitionRef.current) {
      setError("Voice search is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError("");
      } catch (err) {
        console.error("Failed to start voice recognition:", err);
      }
    }
  }, [isListening]);

  const handleClearSearch = useCallback(() => {
    haptics.action();
    setSearch("");
    setError("");
  }, [setSearch]);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative mx-auto w-full max-w-xl rounded-xl shadow-[3px_3px_0px_#18181b] dark:shadow-[3px_3px_0px_#fafafa] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#18181b] dark:hover:shadow-[5px_5px_0px_#fafafa] focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-[5px_5px_0px_#18181b] dark:focus-within:shadow-[5px_5px_0px_#fafafa]">
        {/* Left search icon stamp */}
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
          <Search className="h-4.5 w-4.5 stroke-[2.5]" />
        </div>

        {/* Neo-brutalist Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setError("");
          }}
          className={`block w-full rounded-xl border border-zinc-900 bg-white pl-10.5 sm:pl-11 pr-24 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-zinc-900 placeholder:text-zinc-400 placeholder:font-medium focus:outline-none dark:border-zinc-100 dark:bg-[#111827] dark:text-zinc-50 dark:placeholder:text-zinc-500 ${
            isDark ? "dark" : ""
          }`}
        />

        {/* Right side interactive actions */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1.5">
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-100 text-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all dark:border-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[1.5px_1.5px_0px_#fafafa] cursor-pointer"
              aria-label="Clear search"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          )}

          {isSearching && (
            <div
              className="inline-flex h-7 w-7 items-center justify-center text-blue-600 dark:text-blue-400"
              title="Searching..."
            >
              <Loader2 className="h-4 w-4 animate-spin stroke-[2.5]" />
            </div>
          )}

          <button
            type="button"
            onClick={toggleVoiceSearch}
            className={`inline-flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-zinc-900 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer dark:border-zinc-100 dark:shadow-[2px_2px_0px_#fafafa] ${
              isListening
                ? "bg-rose-600 text-white animate-pulse"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-label="Voice search"
            title={isListening ? "Stop listening" : "Start voice search"}
          >
            {isListening ? (
              <MicOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
            ) : (
              <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Status feedback notifications */}
      {isListening && (
        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 shadow-[2px_2px_0px_#18181b] dark:border-zinc-100 dark:bg-rose-950/60 dark:text-rose-300 dark:shadow-[2px_2px_0px_#fafafa] animate-pulse">
            <Mic className="h-3.5 w-3.5 animate-bounce stroke-[2.5]" /> Listening... Speak now
          </span>
        </div>
      )}

      {error && (
        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 shadow-[2px_2px_0px_#18181b] dark:border-zinc-100 dark:bg-amber-950/60 dark:text-amber-300 dark:shadow-[2px_2px_0px_#fafafa]">
            {error}
          </span>
        </div>
      )}

      {isSearching && !isListening && !error && (
        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-[2px_2px_0px_#18181b] dark:border-zinc-100 dark:bg-blue-950/60 dark:text-blue-300 dark:shadow-[2px_2px_0px_#fafafa]">
            <Loader2 className="h-3.5 w-3.5 animate-spin stroke-[2.5]" /> Searching...
          </span>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
