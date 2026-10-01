import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';

const AP_CATEGORIES = [
  { id: '1', name: 'Technical Competitions & Hackathons', earned: 45, max: 50, icon: 'code-slash-outline', color: '#2563EB', bg: '#EFF6FF' },
  { id: '2', name: 'Sports, NSS & NCC Activities', earned: 20, max: 25, icon: 'football-outline', color: '#059669', bg: '#ECFDF5' },
  { id: '3', name: 'Paper Presentations & Conferences', earned: 15, max: 20, icon: 'newspaper-outline', color: '#7C3AED', bg: '#F5F3FF' },
  { id: '4', name: 'Online Certifications (NPTEL / Coursera)', earned: 20, max: 25, icon: 'ribbon-outline', color: '#D97706', bg: '#FFFBEB' },
];

const SUBMISSIONS = [
  { title: 'Smart India Hackathon Internal Round', points: 25, date: '18 Aug 2025', status: 'Approved' },
  { title: 'NPTEL Cloud Computing Certification', points: 20, date: '10 Jul 2025', status: 'Approved' },
  { title: 'Inter-College Badminton Championship', points: 10, date: '05 May 2025', status: 'Pending Review' },
];

export default function ApSiteScreen({ navigation }) {
  const totalEarned = AP_CATEGORIES.reduce((s, c) => s + c.earned, 0);
  const totalRequired = 100;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="AP Site (Activity Points)"
        subtitle="Student AICTE Activity Point Ledger"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* AP Progress Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLabel}>Total Activity Points Earned</Text>
              <Text style={styles.summaryPoints}>{totalEarned} / {totalRequired} pts</Text>
            </View>
            <Badge label="Requirement Met" variant="success" />
          </View>

          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${Math.min((totalEarned / totalRequired) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.barSub}>AICTE Minimum Requirement: 100 Points for B.E./B.Tech</Text>
        </View>

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>Category-Wise Breakdown</Text>
        <View style={styles.categoryGrid}>
          {AP_CATEGORIES.map((cat) => (
            <View key={cat.id} style={styles.catCard}>
              <View style={[styles.catIconBox, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon} size={22} color={cat.color} />
              </View>
              <View style={styles.catInfo}>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catPoints}>{cat.earned} / {cat.max} pts</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Submissions History */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Certificate Submissions</Text>
        {SUBMISSIONS.map((sub, idx) => (
          <View key={idx} style={styles.subCard}>
            <View style={styles.subLeft}>
              <Text style={styles.subTitle}>{sub.title}</Text>
              <Text style={styles.subDate}>{sub.date} • +{sub.points} pts</Text>
            </View>
            <Badge
              label={sub.status}
              variant={sub.status === 'Approved' ? 'success' : 'warning'}
              size="small"
            />
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
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryPoints: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  barContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  barSub: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  categoryGrid: {
    gap: 10,
  },
  catCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    elevation: 1,
  },
  catIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  catPoints: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  subCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  subLeft: {
    flex: 1,
    marginRight: 10,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subDate: {
    fontSize: 11,
    color: '#64748B',
  },
});
