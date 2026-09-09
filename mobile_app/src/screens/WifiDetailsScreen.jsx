import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

export default function WifiDetailsScreen({ navigation }) {
  const handleOpenPortal = () => {
    Linking.openURL('http://192.168.1.1:8080').catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Wi-Fi Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>BIT Student Wi-Fi Setup</Text>
          <Text style={styles.cardBody}>
            SSID: <Text style={styles.bold}>BIT-Student</Text>
            {'\n'}Security: <Text style={styles.bold}>WPA2-Enterprise / PEAP</Text>
            {'\n'}Domain: <Text style={styles.bold}>bitsathy.ac.in</Text>
            {'\n'}Identity: Your Roll Number (e.g. 211CS101)
          </Text>
        </View>

        <TouchableOpacity style={styles.portalButton} onPress={handleOpenPortal}>
          <Text style={styles.portalButtonText}>Open Wi-Fi Login Portal</Text>
        </TouchableOpacity>
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
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  cardBody: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 24,
  },
  bold: {
    fontWeight: '700',
    color: '#2563EB',
  },
  portalButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  portalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
