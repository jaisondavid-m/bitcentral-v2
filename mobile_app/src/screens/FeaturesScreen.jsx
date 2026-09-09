import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const FEATURES_LIST = [
  { id: '1', title: 'Faculty Directory', desc: 'Find cabin details & faculty contacts', route: 'FacultyDirectory' },
  { id: '2', title: 'Mess Menu', desc: 'Daily hostel mess meal schedules', route: 'MessMenu' },
  { id: '3', title: 'Wi-Fi Details', desc: 'Campus Wi-Fi portal and config', route: 'WifiDetails' },
  { id: '4', title: 'BitBot AI Assistant', desc: 'Instant AI help for student questions', route: 'BitBot' },
  { id: '5', title: 'Exam Hall Locator', desc: 'Locate seating arrangements for exams', route: 'HomeScreen' },
  { id: '6', title: 'Semester Portal', desc: 'View grades and subject details', route: 'HomeScreen' },
  { id: '7', title: 'PCDP', desc: 'Placement & Career Development Portal', route: 'HomeScreen' },
];

export default function FeaturesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Tools</Text>
        <Text style={styles.headerSubtitle}>All BIT Central resources in one place</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {FEATURES_LIST.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  desc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  arrow: {
    fontSize: 22,
    color: '#94A3B8',
    marginLeft: 10,
  },
});
