import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { fetchPSBiometricDetails } from '../api/axios';

const SAMPLE_BIOMETRICS = [
  { session: 'Morning Placement Session', date: '2025-09-10', punch_in: '08:42 AM', punch_out: '12:35 PM', venue: 'Main Auditorium Gate A', status: 'Verified' },
  { session: 'Afternoon Coding Practical', date: '2025-09-09', punch_in: '01:25 PM', punch_out: '04:40 PM', venue: 'SF Block 2nd Floor Biometric', status: 'Verified' },
  { session: 'SIG Artificial Intelligence Lab', date: '2025-09-08', punch_in: '04:45 PM', punch_out: '06:50 PM', venue: 'IB Block Lab Scanner 1', status: 'Verified' },
  { session: 'Aptitude Diagnostic Test', date: '2025-09-05', punch_in: '08:40 AM', punch_out: '10:05 AM', venue: 'Vedhanayagam Auditorium', status: 'Verified' },
];

export default function PSBiometricDetailsScreen({ navigation }) {
  const [biometrics, setBiometrics] = useState(SAMPLE_BIOMETRICS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBiometrics();
  }, []);

  const loadBiometrics = async () => {
    setLoading(true);
    const data = await fetchPSBiometricDetails();
    if (data && Array.isArray(data) && data.length > 0) {
      setBiometrics(data);
    } else {
      setBiometrics(SAMPLE_BIOMETRICS);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBiometrics();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Biometric Attendance"
        subtitle="Fingerprint Punch Logs & Sessions"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoBanner}>
          <Ionicons name="finger-print-outline" size={24} color="#2563EB" style={{ marginRight: 10 }} />
          <Text style={styles.infoText}>
            Attendance is automatically verified by on-campus biometric scanners for all placement and lab sessions.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Punch Logs</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 30 }} />
        ) : biometrics.length > 0 ? (
          <View style={styles.list}>
            {biometrics.map((log, index) => (
              <View key={index} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.sessionName}>{log.session}</Text>
                  <Badge label={log.status || 'Verified'} variant="success" size="small" />
                </View>

                <View style={styles.timeRow}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>In Time</Text>
                    <Text style={styles.timeValue}>{log.punch_in}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color="#94A3B8" />
                  <View style={styles.timeBox}>
                    <Text style={styles.timeLabel}>Out Time</Text>
                    <Text style={styles.timeValue}>{log.punch_out}</Text>
                  </View>
                </View>

                <View style={styles.logFooter}>
                  <View style={styles.footerItem}>
                    <Ionicons name="calendar-outline" size={13} color="#64748B" />
                    <Text style={styles.footerText}>{log.date}</Text>
                  </View>
                  <View style={styles.footerItem}>
                    <Ionicons name="location-outline" size={13} color="#64748B" />
                    <Text style={styles.footerText}>{log.venue}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="finger-print-outline"
            title="No Biometric Records"
            description="Punch records will appear once you scan at designated terminals."
          />
        )}
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
    paddingBottom: 32,
  },
  infoBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  infoText: {
    fontSize: 12,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  timeBox: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  logFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
  },
});
