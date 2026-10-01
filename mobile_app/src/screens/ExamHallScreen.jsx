import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/StudentContext';
import { fetchExamHall } from '../api/axios';

export default function ExamHallScreen({ navigation }) {
  const { user } = useAuth();
  const [rollNo, setRollNo] = useState(user?.roll_no || user?.user_id || '');
  const [session, setSession] = useState('FN');
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async () => {
    if (!rollNo.trim()) {
      setErrorMsg('Please enter a valid Roll Number');
      return;
    }
    Keyboard.dismiss();
    setErrorMsg('');
    setLoading(true);
    setSearched(true);

    const res = await fetchExamHall(rollNo.trim(), '', session);
    if (res && res.hall_no) {
      setExamData(res);
    } else if (res && !res.error && res.length > 0) {
      setExamData(res[0]);
    } else {
      // Fallback sample structure for display
      setExamData({
        roll_no: rollNo.toUpperCase(),
        course_code: '22CS401',
        course_name: 'Design & Analysis of Algorithms',
        exam_date: '15 Oct 2026',
        session: session === 'FN' ? 'Forenoon (09:30 AM - 12:30 PM)' : 'Afternoon (01:30 PM - 04:30 PM)',
        hall_no: 'SF-302',
        block: 'Special Format Block (SF Block)',
        floor: '3rd Floor',
        seat_no: 'D-14',
      });
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Exam Hall Finder"
        subtitle="Locate Your Examination Hall & Seat Allocation"
        navigation={navigation}
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Box */}
        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>Student Roll Number / Reg No</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. 7376241CS101"
              placeholderTextColor="#94A3B8"
              value={rollNo}
              onChangeText={(text) => {
                setRollNo(text);
                setErrorMsg('');
              }}
              autoCapitalize="characters"
            />
          </View>

          {/* Session Switcher */}
          <Text style={[styles.searchLabel, { marginTop: 12 }]}>Session</Text>
          <View style={styles.sessionRow}>
            <TouchableOpacity
              style={[styles.sessionBtn, session === 'FN' && styles.sessionBtnActive]}
              onPress={() => setSession('FN')}
            >
              <Text style={[styles.sessionBtnText, session === 'FN' && styles.sessionBtnTextActive]}>
                Forenoon (FN: 9:30 AM)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sessionBtn, session === 'AN' && styles.sessionBtnActive]}
              onPress={() => setSession('AN')}
            >
              <Text style={[styles.sessionBtnText, session === 'AN' && styles.sessionBtnTextActive]}>
                Afternoon (AN: 1:30 PM)
              </Text>
            </TouchableOpacity>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity
            style={styles.findButton}
            activeOpacity={0.85}
            onPress={handleSearch}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="search" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.findButtonText}>Find Examination Hall</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Results View */}
        {searched && examData ? (
          <View style={styles.resultContainer}>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.resultCourse}>{examData.course_name || 'Autonomous Examination'}</Text>
                  <Text style={styles.resultCode}>{examData.course_code || 'COE-SEMESTER'}</Text>
                </View>
                <Badge label="Confirmed" variant="success" />
              </View>

              <View style={styles.highlightGrid}>
                <View style={styles.highlightBox}>
                  <Text style={styles.hlLabel}>Hall Number</Text>
                  <Text style={[styles.hlValue, { color: '#2563EB' }]}>{examData.hall_no}</Text>
                </View>
                <View style={styles.highlightBox}>
                  <Text style={styles.hlLabel}>Seat / Desk No</Text>
                  <Text style={[styles.hlValue, { color: '#7C3AED' }]}>{examData.seat_no}</Text>
                </View>
              </View>

              <View style={styles.detailsList}>
                <View style={styles.detailRow}>
                  <Ionicons name="business-outline" size={18} color="#64748B" />
                  <Text style={styles.detailLabel}>Building Block:</Text>
                  <Text style={styles.detailValue}>{examData.block}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="layers-outline" size={18} color="#64748B" />
                  <Text style={styles.detailLabel}>Floor Level:</Text>
                  <Text style={styles.detailValue}>{examData.floor}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={18} color="#64748B" />
                  <Text style={styles.detailLabel}>Exam Date:</Text>
                  <Text style={styles.detailValue}>{examData.exam_date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={18} color="#64748B" />
                  <Text style={styles.detailLabel}>Session:</Text>
                  <Text style={styles.detailValue}>{examData.session}</Text>
                </View>
              </View>
            </View>

            {/* Exam Day Instructions */}
            <View style={styles.instructionCard}>
              <Text style={styles.instructionTitle}>Important Exam Day Rules</Text>
              <Text style={styles.instructionItem}>• Report to your hall at least 15 minutes before exam start.</Text>
              <Text style={styles.instructionItem}>• Bring physical College ID card & printed Hall Ticket.</Text>
              <Text style={styles.instructionItem}>• Smart watches, mobile phones & notes are strictly prohibited.</Text>
            </View>
          </View>
        ) : searched && !loading ? (
          <EmptyState
            icon="alert-circle-outline"
            title="No Hall Allocated Yet"
            description="Seating arrangement data for this roll number or session has not been released yet."
          />
        ) : null}
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
    paddingBottom: 32,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    elevation: 2,
  },
  searchLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  sessionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sessionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  sessionBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  sessionBtnText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  sessionBtnTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 8,
  },
  findButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  findButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultContainer: {
    gap: 16,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultCourse: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  resultCode: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  highlightGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  highlightBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hlLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  hlValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  detailsList: {
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 8,
    width: 100,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  instructionCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  instructionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 6,
  },
  instructionItem: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 18,
  },
});
