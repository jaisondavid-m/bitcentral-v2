import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import { developerProfile } from '../content/publicContent';

export default function DeveloperScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="About Developer"
        subtitle="Creator Profile & Portfolio"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.devHeaderCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="code-slash" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.devName}>{developerProfile.name}</Text>
          <Text style={styles.devRole}>{developerProfile.role}</Text>
          <Text style={styles.devInst}>{developerProfile.institution}</Text>
        </View>

        <Text style={styles.sectionTitle}>About the Project</Text>
        <View style={styles.infoCard}>
          <Text style={styles.descText}>{developerProfile.description}</Text>
        </View>

        <Text style={styles.sectionTitle}>Connect & Portfolio</Text>
        <View style={styles.linksCard}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL('https://github.com/jaisondavid-m')}
          >
            <Ionicons name="logo-github" size={20} color="#0F172A" style={styles.linkIcon} />
            <Text style={styles.linkTitle}>GitHub Profile</Text>
            <Ionicons name="open-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/jaison-david-m-a14072360/')}
          >
            <Ionicons name="logo-linkedin" size={20} color="#2563EB" style={styles.linkIcon} />
            <Text style={styles.linkTitle}>LinkedIn Profile</Text>
            <Ionicons name="open-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkRow, { borderBottomWidth: 0 }]}
            onPress={() => Linking.openURL('https://herostack.netlify.app/')}
          >
            <Ionicons name="globe-outline" size={20} color="#059669" style={styles.linkIcon} />
            <Text style={styles.linkTitle}>Developer Website</Text>
            <Ionicons name="open-outline" size={18} color="#94A3B8" />
          </TouchableOpacity>
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
  devHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 2,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  devName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  devRole: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  devInst: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  descText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  linksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  linkIcon: {
    marginRight: 12,
  },
  linkTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
});
