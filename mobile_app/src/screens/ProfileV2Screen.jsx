import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';
import { useAuth } from '../context/StudentContext';
import { fetchV2Profile, fetchMeProfile } from '../api/axios';

export default function ProfileV2Screen({ navigation }) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const v2 = await fetchV2Profile();
    const me = await fetchMeProfile();
    setProfile({ ...(me || {}), ...(v2 || {}) });
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of BIT-CENTRAL?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const displayName = profile?.display_name || user?.display_name || user?.displayName || 'Student';
  const rollNo = profile?.roll_no || user?.roll_no || user?.user_id || '7376...';
  const email = user?.email || profile?.email || '';
  const photoURL = profile?.photo_url || user?.photoURL || null;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Student Profile"
        subtitle="Account & Academic Identity"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileHeaderCard}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={36} color="#FFFFFF" />
            </View>
          )}
          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.emailText}>{email}</Text>
          <View style={styles.tagRow}>
            <Badge label={rollNo} variant="info" />
            <Badge label={profile?.department || 'CSE'} variant="neutral" />
            <Badge label="Active Student" variant="success" />
          </View>
        </View>

        {/* Academic Details Section */}
        <Text style={styles.sectionTitle}>Academic Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Roll Number</Text>
            <Text style={styles.infoValue}>{rollNo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Degree Program</Text>
            <Text style={styles.infoValue}>{profile?.degree || 'B.E. Computer Science'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Year & Sem</Text>
            <Text style={styles.infoValue}>{profile?.year_sem || '2nd Year / Sem 4'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Academic Batch</Text>
            <Text style={styles.infoValue}>{profile?.batch || '2024 - 2028'}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Faculty Mentor</Text>
            <Text style={styles.infoValue}>{profile?.mentor || 'Dr. S. Ramesh, ASP/CSE'}</Text>
          </View>
        </View>

        {/* Quick App Actions */}
        <Text style={styles.sectionTitle}>App & Community</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Support')}
          >
            <Ionicons name="heart-outline" size={20} color="#EA580C" style={styles.menuIcon} />
            <Text style={styles.menuText}>Support Developer (Buy Me a Coffee)</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('GuidesIndex')}
          >
            <Ionicons name="book-outline" size={20} color="#2563EB" style={styles.menuIcon} />
            <Text style={styles.menuText}>Campus Knowledge Guides</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('About')}
          >
            <Ionicons name="information-circle-outline" size={20} color="#7C3AED" style={styles.menuIcon} />
            <Text style={styles.menuText}>About BIT Central</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => navigation.navigate('FAQ')}
          >
            <Ionicons name="help-circle-outline" size={20} color="#059669" style={styles.menuIcon} />
            <Text style={styles.menuText}>Frequently Asked Questions</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
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
    paddingBottom: 36,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 2,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#2563EB',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
