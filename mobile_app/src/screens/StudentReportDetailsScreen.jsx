import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';
import { fetchStudentReportDetails } from '../api/axios';

const SAMPLE_REPORT = {
  roll_no: '7376241CS101',
  name: 'Student Candidate',
  department: 'Computer Science and Engineering',
  batch: '2024 - 2028',
  cgpa: '8.48',
  total_credits_earned: 48,
  total_credits_required: 165,
  active_arrears: 0,
  history_arrears: 0,
  semesters: [
    { sem: 'Semester 1', gpa: '8.60', credits: 24, status: 'Passed', courses: 7 },
    { sem: 'Semester 2', gpa: '8.36', credits: 24, status: 'Passed', courses: 7 },
  ],
  skills_summary: [
    { skill: 'Data Structures & Algorithms', level: 'Advanced', points: 95 },
    { skill: 'Full Stack Development', level: 'Proficient', points: 90 },
    { skill: 'Database Management', level: 'Intermediate', points: 85 },
  ],
};

export default function StudentReportDetailsScreen({ navigation }) {
  const [report, setReport] = useState(SAMPLE_REPORT);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    const data = await fetchStudentReportDetails();
    if (data && data.roll_no) {
      setReport(data);
    } else {
      setReport(SAMPLE_REPORT);
    }
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReport();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Student 360 Report"
        subtitle="Cumulative Academic & Performance Analytics"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.studentName}>{report.name}</Text>
              <Text style={styles.studentRoll}>{report.roll_no} • {report.department}</Text>
            </View>
            <Badge label={report.active_arrears === 0 ? 'All Clear' : `${report.active_arrears} Arrears`} variant={report.active_arrears === 0 ? 'success' : 'danger'} />
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Cumulative CGPA</Text>
              <Text style={[styles.metricValue, { color: '#2563EB' }]}>{report.cgpa}</Text>
              <Text style={styles.metricSub}>Scale of 10.0</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Credits Earned</Text>
              <Text style={styles.metricValue}>{report.total_credits_earned}</Text>
              <Text style={styles.metricSub}>of {report.total_credits_required} req</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Batch</Text>
              <Text style={styles.metricValueSmall}>{report.batch}</Text>
              <Text style={styles.metricSub}>4 Year B.E.</Text>
            </View>
          </View>
        </View>

        {/* Semester Progression */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Semester GPA Breakdown</Text>
        </View>

        {report.semesters && report.semesters.map((sem, idx) => (
          <View key={idx} style={styles.semCard}>
            <View style={styles.semLeft}>
              <View style={styles.semIconBox}>
                <Ionicons name="document-text-outline" size={22} color="#2563EB" />
              </View>
              <View style={styles.semDetails}>
                <Text style={styles.semTitle}>{sem.sem}</Text>
                <Text style={styles.semSubtitle}>{sem.credits} Credits • {sem.courses} Courses</Text>
              </View>
            </View>
            <View style={styles.semRight}>
              <Text style={styles.gpaValue}>{sem.gpa}</Text>
              <Badge label={sem.status || 'Passed'} variant="success" size="small" />
            </View>
          </View>
        ))}

        {/* Skill Analytics */}
        <View style={[styles.sectionHeader, { marginTop: 18 }]}>
          <Text style={styles.sectionTitle}>Skill & Training Proficiency</Text>
        </View>

        {report.skills_summary && report.skills_summary.map((skill, idx) => (
          <View key={idx} style={styles.skillCard}>
            <View style={styles.skillHeader}>
              <Text style={styles.skillName}>{skill.skill}</Text>
              <Badge label={skill.level} variant="purple" size="small" />
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${skill.points}%` }]} />
            </View>
          </View>
        ))}
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
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentRoll: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  metricValueSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
    marginTop: 4,
  },
  metricSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  semCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  semLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  semIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  semDetails: {
    flex: 1,
  },
  semTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  semSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  semRight: {
    alignItems: 'flex-end',
  },
  gpaValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 4,
  },
  skillCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#9333EA',
    borderRadius: 3,
  },
});
