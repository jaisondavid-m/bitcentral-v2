import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';

export default function PaymentSuccessfulScreen({ route, navigation }) {
  const { amount = 50, id = 'TXN_' + Date.now().toString().slice(-6) } = route.params || {};

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Payment Successful"
        subtitle="Contribution Confirmation"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.receiptCard}>
          <View style={styles.successIconBox}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
          </View>
          <Text style={styles.thankTitle}>Thank You for Your Support!</Text>
          <Text style={styles.thankDesc}>
            Your contribution directly powers server hosting, domain maintenance, and AI services for the BIT Sathy student community.
          </Text>

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Contribution Amount</Text>
            <Text style={styles.amountValue}>₹{amount}</Text>
            <Badge label="Payment Verified" variant="success" size="small" style={{ marginTop: 6 }} />
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>{new Date().toLocaleDateString('en-GB')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>UPI Transfer</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.doneBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.doneBtnText}>Return to Home</Text>
        </TouchableOpacity>
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
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 2,
  },
  successIconBox: {
    marginBottom: 12,
  },
  thankTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  thankDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  amountBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
  },
  detailsList: {
    width: '100%',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  doneBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
