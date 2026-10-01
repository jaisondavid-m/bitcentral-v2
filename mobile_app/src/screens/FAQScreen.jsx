import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import { faqs } from '../content/publicContent';

export default function FAQScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? -1 : idx);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Frequently Asked Questions"
        subtitle="Common Questions & Help"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {faqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={styles.faqCard}
                activeOpacity={0.85}
                onPress={() => toggleExpand(idx)}
              >
                <View style={styles.questionRow}>
                  <Text style={styles.questionText}>{faq.question}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#64748B"
                  />
                </View>
                {isExpanded && (
                  <View style={styles.answerBox}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
  list: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 10,
    lineHeight: 20,
  },
  answerBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  answerText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
});
