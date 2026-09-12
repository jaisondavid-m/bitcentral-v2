import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      const cachedMe = await AsyncStorage.getItem('me_profile');
      let meObj = null;
      if (cachedMe) {
        try {
          meObj = JSON.parse(cachedMe);
        } catch (e) {
          // ignore
        }
      }

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (meObj) {
          setUser({
            ...parsedUser,
            display_name: meObj.display_name || parsedUser.display_name || parsedUser.displayName,
            displayName: meObj.display_name || parsedUser.displayName || parsedUser.display_name,
            roll_no: meObj.roll_no || parsedUser.roll_no,
            user_id: meObj.user_id || parsedUser.user_id,
          });
        } else {
          setUser(parsedUser);
        }
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
      display_name: googleUser.display_name || googleUser.name || googleUser.displayName,
      displayName: googleUser.display_name || googleUser.displayName || googleUser.name,
      roll_no: googleUser.roll_no || googleUser.rollNo,
      user_id: googleUser.user_id || googleUser.userId,
      photoURL: googleUser.photo || googleUser.photoURL,
    };

    setUser(userData);
    await AsyncStorage.setItem('user_session', JSON.stringify(userData));
    if (token) {
      await AsyncStorage.setItem('auth_token', token);
    }
    return true;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user_session');
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('me_profile');
  };

  return (
    <StudentContext.Provider
      value={{
        user,
        loading,
        accessDeniedMessage,
        loginWithGoogleUser,
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
