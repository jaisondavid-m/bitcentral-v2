import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { featureList, impactStats } from '../content/publicContent';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E40AF" barStyle="light-content" translucent={true} />

      {/* Hero Header */}
      <View style={styles.heroSection}>
        <View style={styles.heroTop}>
          <View style={styles.logoBadge}>
            <Ionicons name="star" size={18} color="#FFFFFF" />
            <Text style={styles.logoText}>BIT-CENTRAL</Text>
          </View>
          <TouchableOpacity
            style={styles.loginBtnTop}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginBtnTopText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heroTitle}>
          The Complete Student Ecosystem for <Text style={styles.highlightText}>BIT Sathy</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Question banks, exam seating layouts, mess menus, reward points, and campus services in one fast mobile app.
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login')}
        >
          <Ionicons name="logo-google" size={18} color="#2563EB" style={{ marginRight: 8 }} />
          <Text style={styles.ctaButtonText}>Sign In with BIT Google Account</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Platform Adoption Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsHeaderTitle}>{impactStats.title}</Text>
          <Text style={styles.statsHeaderSub}>{impactStats.subtitle}</Text>

          <View style={styles.statsRow}>
            {impactStats.metrics.map((m, idx) => (
              <View key={idx} style={styles.statBox}>
                <Text style={styles.statNum}>{m.value}</Text>
                <Text style={styles.statName}>{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Feature Grid */}
        <Text style={styles.sectionTitle}>Everything You Need for Campus</Text>

        <View style={styles.featureGrid}>
          {featureList.map((feat, idx) => (
            <View key={idx} style={styles.featureCard}>
              <View style={styles.featIconBox}>
                <Ionicons name={feat.icon} size={22} color="#2563EB" />
              </View>
              <Text style={styles.featTitle}>{feat.title}</Text>
              <Text style={styles.featSummary}>{feat.summary}</Text>
            </View>
          ))}
        </View>

        {/* Public Guides & Info Links */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Explore Campus Knowledge</Text>
        <View style={styles.linksCard}>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('GuidesIndex')}
          >
            <Ionicons name="book-outline" size={20} color="#2563EB" style={styles.linkIcon} />
            <Text style={styles.linkText}>Campus Survival Guides & Handbook</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('WifiDetails')}
          >
            <Ionicons name="wifi-outline" size={20} color="#059669" style={styles.linkIcon} />
            <Text style={styles.linkText}>Campus Wi-Fi Setup Guide</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate('FAQ')}
          >
            <Ionicons name="help-circle-outline" size={20} color="#7C3AED" style={styles.linkIcon} />
            <Text style={styles.linkText}>Frequently Asked Questions (FAQ)</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkItem, { borderBottomWidth: 0 }]}
            onPress={() => navigation.navigate('About')}
          >
            <Ionicons name="information-circle-outline" size={20} color="#EA580C" style={styles.linkIcon} />
            <Text style={styles.linkText}>About Platform & Developer</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
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
  heroSection: {
    backgroundColor: '#1E40AF',
    paddingTop: STATUS_BAR_HEIGHT + 14,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loginBtnTop: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  loginBtnTopText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 8,
  },
  highlightText: {
    color: '#93C5FD',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#E0E7FF',
    lineHeight: 18,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 1,
  },
  statsHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statsHeaderSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  statName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    width: '48.5%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  featIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  featSummary: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  linksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  linkIcon: {
    marginRight: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
});
