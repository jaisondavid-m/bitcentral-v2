import React, { useState, useEffect, useCallback } from "react";
import {
  Cloud,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  Key,
  Settings,
  ChevronDown,
  ArrowUpRight,
  Loader,
  HelpCircle,
  Copy,
  Check,
  FolderGit2,
  Cpu,
  BarChart2,
  HardDrive,
  Info,
  X,
} from "lucide-react";
import {
  getCloudflareUsage,
  getCloudflareConfig,
  updateCloudflareConfig,
  testCloudflareConnection,
} from "@/api/admin.js";

function formatISTDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function timeAgo(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function CloudflarePagesSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [copiedText, setCopiedText] = useState("");

  // Settings modal
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [configSaving, setConfigSaving] = useState(false);
  const [configTesting, setConfigTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [configBanner, setConfigBanner] = useState({ type: "", message: "" });
  const [configForm, setConfigForm] = useState({
    api_token: "",
    account_id: "",
    project_name: "",
  });
  const [existingConfig, setExistingConfig] = useState(null);

  const fetchUsage = useCallback(
    async (projName = "") => {
      try {
        setRefreshing(true);
        setError("");
        const res = await getCloudflareUsage(projName || selectedProject);
        if (res) {
          setData(res);
          if (res.project?.name && !selectedProject) {
            setSelectedProject(res.project.name);
          }
        }
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to fetch Cloudflare Pages usage");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedProject]
  );

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const openConfigModal = async () => {
    setIsConfigOpen(true);
    setConfigLoading(true);
    setConfigBanner({ type: "", message: "" });
    setTestResult(null);
    try {
      const res = await getCloudflareConfig();
      if (res?.success) {
        setExistingConfig(res);
        setConfigForm({
          api_token: res.masked_token || "",
          account_id: res.account_id || "",
          project_name: res.project_name || "",
        });
      }
    } catch (err) {
      setConfigBanner({ type: "error", message: "Failed to load current configuration" });
    } finally {
      setConfigLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setConfigTesting(true);
    setTestResult(null);
    try {
      const res = await testCloudflareConnection({
        api_token: configForm.api_token,
        account_id: configForm.account_id,
        project_name: configForm.project_name,
      });
      setTestResult(res);
    } catch (err) {
      setTestResult({
        success: false,
        message: err?.response?.data?.message || err?.message || "Connection test failed",
      });
    } finally {
      setConfigTesting(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setConfigSaving(true);
    setConfigBanner({ type: "", message: "" });
    try {
      const res = await updateCloudflareConfig({
        api_token: configForm.api_token,
        account_id: configForm.account_id,
        project_name: configForm.project_name,
      });
      if (res?.success) {
        setConfigBanner({ type: "success", message: res.message || "Cloudflare credentials saved successfully!" });
        setExistingConfig((prev) => ({
          ...prev,
          configured: true,
          masked_token: res.masked_token,
          account_id: res.account_id,
          project_name: res.project_name,
        }));
        setTimeout(() => {
          setIsConfigOpen(false);
          fetchUsage(res.project_name);
        }, 1200);
      } else {
        setConfigBanner({ type: "error", message: res?.message || "Failed to save configuration" });
      }
    } catch (err) {
      setConfigBanner({
        type: "error",
        message: err?.response?.data?.message || err?.message || "Failed to save configuration",
      });
    } finally {
      setConfigSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-950">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
          <Cloud className="h-7 w-7 animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">
          Querying Cloudflare Pages API...
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Gathering project metrics, build limits, and real-time deployment status
        </p>
      </div>
    );
  }

  const isConfigured = data?.configured;
  const project = data?.project || {};
  const usage = data?.usage || {};
  const limits = data?.limits || {};
  const availableProjects = data?.available_projects || [];
  const recentDeployments = data?.recent_deployments || [];
  const canonicalDeploy = project?.canonical_deploy || null;

  // Determine usage threshold color
  const usagePercent = usage.usage_percent || 0;
  const usageColor =
    usagePercent >= 90
      ? "text-rose-600 dark:text-rose-400"
      : usagePercent >= 75
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";

  const progressBgColor =
    usagePercent >= 90 ? "bg-rose-500" : usagePercent >= 75 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
            <Cloud className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Cloudflare Pages Monitor
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/80">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                Go SDK v7.13
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Live deployment tracking, monthly quota inspection, build limits, and global edge network status.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {availableProjects.length > 1 && (
            <div className="relative">
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  fetchUsage(e.target.value);
                }}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {availableProjects.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            </div>
          )}

          <button
            type="button"
            onClick={openConfigModal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shadow-xs"
          >
            <Key className="h-3.5 w-3.5 text-orange-500" />
            <span>API Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => fetchUsage(selectedProject)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer shadow-md shadow-orange-600/20"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* Error alert banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Not Configured State */}
      {!isConfigured && (
        <div className="rounded-2xl border border-dashed border-orange-300 bg-orange-50/50 p-8 text-center dark:border-orange-800/80 dark:bg-orange-950/20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/60 dark:text-orange-300">
            <Cloud className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            Cloudflare Pages Credentials Required
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-600 dark:text-slate-400">
            Connect your Cloudflare account to monitor frontend deployment usage, monthly limits, build queues, and custom domains directly in your admin panel.
          </p>

          <div className="mx-auto mt-6 max-w-lg rounded-xl border border-slate-200 bg-white p-4 text-left text-xs dark:border-slate-800 dark:bg-slate-900">
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">
              Setup Instructions:
            </p>
            <ol className="list-decimal space-y-1.5 pl-4 text-slate-600 dark:text-slate-400">
              <li>
                Go to{" "}
                <a
                  href="https://dash.cloudflare.com/profile/api-tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-orange-600 hover:underline inline-flex items-center gap-0.5"
                >
                  Cloudflare API Tokens <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Create a custom token with <strong>Account &gt; Cloudflare Pages &gt; Read</strong> permission (or Edit).</li>
              <li>Copy your Account ID from the Cloudflare Dashboard URL or right sidebar.</li>
              <li>Save them below or add them to <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-orange-600">server/.env</code>.</li>
            </ol>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={openConfigModal}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-orange-700 shadow-lg shadow-orange-600/20 cursor-pointer"
            >
              <Key className="h-4 w-4" /> Configure Cloudflare API Now
            </button>
          </div>
        </div>
      )}

      {isConfigured && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Monthly Deployments Quota Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Deployments Quota</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {usage.billing_period || "This Month"}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className={`text-3xl font-black ${usageColor}`}>
                  {usage.deployments_this_month || 0}
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  / {usage.monthly_deployment_limit || 500}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressBgColor}`}
                    style={{ width: `${Math.min(100, usagePercent)}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span>{usage.usage_percent || 0}% used</span>
                  <span>{usage.remaining_deployments || 500} remaining</span>
                </div>
              </div>
            </div>

            {/* Concurrent Builds Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Concurrent Builds</span>
                <Cpu className="h-4 w-4 text-orange-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {limits.concurrent_builds || 1}
                </span>
                <span className="text-xs font-semibold text-slate-400">build at a time</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>Build timeout:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {limits.build_timeout_minutes || 20} mins max
                </span>
              </div>
            </div>

            {/* Total Deployments History Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Recorded Deployments</span>
                <Layers className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {usage.total_recorded || 0}
                </span>
                <span className="text-xs font-semibold text-slate-400">runs fetched</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ {usage.successful_deployments || 0} success
                </span>
                {usage.failed_deployments > 0 && (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    ✗ {usage.failed_deployments} failed
                  </span>
                )}
              </div>
            </div>

            {/* Edge Bandwidth & Network Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Bandwidth & Requests</span>
                <Globe className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  Unlimited
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>Cloudflare Global CDN</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Active</span>
              </div>
            </div>
          </div>

          {/* Active Production Deployment Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Live Production Deployment
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Project: <strong className="text-slate-700 dark:text-slate-300">{project.name}</strong> • Branch: <code className="font-mono text-orange-600 dark:text-orange-400">{project.production_branch || "main"}</code>
                  </p>
                </div>
              </div>

              {/* Direct Link Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {project.subdomain && (
                  <a
                    href={`https://${project.subdomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <span>{project.subdomain}</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                )}
                {(project.domains || []).map((dom) => (
                  <a
                    key={dom}
                    href={`https://${dom}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3.5 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/80 cursor-pointer"
                  >
                    <span>{dom}</span>
                    <ExternalLink className="h-3 w-3 text-orange-500" />
                  </a>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800/80 dark:bg-slate-900/50">
                <span className="text-slate-400 font-medium">Framework & Build</span>
                <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                  {project.framework || "Vite / React"} {project.framework_version ? `(v${project.framework_version})` : ""}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800/80 dark:bg-slate-900/50">
                <span className="text-slate-400 font-medium">Pages Functions</span>
                <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                  {project.uses_functions ? "Enabled (Serverless Edge)" : "Static Assets Deployment"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800/80 dark:bg-slate-900/50">
                <span className="text-slate-400 font-medium">Latest Commit</span>
                <p className="mt-1 font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                  {canonicalDeploy?.commit_hash ? `#${canonicalDeploy.commit_hash}` : "Manual Upload / CI"}
                  {canonicalDeploy?.commit_message ? ` - ${canonicalDeploy.commit_message}` : ""}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800/80 dark:bg-slate-900/50">
                <span className="text-slate-400 font-medium">Last Deployed</span>
                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  {canonicalDeploy?.created_on ? formatISTDateTime(canonicalDeploy.created_on) : "Recently"}
                </p>
              </div>
            </div>
          </div>

          {/* Limits & Capabilities Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-900">
              <Zap className="h-4 w-4 text-orange-500" />
              Cloudflare Pages Policy & Limits Reference
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Monthly Builds Cap:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">500 builds / mo</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Concurrent Builds:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">1 build</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Max Projects per Account:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">100 projects</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Max Custom Domains:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">100 domains</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Max Asset File Size:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">25 MB per asset</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Files per Deployment:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">20,000 files</span>
              </div>
            </div>
          </div>

          {/* Recent Deployments Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-900">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Recent Deployment Runs
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Showing latest deployments fetched from Cloudflare Pages API
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {recentDeployments.length} runs listed
              </span>
            </div>

            {recentDeployments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No recent deployments recorded for this project.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Deployment ID</th>
                      <th className="py-2.5 px-4 font-semibold">Environment</th>
                      <th className="py-2.5 px-4 font-semibold">Status</th>
                      <th className="py-2.5 px-4 font-semibold">Commit / Trigger</th>
                      <th className="py-2.5 px-4 font-semibold">Deployed At</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {recentDeployments.map((d) => {
                      const isSuccess = d.status.toLowerCase().includes("success");
                      const isFailed = d.status.toLowerCase().includes("fail");
                      return (
                        <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-orange-600 dark:text-orange-400">
                            {d.short_id || (d.id ? d.id.slice(0, 8) : "-")}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                                d.environment === "production"
                                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {d.environment || "preview"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                                isSuccess
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                  : isFailed
                                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              }`}
                            >
                              {isSuccess ? "✓ Success" : isFailed ? "✗ Failed" : d.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-700 dark:text-slate-300">
                            {d.commit_hash && (
                              <span className="font-mono font-semibold text-slate-900 dark:text-white mr-1.5">
                                #{d.commit_hash}
                              </span>
                            )}
                            <span>{d.commit_message || "Manual Deployment"}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                            <div>{timeAgo(d.created_on)}</div>
                            <div className="text-[10px] text-slate-400">{formatISTDateTime(d.created_on)}</div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {d.url && (
                              <a
                                href={d.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/40 transition cursor-pointer"
                              >
                                View <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Cloudflare API Config Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-500" /> Cloudflare API Credentials
              </h3>
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure your Cloudflare API Token and Account ID. The token is stored securely in MySQL and masked on the frontend.
            </p>

            {existingConfig?.source && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs flex items-center justify-between border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 dark:text-slate-400">Current Credential Source:</span>
                <span className="font-bold uppercase text-orange-600 dark:text-orange-400">
                  {existingConfig.source === "db" ? "Database (MySQL)" : existingConfig.source === "env" ? "server/.env" : "Not Set"}
                </span>
              </div>
            )}

            {configBanner.message && (
              <div
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  configBanner.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200"
                }`}
              >
                {configBanner.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
                <span>{configBanner.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cloudflare API Token
                </label>
                <input
                  type="password"
                  placeholder="e.g. cftk_xxxx or enter new token"
                  value={configForm.api_token}
                  onChange={(e) => setConfigForm({ ...configForm, api_token: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Needs <strong>Pages:Read</strong> permission at minimum.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cloudflare Account ID
                </label>
                <input
                  type="text"
                  placeholder="32-character hexadecimal Account ID"
                  value={configForm.account_id}
                  onChange={(e) => setConfigForm({ ...configForm, account_id: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pages Project Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. bitcentral-v2 (leave empty to auto-detect)"
                  value={configForm.project_name}
                  onChange={(e) => setConfigForm({ ...configForm, project_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                    testResult.success
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200"
                  }`}
                >
                  {testResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={configTesting || !configForm.api_token || !configForm.account_id}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {configTesting ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5 text-orange-500" />}
                  <span>{configTesting ? "Testing..." : "Test Connection"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfigOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={configSaving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-50 cursor-pointer shadow-md shadow-orange-600/20"
                  >
                    {configSaving ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    <span>Save & Validate</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
