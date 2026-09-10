import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchMessMenu } from '../api/axios';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const FALLBACK_MENU = {
  Boys: {
    Breakfast: 'Idli, Sambar, Coconut Chutney, Tea / Coffee',
    Lunch: 'Rice, Sambar, Poriyal, Appalam, Curd, Rasam',
    Snacks: 'Samosa / Sundal, Tea',
    Dinner: 'Chapati, Kurma, Variety Rice, Milk',
  },
  Girls: {
    Breakfast: 'Dosa, Tomato Chutney, Sambar, Tea / Coffee',
    Lunch: 'Variety Rice / Meals, Poriyal, Kootu, Curd',
    Snacks: 'Biscuits / Cake, Tea',
    Dinner: 'Phulka, Chana Masala, Curd Rice, Milk',
  },
};

export default function MessMenuScreen({ navigation }) {
  const [tab, setTab] = useState('Boys');
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    const backendData = await fetchMessMenu(tab.toLowerCase());
    if (backendData && backendData.full_menu) {
      setMenuData(backendData.full_menu);
    } else {
      setMenuData(FALLBACK_MENU[tab]);
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const displayMenu = menuData || FALLBACK_MENU[tab];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" translucent={true} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Ionicons name="star" size={20} color="#FFFFFF" style={styles.starIcon} />
          <Text style={styles.headerTitle}>BIT-CENTRAL</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'Boys' && styles.activeTab]}
          onPress={() => setTab('Boys')}
        >
          <Text style={[styles.tabText, tab === 'Boys' && styles.activeTabText]}>Boys Hostel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'Girls' && styles.activeTab]}
          onPress={() => setTab('Girls')}
        >
          <Text style={[styles.tabText, tab === 'Girls' && styles.activeTabText]}>Girls Hostel</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={styles.loadingIndicator} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {Object.entries(displayMenu).map(([meal, items]) => (
            <View key={meal} style={styles.mealCard}>
              <Text style={styles.mealHeader}>{meal.toUpperCase()}</Text>
              <Text style={styles.mealItems}>
                {typeof items === 'string'
                  ? items
                  : Array.isArray(items)
                  ? items.join(', ')
                  : JSON.stringify(items)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 6,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  loadingIndicator: {
    marginTop: 40,
  },
  content: {
    padding: 16,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mealHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 6,
  },
  mealItems: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
});
