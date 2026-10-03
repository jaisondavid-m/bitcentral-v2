/**
 * Professional, extremely subtle haptic feedback service for web browsers.
 * Uses navigator.vibrate() with feature detection, prefers-reduced-motion checks,
 * rate-limiting throttling, and silent failure fallback.
 */

// Rate limiting map to prevent vibration spam from rapid taps or re-renders
const lastTriggerTimes = new Map();
const DEFAULT_THROTTLE_MS = 60;

/**
 * Checks if vibration API is available and user does not prefer reduced motion.
 */
const isVibrationSupported = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  if (!('vibrate' in navigator) || typeof navigator.vibrate !== 'function') {
    return false;
  }
  // Respect user prefers-reduced-motion setting
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  return true;
};

/**
 * Throttles haptic calls of the same category to prevent spam.
 */
const shouldTrigger = (key, throttleMs = DEFAULT_THROTTLE_MS) => {
  if (!isVibrationSupported()) return false;
  const now = Date.now();
  const lastTime = lastTriggerTimes.get(key) || 0;
  if (now - lastTime < throttleMs) {
    return false;
  }
  lastTriggerTimes.set(key, now);
  return true;
};

/**
 * Safe vibration call wrapper.
 */
const vibrateSafe = (pattern) => {
  try {
    navigator.vibrate(pattern);
  } catch {
    // Silently ignore failures on unsupported browsers (iOS Safari, desktop Chrome, etc.)
  }
};

export const haptics = {
  /**
   * Extremely light pulse (~5ms) for minor UI selections, tab switches, mobile menu buttons.
   */
  light() {
    if (!shouldTrigger('light', 40)) return;
    vibrateSafe(5);
  },

  /**
   * Selection tick (~5ms) for dropdown selections, filter chips, segment controls.
   */
  selection() {
    if (!shouldTrigger('selection', 40)) return;
    vibrateSafe(5);
  },

  /**
   * Primary Action pulse (~8ms) for main button clicks, form submissions, modal opens.
   */
  action() {
    if (!shouldTrigger('action', 60)) return;
    vibrateSafe(8);
  },

  /**
   * Success confirmation pattern ([8ms, 30ms pause, 12ms]) matching native success feedback.
   */
  success() {
    if (!shouldTrigger('success', 100)) return;
    vibrateSafe([8, 30, 12]);
  },

  /**
   * Warning confirmation pattern ([10ms, 35ms pause, 10ms]) for resets & destructive alerts.
   */
  warning() {
    if (!shouldTrigger('warning', 100)) return;
    vibrateSafe([10, 35, 10]);
  },

  /**
   * Distinct Error pattern ([12ms, 40ms pause, 12ms]) for validation errors & operation failures.
   */
  error() {
    if (!shouldTrigger('error', 100)) return;
    vibrateSafe([12, 40, 12]);
  },
};

export default haptics;
