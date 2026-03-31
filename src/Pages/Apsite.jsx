import { Search, Loader2, AlertCircle, Award, BookOpen, TrendingUp, ShieldAlert } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import api from "../api/axios.js";

function parseNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function parseIdentityValue(rawValue) {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);
    const normalized = typeof parsed === "string" ? JSON.parse(parsed) : parsed;

    if (!normalized || typeof normalized !== "object") return null;

    const rollNo = String(normalized.rollNo || "").trim();
    const registerNo = String(normalized.registerNo || "").trim();
    const savedAt = Number(normalized.savedAt) || 0;
    const enrollment = rollNo || registerNo;

    if (!enrollment) return null;

    return { enrollment, savedAt };
  } catch {
    return null;
  }
}

function getDefaultEnrollmentFromStorage() {
  if (typeof window === "undefined") return "";

  let bestMatch = { enrollment: "", savedAt: -1 };

  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith("dashboard-identity-")) continue;

    const parsedIdentity = parseIdentityValue(window.localStorage.getItem(key));
    if (!parsedIdentity) continue;

    if (parsedIdentity.savedAt >= bestMatch.savedAt) {
      bestMatch = parsedIdentity;
    }
  }

  return bestMatch.enrollment;
}

function Apsite() {
  const [enrollmentNo, setEnrollmentNo] = useState(() => getDefaultEnrollmentFromStorage());
  const [searchedEnrollmentNo, setSearchedEnrollmentNo] = useState("");
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Perform the actual search
  const performSearch = async (enrollment) => {
    const normalizedEnrollmentNo = enrollment.trim().toLowerCase();
    if (!normalizedEnrollmentNo) {
      setErrorMessage("Please enter your enrollment no.");
      setRewards([]);
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSearchedEnrollmentNo(normalizedEnrollmentNo);
    try {
      const { data: payload } = await api.get(`/rewards/${encodeURIComponent(normalizedEnrollmentNo)}`);
      if (!payload?.success) {
        throw new Error(payload?.message || "Unable to fetch rewards");
      }
      setRewards(Array.isArray(payload?.data) ? payload.data : []);
    } catch (error) {
      setRewards([]);
      setErrorMessage(error?.response?.data?.message || error?.message || "Something went wrong while fetching rewards");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load if enrollment exists in localStorage
  useEffect(() => {
    if (enrollmentNo && enrollmentNo.trim()) {
      performSearch(enrollmentNo);
    }
  }, []);

  // Handle form submission
  const handleSearch = async (event) => {
    event.preventDefault();
    performSearch(enrollmentNo);
  };

  const totals = useMemo(() => {
    return rewards.reduce(
      (acc, item) => {
        acc.earned += parseNumber(item?.total_earned);
        acc.withheld += parseNumber(item?.total_withheld);
        return acc;
      },
      { earned: 0, withheld: 0 }
    );
  }, [rewards]);

  const totalActivityPoints = totals.earned;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .ap-root, .ap-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .ap-root {
          min-height:80vh;
          background: #f0f6ff;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 90% 90%, rgba(99,179,237,0.1) 0%, transparent 60%);
          font-family: 'Sora', sans-serif;
          padding: 2.5rem 1.25rem;
        }

        .ap-container {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Header */
        .ap-header {
          text-align: center;
          padding-bottom: 0.5rem;
        }
        .ap-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.25);
          color: #2563eb;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          margin-bottom: 0.85rem;
        }
        .ap-title {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 700;
          color: #0f2d6b;
          letter-spacing: -0.03em;
          line-height: 1.15;
        }
        .ap-subtitle {
          font-size: 0.9rem;
          color: #6b8ab1;
          margin-top: 0.5rem;
          font-weight: 400;
        }

        /* Card */
        .ap-card {
          background: #ffffff;
          border: 1px solid rgba(37,99,235,0.12);
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(37,99,235,0.07), 0 1px 3px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        /* Search section */
        .ap-search-section {
          padding: 1.75rem 2rem;
        }
        .ap-search-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: #3b6fd4;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .ap-search-row {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .ap-input-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        .ap-input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #93b4e0;
          width: 16px;
          height: 16px;
          pointer-events: none;
        }
        .ap-input {
          width: 100%;
          border: 1.5px solid #dbeafe;
          border-radius: 12px;
          background: #f8fbff;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          font-size: 0.88rem;
          color: #1e3a6e;
          font-family: 'DM Mono', monospace;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .ap-input::placeholder { color: #aac3e8; }
        .ap-input:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .ap-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 12px rgba(37,99,235,0.3);
          white-space: nowrap;
        }
        .ap-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37,99,235,0.35);
        }
        .ap-btn:active:not(:disabled) { transform: translateY(0); }
        .ap-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .ap-error {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.9rem;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
          font-size: 0.82rem;
          padding: 0.55rem 0.9rem;
          border-radius: 10px;
          font-weight: 500;
        }

        /* Stats bar */
        .ap-stats {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%);
          padding: 1.25rem 2rem;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          animation: fadeInUp 0.6s ease-out;
        }
        .ap-stat {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .ap-stat + .ap-stat {
          border-left: 1px solid rgba(255,255,255,0.15);
          padding-left: 1rem;
        }
        .ap-stat-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
        }
        .ap-stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          font-family: 'DM Mono', monospace;
        }
        .ap-stat-sub {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.55);
          font-family: 'DM Mono', monospace;
        }

        /* Results section */
        .ap-results {
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
        .ap-results-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b8ab1;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e8f0fe;
        }

        .ap-empty {
          text-align: center;
          padding: 2.5rem 1rem;
          color: #93b4e0;
          font-size: 0.88rem;
        }

        /* Category card */
        .ap-category {
          border: 1px solid #dbeafe;
          border-radius: 14px;
          overflow: hidden;
          transition: box-shadow 0.18s;
          animation: fadeInUp 0.6s ease-out;
        }
        .ap-category:hover {
          box-shadow: 0 4px 20px rgba(37,99,235,0.09);
        }
        .ap-category:nth-child(1) { animation-delay: 0.2s; }
        .ap-category:nth-child(2) { animation-delay: 0.3s; }
        .ap-category:nth-child(3) { animation-delay: 0.4s; }
        .ap-category:nth-child(4) { animation-delay: 0.5s; }
        .ap-category:nth-child(5) { animation-delay: 0.6s; }
        .ap-category:nth-child(n+6) { animation-delay: 0.7s; }
        .ap-category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.6rem;
          background: #f0f6ff;
          border-bottom: 1px solid #dbeafe;
          padding: 0.85rem 1.1rem;
        }
        .ap-category-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e3a6e;
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .ap-category-name-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3b82f6;
          flex-shrink: 0;
        }
        .ap-badges {
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
        }
        .ap-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.28rem 0.7rem;
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
        }
        .ap-badge-earned {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .ap-badge-withheld {
          background: #fef9c3;
          color: #854d0e;
          border: 1px solid #fde68a;
        }

        /* Table */
        .ap-table-wrap { overflow-x: auto; }
        table.ap-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.83rem;
        }
        .ap-table thead tr {
          background: #f8fbff;
        }
        .ap-table th {
          padding: 0.6rem 1.1rem;
          text-align: left;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #7aa0cc;
          border-bottom: 1px solid #e8f0fe;
        }
        .ap-table th:not(:first-child) { text-align: right; }
        .ap-table td {
          padding: 0.7rem 1.1rem;
          color: #2d4a7a;
          border-bottom: 1px solid #f0f6ff;
          vertical-align: middle;
        }
        .ap-table td:not(:first-child) {
          text-align: right;
          font-family: 'DM Mono', monospace;
          font-weight: 500;
        }
        .ap-table tbody tr:last-child td { border-bottom: none; }
        .ap-table tbody tr:hover td { background: #f8fbff; }
        .ap-table .td-earned { color: #16a34a; }
        .ap-table .td-withheld { color: #b45309; }
        .ap-table .td-empty { text-align: center; color: #93b4e0; font-style: italic; }

        /* Skeleton loaders */
        .ap-skeleton {
          background: linear-gradient(90deg, #e8f0fe 25%, #dbeafe 50%, #e8f0fe 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: 8px;
        }
        .ap-skeleton-stat {
          background: rgba(255,255,255,0.15);
          height: 2.4rem;
          border-radius: 8px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        .ap-skeleton-card {
          border: 1px solid #dbeafe;
          border-radius: 14px;
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out;
        }
        .ap-skeleton-header {
          background: #f0f6ff;
          border-bottom: 1px solid #dbeafe;
          padding: 0.85rem 1.1rem;
          height: 3.2rem;
        }
        .ap-skeleton-row {
          height: 2.2rem;
          margin: 0.5rem 1.1rem;
          border-radius: 6px;
          background: #e8f0fe;
          animation: shimmer 2s infinite;
        }

        @media (max-width: 600px) {
          .ap-search-section { padding: 1.25rem 1.1rem; }
          .ap-stats { grid-template-columns: 1fr; }
          .ap-stat + .ap-stat { border-left: none; border-top: 1px solid rgba(255,255,255,0.15); padding-left: 0; padding-top: 0.75rem; }
          .ap-results { padding: 1.1rem; }
        }
      `}</style>

      <div className="ap-root">
        <div className="ap-container">

          {/* Header */}
          <header className="ap-header">
            <h1 className="ap-title">Activity Points Checker</h1>
            <p className="ap-subtitle">Look up earned activity points by enrollment number</p>
          </header>

          {/* Search Card */}
          <div className="ap-card">
            <div className="ap-search-section">
              <label className="ap-search-label">
                <BookOpen size={11} style={{ display: "inline", marginRight: "0.35rem", verticalAlign: "middle" }} />
                Enrollment Number
              </label>
              <form onSubmit={handleSearch}>
                <div className="ap-search-row">
                  <div className="ap-input-wrap">
                    <Search className="ap-input-icon" />
                    <input
                      type="text"
                      value={enrollmentNo}
                      onChange={(e) => setEnrollmentNo(e.target.value)}
                      placeholder="e.g. 2025UCS1023"
                      className="ap-input"
                    />
                  </div>
                  <button type="submit" disabled={isLoading} className="ap-btn">
                    {isLoading
                      ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Searching…</>
                      : <><Search size={15} /> Search</>
                    }
                  </button>
                </div>

                {errorMessage && (
                  <div className="ap-error">
                    <AlertCircle size={14} />
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Stats bar + results */}
            {searchedEnrollmentNo && !errorMessage && (
              <>
                {isLoading ? (
                  <>
                    <div className="ap-stats">
                      <div className="ap-stat">
                        <span className="ap-stat-label">Enrollment</span>
                        <div className="ap-skeleton-stat"></div>
                      </div>
                      <div className="ap-stat">
                        <span className="ap-stat-label">Total Activity Points</span>
                        <div className="ap-skeleton-stat"></div>
                      </div>
                    </div>
                    <div className="ap-results">
                      <p className="ap-results-title">Category Breakdown</p>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="ap-skeleton-card" style={{ animationDelay: `${i * 0.1}s` }}>
                          <div className="ap-skeleton-header" />
                          <div className="ap-skeleton-row" />
                          <div className="ap-skeleton-row" style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }} />
                          <div className="ap-skeleton-row" style={{ marginBottom: '0.5rem' }} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ap-stats">
                  <div className="ap-stat">
                    <span className="ap-stat-label">Enrollment</span>
                    <span className="ap-stat-value" style={{ fontSize: "0.9rem", letterSpacing: "0.04em" }}>
                      {searchedEnrollmentNo.toUpperCase()}
                    </span>
                  </div>
                  <div className="ap-stat">
                    <span className="ap-stat-label">Total Activity Points</span>
                    <span className="ap-stat-value">{totalActivityPoints}</span>
                    <span className="ap-stat-sub">Withheld: {totals.withheld}</span>
                  </div>
                </div>

                <div className="ap-results">
                  <p className="ap-results-title">
                    <TrendingUp size={11} style={{ display: "inline", marginRight: "0.35rem", verticalAlign: "middle" }} />
                    Category Breakdown
                  </p>

                  {rewards.length === 0 ? (
                    <div className="ap-empty">No reward data found for this enrollment number.</div>
                  ) : (
                    rewards.map((category) => {
                      const sources = Array.isArray(category?.sources) ? category.sources : [];
                      return (
                        <div key={category?.category_name} className="ap-category">
                          <div className="ap-category-header">
                            <div className="ap-category-name">
                              <span className="ap-category-name-dot" />
                              {category?.category_name || "Unnamed Category"}
                            </div>
                            <div className="ap-badges">
                              <span className="ap-badge ap-badge-earned">
                                ✦ Earned: {parseNumber(category?.total_earned)}
                              </span>
                              <span className="ap-badge ap-badge-withheld">
                                ⚐ Withheld: {parseNumber(category?.total_withheld)}
                              </span>
                            </div>
                          </div>

                          <div className="ap-table-wrap">
                            <table className="ap-table">
                              <thead>
                                <tr>
                                  <th>Activity Source</th>
                                  <th>Earned</th>
                                  <th>Withheld</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sources.length === 0 ? (
                                  <tr>
                                    <td colSpan={3} className="td-empty">No source rows.</td>
                                  </tr>
                                ) : (
                                  sources.map((source, i) => (
                                    <tr key={`${category?.category_name}-${i}`}>
                                      <td>{source?.points_from || "—"}</td>
                                      <td className="td-earned">{parseNumber(source?.earned)}</td>
                                      <td className="td-withheld">{parseNumber(source?.withheld)}</td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                  </>
                )}
              </>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

export default Apsite;