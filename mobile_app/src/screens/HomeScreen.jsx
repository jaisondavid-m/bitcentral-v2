import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchHomeCards } from '../api/axios';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const FALLBACK_CARDS = [
  {
    id: 'dashboard',
    name: 'Student Dashboard',
    description: 'Quick student overview, batch details, and academic health stats.',
    btntext: 'Open Dashboard',
    icon: 'speedometer-outline',
    route: 'Dashboard',
  },
  {
    id: 'semester',
    name: 'Semester & Courses',
    description: 'Check enrolled courses, credits, and live subject attendance percentages.',
    btntext: 'View Courses',
    icon: 'school-outline',
    route: 'Semester',
  },
  {
    id: 'exam-hall',
    name: 'Exam Hall Finder',
    description: 'Find your exam hall, seat number, and floor layout by roll number.',
    btntext: 'Find Hall',
    icon: 'location-outline',
    route: 'ExamHall',
  },
  {
    id: 'student-report',
    name: 'Student 360 Report',
    description: 'Comprehensive academic history, CGPA analytics, and arrear tracker.',
    btntext: 'View Report',
    icon: 'analytics-outline',
    route: 'StudentReport',
  },
  {
    id: 'lost-found',
    name: 'Campus Lost & Found',
    description: 'Report lost items or claim belongings found across campus.',
    btntext: 'Browse Items',
    icon: 'search-outline',
    route: 'LostAndFound',
  },
  {
    id: 'mess-menu',
    name: 'Mess Menu',
    description: 'Check daily food menus for boys and girls hostel mess with timings.',
    btntext: 'View Menu',
    icon: 'restaurant-outline',
    route: 'MessMenu',
  },
  {
    id: 'leave-details',
    name: 'Leave & Outpasses',
    description: 'Check status of applied hostel leaves, outpasses, and gate logs.',
    btntext: 'View Leaves',
    icon: 'calendar-outline',
    route: 'LeaveDetails',
  },
  {
    id: 'find-my-way',
    name: 'Find My Way',
    description: 'Locate campus blocks, labs, auditoriums, and facilities on the map.',
    btntext: 'Explore Campus',
    icon: 'map-outline',
    route: 'FindMyWay',
  },
  {
    id: 'faculty-directory',
    name: 'Faculty Directory',
    description: 'Find contact info, cabins, and emails for BIT faculty.',
    btntext: 'Search Faculty',
    icon: 'people-outline',
    route: 'FacultyDirectory',
  },
  {
    id: 'reward-points',
    name: 'Reward Points (RP Site)',
    description: 'Search student RP, leaderboard rankings, and year-wise averages.',
    btntext: 'View RP Site',
    icon: 'ribbon-outline',
    route: 'RpSite',
  },
  {
    id: 'activity-points',
    name: 'Activity Points (AP Site)',
    description: 'Track your AICTE activity points and certificate submissions.',
    btntext: 'View AP Site',
    icon: 'trophy-outline',
    route: 'ApSite',
  },
  {
    id: 'pcdp',
    name: 'PCDP Placement Portal',
    description: 'Access placement training modules and upcoming campus drives.',
    btntext: 'Open PCDP',
    icon: 'briefcase-outline',
    route: 'PCDP',
  },
  {
    id: 'ps-assessments',
    name: 'PS Assessment History',
    description: 'Review placement mock tests, test results, and attendance records.',
    btntext: 'View Tests',
    icon: 'document-text-outline',
    route: 'PSAssessmentHistory',
  },
  {
    id: 'wifi-details',
    name: 'Wi-Fi Portal & Setup',
    description: 'Quick credentials, setup guide, and connection instructions for campus Wi-Fi.',
    btntext: 'Connect Wi-Fi',
    icon: 'wifi-outline',
    route: 'WifiDetails',
  },
  {
    id: 'bitbot-ai',
    name: 'BitBot AI Assistant',
    description: 'Ask questions about academics, campus rules, mess, and exam schedules.',
    btntext: 'Chat with AI',
    icon: 'sparkles-outline',
    route: 'BitBot',
  },
  {
    id: 'bitcentral-support',
    name: 'Support Developer',
    description: 'Support BIT-CENTRAL server maintenance via UPI contributions.',
    btntext: 'Buy a Coffee',
    icon: 'heart-outline',
    route: 'Support',
  },
];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [cards, setCards] = useState(FALLBACK_CARDS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    const apiCards = await fetchHomeCards();
    if (apiCards && apiCards.length > 0) {
      // Merge fallback cards with API cards to ensure all native screens are accessible
      const merged = [...FALLBACK_CARDS];
      apiCards.forEach((ac) => {
        if (!merged.find((m) => m.name.toLowerCase() === ac.name.toLowerCase())) {
          merged.push(ac);
        }
      });
      setCards(merged);
    } else {
      setCards(FALLBACK_CARDS);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCards();
  };

  const filteredCards = cards.filter((card) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (card.name && card.name.toLowerCase().includes(q)) ||
      (card.description && card.description.toLowerCase().includes(q)) ||
      (card.btntext && card.btntext.toLowerCase().includes(q))
    );
  });

  const handleCardPress = (card) => {
    const targetRoute = (card.app_route || card.route || '').trim();

    if (targetRoute) {
      const routeLower = targetRoute.toLowerCase();
      if (routeLower === 'dashboard') {
        navigation.navigate('Dashboard');
        return;
      }
      if (routeLower === 'semester') {
        navigation.navigate('Semester');
        return;
      }
      if (routeLower === 'examhall' || routeLower.includes('exam')) {
        navigation.navigate('ExamHall');
        return;
      }
      if (routeLower === 'studentreport' || routeLower.includes('report')) {
        navigation.navigate('StudentReport');
        return;
      }
      if (routeLower === 'lostandfound' || routeLower.includes('lost')) {
        navigation.navigate('LostAndFound');
        return;
      }
      if (routeLower === 'leavedetails' || routeLower.includes('leave')) {
        navigation.navigate('LeaveDetails');
        return;
      }
      if (routeLower === 'findmyway' || routeLower.includes('way') || routeLower.includes('map')) {
        navigation.navigate('FindMyWay');
        return;
      }
      if (routeLower === 'apsite' || routeLower.includes('activity')) {
        navigation.navigate('ApSite');
        return;
      }
      if (routeLower === 'pcdp') {
        navigation.navigate('PCDP');
        return;
      }
      if (routeLower === 'psassessmenthistory' || routeLower.includes('assessment')) {
        navigation.navigate('PSAssessmentHistory');
        return;
      }
      if (routeLower === 'messmenu' || routeLower.includes('mess')) {
        navigation.navigate('MessMenu');
        return;
      }
      if (routeLower === 'facultydirectory' || routeLower.includes('faculty')) {
        navigation.navigate('FacultyDirectory');
        return;
      }
      if (routeLower === 'rpsite' || routeLower.includes('reward') || routeLower.includes('rp')) {
        navigation.navigate('RpSite');
        return;
      }
      if (routeLower === 'wifidetails' || routeLower.includes('wifi')) {
        navigation.navigate('WifiDetails');
        return;
      }
      if (routeLower === 'bitbot' || routeLower.includes('bot')) {
        navigation.navigate('BitBot');
        return;
      }
      if (routeLower === 'support' || routeLower.includes('help')) {
        navigation.navigate('Support');
        return;
      }
      if (routeLower === 'profile') {
        navigation.navigate('Profile');
        return;
      }
      try {
        navigation.navigate(targetRoute);
        return;
      } catch (e) {}
    }

    if (card.link) {
      const linkLower = card.link.toLowerCase();
      if (linkLower.includes('/dashboard')) return navigation.navigate('Dashboard');
      if (linkLower.includes('/semester')) return navigation.navigate('Semester');
      if (linkLower.includes('/exam-hall') || linkLower.includes('/exam')) return navigation.navigate('ExamHall');
      if (linkLower.includes('/student-report')) return navigation.navigate('StudentReport');
      if (linkLower.includes('/lost-found') || linkLower.includes('/lostfound')) return navigation.navigate('LostAndFound');
      if (linkLower.includes('/leavedetails') || linkLower.includes('/leave')) return navigation.navigate('LeaveDetails');
      if (linkLower.includes('/findmyway')) return navigation.navigate('FindMyWay');
      if (linkLower.includes('/apsite')) return navigation.navigate('ApSite');
      if (linkLower.includes('/pcdp')) return navigation.navigate('PCDP');
      if (linkLower.includes('/ps-assessment')) return navigation.navigate('PSAssessmentHistory');
      if (linkLower.includes('/mess')) return navigation.navigate('MessMenu');
      if (linkLower.includes('/faculty')) return navigation.navigate('FacultyDirectory');
      if (linkLower.includes('/rpsite') || linkLower.includes('/reward')) return navigation.navigate('RpSite');
      if (linkLower.includes('/wifi')) return navigation.navigate('WifiDetails');
      if (linkLower.includes('/bitbot')) return navigation.navigate('BitBot');
      if (linkLower.includes('/support') || linkLower.includes('/support-dev')) return navigation.navigate('Support');
      if (linkLower.includes('/profile')) return navigation.navigate('Profile');

      Linking.openURL(card.link).catch((err) => console.warn('Unable to open URL:', err));
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" translucent={true} />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="star" size={22} color="#FFFFFF" style={styles.starIcon} />
          <Text style={styles.headerTitle}>BIT-CENTRAL</Text>
        </View>
        <TouchableOpacity
          style={styles.headerRightBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Body Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        {/* Search Bar in Page Body */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources, mess, exam halls, tools..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : (
              <Ionicons name="search-outline" size={18} color="#64748B" />
            )}
          </View>
        </View>

        {/* Card Section */}
        <View style={styles.content}>
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          )}

          {filteredCards.length > 0 ? (
            <View style={styles.grid}>
              {filteredCards.map((card, index) => (
                <TouchableOpacity
                  key={card.id || index}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => handleCardPress(card)}
                >
                  <View style={styles.cardBody}>
                    <View style={styles.cardIconBox}>
                      <Ionicons name={card.icon || 'apps-outline'} size={20} color="#2563EB" />
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {card.name}
                    </Text>
                    {card.description ? (
                      <Text style={styles.cardDesc} numberOfLines={2}>
                        {card.description}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>
                      {card.btntext || 'Open Tool'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tool found matching "{search}"</Text>
            </View>
          )}
        </View>
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
    paddingBottom: 28,
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerRightBtn: {
    padding: 2,
  },
  searchSection: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#93C5FD',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: '#0F172A',
    paddingRight: 6,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  loadingRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '48.5%',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBody: {
    flex: 1,
    marginBottom: 10,
  },
  cardIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    lineHeight: 18,
  },
  cardDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  cardButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
});
