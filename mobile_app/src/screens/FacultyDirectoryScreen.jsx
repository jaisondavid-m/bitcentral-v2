import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Platform,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchFacultyDirectory } from '../api/axios';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const AVATAR_COLORS = ['#2563EB', '#7C3AED', '#4F46E5', '#059669', '#0891B2', '#E11D48'];

function getInitials(name = '') {
  if (!name) return 'FC';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + hash * 31;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function FacultyAvatar({ photoUrl, name, size = 52 }) {
  const [imageError, setImageError] = useState(false);

  if (photoUrl && !imageError) {
    const imgStyle = { width: size, height: size, borderRadius: size / 3.5 };
    return (
      <Image
        source={{ uri: photoUrl }}
        style={imgStyle}
        onError={() => setImageError(true)}
      />
    );
  }

  const avatarColor = getAvatarColor(name);
  const initials = getInitials(name);
  const bgStyle = {
    width: size,
    height: size,
    borderRadius: size / 3.5,
    backgroundColor: avatarColor,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const txtStyle = { color: '#FFFFFF', fontWeight: '700', fontSize: size * 0.38 };

  return (
    <View style={bgStyle}>
      <Text style={txtStyle}>
        {initials}
      </Text>
    </View>
  );
}

export default function FacultyDirectoryScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [activeCallModal, setActiveCallModal] = useState(null);

  const loadDirectory = useCallback(async () => {
    // 1. Instantly check AsyncStorage cache for 0ms load
    try {
      const cached = await AsyncStorage.getItem('faculty_directory_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFaculty(parsed);
          setLoading(false);
        }
      }
    } catch (e) {
      // ignore
    }

    // 2. Fetch full directory from API in background
    const res = await fetchFacultyDirectory('', '');
    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
      setFaculty(res.data);
      AsyncStorage.setItem('faculty_directory_cache', JSON.stringify(res.data)).catch(() => {});
    } else if (faculty.length === 0) {
      // Fallback data if server returns empty and cache was empty
      setFaculty([
        {
          id: 1,
          name: 'Dr. S. Kumar',
          department: 'Computer Science & Engineering',
          job_title: 'Professor & Head',
          email: 'skumar@bitsathy.ac.in',
          phone: '9843123456',
        },
        {
          id: 2,
          name: 'Prof. R. Priya',
          department: 'Information Technology',
          job_title: 'Associate Professor',
          email: 'rpriya@bitsathy.ac.in',
          phone: '9843654321',
        },
        {
          id: 3,
          name: 'Dr. M. Rajesh',
          department: 'Electronics & Communication',
          job_title: 'Assistant Professor',
          email: 'mrajesh@bitsathy.ac.in',
          phone: '9843987654',
        },
      ]);
    }
    setLoading(false);
  }, [faculty.length]);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  const departmentList = useMemo(() => {
    const counts = {};
    faculty.forEach((member) => {
      const dept = (member.department || 'Faculty & Staff').trim();
      if (dept) counts[dept] = (counts[dept] || 0) + 1;
    });
    const list = Object.keys(counts).sort();
    return ['ALL', ...list];
  }, [faculty]);

  const filteredFaculty = useMemo(() => {
    const q = query.toLowerCase().trim();
    return faculty.filter((member) => {
      if (selectedDept && selectedDept !== 'ALL') {
        const memberDept = (member.department || '').trim().toLowerCase();
        if (!memberDept.includes(selectedDept.toLowerCase())) {
          return false;
        }
      }
      if (!q) return true;
      const nameMatch = member.name?.toLowerCase().includes(q);
      const emailMatch = member.email?.toLowerCase().includes(q);
      const phoneMatch = member.phone?.includes(q);
      const deptMatch = member.department?.toLowerCase().includes(q);
      const jobMatch = member.job_title?.toLowerCase().includes(q);
      return nameMatch || emailMatch || phoneMatch || deptMatch || jobMatch;
    });
  }, [faculty, query, selectedDept]);

  const handleEmailPress = (email) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  const handleCopyPhone = (phone, id) => {
    if (!phone) return;
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlaceCall = (phone) => {
    if (!phone) return;
    setActiveCallModal(null);
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Ionicons name="star" size={20} color="#FFFFFF" style={styles.starIcon} />
          <Text style={styles.headerTitle}>BIT-CENTRAL</Text>
        </View>
      </View>

      {/* Search & Filter Header Container */}
      <View style={styles.filterContainer}>
        {/* Search Input Bar */}
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search by name, email, dept, or phone..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Department Chips Scroll */}
        {departmentList.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.deptScrollContent}
          >
            {departmentList.map((dept) => {
              const isActive = selectedDept === dept;
              return (
                <TouchableOpacity
                  key={dept}
                  style={[styles.deptChip, isActive && styles.activeDeptChip]}
                  onPress={() => setSelectedDept(dept)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.deptChipText, isActive && styles.activeDeptChipText]}>
                    {dept === 'ALL' ? 'All Depts' : dept}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Faculty Member Count Status Bar */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>
          {filteredFaculty.length} Faculty Member{filteredFaculty.length !== 1 ? 's' : ''} Found
        </Text>
      </View>

      {/* Faculty Member Cards */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Fetching Faculty Contacts...</Text>
        </View>
      ) : filteredFaculty.length > 0 ? (
        <FlatList
          data={filteredFaculty}
          keyExtractor={(item, index) => item.id?.toString() || item.email || index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <FacultyAvatar photoUrl={item.photo_url} name={item.name} size={54} />
                <View style={styles.headerTextCol}>
                  <Text style={styles.facultyName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.deptBadge}>
                    <Ionicons name="business-outline" size={12} color="#2563EB" style={styles.deptIcon} />
                    <Text style={styles.deptBadgeText} numberOfLines={1}>
                      {item.department || 'Faculty & Staff'}
                    </Text>
                  </View>
                  {item.job_title && item.job_title !== 'Faculty / Staff' ? (
                    <Text style={styles.jobTitle} numberOfLines={1}>
                      {item.job_title}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Contact Information */}
              <View style={styles.contactDetailsBox}>
                {item.email ? (
                  <TouchableOpacity
                    style={styles.contactRow}
                    onPress={() => handleEmailPress(item.email)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="mail-outline" size={15} color="#64748B" style={styles.contactIcon} />
                    <Text style={styles.emailText} numberOfLines={1}>
                      {item.email}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {item.phone ? (
                  <View style={styles.contactRowBetween}>
                    <View style={styles.contactRowLeft}>
                      <Ionicons name="call-outline" size={15} color="#64748B" style={styles.contactIcon} />
                      <Text style={styles.phoneText}>{item.phone}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCopyPhone(item.phone, item.id)}
                      style={styles.copyBtn}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={copiedId === item.id ? 'checkmark-circle' : 'copy-outline'}
                        size={16}
                        color={copiedId === item.id ? '#059669' : '#64748B'}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>

              {/* Call Faculty Primary Button */}
              {item.phone ? (
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => setActiveCallModal(item)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="call" size={15} color="#2563EB" style={styles.callIcon} />
                  <Text style={styles.callBtnText}>Call Faculty</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        />
      ) : (
        <View style={styles.centerBox}>
          <Ionicons name="people-outline" size={48} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No Faculty Contacts Found</Text>
          <Text style={styles.emptySub}>Try adjusting your search query or department filter</Text>
        </View>
      )}

      {/* CALL CONFIRMATION MODAL */}
      <Modal
        visible={!!activeCallModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveCallModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setActiveCallModal(null)} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>

            {activeCallModal && (
              <View style={styles.modalBody}>
                <FacultyAvatar photoUrl={activeCallModal.photo_url} name={activeCallModal.name} size={80} />

                <Text style={styles.modalFacultyName}>{activeCallModal.name}</Text>

                <View style={styles.modalDeptBadge}>
                  <Ionicons name="business-outline" size={13} color="#2563EB" style={styles.modalDeptIcon} />
                  <Text style={styles.modalDeptText}>{activeCallModal.department || 'Faculty & Staff'}</Text>
                </View>

                {activeCallModal.job_title && activeCallModal.job_title !== 'Faculty / Staff' ? (
                  <Text style={styles.modalJobTitle}>{activeCallModal.job_title}</Text>
                ) : null}

                <Text style={styles.modalEmailText}>{activeCallModal.email}</Text>

                {/* Big Phone Number Box */}
                <View style={styles.phoneDisplayBox}>
                  <View style={styles.phoneIconBox}>
                    <Ionicons name="call" size={18} color="#2563EB" />
                  </View>
                  <View style={styles.phoneTextCol}>
                    <Text style={styles.phoneDisplayLabel}>PHONE NUMBER</Text>
                    <Text style={styles.phoneDisplayVal}>{activeCallModal.phone}</Text>
                  </View>
                </View>

                {/* Official Hours Notice Banner */}
                <View style={styles.noticeBanner}>
                  <Ionicons name="warning-outline" size={18} color="#D97706" style={styles.noticeIcon} />
                  <Text style={styles.noticeText}>
                    Please confirm before placing the call. Only contact faculty during official working hours for academic queries.
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    style={styles.cancelModalBtn}
                    onPress={() => setActiveCallModal(null)}
                  >
                    <Text style={styles.cancelModalBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.callNowBtn}
                    onPress={() => handlePlaceCall(activeCallModal.phone)}
                  >
                    <Ionicons name="call" size={16} color="#FFFFFF" style={styles.callNowIcon} />
                    <Text style={styles.callNowBtnText}>Call Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingBottom: 14,
    backgroundColor: '#2563EB',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButton: {
    paddingRight: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  clearBtn: {
    padding: 4,
  },
  deptScrollContent: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deptChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 6,
  },
  activeDeptChip: {
    backgroundColor: '#2563EB',
  },
  deptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  activeDeptChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    padding: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  facultyName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  deptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  deptIcon: {
    marginRight: 4,
  },
  deptBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  jobTitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  contactDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  contactRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    marginTop: 2,
  },
  contactRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    marginRight: 8,
  },
  emailText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
    flex: 1,
  },
  phoneText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  copyBtn: {
    padding: 4,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  callIcon: {
    marginRight: 6,
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  modalBody: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  modalFacultyName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
    textAlign: 'center',
  },
  modalDeptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  modalDeptText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  modalJobTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  modalEmailText: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  phoneDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  phoneIconBox: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  phoneTextCol: {
    flex: 1,
  },
  phoneDisplayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  phoneDisplayVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
  },
  modalActionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelModalBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  callNowBtn: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callNowBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalDeptIcon: {
    marginRight: 4,
  },
  noticeIcon: {
    marginRight: 8,
  },
  callNowIcon: {
    marginRight: 6,
  },
});
