import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/StudentContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";
import { getPSStatus, connectPS, disconnectPS, fetchPSImage } from "@/api/ps.js";

function createStyles(isDark) {
  return {
    page: {
      minHeight: "100vh",
      background: isDark
        ? "linear-gradient(135deg, #0b0f19 0%, #111827 50%, #1e1b4b 100%)"
        : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 45%, #ede9fe 100%)",
      padding: "24px 16px 60px",
      color: isDark ? "#e2e8f0" : "#0f172a",
      fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
      transition: "background 0.3s ease, color 0.3s ease",
    },
    container: {
      maxWidth: 720,
      margin: "0 auto",
    },

    /* Header */
    header: {
      textAlign: "center",
      marginBottom: 32,
      padding: "28px 0 20px",
    },
    headerIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 800,
      background: isDark
        ? "linear-gradient(135deg, #a855f7, #ec4899)"
        : "linear-gradient(135deg, #7c3aed, #db2777)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: 8,
      letterSpacing: "-0.5px",
    },
    headerSub: {
      fontSize: 14,
      color: isDark ? "#94a3b8" : "#475569",
      maxWidth: 440,
      margin: "0 auto",
      lineHeight: 1.6,
    },

    /* Status Card */
    statusCard: {
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.88)",
      border: isDark
        ? "1px solid rgba(255,255,255,0.08)"
        : "1px solid rgba(226,232,240,0.9)",
      borderRadius: 16,
      padding: "24px",
      marginBottom: 20,
      backdropFilter: "blur(12px)",
      boxShadow: isDark
        ? "0 8px 32px rgba(0,0,0,0.25)"
        : "0 10px 25px rgba(99,102,241,0.07)",
      transition: "all 0.3s ease",
    },
    statusRow: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 8,
    },
    statusDot: (connected) => ({
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: connected ? "#22c55e" : "#ef4444",
      boxShadow: connected
        ? "0 0 12px rgba(34,197,94,0.6)"
        : "0 0 12px rgba(239,68,68,0.4)",
      flexShrink: 0,
      transition: "all 0.3s ease",
    }),
    statusLabel: {
      fontSize: 18,
      fontWeight: 700,
      color: isDark ? "#f8fafc" : "#0f172a",
    },
    statusDetail: {
      fontSize: 13,
      color: isDark ? "#94a3b8" : "#64748b",
      marginLeft: 28,
      lineHeight: 1.5,
    },

    /* Profile Info Grid (When Connected) */
    profilePillContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: 10,
      marginTop: 18,
      paddingTop: 16,
      borderTop: isDark
        ? "1px solid rgba(255,255,255,0.08)"
        : "1px solid rgba(226,232,240,0.8)",
    },
    profilePill: {
      background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
      border: isDark
        ? "1px solid rgba(255,255,255,0.06)"
        : "1px solid #e2e8f0",
      borderRadius: 10,
      padding: "10px 12px",
    },
    profilePillLabel: {
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      fontWeight: 600,
      color: isDark ? "#94a3b8" : "#64748b",
      marginBottom: 3,
    },
    profilePillVal: {
      fontSize: 13,
      fontWeight: 700,
      color: isDark ? "#f1f5f9" : "#0f172a",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    /* Image Test Card */
    imageCard: {
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
      border: isDark
        ? "1px solid rgba(255,255,255,0.08)"
        : "1px solid rgba(226,232,240,0.9)",
      borderRadius: 16,
      padding: "24px",
      marginBottom: 20,
      backdropFilter: "blur(12px)",
      textAlign: "center",
      boxShadow: isDark
        ? "0 8px 32px rgba(0,0,0,0.25)"
        : "0 10px 25px rgba(99,102,241,0.07)",
      transition: "all 0.3s ease",
    },
    imageTitle: {
      fontSize: 17,
      fontWeight: 700,
      marginBottom: 4,
      color: isDark ? "#f8fafc" : "#0f172a",
    },
    imageSubtitle: {
      fontSize: 12.5,
      color: isDark ? "#94a3b8" : "#64748b",
      marginBottom: 18,
    },
    imageWrapper: {
      position: "relative",
      display: "inline-block",
      borderRadius: 16,
      overflow: "hidden",
      border: isDark
        ? "2px solid rgba(168,85,247,0.4)"
        : "2px solid rgba(147,51,234,0.3)",
      boxShadow: isDark
        ? "0 12px 36px rgba(0,0,0,0.5)"
        : "0 12px 36px rgba(99,102,241,0.15)",
      maxWidth: "100%",
    },
    profileImage: {
      display: "block",
      maxWidth: "100%",
      maxHeight: 340,
      objectFit: "contain",
      borderRadius: 14,
    },
    imagePlaceholder: {
      width: 280,
      height: 200,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
      border: isDark ? "none" : "1px dashed #cbd5e1",
      borderRadius: 14,
      color: isDark ? "#94a3b8" : "#64748b",
      fontSize: 13,
      gap: 10,
    },
    imagePlaceholderIcon: {
      fontSize: 38,
      opacity: 0.6,
    },

    /* Manual Connect Section */
    manualSection: {
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.88)",
      border: isDark
        ? "1px solid rgba(255,255,255,0.08)"
        : "1px solid rgba(226,232,240,0.9)",
      borderRadius: 16,
      padding: "24px",
      marginBottom: 20,
      backdropFilter: "blur(12px)",
      boxShadow: isDark
        ? "0 8px 32px rgba(0,0,0,0.25)"
        : "0 10px 25px rgba(99,102,241,0.07)",
      transition: "all 0.3s ease",
    },
    manualTitle: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 4,
      color: isDark ? "#f8fafc" : "#0f172a",
    },
    manualSubtitle: {
      fontSize: 12.5,
      color: isDark ? "#94a3b8" : "#64748b",
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 600,
      color: isDark ? "#cbd5e1" : "#334155",
      marginBottom: 6,
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 10,
      border: isDark
        ? "1px solid rgba(255,255,255,0.12)"
        : "1px solid #cbd5e1",
      background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
      color: isDark ? "#f8fafc" : "#0f172a",
      fontSize: 13,
      outline: "none",
      transition: "all 0.2s",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      boxShadow: isDark ? "none" : "inset 0 1px 2px rgba(0,0,0,0.04)",
    },
    helpText: {
      fontSize: 11,
      color: isDark ? "#94a3b8" : "#64748b",
      marginTop: 6,
      lineHeight: 1.5,
    },

    /* Buttons */
    btnPrimary: {
      width: "100%",
      padding: "13px",
      borderRadius: 12,
      border: "none",
      background: "linear-gradient(135deg, #6366f1, #a855f7)",
      color: "#fff",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 10,
      boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
    },
    btnDanger: {
      width: "100%",
      padding: "13px",
      borderRadius: 12,
      border: isDark
        ? "1px solid rgba(239,68,68,0.25)"
        : "1px solid #fecaca",
      background: isDark ? "rgba(239,68,68,0.12)" : "#fef2f2",
      color: isDark ? "#f87171" : "#dc2626",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 10,
      boxShadow: isDark ? "none" : "0 2px 8px rgba(239,68,68,0.08)",
    },
    btnOutline: {
      width: "100%",
      padding: "12px",
      borderRadius: 12,
      border: isDark
        ? "1px solid rgba(168,85,247,0.35)"
        : "1px solid #a855f7",
      background: isDark ? "transparent" : "#ffffff",
      color: isDark ? "#c084fc" : "#7e22ce",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 10,
      boxShadow: isDark ? "none" : "0 2px 8px rgba(168,85,247,0.1)",
    },

    /* Message */
    message: (type) => ({
      padding: "12px 16px",
      borderRadius: 10,
      fontSize: 13,
      marginBottom: 16,
      lineHeight: 1.5,
      background: isDark
        ? type === "success"
          ? "rgba(34,197,94,0.12)"
          : type === "error"
          ? "rgba(239,68,68,0.12)"
          : "rgba(59,130,246,0.12)"
        : type === "success"
        ? "#f0fdf4"
        : type === "error"
        ? "#fef2f2"
        : "#eff6ff",
      color: isDark
        ? type === "success"
          ? "#4ade80"
          : type === "error"
          ? "#f87171"
          : "#60a5fa"
        : type === "success"
        ? "#15803d"
        : type === "error"
        ? "#b91c1c"
        : "#1d4ed8",
      border: `1px solid ${
        isDark
          ? type === "success"
            ? "rgba(34,197,94,0.25)"
            : type === "error"
            ? "rgba(239,68,68,0.25)"
            : "rgba(59,130,246,0.25)"
          : type === "success"
          ? "#bbf7d0"
          : type === "error"
          ? "#fecaca"
          : "#bfdbfe"
      }`,
    }),

    /* Steps */
    stepsCard: {
      background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)",
      border: isDark
        ? "1px solid rgba(255,255,255,0.08)"
        : "1px solid rgba(226,232,240,0.9)",
      borderRadius: 16,
      padding: "24px",
      marginBottom: 20,
      backdropFilter: "blur(12px)",
      boxShadow: isDark
        ? "0 8px 32px rgba(0,0,0,0.2)"
        : "0 10px 25px rgba(99,102,241,0.06)",
      transition: "all 0.3s ease",
    },
    stepsTitle: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: isDark ? "#f8fafc" : "#0f172a",
    },
    step: {
      display: "flex",
      gap: 14,
      marginBottom: 16,
      alignItems: "flex-start",
    },
    stepNum: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1, #a855f7)",
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
    },
    stepText: {
      fontSize: 13,
      lineHeight: 1.6,
      color: isDark ? "#cbd5e1" : "#334155",
      paddingTop: 3,
    },
    stepCode: {
      display: "inline-block",
      background: isDark ? "rgba(168,85,247,0.15)" : "rgba(147,51,234,0.08)",
      color: isDark ? "#c084fc" : "#7e22ce",
      border: isDark
        ? "1px solid rgba(168,85,247,0.25)"
        : "1px solid rgba(147,51,234,0.2)",
      padding: "2px 8px",
      borderRadius: 6,
      fontSize: 12,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    },

    /* Spinner */
    spinner: {
      display: "inline-block",
      width: 18,
      height: 18,
      border: isDark ? "2px solid rgba(255,255,255,0.2)" : "2px solid rgba(0,0,0,0.15)",
      borderTopColor: isDark ? "#fff" : "#4f46e5",
      borderRadius: "50%",
      animation: "ps-spin 0.6s linear infinite",
    },
  };
}

export default function PSConnect() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const [status, setStatus] = useState({ connected: false, loading: true });
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [message, setMessage] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  // Fetch PS status on mount
  const refreshStatus = useCallback(async () => {
    setStatus((s) => ({ ...s, loading: true }));
    try {
      const email = user?.email || (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}")?.email : null);
      const res = await getPSStatus(email);
      setStatus({
        connected: res.connected || false,
        psUsername: res.ps_username || "",
        email: res.email || email || "",
        userOffId: res.user_off_id || "",
        userId: res.user_id || "",
        dept: res.dept || "",
        year: res.year || "",
        connectedAt: res.connected_at || "",
        loading: false,
      });
      if (res.connected) {
        loadImage(email || res.email);
      }
    } catch {
      setStatus({ connected: false, loading: false });
    }
  }, [user?.email]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // Load PS profile image
  const loadImage = async (userEmail = null) => {
    setImageLoading(true);
    setImageError(false);
    try {
      const targetEmail = userEmail || user?.email;
      const blobUrl = await fetchPSImage("/api/ps_v2/user/images/image.jpg", targetEmail);
      if (blobUrl) {
        setImageUrl(blobUrl);
      } else {
        setImageError(true);
      }
    } catch {
      setImageError(true);
    }
    setImageLoading(false);
  };

  // Handle manual connect
  const handleConnect = async () => {
    const token = manualToken.trim();
    if (!token) {
      setMessage({ text: "Please enter your PS JWT token", type: "error" });
      return;
    }

    setConnecting(true);
    setMessage(null);
    try {
      const res = await connectPS(token);
      if (res.success) {
        setMessage({
          text: `PS account connected successfully! Welcome, ${res.username || "student"}.`,
          type: "success",
        });
        setManualToken("");
        refreshStatus();
      } else {
        setMessage({ text: res.message || "Failed to connect PS account", type: "error" });
      }
    } catch (err) {
      setMessage({ text: err.message || "Connection failed", type: "error" });
    }
    setConnecting(false);
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    setDisconnecting(true);
    setMessage(null);
    try {
      const res = await disconnectPS();
      if (res.success) {
        setMessage({ text: "PS account disconnected", type: "success" });
        setImageUrl(null);
        refreshStatus();
      } else {
        setMessage({ text: res.message || "Failed to disconnect", type: "error" });
      }
    } catch (err) {
      setMessage({ text: err.message || "Disconnect failed", type: "error" });
    }
    setDisconnecting(false);
  };

  return (
    <>
      {/* Inject spin animation */}
      <style>{`@keyframes ps-spin { to { transform: rotate(360deg); } }`}</style>

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerIcon}>🔗</div>
            <h1 style={styles.headerTitle}>PS Connect</h1>
            <p style={styles.headerSub}>
              Link your <strong>ps.bitsathy.ac.in</strong> account with BitCentral to access your PS profile image and data directly.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div style={styles.message(message.type)}>{message.text}</div>
          )}

          {/* Status Card */}
          <div style={styles.statusCard}>
            <div style={styles.statusRow}>
              {status.loading ? (
                <div style={styles.spinner} />
              ) : (
                <div style={styles.statusDot(status.connected)} />
              )}
              <span style={styles.statusLabel}>
                {status.loading
                  ? "Checking..."
                  : status.connected
                  ? "Connected ✓"
                  : "Not Connected"}
              </span>
            </div>
            <div style={styles.statusDetail}>
              {status.loading
                ? "Verifying PS connection..."
                : status.connected
                ? `Linked as ${status.psUsername || "Student"}${status.connectedAt ? ` • synced ${new Date(status.connectedAt).toLocaleDateString()}` : ""}`
                : "Your PS account is not linked yet"}
            </div>

            {/* Student Info Pills (When Connected) */}
            {status.connected && (
              <div style={styles.profilePillContainer}>
                {status.psUsername && (
                  <div style={styles.profilePill}>
                    <div style={styles.profilePillLabel}>Name</div>
                    <div style={styles.profilePillVal}>{status.psUsername}</div>
                  </div>
                )}
                {status.userOffId && (
                  <div style={styles.profilePill}>
                    <div style={styles.profilePillLabel}>Roll Number</div>
                    <div style={styles.profilePillVal}>{status.userOffId}</div>
                  </div>
                )}
                {status.userId && (
                  <div style={styles.profilePill}>
                    <div style={styles.profilePillLabel}>Register ID</div>
                    <div style={styles.profilePillVal}>{status.userId}</div>
                  </div>
                )}
                {status.dept && (
                  <div style={styles.profilePill}>
                    <div style={styles.profilePillLabel}>Department</div>
                    <div style={styles.profilePillVal}>Dept {status.dept}</div>
                  </div>
                )}
                {status.year && (
                  <div style={styles.profilePill}>
                    <div style={styles.profilePillLabel}>Year</div>
                    <div style={styles.profilePillVal}>Year {status.year}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Image Test Card - Show when connected */}
          {status.connected && (
            <div style={styles.imageCard}>
              <div style={styles.imageTitle}>📸 PS Profile Image Test</div>
              <div style={styles.imageSubtitle}>
                Fetched via proxy from <code style={styles.stepCode}>ps.bitsathy.ac.in</code>
              </div>
              <div style={styles.imageWrapper}>
                {imageLoading ? (
                  <div style={styles.imagePlaceholder}>
                    <div style={styles.spinner} />
                    <span>Loading image...</span>
                  </div>
                ) : imageError || !imageUrl ? (
                  <div style={styles.imagePlaceholder}>
                    <div style={styles.imagePlaceholderIcon}>🖼️</div>
                    <span>Failed to load image</span>
                    <button
                      onClick={() => loadImage()}
                      style={{
                        ...styles.btnOutline,
                        width: "auto",
                        padding: "8px 20px",
                        marginBottom: 0,
                        fontSize: 12,
                      }}
                    >
                      🔄 Retry
                    </button>
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt="PS Profile"
                    style={styles.profileImage}
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Disconnect Button (when connected) */}
          {status.connected && !status.loading && (
            <button
              style={styles.btnDanger}
              onClick={handleDisconnect}
              disabled={disconnecting}
            >
              {disconnecting ? (
                <>
                  <div style={styles.spinner} /> Disconnecting...
                </>
              ) : (
                <>🔌 Disconnect PS Account</>
              )}
            </button>
          )}

          {/* Manual Connect Section (when NOT connected) */}
          {!status.connected && !status.loading && (
            <div style={styles.manualSection}>
              <div style={styles.manualTitle}>🔑 Connect with PS Token</div>
              <div style={styles.manualSubtitle}>
                Use the Chrome extension for auto-detection, or paste your PS JWT manually
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>PS JWT Token</label>
                <input
                  type="password"
                  style={styles.input}
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste your PS JWT token here..."
                  onFocus={(e) => (e.target.style.borderColor = "#a855f7")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = isDark
                      ? "rgba(255,255,255,0.12)"
                      : "#cbd5e1")
                  }
                />
                <div style={styles.helpText}>
                  Go to <strong>ps.bitsathy.ac.in</strong>, log in, open DevTools (F12) → Application → Cookies → copy the <code style={styles.stepCode}>PS</code> cookie value.
                </div>
              </div>

              <button
                style={{
                  ...styles.btnPrimary,
                  opacity: connecting || !manualToken.trim() ? 0.5 : 1,
                  cursor: connecting || !manualToken.trim() ? "not-allowed" : "pointer",
                }}
                onClick={handleConnect}
                disabled={connecting || !manualToken.trim()}
              >
                {connecting ? (
                  <>
                    <div style={styles.spinner} /> Connecting...
                  </>
                ) : (
                  <>🔗 Connect PS Account</>
                )}
              </button>
            </div>
          )}

          {/* How It Works */}
          <div style={styles.stepsCard}>
            <div style={styles.stepsTitle}>
              <span>📋</span> How It Works
            </div>

            <div style={styles.step}>
              <div style={styles.stepNum}>1</div>
              <div style={styles.stepText}>
                Install the <strong>BitCentral PS Connector</strong> Chrome extension, or manually copy your PS token.
              </div>
            </div>

            <div style={styles.step}>
              <div style={styles.stepNum}>2</div>
              <div style={styles.stepText}>
                Log in to <code style={styles.stepCode}>ps.bitsathy.ac.in</code> — the extension automatically detects your session cookie.
              </div>
            </div>

            <div style={styles.step}>
              <div style={styles.stepNum}>3</div>
              <div style={styles.stepText}>
                Click <strong>Sync to BitCentral</strong> in the extension popup. The server decodes your student email and securely stores your token.
              </div>
            </div>

            <div style={styles.step}>
              <div style={styles.stepNum}>4</div>
              <div style={styles.stepText}>
                BitCentral uses your stored token to fetch data from PS endpoints (images, profile, etc.) seamlessly.
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <button style={styles.btnOutline} onClick={refreshStatus}>
            🔄 Refresh Status
          </button>
        </div>
      </div>
    </>
  );
}
