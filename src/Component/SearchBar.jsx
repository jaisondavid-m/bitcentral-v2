import { useEffect, useRef, useState } from "react";
import { Mic , MicOff } from "lucide-react";

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
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-12 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:rounded-xl sm:px-4 sm:py-2.5 sm:pr-12 sm:text-base"
        />

        <button onClick={toggleVoiceSearch} className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-all ${isListening ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`} aria-label="Voice search">
          {isListening ? (
            <MicOff className="h-5 w-5" strokeWidth={2} /> ) : (
            <Mic className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
      </div>

      {isListening && (
        <p className="mt-2 text-center text-xs text-red-500 sm:text-sm">Listening...</p>
      )}
    </div>
  );
}

export default SearchBar;
