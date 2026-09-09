import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { fetchFacultyDirectory } from '../api/axios';

export default function FacultyDirectoryScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFaculty = useCallback(async () => {
    setLoading(true);
    const res = await fetchFacultyDirectory(query);
    if (res && res.data) {
      setFaculty(res.data);
    } else {
      // Fallback sample data
      setFaculty([
        { id: 1, name: 'Dr. S. Kumar', department: 'Computer Science', cabin: 'CS-302', email: 'skumar@bitsathy.ac.in' },
        { id: 2, name: 'Prof. R. Priya', department: 'Information Tech', cabin: 'IT-104', email: 'rpriya@bitsathy.ac.in' },
        { id: 3, name: 'Dr. M. Rajesh', department: 'Electronics', cabin: 'EC-201', email: 'mrajesh@bitsathy.ac.in' },
      ]);
    }
    setLoading(false);
  }, [query]);

  useEffect(() => {
    searchFaculty();
  }, [searchFaculty]);


  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Faculty Directory</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search by faculty name or department..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchFaculty}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={faculty}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.dept}>{item.department || 'BIT Faculty'}</Text>
              {item.cabin && <Text style={styles.meta}>Cabin: {item.cabin}</Text>}
              {item.email && (
                <TouchableOpacity onPress={() => handleEmailPress(item.email)}>
                  <Text style={styles.email}>{item.email}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
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
  searchBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  dept: {
    fontSize: 13,
    color: '#2563EB',
    marginTop: 2,
  },
  meta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  email: {
    fontSize: 13,
    color: '#0EA5E9',
    marginTop: 6,
    textDecorationLine: 'underline',
  },
});
