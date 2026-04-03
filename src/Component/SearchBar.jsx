import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, X } from "lucide-react";

function SearchBar({ search, setSearch }) {
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
    <div>
      <div className="relative mx-auto max-w-md">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setError("");
          }}
          className="block w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 pr-24 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:px-4 sm:py-3 sm:pr-24 sm:text-base dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-700 dark:focus:ring-blue-900/40"
        />

        {search && (
          <button
            onClick={handleClearSearch}
            className="absolute right-12 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        )}

        <button
          onClick={toggleVoiceSearch}
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-all ${
            isListening
              ? "text-red-500 dark:text-red-400"
                : "text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300"
          }`}
          aria-label="Voice search"
          title={isListening ? "Stop listening" : "Start voice search"}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Mic className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
      </div>

      {isListening && (
        <p className="mt-2 text-center text-xs text-red-500 sm:text-sm">
          🎤 Listening...
        </p>
      )}

      {error && (
        <p className="mt-2 text-center text-xs text-red-500 sm:text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

export default SearchBar;