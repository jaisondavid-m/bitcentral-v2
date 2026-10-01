import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '../components/ScreenHeader';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { ITEM_CATEGORIES } from '../data/campusLocations';
import { fetchLostFoundItems } from '../api/axios';
import { useAuth } from '../context/StudentContext';

const SAMPLE_ITEMS = [
  { id: 1, type: 'found', title: 'Blue Boat Airdopes Case with Earbuds', category: 'electronics', location: 'Central Library 1st Floor', created_at: '2 hrs ago', status: 'active', custody: 'with_finder', reporter_name: 'Praveen K' },
  { id: 2, type: 'lost', title: 'BIT Student ID Card (7376241CS101)', category: 'id_card', location: 'Main Food Court Table 12', created_at: '5 hrs ago', status: 'active', custody: 'with_finder', reporter_name: 'Kavitha M' },
  { id: 3, type: 'found', title: 'Black Hercules Cycle Key with Keychain', category: 'keys_cycles', location: 'Boys Hostel 3 Parking', created_at: 'Yesterday', status: 'active', custody: 'main_security_gate', reporter_name: 'Campus Security' },
  { id: 4, type: 'lost', title: 'Physics Lab Observation Note (22PH202)', category: 'documents', location: 'SF Block Ground Floor', created_at: '2 days ago', status: 'claimed', custody: 'with_finder', reporter_name: 'Rahul S' },
];

export default function LostAndFoundScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'lost' | 'found'
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(SAMPLE_ITEMS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [itemType, setItemType] = useState('lost');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory] = useState('electronics');
  const [formLocation, setFormLocation] = useState('Central Library & Digital Zone');
  const [formContact, setFormContact] = useState('');

  const loadItems = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (activeTab !== 'all') params.type = activeTab;
    if (selectedCat !== 'all') params.category = selectedCat;

    const res = await fetchLostFoundItems(params);
    if (res && res.items && res.items.length > 0) {
      setItems(res.items);
    } else {
      setItems(SAMPLE_ITEMS);
    }
    setLoading(false);
    setRefreshing(false);
  }, [activeTab, selectedCat]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const onRefresh = () => {
    setRefreshing(true);
    loadItems();
  };

  const handleCreateItem = async () => {
    if (!formTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter an item title and description');
      return;
    }

    const newItem = {
      type: itemType,
      title: formTitle.trim(),
      category: formCategory,
      location: formLocation,
      contact_info: formContact.trim() || user?.email || '',
      status: 'active',
      reporter_name: user?.display_name || user?.displayName || 'Student',
      created_at: 'Just now',
      id: Date.now(),
    };

    setItems([newItem, ...items]);
    setModalVisible(false);
    setFormTitle('');
    setFormContact('');
    Alert.alert('Success', `Your ${itemType} item report has been published to the campus board.`);
  };

  const filteredItems = items.filter((item) => {
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Campus Lost & Found"
        subtitle="Report & Recover Belongings on Campus"
        navigation={navigation}
        showBack={true}
        rightIcon="add-circle"
        onRightPress={() => setModalVisible(true)}
      />

      {/* Type Switcher */}
      <View style={styles.typeBar}>
        {[
          { key: 'all', label: 'All Items' },
          { key: 'lost', label: 'Lost Items' },
          { key: 'found', label: 'Found Items' },
        ].map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.typeBtn, activeTab === t.key && styles.typeBtnActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.typeBtnText, activeTab === t.key && styles.typeBtnTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search & Categories Horizontal Scroll */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items by keyword or location..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {ITEM_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, selectedCat === cat.id && styles.catChipActive]}
              onPress={() => setSelectedCat(cat.id)}
            >
              <Text style={[styles.catChipText, selectedCat === cat.id && styles.catChipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 30 }} />
        ) : filteredItems.length > 0 ? (
          <View style={styles.list}>
            {filteredItems.map((item) => {
              const isFound = item.type === 'found';
              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.cardHeader}>
                    <Badge
                      label={isFound ? 'FOUND ITEM' : 'LOST ITEM'}
                      variant={isFound ? 'success' : 'danger'}
                      size="small"
                    />
                    <Text style={styles.timeText}>{item.created_at}</Text>
                  </View>

                  <Text style={styles.itemTitle}>{item.title}</Text>

                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text style={styles.metaText}>{item.location}</Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.reporterInfo}>
                      <Ionicons name="person-outline" size={14} color="#64748B" />
                      <Text style={styles.reporterText}>By {item.reporter_name || 'Student'}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.claimButton}
                      onPress={() =>
                        Alert.alert(
                          'Item Contact Info',
                          `Reported by: ${item.reporter_name || 'Student'}\nLocation: ${item.location}\nCustody: ${item.custody || 'With Finder'}`
                        )
                      }
                    >
                      <Text style={styles.claimButtonText}>
                        {isFound ? 'Claim Item' : 'I Found This'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <EmptyState
            icon="search-outline"
            title="No Items Found"
            description="No lost or found items match your current filter criteria."
          />
        )}
      </ScrollView>

      {/* Report Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Lost or Found Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.formTypeRow}>
              <TouchableOpacity
                style={[styles.formTypeBtn, itemType === 'lost' && styles.formTypeBtnActive]}
                onPress={() => setItemType('lost')}
              >
                <Text style={[styles.formTypeText, itemType === 'lost' && styles.formTypeTextActive]}>
                  I Lost An Item
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formTypeBtn, itemType === 'found' && styles.formTypeBtnActive]}
                onPress={() => setItemType('found')}
              >
                <Text style={[styles.formTypeText, itemType === 'found' && styles.formTypeTextActive]}>
                  I Found An Item
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Item Name & Description</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g., Black HP Laptop Charger, Blue ID Card..."
              placeholderTextColor="#94A3B8"
              value={formTitle}
              onChangeText={setFormTitle}
            />

            <Text style={styles.fieldLabel}>Campus Location</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g., Central Library, Food Court, SF Block..."
              placeholderTextColor="#94A3B8"
              value={formLocation}
              onChangeText={setFormLocation}
            />

            <Text style={styles.fieldLabel}>Contact Phone / Email (Optional)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g., 98437XXXXX or student@bitsathy.ac.in"
              placeholderTextColor="#94A3B8"
              value={formContact}
              onChangeText={setFormContact}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreateItem}>
              <Text style={styles.submitBtnText}>Publish Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  typeBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeBtnActive: {
    backgroundColor: '#EFF6FF',
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  typeBtnTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 13,
    color: '#0F172A',
  },
  catScroll: {
    flexDirection: 'row',
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: '#2563EB',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  list: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reporterText: {
    fontSize: 12,
    color: '#64748B',
  },
  claimButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  claimButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  formTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  formTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  formTypeBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  formTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  formTypeTextActive: {
    color: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
