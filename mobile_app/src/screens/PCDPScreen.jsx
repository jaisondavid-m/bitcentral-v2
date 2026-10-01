import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';

const TRAINING_MODULES = [
  { id: '1', title: 'Quantitative Aptitude & Problem Solving', hours: '45 hrs', progress: 85, status: 'Active', instructor: 'Placement Training Cell' },
  { id: '2', title: 'Advanced Data Structures & Algorithms', hours: '60 hrs', progress: 70, status: 'Active', instructor: 'Coding Track Lead' },
  { id: '3', title: 'Business Communication & HR Skills', hours: '30 hrs', progress: 100, status: 'Completed', instructor: 'Language Lab' },
  { id: '4', title: 'Full Stack Web Development & Cloud', hours: '50 hrs', progress: 40, status: 'Active', instructor: 'Industry Partner' },
];

const UPCOMING_DRIVES = [
  { company: 'Global Tech Solutions', role: 'Graduate Software Engineer', ctc: '12 - 18 LPA', date: '25 Oct 2026', eligibility: 'CGPA >= 8.0' },
  { company: 'FinTech Innovations', role: 'Full Stack Developer Intern', ctc: '8 - 14 LPA', date: '02 Nov 2026', eligibility: 'CGPA >= 7.5' },
  { company: 'Cloud Systems Inc', role: 'Cloud DevOps Associate', ctc: '10 - 15 LPA', date: '12 Nov 2026', eligibility: 'CGPA >= 7.5' },
];

export default function PCDPScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('training'); // 'training' | 'drives'

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="PCDP Placement Portal"
        subtitle="Training Tracks, Drives & Career Development"
        navigation={navigation}
        showBack={true}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'training' && styles.tabItemActive]}
          onPress={() => setActiveTab('training')}
        >
          <Text style={[styles.tabText, activeTab === 'training' && styles.tabTextActive]}>
            Training Modules
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'drives' && styles.tabItemActive]}
          onPress={() => setActiveTab('drives')}
        >
          <Text style={[styles.tabText, activeTab === 'drives' && styles.tabTextActive]}>
            Placement Drives
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'training' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enrolled Training Tracks</Text>
            {TRAINING_MODULES.map((track) => (
              <View key={track.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.trackDetails}>
                    <Text style={styles.trackTitle}>{track.title}</Text>
                    <Text style={styles.trackSub}>{track.hours} • {track.instructor}</Text>
                  </View>
                  <Badge
                    label={track.status}
                    variant={track.status === 'Completed' ? 'success' : 'info'}
                    size="small"
                  />
                </View>

                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Completion Progress</Text>
                  <Text style={styles.progressPct}>{track.progress}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${track.progress}%`,
                        backgroundColor: track.progress === 100 ? '#10B981' : '#2563EB',
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming On-Campus Drives</Text>
            {UPCOMING_DRIVES.map((drive, idx) => (
              <View key={idx} style={styles.driveCard}>
                <View style={styles.driveTop}>
                  <View>
                    <Text style={styles.companyName}>{drive.company}</Text>
                    <Text style={styles.roleName}>{drive.role}</Text>
                  </View>
                  <Badge label={drive.ctc} variant="purple" />
                </View>

                <View style={styles.driveMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color="#64748B" />
                    <Text style={styles.metaText}>Drive Date: {drive.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="checkmark-circle-outline" size={14} color="#64748B" />
                    <Text style={styles.metaText}>{drive.eligibility}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
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
    paddingVertical: 10,
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
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
  trackDetails: {
    flex: 1,
    marginRight: 8,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  trackSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  progressPct: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  driveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  driveTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  roleName: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  driveMeta: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
});
