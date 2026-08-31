import React, { useEffect, useRef, useState } from "react";

export default function MobileCircleSelector({ cards = [], onSelect }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState(320);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    function update() {
      if (!containerRef.current) return;
      const w = Math.min(360, Math.round(containerRef.current.clientWidth * 0.96));
      setSize(w);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (onSelect && cards[selected]) onSelect(cards[selected]);
  }, [selected, cards, onSelect]);

  const n = Math.max(1, cards.length);
  const radius = Math.round(size / 2) - Math.round(size * 0.14);
  const anglePer = 360 / n;
  const rotation = -selected * anglePer; // so selected goes to top

  return (
    <div className="sm:hidden">
      <div className="mx-auto w-full px-4" ref={containerRef}>
        <div
          className="relative mx-auto"
          style={{ width: size, height: size, touchAction: "pan-y" }}
        >
          {/* center title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">Selected</div>
            <div className="max-w-[220px] truncate text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {cards[selected]?.name || ""}
            </div>
          </div>

          {cards.map((c, i) => {
            const angle = i * anglePer;
            const total = angle + rotation;
            const rad = (total * Math.PI) / 180;
            const cx = size / 2 + Math.sin(rad) * radius - size * 0.12;
            const cy = size / 2 - Math.cos(rad) * radius - size * 0.12;
            const isSelected = i === selected;
            const itemSize = Math.round(size * (isSelected ? 0.36 : 0.22));

            return (
              <button
                key={c.id || i}
                onClick={() => setSelected(i)}
                className={`absolute flex items-center justify-center overflow-hidden rounded-full border-2 bg-white p-0 shadow transition-transform duration-300 focus:outline-none ${
                  isSelected ? "ring-2 ring-blue-500" : "ring-0"
                }`}
                style={{
                  width: itemSize,
                  height: itemSize,
                  left: cx,
                  top: cy,
                  transform: "translate(-50%, -50%)",
                }}
                aria-label={c.name}
              >
                {c.img ? (
                  <img
                    src={c.img}
                    alt={c.name}
                    className="h-full w-full object-cover"
                    style={{ borderRadius: "9999px" }}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-center">
                    <span className="px-2 text-xs font-semibold text-slate-700">{c.name}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
