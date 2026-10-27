/**
 * BitCentral PS Connector - Content Script
 * 
 * Runs on ps.bitsathy.ac.in pages.
 * Detects the PS JWT from cookies/localStorage and notifies background.
 */

(function () {
  "use strict";

  // Try to read PS token from document cookies
  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function detectAndSendToken() {
    const psToken = getCookie("PS");
    
    if (psToken) {
      chrome.runtime.sendMessage(
        { type: "PS_TOKEN_DETECTED", token: psToken },
        (response) => {
          if (chrome.runtime.lastError) {
            // Extension context invalidated, ignore
            return;
          }
          if (response && response.received) {
            console.log("[BitCentral PS] Token captured successfully");
          }
        }
      );
    }
  }

  // Detect token on page load
  detectAndSendToken();

  // Re-detect periodically in case user logs in after page load
  const interval = setInterval(() => {
    const psToken = getCookie("PS");
    if (psToken) {
      detectAndSendToken();
      clearInterval(interval); // Stop once detected
    }
  }, 3000);

  // Stop checking after 2 minutes
  setTimeout(() => clearInterval(interval), 120000);
})();
