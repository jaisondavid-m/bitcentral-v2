import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/StudentContext';
import { fetchV2Profile } from '../api/axios';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profileV2, setProfileV2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await fetchV2Profile();
      if (data) {
        setProfileV2(data);
      }
    } catch (err) {
      console.warn('Failed to load v2 profile:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  const formatDate = (val) => {
    if (!val) return '-';
    try {
      const num = Number(val);
      const timestamp = Number.isFinite(num) ? num : Date.parse(val);
      if (!Number.isFinite(timestamp)) return String(val);
      return new Date(timestamp).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (e) {
      return String(val);
    }
  };

  const displayName = profileV2?.name || profileV2?.display_name || user?.displayName || 'BIT Student';
  const email = profileV2?.email || user?.email || 'student@bitsathy.ac.in';
  const photoUrl = profileV2?.photo_url || user?.photoURL;

  const registerNo = profileV2?.register_no || profileV2?.roll_no || profileV2?.user_id || 'Not Assigned';
  const userId = profileV2?.user_id || profileV2?.uid || user?.uid || '-';
  const department = profileV2?.department || 'Information Technology';
  const batch = profileV2?.batch || '-';
  const phone = profileV2?.phone || '-';
  const creationTime = profileV2?.creation_time || user?.metadata?.createdAt || '';
  const lastSignInTime = profileV2?.last_sign_in_time || user?.metadata?.lastLoginAt || '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        {/* Header Hero Banner */}
        <View style={styles.headerCard}>
          <View style={styles.avatarContainer}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.badgeRow}>
            {user?.isGuest ? (
              <View style={[styles.badge, styles.guestBadge]}>
                <Text style={styles.guestBadgeText}>Guest Session</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.studentBadge]}>
                <Ionicons name="school-outline" size={14} color="#1D4ED8" style={styles.badgeIcon} />
                <Text style={styles.studentBadgeText}>BIT Sathy Student</Text>
              </View>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="medium" color="#2563EB" />
            <Text style={styles.loadingText}>Fetching profile details...</Text>
          </View>
        ) : (
          <View style={styles.detailsGrid}>
            <Text style={styles.sectionTitle}>Account Details</Text>

            {/* Register No */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Register No</Text>
                <View style={styles.iconCircle}>
                  <Ionicons name="school-outline" size={20} color="#2563EB" />
                </View>
              </View>
              <Text style={styles.cardValue}>{registerNo}</Text>
            </View>

            {/* User ID */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>User ID</Text>
                <View style={styles.iconCircle}>
                  <Ionicons name="key-outline" size={20} color="#2563EB" />
                </View>
              </View>
              <Text style={styles.cardValue}>{userId}</Text>
            </View>

            {/* Department */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Department</Text>
                <View style={styles.iconCircle}>
                  <Ionicons name="business-outline" size={20} color="#2563EB" />
                </View>
              </View>
              <Text style={styles.cardValue}>{department}</Text>
            </View>

            {/* Batch */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Batch</Text>
                <View style={styles.iconCircle}>
                  <Ionicons name="calendar-outline" size={20} color="#2563EB" />
                </View>
              </View>
              <Text style={styles.cardValue}>{batch}</Text>
            </View>

            {/* Phone */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Phone</Text>
                <View style={styles.iconCircle}>
                  <Ionicons name="call-outline" size={20} color="#2563EB" />
                </View>
              </View>
              <Text style={styles.cardValue}>{phone}</Text>
            </View>

            {/* Creation Time / First Login */}
            {creationTime ? (
              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>First Sign-In</Text>
                  <View style={styles.iconCircle}>
                    <Ionicons name="time-outline" size={20} color="#2563EB" />
                  </View>
                </View>
                <Text style={styles.cardValue}>{formatDate(creationTime)}</Text>
              </View>
            ) : null}

            {/* Last Sign-In Time */}
            {lastSignInTime ? (
              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>Last Active</Text>
                  <View style={styles.iconCircle}>
                    <Ionicons name="time-outline" size={20} color="#2563EB" />
                  </View>
                </View>
                <Text style={styles.cardValue}>{formatDate(lastSignInTime)}</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  headerCard: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 34,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: '#DBEAFE',
    marginTop: 4,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentBadge: {
    backgroundColor: '#FFFFFF',
  },
  badgeIcon: {
    marginRight: 4,
  },
  studentBadgeText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  guestBadge: {
    backgroundColor: '#FEF3C7',
  },
  guestBadgeText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
  },
  detailsGrid: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconCircle: {
    backgroundColor: '#EFF6FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
});

