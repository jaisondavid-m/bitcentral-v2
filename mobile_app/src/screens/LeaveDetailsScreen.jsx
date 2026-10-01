import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { fetchStudentLeaves } from '../api/axios';

const SAMPLE_LEAVES = [
  { id: '1', reason: 'Home Visit (Weekend Outpass)', from_date: '10 Oct 2026', to_date: '13 Oct 2026', days: 3, status: 'Approved', type: 'Weekend Outpass', warden_status: 'Approved', parent_consent: 'Verified' },
  { id: '2', reason: 'Medical Consultation & Treatment', from_date: '20 Sep 2026', to_date: '22 Sep 2026', days: 2, status: 'Completed', type: 'Medical Leave', warden_status: 'Approved', parent_consent: 'Verified' },
  { id: '3', reason: 'Inter-College Hackathon Representation', from_date: '02 Aug 2026', to_date: '04 Aug 2026', days: 2, status: 'Completed', type: 'On-Duty (OD)', warden_status: 'Approved', parent_consent: 'Verified' },
];

export default function LeaveDetailsScreen({ navigation }) {
  const [leaves, setLeaves] = useState(SAMPLE_LEAVES);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    setLoading(true);
    const data = await fetchStudentLeaves();
    if (data && Array.isArray(data) && data.length > 0) {
      setLeaves(data);
    } else {
      setLeaves(SAMPLE_LEAVES);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaves();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Leave & Outing Details"
        subtitle="Hostel Gate Passes & Leave History"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.sumItem}>
            <Text style={styles.sumLabel}>Total Outpasses</Text>
            <Text style={styles.sumValue}>{leaves.length}</Text>
          </View>
          <View style={styles.sumDivider} />
          <View style={styles.sumItem}>
            <Text style={styles.sumLabel}>Approved Leaves</Text>
            <Text style={[styles.sumValue, { color: '#059669' }]}>
              {leaves.filter((l) => l.status === 'Approved' || l.status === 'Completed').length}
            </Text>
          </View>
          <View style={styles.sumDivider} />
          <View style={styles.sumItem}>
            <Text style={styles.sumLabel}>Gate Biometrics</Text>
            <Text style={[styles.sumValue, { color: '#2563EB' }]}>Active</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Leave History & Approvals</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 30 }} />
        ) : leaves.length > 0 ? (
          <View style={styles.list}>
            {leaves.map((leave, idx) => (
              <View key={leave.id || idx} style={styles.leaveCard}>
                <View style={styles.cardTop}>
                  <View style={styles.reasonBox}>
                    <Text style={styles.reasonText}>{leave.reason}</Text>
                    <Badge label={leave.type || 'Outpass'} variant="neutral" size="small" />
                  </View>
                  <Badge
                    label={leave.status}
                    variant={
                      leave.status === 'Approved' || leave.status === 'Completed'
                        ? 'success'
                        : 'warning'
                    }
                  />
                </View>

                <View style={styles.dateRow}>
                  <View style={styles.dateCol}>
                    <Text style={styles.dateLabel}>From Date</Text>
                    <Text style={styles.dateValue}>{leave.from_date}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color="#94A3B8" />
                  <View style={styles.dateCol}>
                    <Text style={styles.dateLabel}>To Date</Text>
                    <Text style={styles.dateValue}>{leave.to_date}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.verifyItem}>
                    <Ionicons name="shield-checkmark" size={14} color="#059669" />
                    <Text style={styles.verifyText}>Warden: {leave.warden_status || 'Approved'}</Text>
                  </View>
                  <View style={styles.verifyItem}>
                    <Ionicons name="call" size={14} color="#2563EB" />
                    <Text style={styles.verifyText}>Parent: {leave.parent_consent || 'Verified'}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="calendar-outline"
            title="No Leaves Recorded"
            description="You have no previous or active hostel leave requests."
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 2,
  },
  sumItem: {
    alignItems: 'center',
    flex: 1,
  },
  sumLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  sumValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sumDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
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
  leaveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reasonBox: {
    flex: 1,
    marginRight: 8,
    gap: 4,
  },
  reasonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  dateCol: {
    alignItems: 'center',
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  verifyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifyText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
});
