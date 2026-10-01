import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuth } from '../context/StudentContext';
import { postGoogleAuth } from '../api/axios';
import ENV from '../config/env';

// Complete any active WebBrowser authentication session
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { loginWithGoogleUser, accessDeniedMessage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Official Expo Google Auth Provider with PKCE (Works across iOS, Android & Expo Go)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: ENV.GOOGLE_WEB_CLIENT_ID,
    webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
    androidClientId: ENV.GOOGLE_WEB_CLIENT_ID,
    iosClientId: ENV.GOOGLE_WEB_CLIENT_ID,
    selectAccount: true,
  });

  const processGoogleAuthResponse = useCallback(
    async (authResponse) => {
      try {
        setLoading(true);
        setError('');

        const accessToken = authResponse?.authentication?.accessToken || authResponse?.params?.access_token;
        const idToken = authResponse?.authentication?.idToken || authResponse?.params?.id_token;

        let googleUser = null;
        if (accessToken) {
          try {
            const userInfoRes = await fetch('https://www.googleapis.com/userinfo/v2/me', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            googleUser = await userInfoRes.json();
          } catch (fetchErr) {
            console.warn('Could not fetch userinfo from Google endpoint:', fetchErr);
          }
        }

        const userEmail = (googleUser?.email || '').toLowerCase().trim();
        if (!userEmail && !idToken && !accessToken) {
          throw new Error('Google Sign-In completed but no user account details were returned.');
        }

        const backendRes = await postGoogleAuth({
          id_token: idToken || accessToken,
          credential: idToken || accessToken,
          token: accessToken || idToken,
          email: userEmail,
          name: googleUser?.name || googleUser?.given_name || 'BIT Student',
          photo_url: googleUser?.picture || null,
        });

        if (backendRes?.error && !backendRes?.success) {
          console.warn('Backend Auth error:', backendRes.error);
          setError(backendRes.error);
          return;
        }

        const userObj = backendRes?.user || {
          id: googleUser?.id || userEmail,
          email: userEmail,
          name: googleUser?.name || googleUser?.given_name || 'BIT Student',
          photo: googleUser?.picture || null,
        };

        const success = await loginWithGoogleUser(
          userObj,
          backendRes?.token || backendRes?.jwt || accessToken || idToken
        );
        if (!success && !accessDeniedMessage) {
          setError('Sign in failed. Only @bitsathy.ac.in accounts allowed.');
        }
      } catch (err) {
        console.error('Authentication processing error:', err);
        setError(err?.message || 'Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [loginWithGoogleUser, accessDeniedMessage]
  );

  useEffect(() => {
    if (response?.type === 'success') {
      processGoogleAuthResponse(response);
    } else if (response?.type === 'error') {
      setError(response.error?.message || 'Google Sign-In failed');
      setLoading(false);
    } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
      setLoading(false);
    }
  }, [response, processGoogleAuthResponse]);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await promptAsync();
    } catch (err) {
      console.error('Sign-in initiation error:', err);
      setError(err?.message || 'Could not start sign-in process');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.cardContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoTitle}>BIT Central</Text>
          <Text style={styles.logoSubtitle}>By student · For students</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.domainText}>
            Only <Text style={styles.domainHighlight}>@bitsathy.ac.in</Text> email accounts are allowed
          </Text>

          {error || accessDeniedMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error || accessDeniedMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.googleButton}
            disabled={loading || !request}
            onPress={handleSignIn}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.footerNote}>Secure authentication powered by Google</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3B82F6',
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    backgroundColor: '#2563EB',
    paddingVertical: 28,
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#DBEAFE',
    marginTop: 4,
  },
  content: {
    padding: 24,
  },
  domainText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
  },
  domainHighlight: {
    color: '#2563EB',
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 13,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 10,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  footerNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
});
