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
import { fetchPSPointDetails } from '../api/axios';

const SAMPLE_POINTS = [
  { activity: 'Mock Aptitude Test Performance (>80%)', points: 50, date: '2025-09-10', category: 'Assessment', type: 'credit' },
  { activity: 'Special Interest Group (SIG) Attendance', points: 30, date: '2025-09-05', category: 'Training', type: 'credit' },
  { activity: 'Weekly Coding Contest - 1st Rank in Track', points: 100, date: '2025-08-30', category: 'Competition', type: 'credit' },
  { activity: 'Full Stack Workshop Completion', points: 40, date: '2025-08-20', category: 'Workshop', type: 'credit' },
  { activity: 'Soft Skills & Group Discussion Session', points: 25, date: '2025-08-12', category: 'Soft Skills', type: 'credit' },
];

export default function PSPointDetailsScreen({ navigation }) {
  const [points, setPoints] = useState(SAMPLE_POINTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPoints();
  }, []);

  const loadPoints = async () => {
    setLoading(true);
    const data = await fetchPSPointDetails();
    if (data && Array.isArray(data) && data.length > 0) {
      setPoints(data);
    } else {
      setPoints(SAMPLE_POINTS);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPoints();
  };

  const totalPoints = points.reduce((sum, p) => sum + (p.points || 0), 0);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="PS Reward Points"
        subtitle="Placement & Skill Training Points Ledger"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Points Card */}
        <View style={styles.totalCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="trophy" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.totalDetails}>
            <Text style={styles.totalLabel}>Total PS Points Earned</Text>
            <Text style={styles.totalValue}>{totalPoints} Points</Text>
          </View>
          <Badge label="Elite Tier" variant="purple" />
        </View>

        <Text style={styles.sectionTitle}>Points Activity History</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 30 }} />
        ) : points.length > 0 ? (
          <View style={styles.list}>
            {points.map((item, index) => (
              <View key={index} style={styles.pointCard}>
                <View style={styles.pointLeft}>
                  <View style={styles.pointIconBox}>
                    <Ionicons name="add-circle" size={22} color="#059669" />
                  </View>
                  <View style={styles.pointInfo}>
                    <Text style={styles.pointActivity}>{item.activity}</Text>
                    <View style={styles.pointMeta}>
                      <Badge label={item.category || 'Skill'} variant="neutral" size="small" />
                      <Text style={styles.pointDate}>{item.date}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.pointPoints}>+{item.points} pts</Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="trophy-outline"
            title="No PS Points Recorded"
            description="Complete placement training milestones to earn points."
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
  totalCard: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  totalDetails: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#E0E7FF',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
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
  pointCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    elevation: 1,
  },
  pointLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  pointIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pointInfo: {
    flex: 1,
  },
  pointActivity: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 4,
  },
  pointMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointDate: {
    fontSize: 11,
    color: '#64748B',
  },
  pointPoints: {
    fontSize: 15,
    fontWeight: '800',
    color: '#059669',
  },
});
