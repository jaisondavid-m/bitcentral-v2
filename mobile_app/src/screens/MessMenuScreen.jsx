import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { fetchMessMenu } from '../api/axios';

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

  useEffect(() => {
    loadMenu();
  }, [tab]);

  const loadMenu = async () => {
    setLoading(true);
    const backendData = await fetchMessMenu(tab.toLowerCase());
    if (backendData && backendData.full_menu) {
      setMenuData(backendData.full_menu);
    } else {
      setMenuData(FALLBACK_MENU[tab]);
    }
    setLoading(false);
  };

  const displayMenu = menuData || FALLBACK_MENU[tab];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mess Menu</Text>
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
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
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
    padding: 16,
    backgroundColor: '#1E293B',
  },
  backButton: {
    paddingRight: 12,
  },
  backText: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
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
