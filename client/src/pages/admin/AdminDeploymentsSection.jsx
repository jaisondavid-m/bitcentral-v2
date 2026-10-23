import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Server,
  Cloud,
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Radio,
  Zap,
  Globe,
  Layers,
  Cpu,
  Clock,
  ArrowRight,
  HardDrive,
  Copy,
  Check,
} from "lucide-react";

export default function AdminDeploymentsSection() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // Active Origin State
  const [frontendOrigin, setFrontendOrigin] = useState({
    type: "own_server", // "own_server" | "vercel" | "unknown"
    name: "Own Server (Primary)",
    platform: "Docker / Nginx on Local Host",
    host: window.location.host,
    latency: null,
    isLocal: false,
    headers: {},
  });

  const [backendOrigin, setBackendOrigin] = useState({
    type: "own_server", // "own_server" | "render" | "unknown"
    name: "Own Server (Primary)",
    platform: "Golang Micro-Engine (Docker :8080)",
    host: "localhost:8080",
    latency: null,
    serverType: "own_server",
    dbHost: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    dbDatabase: "bitcentral",
  });

  // Endpoints Diagnostic Status
  const [endpoints, setEndpoints] = useState([
    {
      id: "local-fe",
      name: "Own Server (Frontend)",
      role: "Primary Web Origin",
      url: window.location.origin,
      status: "checking", // "online" | "offline" | "checking"
      ping: null,
      type: "local",
      expected: "HTTP 200 (HTML/Nginx)",
    },
    {
      id: "local-be",
      name: "Own Server (Backend API)",
      role: "Primary Go Engine",
      url: "/api/deployment/status",
      status: "checking",
      ping: null,
      type: "local",
      expected: "HTTP 200 (JSON)",
    },
    {
      id: "fallback-fe",
      name: "Vercel Edge (Frontend)",
      role: "Automated Standby",
      url: "https://bitcentral-v2-inky.vercel.app",
      status: "checking",
      ping: null,
      type: "cloud",
      expected: "HTTP 200 (Vercel CDN)",
    },
    {
      id: "fallback-be",
      name: "Render Cloud (Backend API)",
      role: "Automated Standby",
      url: "https://bitcentral-v2.onrender.com",
      status: "checking",
      ping: null,
      type: "cloud",
      expected: "HTTP 200 / 404 (Render Origin)",
    },
  ]);

  const runDiagnostics = useCallback(async () => {
    setRefreshing(true);
    const startTime = Date.now();

    // 1. Detect Frontend Serving Origin
    try {
      const feStart = performance.now();
      const feRes = await fetch(window.location.href, {
        method: "HEAD",
        cache: "no-store",
      });
      const feLatency = Math.round(performance.now() - feStart);

      const serverHeader = feRes.headers.get("server") || "";
      const vercelHeader = feRes.headers.get("x-vercel-id") || "";
      const isVercel =
        Boolean(vercelHeader) ||
        window.location.hostname.includes("vercel.app");
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      setFrontendOrigin({
        type: isVercel ? "vercel" : "own_server",
        name: isVercel ? "Vercel Cloud Backup" : isLocal ? "Local Development PC" : "Own Primary Server (Tunnel)",
        platform: isVercel
          ? "Vercel Serverless Edge Network"
          : "Docker Nginx (bitcentral-client)",
        host: window.location.host,
        latency: feLatency,
        isLocal,
        headers: {
          server: serverHeader || "Nginx / Cloudflare",
          vercelId: vercelHeader || null,
        },
      });
    } catch {
      // Fallback detection
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      setFrontendOrigin((prev) => ({
        ...prev,
        type: isLocal ? "own_server" : "unknown",
        name: isLocal ? "Local Development PC" : "Active Edge Origin",
        host: window.location.host,
      }));
    }

    // 2. Detect Backend Serving Origin
    try {
      const beStart = performance.now();
      const beRes = await fetch("/api/deployment/status", {
        cache: "no-store",
      });
      const beLatency = Math.round(performance.now() - beStart);
      const renderHeader = beRes.headers.get("x-render-origin-server");

      if (beRes.ok) {
        const data = await beRes.json();
        setBackendOrigin({
          type: data.server_type === "own_server" ? "own_server" : "render",
          name:
            data.server_type === "own_server"
              ? "Own Primary Server (Go Docker)"
              : "Render Cloud Backup",
          platform:
            data.server_type === "own_server"
              ? "Go Gin Engine (bitcentral-server :8080)"
              : "Render Web Service",
          host: window.location.hostname,
          latency: beLatency,
          serverType: data.server_type || "own_server",
          dbHost: data.db_host || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
          dbDatabase: data.db_database || "bitcentral",
        });
      } else {
        setBackendOrigin((prev) => ({
          ...prev,
          type: renderHeader ? "render" : "own_server",
          name: renderHeader ? "Render Cloud Backup" : "Own Server (via Tunnel)",
          latency: beLatency,
        }));
      }
    } catch {
      // Try /health as fallback
      try {
        const hStart = performance.now();
        const hRes = await fetch("/health", { cache: "no-store" });
        const hLatency = Math.round(performance.now() - hStart);
        setBackendOrigin((prev) => ({
          ...prev,
          latency: hLatency,
          name: "Live Backend API",
        }));
      } catch {
        setBackendOrigin((prev) => ({
          ...prev,
          name: "Backend Connection Pending",
        }));
      }
    }

    // 3. Diagnostic Ping across all cluster nodes
    const updatedEndpoints = await Promise.all(
      endpoints.map(async (ep) => {
        try {
          const controller = new AbortController();
          const tId = setTimeout(() => controller.abort(), 3500);
          const pStart = performance.now();

          // For external URLs use no-cors to measure reachability safely
          const res = await fetch(ep.url, {
            mode: ep.type === "local" ? "cors" : "no-cors",
            cache: "no-store",
            signal: controller.signal,
          });
          clearTimeout(tId);
          const pLatency = Math.round(performance.now() - pStart);

          return {
            ...ep,
            status: "online",
            ping: pLatency,
          };
        } catch {
          return {
            ...ep,
            status: "offline",
            ping: null,
          };
        }
      })
    );

    setEndpoints(updatedEndpoints);
    setLastChecked(new Date().toLocaleTimeString());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    runDiagnostics();
    const interval = setInterval(runDiagnostics, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, [runDiagnostics]);

  const copyStatusSummary = () => {
    const summary = `[BitCentral Deployment Status]
Checked: ${new Date().toISOString()}
Frontend Serving: ${frontendOrigin.name} (${frontendOrigin.host}) - Latency: ${frontendOrigin.latency || "N/A"}ms
Backend Serving: ${backendOrigin.name} - Latency: ${backendOrigin.latency || "N/A"}ms
Database: TiDB Cloud MySQL (gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000)
Failover Fallback 1: bitcentral-v2-inky.vercel.app
Failover Fallback 2: bitcentral-v2.onrender.com`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Deployment & Infrastructure
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Dual-Cluster
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time status of your Primary Own Server, automated Cloudflare Failover, and standby Cloud Nodes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={copyStatusSummary}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy Diagnostics"}</span>
          </button>

          <button
            onClick={runDiagnostics}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Checking..." : "Re-Check Status"}</span>
          </button>
        </div>
      </div>

      {/* Cloudflare Pages Monitor Promotion Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200 dark:border-orange-900/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm shadow-orange-500/20">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Cloudflare Pages Usage & Limits API
              <span className="rounded-full bg-orange-100 px-2 py-0.2 text-[10px] font-bold text-orange-700 dark:bg-orange-900 dark:text-orange-200">
                New
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Track your 500 monthly deployments quota, concurrent build limits, and real-time build statuses securely via Go SDK.
            </p>
          </div>
        </div>
        <Link
          to="/admin/cloudflare"
          className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 transition shadow-sm shrink-0"
        >
          <span>Open Cloudflare Monitor</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Hero: Active Serving Origin Status */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Frontend Origin Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Frontend Origin
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                frontendOrigin.type === "own_server"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${frontendOrigin.type === "own_server" ? "bg-emerald-500" : "bg-amber-500"}`} />
              {frontendOrigin.type === "own_server" ? "Primary Server Active" : "Fallback Active (Vercel)"}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {frontendOrigin.name}
            </div>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {frontendOrigin.platform}
          </p>

          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Serving Host</span>
              <span className="font-mono font-medium">{frontendOrigin.host}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Response Latency</span>
              <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                {frontendOrigin.latency ? `${frontendOrigin.latency} ms` : "Instant"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cloud Backup</span>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">bitcentral-v2-inky.vercel.app</span>
            </div>
          </div>
        </div>

        {/* Backend Origin Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Backend API Origin
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                backendOrigin.type === "own_server"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${backendOrigin.type === "own_server" ? "bg-emerald-500" : "bg-amber-500"}`} />
              {backendOrigin.type === "own_server" ? "Primary Server Active" : "Fallback Active (Render)"}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {backendOrigin.name}
            </div>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {backendOrigin.platform}
          </p>

          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Backend Port</span>
              <span className="font-mono font-medium">8080 (Docker Container)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">API Latency</span>
              <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                {backendOrigin.latency ? `${backendOrigin.latency} ms` : "Active"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cloud Backup</span>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">bitcentral-v2.onrender.com</span>
            </div>
          </div>
        </div>

        {/* TiDB Cloud Database Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Shared Database (Single Truth)
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-700 border border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              TiDB Cloud MySQL
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-lg font-black text-slate-900 dark:text-white">
              TiDB Serverless Cluster
            </div>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            TLS 1.2 Encrypted via isrgrootx1.pem
          </p>

          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Cluster Endpoint</span>
              <span className="font-mono text-[11px] truncate max-w-[180px]">gateway01.ap-southeast-1.prod.aws...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Database & Port</span>
              <span className="font-mono font-medium">bitcentral : 4000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Data Synchronization</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Shared (Zero Drift)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Live Failover Topology */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Traffic Routing Topology & Failover Circuit
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visual path of client requests flowing through Cloudflare Edge to either your Local PC or Cloud Standby.
            </p>
          </div>
          {lastChecked && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Last checked: {lastChecked}</span>
            </div>
          )}
        </div>

        {/* Topology Diagram Nodes */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Step 1: Client */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center dark:border-slate-800 dark:bg-slate-800/50">
            <Globe className="h-7 w-7 text-blue-600 dark:text-blue-400 mb-2" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Public Visitor</span>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5">bitcentral.bitsathy.in</span>
            <span className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">HTTPS / SSL Ready</span>
          </div>

          {/* Step 2: Cloudflare Worker */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-center dark:border-blue-900/50 dark:bg-blue-950/30">
            <Radio className="h-7 w-7 text-blue-600 dark:text-blue-400 mb-2 animate-pulse" />
            <span className="text-xs font-bold text-blue-950 dark:text-blue-200">Cloudflare Edge Worker</span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">Health Probe: 2.0s</span>
            <span className="mt-2 text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-mono">
              Transparent Proxy (No Redirect)
            </span>
          </div>

          {/* Step 3: Target Split (Primary vs Fallback) */}
          <div className="space-y-3">
            {/* Primary Node */}
            <div
              className={`rounded-xl border p-3 text-left transition ${
                frontendOrigin.type === "own_server"
                  ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/40 shadow-xs"
                  : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-emerald-600" />
                  Primary: Local PC
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                  {frontendOrigin.type === "own_server" ? "SERVING NOW" : "STANDBY"}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                Tunnel: http://localhost:5173
              </span>
            </div>

            {/* Fallback Node */}
            <div
              className={`rounded-xl border p-3 text-left transition ${
                frontendOrigin.type === "vercel"
                  ? "border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/40 shadow-xs"
                  : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Cloud className="h-3.5 w-3.5 text-amber-600" />
                  Backup: Vercel / Render
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-1.5 py-0.2 rounded font-bold">
                  {frontendOrigin.type === "vercel" ? "SERVING NOW" : "STANDBY READY"}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                Vercel + Render Cloud
              </span>
            </div>
          </div>

          {/* Step 4: TiDB Cloud Database */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50/50 p-4 text-center dark:border-cyan-900/50 dark:bg-cyan-950/30">
            <Database className="h-7 w-7 text-cyan-600 dark:text-cyan-400 mb-2" />
            <span className="text-xs font-bold text-cyan-950 dark:text-cyan-200">TiDB Cloud MySQL</span>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">Port 4000 (SSL)</span>
            <span className="mt-2 text-[10px] bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 px-2 py-0.5 rounded font-mono">
              Shared by Both Origins
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Endpoint Diagnostics Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Cluster Node Health & Diagnostics
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Live connectivity test to individual frontend and backend server components.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-1">Node Target</th>
                <th className="pb-3">Cluster Role</th>
                <th className="pb-3">Live URL / Endpoint</th>
                <th className="pb-3">Expected Target</th>
                <th className="pb-3">Latency</th>
                <th className="pb-3 pr-1 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {endpoints.map((ep) => (
                <tr key={ep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3 pl-1 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {ep.type === "local" ? (
                      <HardDrive className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Cloud className="h-4 w-4 text-blue-600" />
                    )}
                    {ep.name}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">
                    {ep.role}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                    {ep.url}
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400 text-[11px]">
                    {ep.expected}
                  </td>
                  <td className="py-3 font-mono font-medium text-blue-600 dark:text-blue-400">
                    {ep.ping ? `${ep.ping} ms` : ep.status === "online" ? "Active" : "--"}
                  </td>
                  <td className="py-3 pr-1 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        ep.status === "online"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : ep.status === "checking"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          ep.status === "online"
                            ? "bg-emerald-500"
                            : ep.status === "checking"
                            ? "bg-blue-500 animate-pulse"
                            : "bg-rose-500"
                        }`}
                      />
                      {ep.status === "online" ? "Online" : ep.status === "checking" ? "Checking" : "Unreachable"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failover Guide & Architecture Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>How Failover Works on Sudden Outage</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            When this PC turns off, experiences power loss, or disconnects from Wi-Fi/Ethernet, the Cloudflare Tunnel drops immediately.
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
            <li><strong>Worker Timeout:</strong> 2.0s for frontend, 2.5s for backend.</li>
            <li><strong>Error Trigger:</strong> HTTP 1033 (Tunnel Disconnected) or HTTP 502/504 gateway failures.</li>
            <li><strong>Seamless Transition:</strong> Proxies requests to Vercel/Render with host header overriding so no redirect (301/302) is triggered.</li>
            <li><strong>Zero Data Loss:</strong> Both clusters connect directly to the same TiDB Cloud database.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Quick Simulation Test</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You can verify failover live at any time without turning off your computer:
          </p>
          <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-slate-200 space-y-1">
            <p className="text-slate-400"># 1. Stop local tunnel to simulate PC power off:</p>
            <p className="text-emerald-400">killall cloudflared</p>
            <p className="text-slate-400 mt-2"># 2. Refresh site: Vercel seamlessly handles it.</p>
            <p className="text-slate-400 mt-2"># 3. Restart tunnel to return to own server:</p>
            <p className="text-emerald-400">nohup cloudflared tunnel --protocol http2 run mockmate-live &gt; ~/.cloudflared/tunnel.log 2&gt;&amp;1 &amp;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
