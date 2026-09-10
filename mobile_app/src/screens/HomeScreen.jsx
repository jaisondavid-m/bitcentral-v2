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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchHomeCards } from '../api/axios';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const FALLBACK_CARDS = [
  {
    id: 'faculty-directory',
    name: 'Faculty Directory',
    description: 'Find contact info, cabins, and emails for BIT faculty.',
    btntext: 'Search Faculty',
    icon: 'people-outline',
    route: 'FacultyDirectory',
  },
  {
    id: 'mess-menu',
    name: 'Mess Menu',
    description: 'Check daily food menus for boys and girls hostel mess.',
    btntext: 'View Menu',
    icon: 'restaurant-outline',
    route: 'MessMenu',
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
    id: 'wifi-details',
    name: 'Wi-Fi Portal & Details',
    description: 'Quick credentials, setup guide, and login portal for campus Wi-Fi.',
    btntext: 'Connect Wi-Fi',
    icon: 'wifi-outline',
    route: 'WifiDetails',
  },
  {
    id: 'bitcentral-support',
    name: 'BIT-CENTRAL Support',
    description: 'Direct admin line for queries, feedback, and issue reporting.',
    btntext: 'Get Support',
    icon: 'headset-outline',
    route: 'Support',
  },
];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    const apiCards = await fetchHomeCards();
    if (apiCards && apiCards.length > 0) {
      setCards(apiCards);
    } else {
      setCards(FALLBACK_CARDS);
    }
    setLoading(false);
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
      if (routeLower === 'support' || routeLower.includes('help') || routeLower === 'bitbot' || routeLower.includes('bot')) {
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
      if (linkLower.includes('/mess')) {
        navigation.navigate('MessMenu');
        return;
      }
      if (linkLower.includes('/faculty')) {
        navigation.navigate('FacultyDirectory');
        return;
      }
      if (linkLower.includes('/rpsite') || linkLower.includes('/reward')) {
        navigation.navigate('RpSite');
        return;
      }
      if (linkLower.includes('/wifi')) {
        navigation.navigate('WifiDetails');
        return;
      }
      if (linkLower.includes('/support') || linkLower.includes('/feedback') || linkLower.includes('/bitbot') || linkLower.includes('/bot')) {
        navigation.navigate('Support');
        return;
      }
      if (linkLower.includes('/profile')) {
        navigation.navigate('Profile');
        return;
      }

      Linking.openURL(card.link).catch((err) => console.warn('Unable to open URL:', err));
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" translucent={true} />

      {/* Fixed Top Navbar separated from Status Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="star" size={22} color="#FFFFFF" style={styles.starIcon} />
          <Text style={styles.headerTitle}>BIT-CENTRAL</Text>
        </View>
      </View>

      {/* Scrollable Body Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar in Page Body */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            <Ionicons name="mic-outline" size={20} color="#64748B" style={styles.micIcon} />
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
              <Text style={styles.emptyText}>No site or tool found matching "{search}"</Text>
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
    paddingBottom: 24,
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
    fontSize: 14,
    color: '#0F172A',
    paddingRight: 6,
  },
  micIcon: {
    marginLeft: 4,
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
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardBody: {
    flex: 1,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  cardButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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

