import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/StudentContext';
import { fetchV2Profile, fetchMeProfile } from '../api/axios';
import { haptics } from '../utils/haptics';

export default function ProfileV2Screen({ navigation }) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const v2 = await fetchV2Profile();
      const me = await fetchMeProfile();
      setProfile({ ...(me || {}), ...(v2 || {}) });
    } catch (err) {
      console.warn('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    haptics.warning();
    Alert.alert('Sign Out', 'Are you sure you want to sign out of BIT-CENTRAL?', [
      { text: 'Cancel', style: 'cancel', onPress: () => haptics.tap() },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          haptics.confirm();
          logout();
        },
      },
    ]);
  };

  const formatAuthDate = (value) => {
    if (!value) return '-';
    const numericValue = Number(value);
    const timestamp = Number.isFinite(numericValue) ? numericValue : Date.parse(value);
    if (!Number.isFinite(timestamp)) return String(value);

    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const name =
    profile?.name ||
    profile?.display_name ||
    user?.display_name ||
    user?.displayName ||
    'Student';

  const email = (profile?.email || user?.email || '').toLowerCase().trim();
  const isBitsathyEmail = email.endsWith('@bitsathy.ac.in');

  const photoURL = profile?.photo_url || user?.photoURL || null;

  const registerNo =
    profile?.register_no ||
    profile?.roll_no ||
    profile?.user_id ||
    user?.roll_no ||
    '-';

  const userId =
    profile?.user_id ||
    profile?.uid ||
    user?.uid ||
    '-';

  const department = profile?.department || 'Department Student';
  const batch = profile?.batch || '2024 - 2028';
  const phone = profile?.phone || profile?.phone_no || '-';

  const creationTime =
    profile?.creation_time ||
    user?.metadata?.createdAt ||
    user?.metadata?.creationTime ||
    '';

  const lastSignInTime =
    profile?.last_sign_in_time ||
    user?.metadata?.lastLoginAt ||
    user?.metadata?.lastSignInTime ||
    '';

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Profile" subtitle="Student Account & Identity" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Banner */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
          </View>

          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.emailText}>{email}</Text>

          <View style={styles.tagContainer}>
            <View style={styles.tagChip}>
              <Ionicons name="school-outline" size={14} color="#2563EB" style={styles.tagIcon} />
              <Text style={styles.tagText}>{registerNo}</Text>
            </View>
            <View style={[styles.tagChip, styles.deptTagChip]}>
              <Text style={styles.deptTagText}>{department}</Text>
            </View>
          </View>
        </View>

        {/* Domain Warning Banner if non-bitsathy */}
        {!isBitsathyEmail && email.length > 0 && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning-outline" size={20} color="#D97706" style={styles.warningIcon} />
            <Text style={styles.warningText}>
              Please use your @bitsathy.ac.in college email for full access.
            </Text>
          </View>
        )}

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.loadingText}>Loading profile details...</Text>
          </View>
        )}

        {/* Details Grid Cards */}
        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.detailsGrid}>
          {/* Register No */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <Text style={styles.detailLabel}>REGISTER NO</Text>
              <View style={styles.iconCircle}>
                <Ionicons name="school-outline" size={18} color="#2563EB" />
              </View>
            </View>
            <Text style={styles.detailValue}>{registerNo}</Text>
          </View>

          {/* User ID */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <Text style={styles.detailLabel}>USER ID</Text>
              <View style={styles.iconCircle}>
                <Ionicons name="finger-print-outline" size={18} color="#2563EB" />
              </View>
            </View>
            <Text style={styles.detailValue}>{userId}</Text>
          </View>

          {/* Department */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <Text style={styles.detailLabel}>DEPARTMENT</Text>
              <View style={styles.iconCircle}>
                <Ionicons name="business-outline" size={18} color="#2563EB" />
              </View>
            </View>
            <Text style={styles.detailValue}>{department}</Text>
          </View>

          {/* Batch */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <Text style={styles.detailLabel}>BATCH</Text>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar-outline" size={18} color="#2563EB" />
              </View>
            </View>
            <Text style={styles.detailValue}>{batch}</Text>
          </View>

          {/* Phone */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <Text style={styles.detailLabel}>PHONE</Text>
              <View style={styles.iconCircle}>
                <Ionicons name="call-outline" size={18} color="#2563EB" />
              </View>
            </View>
            <Text style={styles.detailValue}>{phone}</Text>
          </View>

          {/* First Login */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <Text style={styles.detailLabel}>FIRST LOGIN</Text>
              <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={18} color="#2563EB" />
              </View>
            </View>
            <Text style={styles.detailValue}>{formatAuthDate(creationTime)}</Text>
          </View>

          {/* Last Login */}
          <View style={styles.detailCard}>
            <View style={styles.detailCardHeader}>
              <Text style={styles.detailLabel}>LAST LOGIN</Text>
              <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={18} color="#2563EB" />
              </View>
            </View>
            <Text style={styles.detailValue}>{formatAuthDate(lastSignInTime)}</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out of BIT-CENTRAL</Text>
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
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
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
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emailText: {
    fontSize: 13,
    color: '#E0E7FF',
    marginTop: 2,
    textAlign: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  deptTagChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  deptTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningIcon: {
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  detailCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    elevation: 1,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
