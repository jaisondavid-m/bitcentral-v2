import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/StudentContext';
import { postGoogleAuth } from '../api/axios';
import ENV from '../config/env';
import { haptics } from '../utils/haptics';

const GOOGLE_AUTH_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: ENV.GOOGLE_WEB_CLIENT_ID,
    redirect_uri: 'https://auth.expo.io/@anonymous/bitcentral',
    response_type: 'token',
    scope: 'openid profile email',
    prompt: 'select_account',
  }).toString();

// Standard Mobile Safari User-Agent so Google allows web authentication
const CUSTOM_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

export default function LoginScreen() {
  const { loginWithGoogleUser, accessDeniedMessage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWebModal, setShowWebModal] = useState(false);

  const processAccessToken = async (accessToken) => {
    try {
      setLoading(true);
      setShowWebModal(false);
      setError('');

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
      if (!userEmail) {
        throw new Error('Google Sign-In completed but no email was found.');
      }

      const backendRes = await postGoogleAuth({
        credential: accessToken,
        id_token: accessToken,
        token: accessToken,
        email: userEmail,
        name: googleUser?.name || googleUser?.given_name || 'BIT Student',
        photo_url: googleUser?.picture || null,
      });

      if (backendRes?.error && !backendRes?.success) {
        console.warn('Backend Auth error:', backendRes.error);
        haptics.error();
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
        backendRes?.token || backendRes?.jwt || accessToken
      );
      if (success) {
        haptics.success();
      } else if (!accessDeniedMessage) {
        haptics.error();
        setError('Sign in failed. Only @bitsathy.ac.in accounts allowed.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      haptics.error();
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    if (!url) return;

    if (url.includes('access_token=')) {
      const hashIndex = url.indexOf('#');
      const queryIndex = url.indexOf('?');
      const paramString =
        hashIndex !== -1 ? url.substring(hashIndex + 1) : queryIndex !== -1 ? url.substring(queryIndex + 1) : '';

      const params = new URLSearchParams(paramString);
      const token = params.get('access_token');
      if (token) {
        processAccessToken(token);
      }
    } else if (url.includes('error=')) {
      const params = new URLSearchParams(url.split('?')[1] || url.split('#')[1] || '');
      const errReason = params.get('error') || 'Sign in was cancelled or failed';
      setShowWebModal(false);
      haptics.error();
      setError(errReason);
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
            disabled={loading}
            onPress={() => {
              haptics.mediumTap();
              setError('');
              setShowWebModal(true);
            }}
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

      {/* In-App Google OAuth Modal */}
      <Modal
        visible={showWebModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWebModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Google Sign In</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowWebModal(false)}
            >
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: GOOGLE_AUTH_URL }}
            userAgent={CUSTOM_USER_AGENT}
            onNavigationStateChange={handleNavigationStateChange}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webLoading}>
                <ActivityIndicator size="large" color="#2563EB" />
              </View>
            )}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            incognito={false}
          />
        </SafeAreaView>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  closeButton: {
    padding: 4,
  },
  webLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
