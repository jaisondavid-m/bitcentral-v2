const GUEST_SESSION_KEY = "bitcentral_guest_session";
const GUEST_SESSION_EVENT = "bitcentral-guest-session-changed";

export const GUEST_DISPLAY_NAME = "guest";
export const GUEST_EMAIL = "guest@bitsathy.ac.in";
export const GUEST_DEPARTMENT = "Computer Science and Engineering";
export const GUEST_BATCH = "2025 - 2029";

export const isGuestLoginEnabled = String(import.meta.env.VITE_ENABLE_GUEST_LOGIN || "")
  .trim()
  .toLowerCase() === "true";

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch (error) {
    return null;
  }
};

const notifyGuestSessionChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(GUEST_SESSION_EVENT));
};

export const readGuestSession = () => {
  if (!isGuestLoginEnabled) {
    return null;
  }

  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const rawSession = storage.getItem(GUEST_SESSION_KEY);
    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession);
    if (!parsedSession || typeof parsedSession !== "object") {
      return null;
    }

    return {
      createdAt: Number(parsedSession.createdAt) || Date.now(),
      lastLoginAt: Number(parsedSession.lastLoginAt) || Number(parsedSession.createdAt) || Date.now(),
    };
  } catch (error) {
    return null;
  }
};

export const activateGuestSession = () => {
  if (!isGuestLoginEnabled) {
    return null;
  }

  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const now = Date.now();
  const guestSession = {
    createdAt: now,
    lastLoginAt: now,
  };

  storage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestSession));
  notifyGuestSessionChange();
  return guestSession;
};

export const clearGuestSession = () => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(GUEST_SESSION_KEY);
  notifyGuestSessionChange();
};

export const subscribeToGuestSessionChanges = (handler) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(GUEST_SESSION_EVENT, handler);
  return () => window.removeEventListener(GUEST_SESSION_EVENT, handler);
};

export const createGuestUser = (guestSession = {}) => {
  const createdAt = Number(guestSession.createdAt) || Date.now();
  const lastLoginAt = Number(guestSession.lastLoginAt) || createdAt;

  return {
    uid: "guest",
    displayName: GUEST_DISPLAY_NAME,
    email: GUEST_EMAIL,
    photoURL: null,
    emailVerified: true,
    isGuest: true,
    metadata: {
      createdAt: String(createdAt),
      lastLoginAt: String(lastLoginAt),
      creationTime: String(createdAt),
      lastSignInTime: String(lastLoginAt),
    },
  };
};

export const createGuestStudent = () => ({
  email: GUEST_EMAIL,
  usernamePart: GUEST_DISPLAY_NAME,
  deptYear: "cs25",
  yearCode: "25",
  deptCode: "cs",
  department: GUEST_DEPARTMENT,
  startYear: 2025,
  endYear: 2029,
  batch: GUEST_BATCH,
});