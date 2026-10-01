import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ScreenHeader from '../components/ScreenHeader';

export default function LegalScreen({ route, navigation }) {
  const { type = 'privacy' } = route.params || {};

  const getContent = () => {
    switch (type) {
      case 'terms':
        return {
          title: 'Terms of Service',
          subtitle: 'Rules, Guidelines & Conditions',
          lastUpdated: 'September 2026',
          sections: [
            {
              heading: '1. Acceptance of Terms',
              text: 'By accessing or using BIT-CENTRAL mobile application, you agree to be bound by these Terms of Service. If you do not agree to all terms, please discontinue using the application.',
            },
            {
              heading: '2. User Authentication & Accounts',
              text: 'Access to student features requires valid authentication using an official Bannari Amman Institute of Technology institutional Google account (@bitsathy.ac.in). You are responsible for maintaining the confidentiality of your credentials.',
            },
            {
              heading: '3. Acceptable Use Policy',
              text: 'You agree not to misuse platform services, submit fraudulent lost & found claims, attempt unauthorized API access, or scrape private student information.',
            },
            {
              heading: '4. Non-Official Platform Disclaimer',
              text: 'BIT-CENTRAL is an independent student platform built for academic convenience. For all official marks, examination dates, and administrative policies, the official Controller of Examinations and college authorities remain the sole authoritative source.',
            },
          ],
        };
      case 'disclaimer':
        return {
          title: 'Platform Disclaimer',
          subtitle: 'Institutional & Legal Disclosures',
          lastUpdated: 'September 2026',
          sections: [
            {
              heading: '1. Independent Student Project',
              text: 'BIT-CENTRAL is developed and maintained independently to assist students of Bannari Amman Institute of Technology. It is not an official release from the institute administration.',
            },
            {
              heading: '2. Information Accuracy',
              text: 'While we strive to keep academic question banks, mess menus, and schedules up to date, information may change without prior notice. Always verify critical schedules against official COE notices.',
            },
            {
              heading: '3. External Links',
              text: 'The application contains links to external portals and resources. We do not control or assume responsibility for content on third-party websites.',
            },
          ],
        };
      case 'privacy':
      default:
        return {
          title: 'Privacy Policy',
          subtitle: 'How Your Data is Handled',
          lastUpdated: 'September 2026',
          sections: [
            {
              heading: '1. Information We Collect',
              text: 'When you authenticate using your BIT Sathy Google account, we collect your name, email address, roll number, and department to personalize your academic dashboard and attendance records.',
            },
            {
              heading: '2. How We Use Your Information',
              text: 'Your information is used strictly to provide access to student services, exam hall arrangements, lost & found claims, and personalized academic analytics.',
            },
            {
              heading: '3. Data Security & Storage',
              text: 'We do not sell, rent, or monetize student personal data with external third parties or advertisers. Authentication tokens are securely encrypted and stored on your device.',
            },
            {
              heading: '4. Contact Us',
              text: 'For questions regarding data privacy or account deletion requests, please contact developer@bitsathy.in.',
            },
          ],
        };
    }
  };

  const legal = getContent();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={legal.title}
        subtitle={legal.subtitle}
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <Text style={styles.updatedText}>Last updated: {legal.lastUpdated}</Text>
        </View>

        {legal.sections.map((sec, idx) => (
          <View key={idx} style={styles.sectionCard}>
            <Text style={styles.heading}>{sec.heading}</Text>
            <Text style={styles.body}>{sec.text}</Text>
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
  headerBox: {
    marginBottom: 16,
  },
  updatedText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    elevation: 1,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  body: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
});
