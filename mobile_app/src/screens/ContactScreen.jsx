import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import { contactMethods } from '../content/publicContent';

export default function ContactScreen({ navigation }) {
  const handlePress = (item) => {
    if (item.href) {
      Linking.openURL(item.href);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Contact & Support"
        subtitle="Get in Touch with BIT Central"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>We'd love to hear from you</Text>
          <Text style={styles.headerDesc}>
            Have a suggestion, found a bug, or want to contribute study materials? Reach out to us directly.
          </Text>
        </View>

        <View style={styles.list}>
          {contactMethods.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.contactCard}
              activeOpacity={0.85}
              onPress={() => handlePress(item)}
            >
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={22} color="#2563EB" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{item.label}</Text>
                <Text style={styles.contactValue}>{item.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  headerCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 6,
  },
  headerDesc: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 18,
  },
  list: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
});
