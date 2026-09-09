import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from '../config/env';

export const GUEST_USER = {
  uid: "guest-user",
  email: "guest@bitsathy.ac.in",
  displayName: "Guest Student",
  photoURL: null,
  isGuest: true,
};

export const isGuestLoginEnabled = ENV.ENABLE_GUEST_LOGIN;

export const setGuestSession = async () => {
  try {
    await AsyncStorage.setItem('user_session', JSON.stringify(GUEST_USER));
  } catch (err) {
    console.error("Failed to set guest session", err);
  }
};

export const clearGuestSession = async () => {
  try {
    await AsyncStorage.removeItem('user_session');
  } catch (err) {
    console.error("Failed to clear guest session", err);
  }
};
