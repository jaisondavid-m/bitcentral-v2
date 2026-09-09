import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GUEST_USER, setGuestSession, clearGuestSession } from '../services/guestSession';
import { isAllowedEmail } from '../services/authRules';

const StudentContext = createContext({});

export function StudentProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState('');

  useEffect(() => {
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user_session');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to load session', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleUser = async (googleUser, token) => {
    setAccessDeniedMessage('');
    if (!isAllowedEmail(googleUser.email)) {
      setAccessDeniedMessage('Only @bitsathy.ac.in email accounts are allowed to sign in.');
      return false;
    }

    const userData = {
      uid: googleUser.id || googleUser.uid,
      email: googleUser.email,
      displayName: googleUser.name || googleUser.displayName,
      photoURL: googleUser.photo || googleUser.photoURL,
      isGuest: false,
    };

    setUser(userData);
    await AsyncStorage.setItem('user_session', JSON.stringify(userData));
    if (token) {
      await AsyncStorage.setItem('auth_token', token);
    }
    return true;
  };

  const loginAsGuest = async () => {
    setAccessDeniedMessage('');
    setUser(GUEST_USER);
    await setGuestSession();
  };

  const logout = async () => {
    setUser(null);
    await clearGuestSession();
    await AsyncStorage.removeItem('auth_token');
  };

  return (
    <StudentContext.Provider
      value={{
        user,
        loading,
        accessDeniedMessage,
        loginWithGoogleUser,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useAuth() {
  return useContext(StudentContext);
}
