import React, { useEffect, useRef, useState } from "react";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import { getLottieBuffer, getLottieBufferSync, LOTTIE_FILES } from "@/utils/lottiePreloader";

function MealCardSkeleton({ message = "Fetching fresh mess menu..." }) {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(Boolean(getLottieBufferSync(LOTTIE_FILES.MESS)));

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
          options.data = buffer.slice(0);
        } else {
          options.src = LOTTIE_FILES.MESS;
        }

        dotLottie = new DotLottie(options);
        setIsReady(true);
      } catch (err) {
        console.warn("DotLottie mess animation init failed:", err);
      }
    };

    const initialBuffer = getLottieBufferSync(LOTTIE_FILES.MESS);
    if (initialBuffer) {
      initAnimation(initialBuffer);
    } else {
      getLottieBuffer(LOTTIE_FILES.MESS).then((buffer) => {
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
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-200/70 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/85 flex flex-col items-center justify-center min-h-[340px] transition-all">
      <div className="relative flex items-center justify-center w-52 h-52 sm:w-60 sm:h-60">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-r-transparent" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain transition-opacity duration-200 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200 text-center animate-pulse">
        {message}
      </p>
    </div>
  );
}

export default MealCardSkeleton;
