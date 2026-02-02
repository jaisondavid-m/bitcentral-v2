/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        typing: {
          to: { width: "calc(var(--chars) * 1ch)" }
        },
        blink: {
          "50%": { borderColor: "transparent" }
        },
        softFloat: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(3px)" }
        }
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out forwards",
        typing: "typing 2.5s steps(var(--chars)) forwards, blink 0.8s step-end infinite",
        softFloat: "softFloat 4s ease-in-out infinite"
      },
    },
  },
  plugins: [],
}
