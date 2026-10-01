import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';
import { GUIDES_DATA } from '../content/guidesData';

export default function GuideDetailScreen({ route, navigation }) {
  const { slug } = route.params || {};
  const guide = GUIDES_DATA.find((g) => g.slug === slug) || GUIDES_DATA[0];

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Campus Guide"
        subtitle={guide.category}
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Article Header */}
        <View style={styles.headerCard}>
          <Badge label={guide.category} variant="info" size="small" />
          <Text style={styles.title}>{guide.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>{guide.readTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>Updated {guide.lastUpdated}</Text>
            </View>
          </View>
          <Text style={styles.leadText}>{guide.shortDescription}</Text>
        </View>

        {/* Table of Contents */}
        {guide.tableOfContents && guide.tableOfContents.length > 0 && (
          <View style={styles.tocCard}>
            <Text style={styles.tocTitle}>Table of Contents</Text>
            {guide.tableOfContents.map((item, idx) => (
              <View key={item.id || idx} style={styles.tocItem}>
                <Text style={styles.tocNumber}>{idx + 1}.</Text>
                <Text style={styles.tocText}>{item.title}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sections */}
        {guide.sections &&
          guide.sections.map((sec, idx) => (
            <View key={sec.id || idx} style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>{sec.h2}</Text>
              <Text style={styles.sectionBody}>{sec.content}</Text>
            </View>
          ))}
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
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  leadText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  tocCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  tocTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 10,
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  tocNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    width: 20,
  },
  tocText: {
    fontSize: 12,
    color: '#1E293B',
    flex: 1,
    lineHeight: 17,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    elevation: 1,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 21,
  },
});
