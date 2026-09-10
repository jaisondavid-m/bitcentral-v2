import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  RefreshControl,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchMessMenu } from '../api/axios';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner'];

const MEAL_META = {
  breakfast: { label: 'Breakfast', icon: '☀️', time: '7:00 – 8:30 AM' },
  lunch: { label: 'Lunch', icon: '🌤️', time: '12:20 – 1:30 PM' },
  dinner: { label: 'Dinner', icon: '🌙', time: '7:00 – 8:30 PM' },
};

const HOSTEL_TABS = [
  { key: 'boys', label: 'Boys Hostel' },
  { key: 'girls', label: 'Girls Hostel' },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function todayIST() {
  const d = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + istOffset);

  const yyyy = istDate.getFullYear();
  const mm = String(istDate.getMonth() + 1).padStart(2, '0');
  const dd = String(istDate.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(+y, +m - 1, +d);
  return dateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getShiftedDate(dateStr, days) {
  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(+y, +m - 1, +d);
  dateObj.setDate(dateObj.getDate() + days);
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const FALLBACK_MENU = {
  boys: {
    breakfast: ['Idli', 'Sambar', 'Coconut Chutney', 'Tea / Coffee'],
    lunch: ['Rice', 'Sambar', 'Poriyal', 'Appalam', 'Curd', 'Rasam'],
    dinner: ['Chapati', 'Kurma', 'Variety Rice', 'Milk'],
  },
  girls: {
    breakfast: ['Dosa', 'Tomato Chutney', 'Sambar', 'Tea / Coffee'],
    lunch: ['Variety Rice / Meals', 'Poriyal', 'Kootu', 'Curd'],
    dinner: ['Phulka', 'Chana Masala', 'Curd Rice', 'Milk'],
  },
};

export default function MessMenuScreen({ navigation }) {
  const [hostel, setHostel] = useState('boys');
  const [activeTab, setActiveTab] = useState('breakfast');
  const [selectedDate, setSelectedDate] = useState(todayIST);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => {
    const [y] = selectedDate.split('-');
    return parseInt(y, 10);
  });
  const [pickerMonth, setPickerMonth] = useState(() => {
    const [, m] = selectedDate.split('-');
    return parseInt(m, 10) - 1;
  });

  const [menu, setMenu] = useState({});
  const [dayLabel, setDayLabel] = useState('');
  const [isDefaultMenu, setIsDefaultMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadMenu = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const data = await fetchMessMenu(hostel, selectedDate);
      if (data && data.full_menu) {
        setMenu(data.full_menu || {});
        setDayLabel(data.day || '');
        setIsDefaultMenu(Boolean(data.default_menu));

        const activeMeal = data?.current_meal?.meal_type?.toLowerCase?.();
        if (activeMeal && MEAL_ORDER.includes(activeMeal)) {
          setActiveTab(activeMeal);
        }
      } else {
        setMenu(FALLBACK_MENU[hostel] || {});
        setDayLabel('');
        setIsDefaultMenu(false);
      }
    } catch (err) {
      console.error('Error fetching mess menu:', err);
      setError('Unable to load menu for the selected date.');
      setMenu(FALLBACK_MENU[hostel] || {});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hostel, selectedDate]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const isToday = selectedDate === todayIST();

  const selectedItems = useMemo(() => {
    const items = menu?.[activeTab] ?? [];
    if (typeof items === 'string') {
      return items.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return Array.isArray(items) ? items : [];
  }, [menu, activeTab]);

  const activeMeta = MEAL_META[activeTab] || { label: activeTab, icon: '🍽️', time: '' };

  const handlePrevDay = () => {
    setSelectedDate((curr) => getShiftedDate(curr, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((curr) => getShiftedDate(curr, 1));
  };

  const handleResetToday = () => {
    setSelectedDate(todayIST());
    const [y, m] = todayIST().split('-');
    setPickerYear(parseInt(y, 10));
    setPickerMonth(parseInt(m, 10) - 1);
  };

  const handleOpenPicker = () => {
    const [y, m] = selectedDate.split('-');
    setPickerYear(parseInt(y, 10));
    setPickerMonth(parseInt(m, 10) - 1);
    setShowDatePicker(true);
  };

  const handlePickerPrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear((y) => y - 1);
    } else {
      setPickerMonth((m) => m - 1);
    }
  };

  const handlePickerNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear((y) => y + 1);
    } else {
      setPickerMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day) => {
    const yyyy = pickerYear;
    const mm = String(pickerMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const newDate = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [pickerYear, pickerMonth]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" translucent={true} />
      
      {/* Top Navbar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Mess Menu</Text>
        </View>
        <TouchableOpacity onPress={() => loadMenu(true)} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadMenu(true)} colors={['#2563EB']} />
        }
      >
        {/* Top Card Container: Date & Hostels & Meal Tabs */}
        <View style={styles.controlCard}>
          {/* Header Title & Default Tag */}
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Daily Menu</Text>
              {dayLabel ? <Text style={styles.dayLabelText}>{dayLabel}</Text> : null}
            </View>

            {isDefaultMenu && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT MENU</Text>
              </View>
            )}
          </View>

          {/* Date Selector Row */}
          <View style={styles.dateSelectorContainer}>
            <TouchableOpacity onPress={handlePrevDay} style={styles.dateNavBtn}>
              <Ionicons name="chevron-back" size={18} color="#2563EB" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOpenPicker} style={styles.dateDisplay} activeOpacity={0.7}>
              <Ionicons name="calendar-outline" size={16} color="#2563EB" style={styles.calendarIcon} />
              <Text style={styles.dateText}>{formatDateDisplay(selectedDate)}</Text>
              <Ionicons name="chevron-down" size={14} color="#64748B" style={styles.dateChevron} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNextDay} style={styles.dateNavBtn}>
              <Ionicons name="chevron-forward" size={18} color="#2563EB" />
            </TouchableOpacity>

            {!isToday && (
              <TouchableOpacity onPress={handleResetToday} style={styles.todayBtn}>
                <Text style={styles.todayBtnText}>Today</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Hostel Segment Selector */}
          <View style={styles.hostelSegment}>
            {HOSTEL_TABS.map((tabItem) => {
              const isActive = hostel === tabItem.key;
              return (
                <TouchableOpacity
                  key={tabItem.key}
                  onPress={() => setHostel(tabItem.key)}
                  style={[styles.hostelTab, isActive && styles.hostelTabActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.hostelTabText, isActive && styles.hostelTabTextActive]}>
                    {tabItem.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Meal Tabs Row */}
          <View style={styles.mealSegment}>
            {MEAL_ORDER.map((mealKey) => {
              const meta = MEAL_META[mealKey];
              const isActive = activeTab === mealKey;
              return (
                <TouchableOpacity
                  key={mealKey}
                  onPress={() => setActiveTab(mealKey)}
                  style={[styles.mealTab, isActive && styles.mealTabActive]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.mealTabIcon}>{meta.icon}</Text>
                  <Text style={[styles.mealTabText, isActive && styles.mealTabTextActive]}>
                    {meta.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Content Section */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Fetching menu details...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={36} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => loadMenu(false)}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mealCardContainer}>
            {/* Default Menu Template Notice */}
            {isDefaultMenu && (
              <View style={styles.amberBanner}>
                <Ionicons name="information-circle-outline" size={18} color="#B45309" style={styles.amberIcon} />
                <Text style={styles.amberBannerText}>
                  Default menu is displayed because the original data has not been updated.
                </Text>
              </View>
            )}

            {/* Meal Header */}
            <View style={styles.mealCardHeader}>
              <View style={styles.mealHeaderLeft}>
                <Text style={styles.mealHeaderIcon}>{activeMeta.icon}</Text>
                <View>
                  <Text style={styles.mealHeaderTitle}>{activeMeta.label}</Text>
                  <Text style={styles.mealHeaderTime}>{activeMeta.time}</Text>
                </View>
              </View>

              <View style={styles.itemCountBadge}>
                <Text style={styles.itemCountText}>
                  {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
                </Text>
              </View>
            </View>

            {/* Items List */}
            <View style={styles.itemsListBody}>
              {selectedItems.length > 0 ? (
                selectedItems.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemIndexCircle}>
                      <Text style={styles.itemIndexText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.itemNameText}>{item}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🍽️</Text>
                  <Text style={styles.emptyText}>No items available for this meal</Text>
                </View>
              )}
            </View>

            {selectedItems.length > 0 && (
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>
                  Total {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Menu Date</Text>
                <Text style={styles.modalSubTitle}>{formatDateDisplay(selectedDate)}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Month Year Navigation Bar */}
            <View style={styles.monthNavRow}>
              <TouchableOpacity onPress={handlePickerPrevMonth} style={styles.monthNavBtn}>
                <Ionicons name="chevron-back" size={20} color="#2563EB" />
              </TouchableOpacity>
              <Text style={styles.monthTitleText}>
                {MONTH_NAMES[pickerMonth]} {pickerYear}
              </Text>
              <TouchableOpacity onPress={handlePickerNextMonth} style={styles.monthNavBtn}>
                <Ionicons name="chevron-forward" size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>

            {/* Weekday Labels Header */}
            <View style={styles.weekdaysRow}>
              {WEEKDAYS.map((wd) => (
                <Text key={wd} style={styles.weekdayText}>
                  {wd}
                </Text>
              ))}
            </View>

            {/* Calendar Days Grid */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <View key={`empty-${idx}`} style={styles.dayCellEmpty} />;
                }

                const dayStr = `${pickerYear}-${String(pickerMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = dayStr === selectedDate;
                const isTodayDay = dayStr === todayIST();

                return (
                  <TouchableOpacity
                    key={`day-${day}`}
                    onPress={() => handleSelectDay(day)}
                    style={[
                      styles.dayCell,
                      isTodayDay && styles.dayCellToday,
                      isSelected && styles.dayCellSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isTodayDay && styles.dayTextToday,
                        isSelected && styles.dayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Modal Actions Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => {
                  handleResetToday();
                  setShowDatePicker(false);
                }}
                style={styles.modalTodayBtn}
              >
                <Text style={styles.modalTodayBtnText}>Select Today</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingBottom: 14,
    backgroundColor: '#2563EB',
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  refreshButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  controlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  dayLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  dateSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateNavBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dateDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  calendarIcon: {
    marginRight: 6,
  },
  dateChevron: {
    marginLeft: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  todayBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6,
  },
  todayBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hostelSegment: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  hostelTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  hostelTabActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  hostelTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  hostelTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mealSegment: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  mealTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 4,
  },
  mealTabActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  mealTabIcon: {
    fontSize: 14,
  },
  mealTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  mealTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  mealCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#93C5FD',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  amberBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  amberIcon: {
    marginRight: 6,
  },
  amberBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    lineHeight: 16,
  },
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mealHeaderIcon: {
    fontSize: 24,
  },
  mealHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mealHeaderTime: {
    fontSize: 12,
    color: '#DBEAFE',
    marginTop: 1,
  },
  itemCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  itemCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemsListBody: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  itemIndexCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIndexText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  itemNameText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cardFooterText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },

  /* Date Picker Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  monthNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  monthNavBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  monthTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    width: 38,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayCellEmpty: {
    width: '14.28%',
    height: 38,
  },
  dayCell: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    marginVertical: 2,
  },
  dayCellToday: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  dayCellSelected: {
    backgroundColor: '#2563EB',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  dayTextToday: {
    color: '#2563EB',
    fontWeight: '700',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
  },
  modalTodayBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  modalTodayBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});


