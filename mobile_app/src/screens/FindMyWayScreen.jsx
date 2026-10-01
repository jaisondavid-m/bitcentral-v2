import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';
import { CAMPUS_LOCATIONS } from '../data/campusLocations';

export default function FindMyWayScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');

  const groups = ['All', 'Academic', 'Facilities', 'Dining', 'Hostels', 'Transit'];

  const filteredLocations = CAMPUS_LOCATIONS.filter((loc) => {
    if (loc.id === 'all') return false;
    if (activeGroup !== 'All' && loc.group !== activeGroup) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return loc.name.toLowerCase().includes(q) || (loc.group && loc.group.toLowerCase().includes(q));
  });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Find My Way"
        subtitle="Campus Navigation, Buildings & Facilities"
        navigation={navigation}
        showBack={true}
      />

      {/* Search Header */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search blocks, auditoriums, hostels, food courts..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>
          {groups.map((grp) => (
            <TouchableOpacity
              key={grp}
              style={[styles.groupChip, activeGroup === grp && styles.groupChipActive]}
              onPress={() => setActiveGroup(grp)}
            >
              <Text style={[styles.groupChipText, activeGroup === grp && styles.groupChipTextActive]}>
                {grp}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {activeGroup === 'All' ? 'All Campus Destinations' : `${activeGroup} Facilities`} ({filteredLocations.length})
        </Text>

        <View style={styles.list}>
          {filteredLocations.map((loc) => (
            <View key={loc.id} style={styles.locCard}>
              <View style={styles.locIconBox}>
                <Ionicons
                  name={
                    loc.group === 'Academic'
                      ? 'school-outline'
                      : loc.group === 'Dining'
                      ? 'restaurant-outline'
                      : loc.group === 'Hostels'
                      ? 'home-outline'
                      : loc.group === 'Transit'
                      ? 'bus-outline'
                      : 'business-outline'
                  }
                  size={22}
                  color="#2563EB"
                />
              </View>
              <View style={styles.locInfo}>
                <Text style={styles.locName}>{loc.name}</Text>
                <Text style={styles.locGroup}>{loc.group || 'Campus Zone'}</Text>
              </View>
              <Badge label={loc.group || 'Zone'} variant="neutral" size="small" />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 13,
    color: '#0F172A',
  },
  groupScroll: {
    flexDirection: 'row',
  },
  groupChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  groupChipActive: {
    backgroundColor: '#2563EB',
  },
  groupChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  groupChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  locCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    elevation: 1,
  },
  locIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locInfo: {
    flex: 1,
  },
  locName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  locGroup: {
    fontSize: 12,
    color: '#64748B',
  },
});
