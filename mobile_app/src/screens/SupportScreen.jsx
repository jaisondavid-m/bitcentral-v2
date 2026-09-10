import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/StudentContext';
import { getFeedbackMessages, sendFeedbackMessage, getCachedMeProfile, fetchMeProfile } from '../api/axios';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

export default function SupportScreen({ navigation }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [meProfile, setMeProfile] = useState(null);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const cached = await getCachedMeProfile();
        if (cached) {
          setMeProfile(cached);
        }
        const fresh = await fetchMeProfile();
        if (fresh) {
          setMeProfile(fresh);
        }
      } catch (e) {
        console.warn('Failed to load profile in SupportScreen:', e);
      }
    }
    loadProfile();
  }, []);

  const fetchMessages = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await getFeedbackMessages(true);
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Error loading feedback messages:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    const msgText = inputText.trim();
    setInputText('');
    setSending(true);

    const displayName =
      meProfile?.display_name ||
      user?.display_name ||
      user?.displayName ||
      user?.name ||
      meProfile?.roll_no ||
      user?.roll_no ||
      'Student';

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      message: msgText,
      sender_name: displayName,
      sender_type: 'user',
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const result = await sendFeedbackMessage(msgText, displayName);
      if (result && result.id) {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? result : m)));
      } else {
        fetchMessages(false);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const canGoBack = navigation?.canGoBack?.();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        {canGoBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}

        <View style={styles.headerLeftContainer}>
          <View style={styles.headsetIconWrapper}>
            <View style={styles.headsetCircle}>
              <Ionicons name="headset" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.headerTitleCol}>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitleText}>BIT-CENTRAL Support</Text>
              <Ionicons name="sparkles" size={14} color="#FBBF24" style={styles.sparkleIcon} />
            </View>
            <View style={styles.subtitleRow}>
              <Ionicons name="shield-checkmark" size={12} color="#BFDBFE" style={styles.shieldIcon} />
              <Text style={styles.subtitleText}>Direct Admin Line</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => fetchMessages(true)} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Chat Body & Input with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesScrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchMessages(true)} colors={['#2563EB']} />
          }
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Connecting to Admin line...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="chatbubbles-outline" size={36} color="#2563EB" />
              </View>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>
                Type your feedback or request below to start a direct chat with BIT-CENTRAL Admins.
              </Text>
            </View>
          ) : (
            messages.map((msg, index) => {
              const isAdmin = msg.sender_type === 'admin';
              const timeStr = msg.created_at
                ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <View
                  key={msg.id || index}
                  style={[styles.messageRow, isAdmin ? styles.adminRow : styles.userRow]}
                >
                  <View style={styles.senderHeaderRow}>
                    <Text style={styles.senderNameText}>
                      {isAdmin ? 'Admin' : msg.sender_name || 'You'}
                    </Text>
                    {timeStr ? <Text style={styles.timestampText}>{timeStr}</Text> : null}
                  </View>

                  <View style={[styles.bubble, isAdmin ? styles.adminBubble : styles.userBubble]}>
                    <Text style={[styles.messageText, isAdmin ? styles.adminMessageText : styles.userMessageText]}>
                      {msg.message}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input Footer */}
        <View style={styles.inputFooter}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type feedback or request..."
            placeholderTextColor="#94A3B8"
            multiline={false}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            disabled={sending}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingBottom: 14,
    backgroundColor: '#2563EB',
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backBtn: {
    marginRight: 8,
  },
  headerLeftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headsetIconWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  headsetCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  sparkleIcon: {
    marginLeft: 4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  shieldIcon: {
    marginRight: 3,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DBEAFE',
  },
  refreshBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  keyboardView: {
    flex: 1,
  },
  messagesScrollContent: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  messageRow: {
    marginBottom: 14,
    maxWidth: '82%',
  },
  userRow: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  adminRow: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  senderNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  timestampText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderTopRightRadius: 4,
  },
  adminBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  adminMessageText: {
    color: '#1E293B',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
});
