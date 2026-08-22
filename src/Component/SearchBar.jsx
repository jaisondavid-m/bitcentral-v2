import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Mic, MicOff, Search, X } from "lucide-react";

function SearchBar({ search, setSearch, isSearching = false, placeholder = "Search student resources, question banks, or tools...", isDark = false }) {
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
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
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
    if (!recognitionRef.current) {
      setError("Voice search is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setError("");
    }
  }, [isListening]);

  const handleClearSearch = useCallback(() => {
    setSearch("");
    setError("");
  }, [setSearch]);

  return (
    <div className="w-full">
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setError("");
          }}
          className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {search && (
            <button
              onClick={handleClearSearch}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isSearching && (
            <div className="p-1.5 text-blue-500">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}

          <button
            onClick={toggleVoiceSearch}
            className={`p-1.5 rounded-lg transition-all ${
              isListening
                ? "bg-red-500/10 text-red-500 animate-pulse"
                : "text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            aria-label="Voice search"
            title={isListening ? "Listening... click to stop" : "Start voice search"}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isListening && (
        <p className="mt-2 text-center text-xs font-semibold text-red-500 animate-pulse">
          🎤 Listening to voice input... Speak now
        </p>
      )}

      {error && (
        <p className="mt-2 text-center text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default SearchBar;