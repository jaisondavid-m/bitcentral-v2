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
 * Sets a browser cookie with specified name, value, and expiration in days (default 30 days = 1 month).
 * @param {string} name
 * @param {string} value
 * @param {number} days
 */
export function setCookie(name, value, days = 30) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isHttps ? "; Secure" : "";
  const encodedVal = encodeURIComponent(value);

  document.cookie = `${name}=${encodedVal}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;

  if (typeof window !== "undefined" && window.location?.hostname?.includes("bitsathy.in")) {
    document.cookie = `${name}=${encodedVal}; path=/; domain=.bitsathy.in; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
    document.cookie = `${name}=${encodedVal}; path=/; domain=bitcentral.bitsathy.in; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
  }
}

/**
 * Deletes a cookie by name across path and domain variations.
 * @param {string} name
 */
export function deleteCookie(name) {
  if (typeof document === "undefined") return;
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isHttps ? "; Secure" : "";

  document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureFlag}`;
  if (typeof window !== "undefined" && window.location?.hostname) {
    document.cookie = `${name}=; path=/; domain=${window.location.hostname}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureFlag}`;
    if (window.location.hostname.includes("bitsathy.in")) {
      document.cookie = `${name}=; path=/; domain=.bitsathy.in; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureFlag}`;
      document.cookie = `${name}=; path=/; domain=bitcentral.bitsathy.in; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureFlag}`;
    }
  }
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
 * Checks common cookie names: 'jwt', 'token', 'auth_token', 'access_token', 'googleToken'.
 * @returns {boolean}
 */
export function hasValidAuthCookie() {
  const cookieNames = ["jwt", "token", "auth_token", "access_token", "googleToken"];
  for (const name of cookieNames) {
    const cookieValue = getCookie(name);
    if (cookieValue && isJwtValid(cookieValue)) {
      return true;
    }
  }
  return false;
}
