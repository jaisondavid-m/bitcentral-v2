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
import { fetchPSAssessmentHistory } from '../api/axios';

const SAMPLE_ASSESSMENTS = [
  { course_name: 'Ist Year Mock Test - Quantitative Aptitude', date: '2025-09-10', start_time: '08:45:00', end_time: '09:45:00', result: 'Cleared', attendance: 'Present', venue: 'Vedhanayagam Auditorium' },
  { course_name: 'Logical Reasoning & Verbal Ability Test', date: '2025-09-02', start_time: '10:00:00', end_time: '11:30:00', result: 'Cleared', attendance: 'Present', venue: 'Main Auditorium Hall 1' },
  { course_name: 'Data Structures & Algorithms Diagnostic', date: '2025-08-25', start_time: '02:00:00', end_time: '03:30:00', result: 'Cleared', attendance: 'Present', venue: 'SF Block Computing Lab 3' },
  { course_name: 'Core Python & C++ Coding Challenge', date: '2025-08-14', start_time: '09:00:00', end_time: '11:00:00', result: 'Not Cleared', attendance: 'Present', venue: 'IB Block Lab 2' },
  { course_name: 'Company Specific Assessment - Round 1', date: '2025-07-28', start_time: '08:30:00', end_time: '10:00:00', result: 'Cleared', attendance: 'Present', venue: 'Central Library Digital Wing' },
];

export default function PSAssessmentHistoryScreen({ navigation }) {
  const [assessments, setAssessments] = useState(SAMPLE_ASSESSMENTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchPSAssessmentHistory();
    if (data && Array.isArray(data) && data.length > 0) {
      setAssessments(data);
    } else {
      setAssessments(SAMPLE_ASSESSMENTS);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const totalCleared = assessments.filter((a) => a.result === 'Cleared' || a.status === '1').length;
  const totalTests = assessments.length;
  const passRate = totalTests > 0 ? Math.round((totalCleared / totalTests) * 100) : 0;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="PS Assessment History"
        subtitle="Placement Training Tests & Attendance"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Metric Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Tests</Text>
            <Text style={styles.statValue}>{totalTests}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Tests Cleared</Text>
            <Text style={[styles.statValue, { color: '#059669' }]}>{totalCleared}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Clear Rate</Text>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>{passRate}%</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 30 }} />
        ) : assessments.length > 0 ? (
          <View style={styles.list}>
            {assessments.map((item, index) => {
              const isCleared = item.result === 'Cleared' || item.status === '1';
              return (
                <View key={index} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.courseDetails}>
                      <Text style={styles.courseName}>{item.course_name}</Text>
                      <View style={styles.metaRow}>
                        <Ionicons name="calendar-outline" size={14} color="#64748B" />
                        <Text style={styles.metaText}>{item.date}</Text>
                        <Ionicons name="time-outline" size={14} color="#64748B" style={{ marginLeft: 8 }} />
                        <Text style={styles.metaText}>{item.start_time} - {item.end_time}</Text>
                      </View>
                    </View>
                    <Badge
                      label={isCleared ? 'Cleared' : 'Not Cleared'}
                      variant={isCleared ? 'success' : 'danger'}
                    />
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.venueRow}>
                      <Ionicons name="location-outline" size={14} color="#64748B" />
                      <Text style={styles.venueText}>{item.venue || 'Campus Auditorium'}</Text>
                    </View>
                    <Badge
                      label={item.attendance || 'Present'}
                      variant={item.attendance === 'Present' ? 'info' : 'warning'}
                      size="small"
                    />
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <EmptyState
            icon="ribbon-outline"
            title="No Assessment Records"
            description="You do not have any recorded placement assessments yet."
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
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  list: {
    gap: 12,
  },
  card: {
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
  courseDetails: {
    flex: 1,
    marginRight: 10,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  venueText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
});
