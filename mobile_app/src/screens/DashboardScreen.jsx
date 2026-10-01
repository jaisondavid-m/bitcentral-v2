import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/StudentContext';
import { fetchMeProfile, fetchV2Profile } from '../api/axios';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const me = await fetchMeProfile();
    const v2 = await fetchV2Profile();
    setProfile({ ...(me || {}), ...(v2 || {}) });
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfileData();
  };

  const rollNo = profile?.roll_no || user?.roll_no || user?.user_id || '7376...';
  const displayName = profile?.display_name || user?.display_name || user?.displayName || 'Student';
  const email = user?.email || profile?.email || '';
  const photoURL = profile?.photo_url || user?.photoURL || null;

  const quickActions = [
    { title: 'Semester & Courses', icon: 'school-outline', route: 'Semester', color: '#2563EB', bg: '#EFF6FF' },
    { title: 'Exam Hall Finder', icon: 'location-outline', route: 'ExamHall', color: '#7C3AED', bg: '#F5F3FF' },
    { title: 'Student 360 Report', icon: 'analytics-outline', route: 'StudentReport', color: '#059669', bg: '#ECFDF5' },
    { title: 'PS Assessments', icon: 'ribbon-outline', route: 'PSAssessmentHistory', color: '#D97706', bg: '#FFFBEB' },
    { title: 'Leave & Outings', icon: 'calendar-outline', route: 'LeaveDetails', color: '#DC2626', bg: '#FEF2F2' },
    { title: 'Lost & Found', icon: 'search-outline', route: 'LostAndFound', color: '#0891B2', bg: '#ECFEFF' },
    { title: 'Mess Menu', icon: 'restaurant-outline', route: 'MessMenu', color: '#EA580C', bg: '#FFF7ED' },
    { title: 'Find My Way', icon: 'map-outline', route: 'FindMyWay', color: '#4F46E5', bg: '#EEF2FF' },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Student Dashboard"
        subtitle="Academic & Campus Overview"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {email}
              </Text>
              <View style={styles.badgeRow}>
                <Badge label={rollNo} variant="info" size="small" />
                {profile?.dept ? (
                  <Badge label={profile.dept} variant="neutral" size="small" style={styles.deptBadge} />
                ) : null}
              </View>
            </View>
          </View>
        </View>

        {/* Academic Stats Summary */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Academic Status</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Attendance</Text>
              <Text style={[styles.statValue, { color: '#059669' }]}>
                {profile?.attendance_percentage || '88.5%'}
              </Text>
              <Text style={styles.statSub}>Good Standing</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Current CGPA</Text>
              <Text style={[styles.statValue, { color: '#2563EB' }]}>
                {profile?.cgpa || '8.42'}
              </Text>
              <Text style={styles.statSub}>Out of 10.0</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Active Arrears</Text>
              <Text style={[styles.statValue, { color: profile?.arrears > 0 ? '#DC2626' : '#059669' }]}>
                {profile?.arrears || '0'}
              </Text>
              <Text style={styles.statSub}>All Clear</Text>
            </View>
          </View>
        </View>

        {/* Quick Services Grid */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Quick Student Services</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.actionTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Campus Assistant Banner */}
        <TouchableOpacity
          style={styles.aiBanner}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('BitBot')}
        >
          <View style={styles.aiLeft}>
            <View style={styles.aiIconCircle}>
              <Ionicons name="sparkles" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.aiTextContainer}>
              <Text style={styles.aiTitle}>Have campus questions?</Text>
              <Text style={styles.aiSubtitle}>Ask BitBot AI for instant answers & guidance</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2563EB" />
        </TouchableOpacity>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  profileEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  deptBadge: {
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    width: '31.5%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    elevation: 1,
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
    marginBottom: 2,
  },
  statSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
  servicesSection: {
    marginBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    width: '48.5%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  aiBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  aiSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
});
