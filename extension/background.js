/**
 * BitCentral PS Connector - Background Service Worker
 * 
 * Monitors cookies on ps.bitsathy.ac.in for the PS JWT token.
 * Automatically decodes & syncs with BitCentral backend using the student's email
 * encoded inside the PS JWT. No manual BitCentral login/token entry needed.
 */

const PS_DOMAIN = "ps.bitsathy.ac.in";
const PS_COOKIE_NAME = "PS";

// Default API base URL
async function getApiBaseUrl() {
  const data = await chrome.storage.local.get(["custom_api_url"]);
  return data.custom_api_url || "https://bitcentral-v2-dgvs.onrender.com";
}

// Extract PS JWT from Chrome cookies
async function getPSToken() {
  try {
    const cookie = await chrome.cookies.get({
      url: `https://${PS_DOMAIN}`,
      name: PS_COOKIE_NAME,
    });
    return cookie ? cookie.value : null;
  } catch (err) {
    console.error("[BitCentral PS] Failed to read PS cookie:", err);
    return null;
  }
}

// Send the PS token to BitCentral backend (public endpoint; backend decodes email)
async function syncPSToken(psToken, customApiBase) {
  if (!psToken) return { success: false, error: "Missing PS token" };

  const apiBase = customApiBase || (await getApiBaseUrl());

  try {
    const res = await fetch(`${apiBase}/ps/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ps_token: psToken }),
    });
    const data = await res.json();
    console.log("[BitCentral PS] Sync response:", data);
    return data;
  } catch (err) {
    console.error("[BitCentral PS] Sync request failed:", err);
    return { success: false, error: err.message };
  }
}

// Disconnect PS from BitCentral
async function disconnectPS(email, customApiBase) {
  const apiBase = customApiBase || (await getApiBaseUrl());
  try {
    const res = await fetch(`${apiBase}/ps/disconnect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Check PS connection status for an email
async function checkPSStatus(email, customApiBase) {
  if (!email) return { success: false, connected: false };

  const apiBase = customApiBase || (await getApiBaseUrl());
  try {
    const res = await fetch(`${apiBase}/ps/status?email=${encodeURIComponent(email)}`);
    return await res.json();
  } catch (err) {
    return { success: false, connected: false, error: err.message };
  }
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PS_TOKEN") {
    getPSToken().then((token) => {
      sendResponse({ psToken: token });
    });
    return true; // async
  }

  if (message.type === "SYNC_PS_TOKEN") {
    const { psToken, apiBase } = message;
    syncPSToken(psToken, apiBase).then((result) => {
      sendResponse(result);
    });
    return true;
  }

  if (message.type === "DISCONNECT_PS") {
    disconnectPS(message.email, message.apiBase).then((result) => {
      sendResponse(result);
    });
    return true;
  }

  if (message.type === "CHECK_PS_STATUS") {
    checkPSStatus(message.email, message.apiBase).then((result) => {
      sendResponse(result);
    });
    return true;
  }

  if (message.type === "PS_TOKEN_DETECTED") {
    const token = message.token;
    chrome.storage.local.set({ ps_jwt: token });

    // Auto-sync to BitCentral in background
    syncPSToken(token).then((result) => {
      console.log("[BitCentral PS] Auto-synced on detection:", result);
    });

    sendResponse({ received: true });
    return true;
  }
});

// Monitor cookie changes on PS domain
chrome.cookies.onChanged.addListener((changeInfo) => {
  const { cookie, removed } = changeInfo;
  if (cookie.domain.includes(PS_DOMAIN) && cookie.name === PS_COOKIE_NAME) {
    if (!removed && cookie.value) {
      console.log("[BitCentral PS] PS cookie updated. Auto-syncing...");
      chrome.storage.local.set({ ps_jwt: cookie.value });

      // Automatically sync new token to BitCentral!
      syncPSToken(cookie.value).then((result) => {
        console.log("[BitCentral PS] Background auto-sync completed:", result);
      });
    } else if (removed) {
      console.log("[BitCentral PS] PS cookie removed");
      chrome.storage.local.remove("ps_jwt");
    }
  }
});
