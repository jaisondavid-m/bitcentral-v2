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
import { developerProfile, benefitList } from '../content/publicContent';

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="About BIT-CENTRAL"
        subtitle="Platform Mission & Vision"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Built for the BIT Sathy Student Community</Text>
          <Text style={styles.heroDesc}>
            BIT Central is an independent student platform built specifically for Bannari Amman Institute of Technology. It unites academic resources, question banks, answer keys, mess menus, exam hall seating, and campus tools into one unified experience.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Why BIT Central?</Text>
        <View style={styles.benefitsCard}>
          {benefitList.map((benefit, idx) => (
            <View key={idx} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginRight: 10, marginTop: 2 }} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Developer & Maintenance</Text>
        <View style={styles.devCard}>
          <Text style={styles.devName}>{developerProfile.name}</Text>
          <Text style={styles.devRole}>{developerProfile.role}</Text>
          <Text style={styles.devDesc}>{developerProfile.description}</Text>

          <View style={styles.linksRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Linking.openURL('https://github.com/jaisondavid-m')}
            >
              <Ionicons name="logo-github" size={18} color="#2563EB" />
              <Text style={styles.socialText}>GitHub</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Linking.openURL('https://www.linkedin.com/in/jaison-david-m-a14072360/')}
            >
              <Ionicons name="logo-linkedin" size={18} color="#2563EB" />
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
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
  heroCard: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  heroDesc: {
    fontSize: 13,
    color: '#E0E7FF',
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    flex: 1,
  },
  devCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  devName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  devRole: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  devDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 14,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  socialText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});
