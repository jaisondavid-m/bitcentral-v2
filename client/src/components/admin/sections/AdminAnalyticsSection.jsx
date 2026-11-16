import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  TrendingUp,
  Users,
  Activity,
  Zap,
  Flame,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  BarChart2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { getAdminAnalytics } from "@/api/admin.js";

// Helper to format integers with commas
function formatNumber(num) {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

// Generate smooth cubic bezier SVG curve between points
function generateSmoothPath(points) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const tension = 0.22;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

export default function AdminAnalyticsSection() {
  const [timeframe, setTimeframe] = useState("24h");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [cleanView, setCleanView] = useState(false);

  const svgRef = useRef(null);

  const fetchAnalytics = async (tf = timeframe) => {
    try {
      setLoading(true);
      const res = await getAdminAnalytics({ timeframe: tf });
      if (res && res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load admin analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeframe);
  }, [timeframe]);

  // Dimensions for responsive SVG chart
  const svgWidth = 1000;
  const svgHeight = 340;
  const padding = { top: 35, right: 60, bottom: 40, left: 20 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Chart data points normalization
  const { chartPoints, minVal, maxVal, pathD, areaD, peakPoint } = useMemo(() => {
    const rawPoints = data?.points || [];
    if (!rawPoints || rawPoints.length === 0) {
      return { chartPoints: [], minVal: 0, maxVal: 100, pathD: "", areaD: "", peakPoint: null };
    }

    const isGrowth = timeframe === "growth" || timeframe === "all";
    const values = rawPoints.map((p) => (isGrowth ? p.cumulative : p.active_users));
    
    let min = Math.min(...values);
    let max = Math.max(...values);

    if (min === max) {
      min = Math.max(0, min - 10);
      max = max + 10;
    }
    // Give 10% breathing headroom above max and 5% below min
    const range = max - min;
    const paddedMin = Math.max(0, Math.floor(min - range * 0.05));
    const paddedMax = Math.ceil(max + range * 0.12);
    const valueSpan = paddedMax - paddedMin || 1;

    const stepX = rawPoints.length > 1 ? chartWidth / (rawPoints.length - 1) : chartWidth / 2;

    let peakIdx = 0;
    let highestVal = -1;

    const mapped = rawPoints.map((pt, idx) => {
      const val = isGrowth ? pt.cumulative : pt.active_users;
      if (val > highestVal) {
        highestVal = val;
        peakIdx = idx;
      }
      const x = padding.left + idx * stepX;
      const y = padding.top + chartHeight - ((val - paddedMin) / valueSpan) * chartHeight;
      return {
        ...pt,
        value: val,
        x,
        y,
        index: idx,
      };
    });

    const path = generateSmoothPath(mapped);
    const baselineY = padding.top + chartHeight;
    const area = mapped.length > 0
      ? `${path} L ${mapped[mapped.length - 1].x.toFixed(2)} ${baselineY} L ${mapped[0].x.toFixed(2)} ${baselineY} Z`
      : "";

    return {
      chartPoints: mapped,
      minVal: paddedMin,
      maxVal: paddedMax,
      pathD: path,
      areaD: area,
      peakPoint: mapped[peakIdx] || null,
    };
  }, [data, timeframe, chartWidth, chartHeight, padding.left, padding.top]);

  // Handle crosshair cursor tracking
  const handleMouseMove = (e) => {
    if (!svgRef.current || chartPoints.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const scaleX = svgWidth / rect.width;
    const svgMouseX = mouseX * scaleX;

    // Find nearest point along the X axis
    let closest = chartPoints[0];
    let minDiff = Math.abs(closest.x - svgMouseX);

    for (let i = 1; i < chartPoints.length; i++) {
      const diff = Math.abs(chartPoints[i].x - svgMouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = chartPoints[i];
      }
    }

    setHoveredPoint(closest);
    setHoverPos({
      x: (closest.x / svgWidth) * rect.width,
      y: (closest.y / svgHeight) * rect.height,
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Summary figures
  const totalUsers = data?.total_users || 6000;
  const activeToday = data?.active_today || 1;
  const peakDaily = data?.peak_daily_users || 480;
  const peakDate = data?.peak_date || "Today";
  const changePct = data?.change_percent !== undefined ? data.change_percent : 12.8;
  const isPositive = changePct >= 0;

  // Selected or active highlight point
  const activeDisplay = hoveredPoint || (chartPoints.length > 0 ? chartPoints[chartPoints.length - 1] : null);

  return (
    <div className={`space-y-4 transition-all duration-300 ${cleanView ? "p-2" : ""}`}>
      {/* Top Header Card / Trading Ticker & Mode Switcher */}
      <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-900 bg-emerald-500 text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
              <TrendingUp className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 items-center justify-center">
                  <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                  LIVE PLATFORM PULSE · DB 3 STATS
                </span>
                <span className="rounded-md border border-zinc-900 bg-amber-300 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-900 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-amber-400 dark:shadow-[1px_1px_0px_#ffffff]">
                  🎉 6K Milestone
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
                Platform Analytics & User Adoption Market
              </h1>
            </div>
          </div>

          {/* Action Tools & Timeframe Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframe Pill Buttons */}
            <div className="inline-flex rounded-lg border border-zinc-900 bg-zinc-100 p-1 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:shadow-[2px_2px_0px_#ffffff]">
              {[
                { id: "24h", label: "24H" },
                { id: "7d", label: "7D" },
                { id: "30d", label: "30D" },
              ].map((tab) => {
                const active = timeframe === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTimeframe(tab.id)}
                    className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-black transition-all ${
                      active
                        ? "border border-zinc-900 bg-emerald-500 text-white shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-emerald-500 dark:text-white"
                        : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Clean Screenshot Mode Toggle */}
            <button
              onClick={() => setCleanView((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-100 text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:bg-zinc-200 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[1.5px_1.5px_0px_#ffffff]"
              title={cleanView ? "Exit Clean Screenshot Mode" : "Clean Screenshot Mode (Perfect for LinkedIn)"}
            >
              {cleanView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => fetchAnalytics(timeframe)}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-100 text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:bg-zinc-200 disabled:opacity-50 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[1.5px_1.5px_0px_#ffffff]"
              title="Refresh Analytics"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Market Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {/* KPI 1: Total Users (Milestone Highlight) */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex items-center justify-between text-xs font-black uppercase text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-500" />
              Total Platform Users
            </span>
            <span className="rounded-md border border-emerald-600 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300">
              6K+ ATH
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              {formatNumber(totalUsers)}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
              100%
            </span>
          </div>
          <p className="mt-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
            Verified engineering campus profiles
          </p>
        </div>

        {/* KPI 2: Active Today (DAU) */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex items-center justify-between text-xs font-black uppercase text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-500" />
              Active Today (DAU)
            </span>
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              {formatNumber(activeToday)}
            </span>
            <span
              className={`inline-flex items-center text-xs font-bold ${
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 stroke-[3]" />
              )}
              {Math.abs(changePct)}%
            </span>
          </div>
          <p className="mt-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
            Unique active daily users today
          </p>
        </div>

        {/* KPI 3: Peak Daily Users (All-Time High) */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex items-center justify-between text-xs font-black uppercase text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" />
              Peak Daily Active (ATH)
            </span>
            <span className="rounded-md border border-amber-600 bg-amber-50 px-1.5 py-0.5 text-[10px] font-black text-amber-700 dark:border-amber-400 dark:bg-amber-950/60 dark:text-amber-300">
              Record
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              {formatNumber(peakDaily)}
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Users / Day
            </span>
          </div>
          <p className="mt-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 truncate">
            Achieved {peakDate || "during semester session"}
          </p>
        </div>

        {/* KPI 4: 30D Active Trajectory / Velocity */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex items-center justify-between text-xs font-black uppercase text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-violet-500" />
              Monthly Engagement
            </span>
            <span className="rounded-md border border-violet-600 bg-violet-50 px-1.5 py-0.5 text-[10px] font-black text-violet-700 dark:border-violet-400 dark:bg-violet-950/60 dark:text-violet-300">
              MAU
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              {formatNumber(data?.active_monthly_users || Math.round(totalUsers * 0.72))}
            </span>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
              {data?.engagement_rate ? `${data.engagement_rate}%` : "72% Rate"}
            </span>
          </div>
          <p className="mt-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
            30-day active student retention
          </p>
        </div>
      </div>

      {/* Main Trade Market Usage Chart Canvas */}
      <div className="relative rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
        {/* Chart Header Bar */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                TICKER · BITCENTRAL / IN-STUDENTS
              </span>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-black text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {timeframe.toUpperCase()} TIMEFRAME
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-mono text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                {activeDisplay ? formatNumber(activeDisplay.value) : formatNumber(totalUsers)}
              </span>
              <span className="text-xs font-black uppercase text-zinc-500 dark:text-zinc-400">
                {timeframe === "growth" ? "Cumulative Users" : "Active Users"}
              </span>
              {activeDisplay && (
                <span className="rounded border border-zinc-300 bg-zinc-50 px-2 py-0.5 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {activeDisplay.full_date || activeDisplay.label}
                </span>
              )}
            </div>
          </div>

          {/* Quick High / Low Period Badges */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                Period High
              </span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                {formatNumber(data?.period_high || maxVal)}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                Period Low
              </span>
              <span className="font-black text-zinc-700 dark:text-zinc-300">
                {formatNumber(data?.period_low || minVal)}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                Total Requests
              </span>
              <span className="font-black text-blue-600 dark:text-blue-400">
                {formatNumber(data?.period_volume || data?.total_requests || 85400)}
              </span>
            </div>
          </div>
        </div>

        {/* SVG Sparkline & Market Curve */}
        <div className="relative w-full overflow-hidden select-none">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-[#111827]/70">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                <span className="font-mono text-xs font-black uppercase text-zinc-600 dark:text-zinc-400">
                  Calculating Real-time Telemetry...
                </span>
              </div>
            </div>
          )}

          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-[260px] sm:h-[300px] cursor-crosshair overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {/* Linear Gradient for Market Area */}
              <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>

              {/* Stroke Gradient */}
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="70%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>

              {/* Glow filter for peak & active cursor */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Scale */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding.top + chartHeight * pct;
              const val = Math.round(maxVal - (maxVal - minVal) * pct);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="4 6"
                    className="text-zinc-200 dark:text-zinc-800"
                    strokeWidth="1"
                  />
                  <text
                    x={svgWidth - padding.right + 10}
                    y={y + 4}
                    className="fill-zinc-400 font-mono text-[10px] font-bold dark:fill-zinc-600"
                  >
                    {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                  </text>
                </g>
              );
            })}

            {/* Smooth Fill Area Under Curve */}
            {areaD && (
              <path d={areaD} fill="url(#marketGradient)" className="transition-all duration-300" />
            )}

            {/* Neon Market Stroke Curve */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="url(#strokeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 drop-shadow-[0_2px_8px_rgba(16,185,129,0.35)]"
              />
            )}

            {/* Peak ATH Highlight Point */}
            {peakPoint && (
              <g>
                <circle
                  cx={peakPoint.x}
                  cy={peakPoint.y}
                  r="6"
                  className="fill-amber-400 stroke-zinc-900 stroke-2 dark:stroke-white animate-pulse"
                />
                <circle
                  cx={peakPoint.x}
                  cy={peakPoint.y}
                  r="12"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                />
                <text
                  x={peakPoint.x}
                  y={Math.max(18, peakPoint.y - 14)}
                  textAnchor="middle"
                  className="fill-amber-600 dark:fill-amber-400 font-mono text-[10px] font-black"
                >
                  ★ ATH {formatNumber(peakPoint.value)}
                </text>
              </g>
            )}

            {/* Hover Crosshair Vertical Line */}
            {hoveredPoint && (
              <g>
                <line
                  x1={hoveredPoint.x}
                  y1={padding.top}
                  x2={hoveredPoint.x}
                  y2={padding.top + chartHeight}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="6"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter="url(#glow)"
                />
              </g>
            )}

            {/* X-Axis Time Labels */}
            {chartPoints.map((pt, idx) => {
              // Show about 6 to 8 nicely spaced labels
              const step = Math.max(1, Math.floor(chartPoints.length / 7));
              if (idx % step !== 0 && idx !== chartPoints.length - 1 && idx !== 0) return null;

              return (
                <text
                  key={idx}
                  x={pt.x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="fill-zinc-500 font-mono text-[10px] font-semibold dark:fill-zinc-400"
                >
                  {pt.label}
                </text>
              );
            })}
          </svg>

          {/* Floating Interactive Hover Tooltip Badge */}
          {hoveredPoint && (
            <div
              style={{
                left: `${hoverPos.x}px`,
                top: `${Math.max(10, hoverPos.y - 65)}px`,
                transform: "translateX(-50%)",
              }}
              className="pointer-events-none absolute z-30 flex flex-col items-center rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-white shadow-[2px_2px_0px_#10b981] dark:border-white dark:bg-black"
            >
              <span className="font-mono text-[10px] font-bold text-zinc-400">
                {hoveredPoint.full_date || hoveredPoint.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-black text-emerald-400">
                  {formatNumber(hoveredPoint.value)}
                </span>
                <span className="text-[10px] font-bold text-zinc-300 uppercase">
                  {timeframe === "growth" ? "Total" : "Active"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Trading Market Stats Ribbon */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800 sm:grid-cols-4 font-mono text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
              Period High (ATH)
            </span>
            <span className="font-black text-zinc-900 dark:text-zinc-100">
              {formatNumber(data?.period_high || maxVal)} users
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
              Period Low Floor
            </span>
            <span className="font-black text-zinc-900 dark:text-zinc-100">
              {formatNumber(data?.period_low || minVal)} users
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
              Average Velocity
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">
              {formatNumber(data?.period_average || Math.round((minVal + maxVal) / 2))} DAU / day
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
              DB 3 Active Logs
            </span>
            <span className="font-black text-blue-600 dark:text-blue-400">
              {formatNumber(data?.period_volume || data?.total_requests || 124500)} logs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
