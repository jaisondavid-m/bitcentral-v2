import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';

const ANSWER_KEYS = [
  {
    code: '22PH202',
    name: 'Physics for Information Science (22PH202)',
    units: [
      { unit: 'Unit 1: Quantum Physics', questions: ['Schrodinger wave equation derivation', 'Particle in a 1D box model', 'Tunneling effect applications'] },
      { unit: 'Unit 2: Semiconductor Physics', questions: ['Fermi-Dirac distribution & Fermi level', 'Intrinsic vs Extrinsic carrier concentration', 'Hall effect & applications'] },
      { unit: 'Unit 3: Dielectrics & Magnetism', questions: ['Internal field in dielectric materials', 'Clausius-Mosotti relation', 'Hysteresis loop and domain theory'] },
    ],
  },
  {
    code: '22HS006',
    name: 'Heritage of Tamils (22HS006)',
    units: [
      { unit: 'Unit 1: Language and Literature', questions: ['Sangam literature classification (Ettuthokai & Pathupattu)', 'Tholkappiyam grammatical traditions', 'Ancient Tamil script evolution'] },
      { unit: 'Unit 2: Heritage - Art and Sculpture', questions: ['Rock-cut temples of Mahabalipuram', 'Chola bronze sculptures and iconography', 'Dravidian temple architecture'] },
    ],
  },
];

export default function AnswerKeyScreen({ route, navigation }) {
  const { code = '22PH202' } = route.params || {};
  const [selectedKey, setSelectedKey] = useState(
    ANSWER_KEYS.find((k) => k.code === code) || ANSWER_KEYS[0]
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Model Answer Keys"
        subtitle={selectedKey.code}
        navigation={navigation}
        showBack={true}
      />

      {/* Switcher Tab */}
      <View style={styles.tabBar}>
        {ANSWER_KEYS.map((item) => (
          <TouchableOpacity
            key={item.code}
            style={[styles.tabItem, selectedKey.code === item.code && styles.tabItemActive]}
            onPress={() => setSelectedKey(item)}
          >
            <Text style={[styles.tabText, selectedKey.code === item.code && styles.tabTextActive]}>
              {item.code}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Badge label={selectedKey.code} variant="info" size="small" />
          <Text style={styles.courseTitle}>{selectedKey.name}</Text>
          <Text style={styles.courseDesc}>
            Curated model answer summaries and high-probability exam question structures for semester prep.
          </Text>
        </View>

        {selectedKey.units.map((unit, uIdx) => (
          <View key={uIdx} style={styles.unitCard}>
            <Text style={styles.unitTitle}>{unit.unit}</Text>
            <View style={styles.questionList}>
              {unit.questions.map((q, qIdx) => (
                <View key={qIdx} style={styles.questionRow}>
                  <Text style={styles.qNum}>Q{qIdx + 1}.</Text>
                  <Text style={styles.qText}>{q}</Text>
                </View>
              ))}
            </View>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
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
    elevation: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 6,
  },
  courseDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  unitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    elevation: 1,
  },
  unitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  questionList: {
    gap: 8,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  qNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    width: 26,
  },
  qText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
});
