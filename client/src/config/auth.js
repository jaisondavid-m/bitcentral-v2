import { isAllowedEmail } from "@/services/authRules.js";
import { clearGuestSession } from "@/services/guestSession.js";
import { getCookie, setCookie, deleteCookie, isJwtValid } from "@/utils/cookieAuth.js";
import { postGoogleAuth, postGoogleLogout } from "@/api/axios.js";

const TOKEN_KEY = "google_auth_token";
const COOKIE_NAMES = ["google_auth_token", "jwt", "token", "auth_token", "access_token"];
const ONE_MONTH_DAYS = 30; // 1 month cookie duration

export const getStoredToken = () => {
  for (const name of COOKIE_NAMES) {
    const val = getCookie(name);
    if (val && isJwtValid(val)) return val;
  }
  const localVal =
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    "";
  if (localVal && isJwtValid(localVal)) {
    return localVal;
  }
  return localVal && localVal.split(".").length !== 3 ? localVal : "";
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem("jwt", token);
    localStorage.setItem("token", token);
    for (const name of COOKIE_NAMES) {
      setCookie(name, token, ONE_MONTH_DAYS);
    }
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    for (const name of COOKIE_NAMES) {
      deleteCookie(name);
    }
  }
};

export const parseJwt = (token) => {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const getCurrentUser = () => {
  const token = getStoredToken();
  if (!token) return null;
  const claims = parseJwt(token);
  if (!claims || !claims.email) {
    return { token, getIdToken: async () => token };
  }
  return {
    uid: claims.sub || claims.user_id || claims.email,
    email: claims.email,
    displayName: claims.name || claims.email.split("@")[0],
    photoURL: claims.picture || null,
    role: claims.role || "user",
    getIdToken: async () => token,
  };
};

export const auth = {
  get currentUser() {
    return getCurrentUser();
  },
};

export const db = null;

const loadGoogleGsiScript = () => {
  if (window.google?.accounts) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("google-gsi-script");
    if (existing) {
      const interval = setInterval(() => {
        if (window.google?.accounts) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }
    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(new Error("Failed to load Google Sign-In script"));
    document.head.appendChild(script);
  });
};

export const signInWithGoogle = async () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "956639761791-ooo2p9kmj35nfekt5s6hli3maokv73qc.apps.googleusercontent.com";

  await loadGoogleGsiScript();

  return new Promise((resolve, reject) => {
    let resolved = false;

    const handleCredentialResponse = async (response) => {
      if (resolved) return;
      try {
        if (!response || !response.credential) {
          throw new Error("Google sign-in returned no credential");
        }
        const token = response.credential;
        const claims = parseJwt(token);
        if (claims?.email && !isAllowedEmail(claims.email)) {
          throw new Error("Only @bitsathy.ac.in email accounts are allowed.");
        }

        // Store initial credential and exchange for 30-day backend application JWT
        setStoredToken(token);
        const backendAuth = await postGoogleAuth(token);
        const finalToken = backendAuth?.token || token;
        setStoredToken(finalToken);

        clearGuestSession();
        window.dispatchEvent(new Event("auth_state_changed"));

        resolved = true;
        const finalClaims = parseJwt(finalToken) || claims;
        const userObj = {
          uid: finalClaims?.sub || claims?.sub || claims?.email,
          email: finalClaims?.email || claims?.email,
          displayName: backendAuth?.user?.display_name || finalClaims?.name || claims?.name,
          photoURL: backendAuth?.user?.photo_url || finalClaims?.picture || claims?.picture,
          role: backendAuth?.user?.role || finalClaims?.role || "user",
          getIdToken: async () => finalToken,
        };
        resolve({ user: userObj });
      } catch (err) {
        resolved = true;
        reject(err);
      }
    };

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
      });

      // Use OAuth2 Token Client popup for standard Google Sign-In button flow
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: async (tokenResponse) => {
          if (resolved) return;
          if (tokenResponse.error) {
            resolved = true;
            return reject(new Error(tokenResponse.error_description || "Google Sign-In failed"));
          }
          if (tokenResponse.access_token) {
            const token = tokenResponse.access_token;
            setStoredToken(token);
            const backendAuth = await postGoogleAuth(token);
            const finalToken = backendAuth?.token || token;
            setStoredToken(finalToken);

            clearGuestSession();
            window.dispatchEvent(new Event("auth_state_changed"));
            resolved = true;
            const finalClaims = parseJwt(finalToken);
            resolve({
              user: {
                uid: finalClaims?.sub || backendAuth?.user?.google_id || backendAuth?.user?.email,
                email: backendAuth?.user?.email || finalClaims?.email,
                displayName: backendAuth?.user?.display_name || finalClaims?.name,
                photoURL: backendAuth?.user?.photo_url || finalClaims?.picture,
                role: backendAuth?.user?.role || finalClaims?.role || "user",
                accessToken: finalToken,
                getIdToken: async () => finalToken,
              },
            });
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: "select_account" });
    } catch (err) {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    }
  });
};

export const logout = async () => {
  clearGuestSession();
  try {
    await postGoogleLogout();
  } catch (e) {}
  setStoredToken(null);
  window.dispatchEvent(new Event("auth_state_changed"));
  if (window.google?.accounts?.id) {
    try {
      window.google.accounts.id.disableAutoSelect();
    } catch (e) {}
  }
};
