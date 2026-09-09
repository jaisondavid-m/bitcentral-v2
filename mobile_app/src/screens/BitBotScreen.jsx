import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { sendChatMessage } from '../api/axios';
import { useAuth } from '../context/StudentContext';

export default function BitBotScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: '1', sender: 'bot', text: 'Hello! I am BitBot AI. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const historyPayload = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    const response = await sendChatMessage({
      message: userText,
      history: historyPayload,
      rollNo: user?.email ? user.email.split('@')[0] : '',
    });

    const replyText =
      response?.reply ||
      response?.message ||
      'BitBot AI response received.';

    const botReply = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: replyText,
    };

    setMessages((prev) => [...prev, botReply]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BitBot AI Assistant</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.sender === 'user' ? styles.userBubbleText : styles.botBubbleText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loadingText}>BitBot is thinking...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your question..."
            placeholderTextColor="#94A3B8"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.disabledButton]}
            onPress={handleSend}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
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
    padding: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatArea: {
    flex: 1,
  },
  messageList: {
    padding: 16,
  },
  bubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: '#2563EB',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  botBubbleText: {
    color: '#0F172A',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
