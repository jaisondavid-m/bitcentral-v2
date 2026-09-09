import React, { useEffect, useRef, useState } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';

// Persistent in-memory cache for Lottie ArrayBuffer to ensure 0ms instant loading
let cachedBuffer = null;
let fetchPromise = null;

export function getLottieBuffer() {
  if (cachedBuffer) return Promise.resolve(cachedBuffer);
  if (!fetchPromise) {
    fetchPromise = fetch('/lotties/cute-doggie.lottie')
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        cachedBuffer = buffer;
        return buffer;
      })
      .catch((err) => {
        console.warn('Lottie pre-fetch failed:', err);
        fetchPromise = null;
        return null;
      });
  }
  return fetchPromise;
}

// Immediately trigger pre-fetch on module load
getLottieBuffer();

function FullScreenLoader({ message = 'Checking your session securely...' }) {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(Boolean(cachedBuffer));

  useEffect(() => {
    let dotLottie = null;
    let mounted = true;

    const initAnimation = (buffer) => {
      if (!canvasRef.current || !mounted) return;
      try {
        const options = {
          canvas: canvasRef.current,
          loop: true,
          autoplay: true,
        };

        if (buffer) {
          options.data = buffer;
        } else {
          options.src = '/lotties/cute-doggie.lottie';
        }

        dotLottie = new DotLottie(options);
        setIsReady(true);
      } catch (err) {
        console.warn('DotLottie init failed:', err);
      }
    };

    if (cachedBuffer) {
      initAnimation(cachedBuffer);
    } else {
      getLottieBuffer().then((buffer) => {
        if (mounted) {
          initAnimation(buffer);
        }
      });
    }

    return () => {
      mounted = false;
      if (dotLottie) {
        try {
          dotLottie.destroy();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="rounded-3xl border border-blue-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-8 py-6 shadow-xl shadow-blue-100/40 dark:shadow-none backdrop-blur-sm text-center max-w-sm w-full">
        <div className="mx-auto mb-2 flex items-center justify-center h-44 w-44 relative">
          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-r-transparent" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className={`w-44 h-44 object-contain transition-opacity duration-150 ${
              isReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
        <p className="text-base font-bold text-slate-900 dark:text-white">Loading BIT Central</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">{message}</p>
      </div>
    </div>
  );
}

export default FullScreenLoader;
