import { useEffect, useRef, useState } from "react";

function SearchBar({ search, setSearch }) {
  const [isListening, setIsListening] = useState(false);
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
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
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

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert("Voice search is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="mb-4 sm:mb-8">
      <div className="relative mx-auto max-w-md">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-12 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:rounded-xl sm:px-4 sm:py-2.5 sm:pr-12 sm:text-base"
        />

        <button
          onClick={toggleVoiceSearch}
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-all ${
            isListening
              ? "text-red-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          aria-label="Voice search"
        >
          {isListening ? (
            <svg
              className="h-5 w-5 animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          )}
        </button>
      </div>

      {isListening && (
        <p className="mt-2 text-center text-xs text-red-500 sm:text-sm">
          Listening...
        </p>
      )}
    </div>
  );
}

export default SearchBar;
