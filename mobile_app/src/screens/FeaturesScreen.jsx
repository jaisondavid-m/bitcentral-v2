import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import { featureList } from '../content/publicContent';

export default function FeaturesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Platform Features"
        subtitle="Tools & Services Available in BIT Central"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Engineered for Student Productivity</Text>
          <Text style={styles.headerDesc}>
            Explore the comprehensive suite of academic, campus life, and AI tools built into BIT-CENTRAL.
          </Text>
        </View>

        <View style={styles.list}>
          {featureList.map((feature, idx) => (
            <View key={idx} style={styles.featureCard}>
              <View style={styles.iconBox}>
                <Ionicons name={feature.icon} size={24} color="#2563EB" />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSummary}>{feature.summary}</Text>
              </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  headerCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 6,
  },
  headerDesc: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 18,
  },
  list: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  featureSummary: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
});
