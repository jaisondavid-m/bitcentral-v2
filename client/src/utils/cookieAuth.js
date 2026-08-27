/**
 * Utility functions for reading and validating JWT tokens stored in browser cookies.
 */

/**
 * Gets the value of a cookie by name.
 * @param {string} name
 * @returns {string|null}
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const matches = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}

/**
 * Parses and checks if a JWT token is valid (not expired).
 * @param {string} token
 * @returns {boolean}
 */
export function isJwtValid(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);

    if (parsed.exp) {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      return parsed.exp > nowInSeconds;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Checks whether any known JWT auth cookie exists and is valid.
 * Checks common cookie names: 'jwt', 'token', 'auth_token', 'access_token', 'firebaseToken'.
 * @returns {boolean}
 */
export function hasValidAuthCookie() {
  const cookieNames = ["jwt", "token", "auth_token", "access_token", "firebaseToken"];
  for (const name of cookieNames) {
    const cookieValue = getCookie(name);
    if (cookieValue && isJwtValid(cookieValue)) {
      return true;
    }
  }
  return false;
}
