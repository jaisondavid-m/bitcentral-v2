/**
 * BitCentral PS Connector - Popup Script
 * 
 * Automatically decodes PS JWT cookie from ps.bitsathy.ac.in,
 * displays student details (name, email, roll no, dept, year),
 * and syncs directly with BitCentral backend with NO manual token entry.
 */

const $ = (sel) => document.querySelector(sel);

const statusDot = $("#statusDot");
const statusLabel = $("#statusLabel");
const statusDetail = $("#statusDetail");
const messageArea = $("#messageArea");
const profileCard = $("#profileCard");
const avatarInitial = $("#avatarInitial");
const studentName = $("#studentName");
const studentEmail = $("#studentEmail");
const studentRoll = $("#studentRoll");
const studentRegId = $("#studentRegId");
const studentDeptYear = $("#studentDeptYear");
const studentExp = $("#studentExp");
const syncBtn = $("#syncBtn");
const disconnectBtn = $("#disconnectBtn");
const refreshBtn = $("#refreshBtn");
const serverSelect = $("#serverSelect");

let currentPSToken = null;
let currentClaims = null;

// Parse JWT without external libraries
function parseJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4) payload += "=";

    const binaryString = atob(payload);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decodedText = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(decodedText);
  } catch (err) {
    console.error("[BitCentral PS] Failed to decode JWT:", err);
    return null;
  }
}

// Show flash message
function showMessage(text, type = "info") {
  messageArea.className = `message ${type}`;
  messageArea.textContent = text;
  messageArea.classList.remove("hidden");
  setTimeout(() => messageArea.classList.add("hidden"), 6000);
}

// Update status dot and text
function setStatus(state, label, detail) {
  statusDot.className = `status-dot ${state}`;
  statusLabel.textContent = label;
  statusDetail.textContent = detail;
}

// Get chosen API base URL
async function getApiBaseUrl() {
  const stored = await chrome.storage.local.get(["custom_api_url"]);
  return stored.custom_api_url || serverSelect.value || "https://bitcentral-v2.onrender.com";
}

// Save selected server
serverSelect.addEventListener("change", async (e) => {
  const chosen = e.target.value;
  await chrome.storage.local.set({ custom_api_url: chosen });
  showMessage(`API set to: ${chosen}`, "info");
  if (currentClaims?.email) {
    checkBitCentralStatus(currentClaims.email);
  }
});

// Check if BitCentral has this student linked
async function checkBitCentralStatus(email) {
  const apiBase = await getApiBaseUrl();
  try {
    const res = await fetch(`${apiBase}/ps/status?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (data && data.connected) {
      setStatus("connected", "Synced with BitCentral ✓", `Linked to ${data.email || email}`);
      syncBtn.classList.add("hidden");
      disconnectBtn.classList.remove("hidden");
    } else {
      setStatus("disconnected", "PS Session Ready", "Click below to sync your PS session with BitCentral");
      syncBtn.classList.remove("hidden");
      syncBtn.disabled = false;
      disconnectBtn.classList.add("hidden");
    }
  } catch (err) {
    console.warn("Status check failed:", err);
    setStatus("disconnected", "PS Session Ready", "Ready to sync with BitCentral");
    syncBtn.classList.remove("hidden");
    syncBtn.disabled = false;
  }
}

// Populate student profile card from decoded claims
function displayStudentClaims(claims) {
  currentClaims = claims;

  const name = claims.username || claims.name || "Student";
  const email = claims.email || "--";
  const roll = claims.user_off_id || "--";
  const regId = claims.user_id || "--";
  const deptYear = `${claims.dept ? `Dept ${claims.dept}` : ""}${claims.year ? ` • Year ${claims.year}` : ""}` || "--";

  studentName.textContent = name;
  studentEmail.textContent = email;
  studentRoll.textContent = roll;
  studentRegId.textContent = regId;
  studentDeptYear.textContent = deptYear;

  // Avatar initial
  avatarInitial.textContent = name.charAt(0).toUpperCase() || "🎓";

  // Expiry date
  if (claims.exp) {
    const expDate = new Date(claims.exp * 1000);
    const isExpired = Date.now() > claims.exp * 1000;
    studentExp.textContent = `${isExpired ? "⚠️ Expired: " : ""}${expDate.toLocaleDateString()}`;
    studentExp.style.color = isExpired ? "#ef4444" : "#4ade80";
  } else {
    studentExp.textContent = "Session Active";
  }

  profileCard.classList.remove("hidden");
}

// Main initialization
async function init() {
  setStatus("loading", "Checking...", "Detecting PS session on ps.bitsathy.ac.in...");
  syncBtn.disabled = true;

  // Restore saved server target
  const stored = await chrome.storage.local.get(["custom_api_url"]);
  if (stored.custom_api_url) {
    serverSelect.value = stored.custom_api_url;
  }

  // 1. Get PS token from background (read from cookie)
  chrome.runtime.sendMessage({ type: "GET_PS_TOKEN" }, async (response) => {
    if (chrome.runtime.lastError) {
      setStatus("disconnected", "Extension Error", "Could not communicate with background script");
      return;
    }

    currentPSToken = response?.psToken || null;

    // Fallback to local storage if cookie read was pending
    if (!currentPSToken) {
      const saved = await chrome.storage.local.get(["ps_jwt"]);
      currentPSToken = saved.ps_jwt || null;
    }

    if (!currentPSToken) {
      setStatus("disconnected", "No PS Session", "Please log in to ps.bitsathy.ac.in in Chrome");
      profileCard.classList.add("hidden");
      syncBtn.disabled = true;
      showMessage("Please visit ps.bitsathy.ac.in and log in, then open this extension.", "info");
      return;
    }

    // 2. Decode the PS JWT
    const claims = parseJwt(currentPSToken);
    if (!claims || !claims.email) {
      setStatus("disconnected", "Invalid PS Token", "Could not parse student info from PS cookie");
      return;
    }

    // 3. Render decoded student profile
    displayStudentClaims(claims);

    // 4. Check if already linked with BitCentral backend
    await checkBitCentralStatus(claims.email);
  });
}

// Sync to BitCentral (sends PS token directly; backend extracts email)
syncBtn.addEventListener("click", async () => {
  if (!currentPSToken) {
    showMessage("No PS token found. Please login to ps.bitsathy.ac.in first.", "error");
    return;
  }

  syncBtn.disabled = true;
  syncBtn.innerHTML = "<span>⏳</span> Syncing...";

  const apiBase = await getApiBaseUrl();

  chrome.runtime.sendMessage(
    { type: "SYNC_PS_TOKEN", psToken: currentPSToken, apiBase },
    (result) => {
      if (result && result.success) {
        setStatus("connected", "Synced with BitCentral ✓", `Linked to ${result.email || currentClaims?.email}`);
        showMessage("✓ PS session synced successfully with BitCentral!", "success");
        syncBtn.classList.add("hidden");
        disconnectBtn.classList.remove("hidden");
      } else {
        showMessage(result?.message || result?.error || "Sync failed. Ensure BitCentral server is running.", "error");
        syncBtn.disabled = false;
      }
      syncBtn.innerHTML = "<span>⚡</span> Sync to BitCentral";
    }
  );
});

// Disconnect PS
disconnectBtn.addEventListener("click", async () => {
  if (!currentClaims?.email) return;

  disconnectBtn.disabled = true;
  disconnectBtn.innerHTML = "<span>⏳</span> Disconnecting...";

  const apiBase = await getApiBaseUrl();

  chrome.runtime.sendMessage(
    { type: "DISCONNECT_PS", email: currentClaims.email, apiBase },
    (result) => {
      if (result && result.success) {
        setStatus("disconnected", "Disconnected", "PS session unlinked from BitCentral");
        showMessage("PS account unlinked.", "success");
        disconnectBtn.classList.add("hidden");
        syncBtn.classList.remove("hidden");
        syncBtn.disabled = false;
      } else {
        showMessage("Failed to disconnect.", "error");
      }
      disconnectBtn.disabled = false;
      disconnectBtn.innerHTML = "<span>🔌</span> Disconnect PS";
    }
  );
});

// Refresh button
refreshBtn.addEventListener("click", () => {
  init();
});

// Auto-run on open
init();
