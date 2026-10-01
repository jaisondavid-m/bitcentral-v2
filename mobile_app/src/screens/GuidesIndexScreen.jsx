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
import { GUIDES_DATA, GUIDE_CATEGORIES } from '../content/guidesData';

export default function GuidesIndexScreen({ navigation }) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const filteredGuides = GUIDES_DATA.filter((guide) => {
    if (selectedCat !== 'All' && guide.category !== selectedCat) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      guide.title.toLowerCase().includes(q) ||
      guide.shortDescription.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Campus Guides"
        subtitle="Handbook, Academics, Mess & Onboarding"
        navigation={navigation}
        showBack={true}
      />

      {/* Search Header */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search guides on exams, mess, campus..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {GUIDE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, selectedCat === cat && styles.catChipActive]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text style={[styles.catChipText, selectedCat === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {selectedCat === 'All' ? 'All Knowledge Guides' : `${selectedCat} Guides`} ({filteredGuides.length})
        </Text>

        <View style={styles.list}>
          {filteredGuides.map((guide) => (
            <TouchableOpacity
              key={guide.slug}
              style={styles.guideCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('GuideDetail', { slug: guide.slug })}
            >
              <View style={styles.guideTop}>
                <Badge label={guide.category} variant="info" size="small" />
                <View style={styles.readTimeRow}>
                  <Ionicons name="time-outline" size={12} color="#64748B" />
                  <Text style={styles.readTimeText}>{guide.readTime}</Text>
                </View>
              </View>

              <Text style={styles.guideTitle}>{guide.title}</Text>
              <Text style={styles.guideDesc} numberOfLines={3}>{guide.shortDescription}</Text>

              <View style={styles.guideFooter}>
                <Text style={styles.updatedText}>Updated {guide.lastUpdated}</Text>
                <View style={styles.readMoreRow}>
                  <Text style={styles.readMoreText}>Read Guide</Text>
                  <Ionicons name="arrow-forward" size={14} color="#2563EB" />
                </View>
              </View>
            </TouchableOpacity>
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
  catScroll: {
    flexDirection: 'row',
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: '#2563EB',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  catChipTextActive: {
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
    gap: 12,
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  guideTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 11,
    color: '#64748B',
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 20,
  },
  guideDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 12,
  },
  guideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  updatedText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});
