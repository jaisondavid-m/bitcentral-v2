import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  Linking,
  SafeAreaView,
} from 'react-native';
import { fetchHomeCards } from '../api/axios';

const FALLBACK_CARDS = [
  {
    id: 'faculty-directory',
    name: 'Faculty Directory',
    description: 'Find contact info, cabins, and emails for BIT faculty.',
    btntext: 'Search Faculty',
    icon: 'people',
    route: 'FacultyDirectory',
  },
  {
    id: 'mess-menu',
    name: 'Mess Menu',
    description: 'Check daily food menus for boys and girls hostel mess.',
    btntext: 'View Menu',
    icon: 'restaurant',
    route: 'MessMenu',
  },
  {
    id: 'wifi-details',
    name: 'Wi-Fi Portal & Details',
    description: 'Quick credentials, setup guide, and login portal for campus Wi-Fi.',
    btntext: 'Connect Wi-Fi',
    icon: 'wifi',
    route: 'WifiDetails',
  },
  {
    id: 'bitbot-ai',
    name: 'BitBot AI Assistant',
    description: 'Ask questions about courses, campus, and schedules.',
    btntext: 'Chat with AI',
    icon: 'chatbubbles',
    route: 'BitBot',
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
    if (card.route) {
      navigation.navigate(card.route);
    } else if (card.link) {
      Linking.openURL(card.link).catch(() => {});
    } else {
      navigation.navigate('Features');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BIT Central</Text>
          <Text style={styles.headerSubtitle}>Student Hub & Resource Portal</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tools, notes, faculty..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Card Section */}
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Resources</Text>
            {loading && <ActivityIndicator size="small" color="#2563EB" />}
          </View>

          {filteredCards.length > 0 ? (
            <View style={styles.grid}>
              {filteredCards.map((card, index) => (
                <View key={card.id || index} style={styles.card}>
                  {card.img ? (
                    <Image source={{ uri: card.img }} style={styles.cardImage} />
                  ) : null}
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{card.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      {card.description}
                    </Text>
                    <TouchableOpacity
                      style={styles.cardButton}
                      onPress={() => handleCardPress(card)}
                    >
                      <Text style={styles.cardButtonText}>
                        {card.btntext || 'Open Tool'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchInput: {
    height: 44,
    fontSize: 14,
    color: '#1E293B',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
  },
  cardBody: {
    padding: 12,
    justifyContent: 'space-between',
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 16,
  },
  cardButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
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
