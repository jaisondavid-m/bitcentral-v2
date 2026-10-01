import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { fetchSemesterCourses } from '../api/axios';

const SAMPLE_COURSES = [
  { code: '22CS401', name: 'Design and Analysis of Algorithms', credits: 4, attendance: 92, status: 'Regular', faculty: 'Dr. S. Ramesh' },
  { code: '22CS402', name: 'Database Management Systems', credits: 3, attendance: 86, status: 'Regular', faculty: 'Dr. M. Priya' },
  { code: '22CS403', name: 'Operating Systems & Architecture', credits: 3, attendance: 78, status: 'Warning', faculty: 'Prof. K. Anand' },
  { code: '22CS404', name: 'Computer Networks', credits: 3, attendance: 88, status: 'Regular', faculty: 'Dr. R. Vignesh' },
  { code: '22CS405', name: 'Full Stack Web Development', credits: 4, attendance: 95, status: 'Regular', faculty: 'Prof. P. Naveen' },
  { code: '22CS406', name: 'Algorithms & DBMS Laboratory', credits: 2, attendance: 90, status: 'Regular', faculty: 'Dr. S. Ramesh' },
  { code: '22HS006', name: 'Heritage of Tamils', credits: 1, attendance: 74, status: 'Critical', faculty: 'Dr. K. Bharathi' },
];

export default function SemesterScreen({ navigation }) {
  const [year, setYear] = useState('2');
  const [courses, setCourses] = useState(SAMPLE_COURSES);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCourses(year);
  }, [year]);

  const loadCourses = async (selectedYear) => {
    setLoading(true);
    const data = await fetchSemesterCourses(selectedYear);
    if (data && Array.isArray(data) && data.length > 0) {
      setCourses(data);
    } else {
      setCourses(SAMPLE_COURSES);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCourses(year);
  };

  const getAttendanceVariant = (pct) => {
    if (pct >= 85) return 'success';
    if (pct >= 75) return 'warning';
    return 'danger';
  };

  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const avgAttendance = Math.round(courses.reduce((sum, c) => sum + (c.attendance || 80), 0) / (courses.length || 1));

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Semester & Courses"
        subtitle="Current Semester Attendance & Credits"
        navigation={navigation}
        showBack={true}
      />

      {/* Year Selection Tabs */}
      <View style={styles.tabBar}>
        {['1', '2', '3', '4'].map((y) => (
          <TouchableOpacity
            key={y}
            style={[styles.tabItem, year === y && styles.tabItemActive]}
            onPress={() => setYear(y)}
          >
            <Text style={[styles.tabText, year === y && styles.tabTextActive]}>
              Year {y}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Semester Stats Header */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Total Courses</Text>
            <Text style={styles.overviewValue}>{courses.length}</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Total Credits</Text>
            <Text style={styles.overviewValue}>{totalCredits}</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Avg Attendance</Text>
            <Text style={[styles.overviewValue, { color: avgAttendance >= 75 ? '#059669' : '#DC2626' }]}>
              {avgAttendance}%
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={styles.loader} />
        ) : courses.length > 0 ? (
          <View style={styles.courseList}>
            {courses.map((course, index) => {
              const variant = getAttendanceVariant(course.attendance || 80);
              return (
                <View key={index} style={styles.courseCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.codeRow}>
                      <Badge label={course.code || 'COURSE'} variant="info" size="small" />
                      <Text style={styles.creditsText}>{course.credits || 3} Credits</Text>
                    </View>
                    <Badge
                      label={`${course.attendance || 80}% Attendance`}
                      variant={variant}
                      size="small"
                    />
                  </View>

                  <Text style={styles.courseName}>{course.name}</Text>
                  {course.faculty ? (
                    <View style={styles.facultyRow}>
                      <Ionicons name="person-outline" size={14} color="#64748B" />
                      <Text style={styles.facultyName}>{course.faculty}</Text>
                    </View>
                  ) : null}

                  {/* Attendance Bar */}
                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(course.attendance || 80, 100)}%`,
                          backgroundColor:
                            course.attendance >= 85
                              ? '#10B981'
                              : course.attendance >= 75
                              ? '#F59E0B'
                              : '#EF4444',
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <EmptyState
            icon="school-outline"
            title="No course records found"
            description="Semester courses could not be loaded at this time."
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  overviewDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  loader: {
    marginVertical: 40,
  },
  courseList: {
    gap: 12,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creditsText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 20,
  },
  facultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  facultyName: {
    fontSize: 12,
    color: '#64748B',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
