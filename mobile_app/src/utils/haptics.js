import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Global enabled flag
let hapticEnabled = true;

// Rate limiting map to prevent vibration spam
const lastTriggerTimes = {};
const DEFAULT_THROTTLE_MS = 60;

/**
 * Throttles haptic calls of the same type within specified ms interval
 */
const shouldTrigger = (key, throttleMs = DEFAULT_THROTTLE_MS) => {
  if (!hapticEnabled) return false;
  const now = Date.now();
  const lastTime = lastTriggerTimes[key] || 0;
  if (now - lastTime < throttleMs) {
    return false;
  }
  lastTriggerTimes[key] = now;
  return true;
};

/**
 * Safe execution wrapper around Expo Haptics APIs.
 * Ensures haptic failures never crash or interrupt application execution.
 */
const safeHapticCall = async (fn) => {
  try {
    await fn();
  } catch (_err) {
    // Silently ignore haptic failures (e.g., unsupported web/simulator or disabled device haptics)
  }
};

export const haptics = {
  /**
   * Configure global haptic status (on/off)
   */
  setEnabled(enabled) {
    hapticEnabled = Boolean(enabled);
  },

  isEnabled() {
    return hapticEnabled;
  },

  /**
   * Light Tap - Subtle physical feedback for standard button taps, list items, card taps.
   */
  tap() {
    if (!shouldTrigger('tap', 40)) return;
    safeHapticCall(() =>
      Platform.OS === 'android' && Haptics.AndroidHaptics?.Virtual_Key
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key)
        : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    );
  },

  /**
   * Very Light Tap - Subtle micro-feedback for quick UI interactions, rating stars, small badges.
   */
  lightTap() {
    if (!shouldTrigger('lightTap', 40)) return;
    safeHapticCall(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  },

  /**
   * Medium Tap - Feedback for primary actions (submit, save, action buttons).
   */
  mediumTap() {
    if (!shouldTrigger('mediumTap', 60)) return;
    safeHapticCall(() =>
      Platform.OS === 'android' && Haptics.AndroidHaptics?.Context_Click
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click)
        : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    );
  },

  /**
   * Heavy Tap - Strong physical feedback for major state changes or explicit user actions.
   */
  heavyTap() {
    if (!shouldTrigger('heavyTap', 80)) return;
    safeHapticCall(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
  },

  /**
   * Selection - Light tick for tab switching, segment chips, picker controls, radio/checkbox options.
   */
  selection() {
    if (!shouldTrigger('selection', 40)) return;
    safeHapticCall(() =>
      Platform.OS === 'android' && Haptics.AndroidHaptics?.Segment_Tick
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick)
        : Haptics.selectionAsync()
    );
  },

  /**
   * Tab Change - Subtle feedback specifically tailored for bottom tab switching.
   */
  tabChange() {
    if (!shouldTrigger('tabChange', 50)) return;
    safeHapticCall(() => Haptics.selectionAsync());
  },

  /**
   * Toggle ON - Physical feedback when a switch or toggle is turned ON.
   */
  toggleOn() {
    if (!shouldTrigger('toggleOn', 50)) return;
    safeHapticCall(() =>
      Platform.OS === 'android' && Haptics.AndroidHaptics?.Toggle_On
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Toggle_On)
        : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    );
  },

  /**
   * Toggle OFF - Physical feedback when a switch or toggle is turned OFF.
   */
  toggleOff() {
    if (!shouldTrigger('toggleOff', 50)) return;
    safeHapticCall(() =>
      Platform.OS === 'android' && Haptics.AndroidHaptics?.Toggle_Off
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Toggle_Off)
        : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    );
  },

  /**
   * Success Notification - Physical feedback when an operation succeeds (form saved, login success, payment ok).
   */
  success() {
    if (!shouldTrigger('success', 100)) return;
    safeHapticCall(() =>
      Platform.OS === 'android' && Haptics.AndroidHaptics?.Confirm
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm)
        : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    );
  },

  /**
   * Warning Notification - Physical feedback for warnings or destructive action prompts (delete confirm, reset).
   */
  warning() {
    if (!shouldTrigger('warning', 100)) return;
    safeHapticCall(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    );
  },

  /**
   * Error Notification - Physical feedback when validation fails or an API request errors out.
   */
  error() {
    if (!shouldTrigger('error', 100)) return;
    safeHapticCall(() =>
      Platform.OS === 'android' && Haptics.AndroidHaptics?.Reject
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject)
        : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    );
  },

  /**
   * Confirm - Action confirmation feedback.
   */
  confirm() {
    if (!shouldTrigger('confirm', 80)) return;
    safeHapticCall(() =>
      Platform.OS === 'android' && Haptics.AndroidHaptics?.Confirm
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm)
        : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    );
  },

  /**
   * Long Press - Recognized long-press gesture feedback.
   */
  longPress() {
    if (!shouldTrigger('longPress', 100)) return;
    safeHapticCall(() =>
      Platform.OS === 'android' && Haptics.AndroidHaptics?.Long_Press
        ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press)
        : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    );
  },
};

export default haptics;
