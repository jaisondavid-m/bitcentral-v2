import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/StudentContext';
import {
  searchRpStudents,
  fetchRpRewards,
  fetchRpLeaderboard,
  fetchRpAverages,
  fetchMeProfile,
} from '../api/axios';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

const DEPARTMENTS = [
  { code: '', name: 'All' },
  { code: 'CSE', name: 'CSE' },
  { code: 'IT', name: 'IT' },
  { code: 'AI&DS', name: 'AI & DS' },
  { code: 'AIML', name: 'AI & ML' },
  { code: 'ECE', name: 'ECE' },
  { code: 'EEE', name: 'EEE' },
  { code: 'MECH', name: 'MECH' },
  { code: 'CIVIL', name: 'CIVIL' },
  { code: 'AGRI', name: 'AGRI' },
  { code: 'BT', name: 'BT' },
];

const YEARS = ['', 'I', 'II', 'III', 'IV'];

export default function RpSiteScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'leaderboard' | 'averages'

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- Modal State ---
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rewardsList, setRewardsList] = useState([]);
  const [rewardsPage, setRewardsPage] = useState(1);
  const [rewardsTotal, setRewardsTotal] = useState(0);
  const [rewardsLoading, setRewardsLoading] = useState(false);

  // --- Leaderboard State ---
  const [selectedYear, setSelectedYear] = useState('III');
  const [selectedDept, setSelectedDept] = useState('');
  const [leaderboardList, setLeaderboardList] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  // --- Averages State ---
  const [averages, setAverages] = useState({});
  const [averagesLoading, setAveragesLoading] = useState(false);

  // Load Averages
  const loadAverages = useCallback(async () => {
    setAveragesLoading(true);
    const data = await fetchRpAverages();
    setAverages(data || {});
    setAveragesLoading(false);
  }, []);

  useEffect(() => {
    loadAverages();
  }, [loadAverages]);

  // Perform Student Search
  const performSearch = useCallback(async (queryToUse) => {
    const q = (queryToUse !== undefined ? queryToUse : searchQuery).trim();
    if (!q || q.length < 3) return;

    setSearching(true);
    setHasSearched(true);
    const res = await searchRpStudents(q);
    setStudents(res || []);
    setSearching(false);
  }, [searchQuery]);

  const hasAutoFilledRef = useRef(false);

  // Auto pre-fill student roll number from /me endpoint once on screen mount
  useEffect(() => {
    if (hasAutoFilledRef.current) return;
    hasAutoFilledRef.current = true;

    async function initAutoFill() {
      let rollNoToUse = '';
      try {
        const meData = await fetchMeProfile();
        if (meData?.roll_no) {
          rollNoToUse = meData.roll_no;
        } else if (meData?.user_id) {
          rollNoToUse = meData.user_id;
        }
      } catch (e) {
        console.warn('Failed to fetch /me profile for auto fill:', e);
      }

      if (!rollNoToUse) {
        if (user?.roll_no) rollNoToUse = user.roll_no;
        else if (user?.email) rollNoToUse = user.email.split('@')[0];
      }

      if (rollNoToUse) {
        setSearchQuery(rollNoToUse);
        performSearch(rollNoToUse);
      }
    }

    initAutoFill();
  }, [user, performSearch]);

  // Perform Leaderboard Search
  const loadLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    const yearToFetch = selectedYear || (!selectedDept ? 'III' : '');
    const data = await fetchRpLeaderboard(yearToFetch, selectedDept);
    setLeaderboardList(data || []);
    setLeaderboardLoading(false);
  }, [selectedYear, selectedDept]);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      loadLeaderboard();
    }
  }, [activeTab, loadLeaderboard]);

  const getYearAvg = (yearStr, averagesObj) => {
    if (!yearStr || !averagesObj) return 0;
    const y = String(yearStr).toUpperCase().trim();
    if (y === 'I' || y === '1') return Number(averagesObj.year_1 || 0);
    if (y === 'II' || y === '2') return Number(averagesObj.year_2 || 0);
    if (y === 'III' || y === '3') return Number(averagesObj.year_3 || 0);
    if (y === 'IV' || y === '4') return Number(averagesObj.year_4 || 0);
    return 0;
  };

  const renderAverageDiffBanner = () => {
    if (!selectedStudent) return null;
    const studentYear = selectedStudent.year || selectedStudent.student_year || 'III';
    const yearAvg = getYearAvg(studentYear, averages);
    const studentBalance = Number(selectedStudent.balance_points || selectedStudent.cumulative_reward_points || 0);

    if (!yearAvg) {
      return (
        <View style={[styles.comparisonBanner, styles.neutralBanner]}>
          <Ionicons name="information-circle-outline" size={20} color="#2563EB" style={styles.bannerIcon} />
          <View style={styles.bannerTextCol}>
            <Text style={styles.comparisonLabel}>REWARD POINTS BALANCE</Text>
            <Text style={styles.comparisonText}>{studentBalance} pts total</Text>
          </View>
        </View>
      );
    }

    const diff = studentBalance - yearAvg;
    const isAbove = diff > 0;
    const isBelow = diff < 0;
    const absDiff = Math.abs(diff);

    return (
      <View
        style={[
          styles.comparisonBanner,
          isAbove && styles.aboveBanner,
          isBelow && styles.belowBanner,
          !isAbove && !isBelow && styles.neutralBanner,
        ]}
      >
        <Ionicons
          name={isAbove ? 'arrow-up-circle' : isBelow ? 'arrow-down-circle' : 'remove-circle'}
          size={22}
          color={isAbove ? '#047857' : isBelow ? '#BE123C' : '#1E40AF'}
          style={styles.bannerIcon}
        />
        <View style={styles.bannerTextCol}>
          <Text
            style={[
              styles.comparisonLabel,
              isAbove && styles.aboveLabel,
              isBelow && styles.belowLabel,
            ]}
          >
            {isAbove ? 'ABOVE YEAR AVERAGE' : isBelow ? 'BELOW YEAR AVERAGE' : 'AT YEAR AVERAGE'}
          </Text>
          <Text
            style={[
              styles.comparisonText,
              isAbove && styles.aboveText,
              isBelow && styles.belowText,
            ]}
          >
            {isAbove
              ? `${absDiff} pts above Year ${studentYear} Avg (${yearAvg} pts)`
              : isBelow
              ? `${absDiff} pts below Year ${studentYear} Avg (${yearAvg} pts)`
              : `Exact match with Year ${studentYear} Avg (${yearAvg} pts)`}
          </Text>
        </View>
      </View>
    );
  };

  // Open Rewards Details Modal
  const openRewardsModal = async (student, page = 1) => {
    setSelectedStudent(student);
    setModalVisible(true);
    setRewardsLoading(true);
    setRewardsPage(page);

    const rollNo = student?.roll_no || '';
    const res = await fetchRpRewards(rollNo, page, 10);
    setRewardsList(res?.data || []);
    setRewardsTotal(res?.total || 0);
    setRewardsLoading(false);
  };

  const getRankStyle = (index) => {
    if (index === 0)
      return {
        bg: '#FEF3C7',
        text: '#D97706',
        label: '#1 Gold',
        icon: 'trophy',
        iconColor: '#D97706',
        badgeBg: '#FFFBEB',
        badgeBorder: '#FDE68A',
      };
    if (index === 1)
      return {
        bg: '#F1F5F9',
        text: '#475569',
        label: '#2 Silver',
        icon: 'medal',
        iconColor: '#64748B',
        badgeBg: '#F8FAFC',
        badgeBorder: '#E2E8F0',
      };
    if (index === 2)
      return {
        bg: '#FFEDD5',
        text: '#C2410C',
        label: '#3 Bronze',
        icon: 'medal',
        iconColor: '#EA580C',
        badgeBg: '#FFF7ED',
        badgeBorder: '#FDBA74',
      };
    return { bg: '#F8FAFC', text: '#64748B', label: `#${index + 1}`, icon: null };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" translucent={true} />

      {/* Top Navbar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <Ionicons name="star" size={20} color="#FFFFFF" style={styles.starIcon} />
          <Text style={styles.headerTitle}>BIT-CENTRAL</Text>
        </View>
      </View>

      {/* Segment Navigation Bar */}
      <View style={styles.segmentWrapper}>
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'search' && styles.activeSegmentBtn]}
            onPress={() => setActiveTab('search')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'search' ? 'search' : 'search-outline'}
              size={16}
              color={activeTab === 'search' ? '#FFFFFF' : '#64748B'}
              style={styles.segmentIcon}
            />
            <Text style={[styles.segmentText, activeTab === 'search' && styles.activeSegmentText]}>
              Search RP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'leaderboard' && styles.activeSegmentBtn]}
            onPress={() => setActiveTab('leaderboard')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'leaderboard' ? 'trophy' : 'trophy-outline'}
              size={16}
              color={activeTab === 'leaderboard' ? '#FFFFFF' : '#64748B'}
              style={styles.segmentIcon}
            />
            <Text style={[styles.segmentText, activeTab === 'leaderboard' && styles.activeSegmentText]}>
              Leaderboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'averages' && styles.activeSegmentBtn]}
            onPress={() => setActiveTab('averages')}
            activeOpacity={0.8}
          >
            <Ionicons
              name={activeTab === 'averages' ? 'stats-chart' : 'stats-chart-outline'}
              size={16}
              color={activeTab === 'averages' ? '#FFFFFF' : '#64748B'}
              style={styles.segmentIcon}
            />
            <Text style={[styles.segmentText, activeTab === 'averages' && styles.activeSegmentText]}>
              Averages
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH TAB CONTENT */}
      {activeTab === 'search' && (
        <View style={styles.tabBody}>
          <View style={styles.searchBarBox}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIconLeft} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by student name or roll no..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => performSearch()}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={() => performSearch()} activeOpacity={0.8}>
              <Ionicons name="search" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {searching ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Searching Reward Points...</Text>
            </View>
          ) : students.length > 0 ? (
            <FlatList
              data={students}
              keyExtractor={(item) => item.roll_no || item.user_id}
              contentContainerStyle={styles.listPadding}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.rpCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.nameBlock}>
                      <Text style={styles.studentName}>{item.student_name}</Text>
                      <Text style={styles.rollNo}>{item.roll_no}</Text>
                    </View>
                    {item.tab ? (
                      <View style={styles.tabBadge}>
                        <Text style={styles.tabBadgeText}>{item.tab}</Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.metaRow}>
                    <Ionicons name="school-outline" size={14} color="#64748B" />
                    <Text style={styles.metaText}>
                      Year {item.year || '-'} &bull; {item.department || 'BIT Student'}
                    </Text>
                  </View>
                  {item.mentor_name ? (
                    <View style={styles.metaRow}>
                      <Ionicons name="person-outline" size={14} color="#64748B" />
                      <Text style={styles.metaText}>Mentor: {item.mentor_name}</Text>
                    </View>
                  ) : null}

                  {/* Points Box */}
                  <View style={styles.pointsGrid}>
                    <View style={styles.pointItem}>
                      <Text style={styles.pointLabel}>Earned</Text>
                      <Text style={[styles.pointValue, styles.earnedText]}>
                        {item.cumulative_reward_points || 0}
                      </Text>
                    </View>
                    <View style={[styles.pointItem, styles.borderLeftRight]}>
                      <Text style={styles.pointLabel}>Balance</Text>
                      <Text style={[styles.pointValue, styles.balanceText]}>
                        {item.balance_points || 0}
                      </Text>
                    </View>
                    <View style={styles.pointItem}>
                      <Text style={styles.pointLabel}>Redeemed</Text>
                      <Text style={[styles.pointValue, styles.redeemedText]}>
                        {item.redeemed_points || 0}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => openRewardsModal(item, 1)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.detailBtnText}>View Detailed Points Breakdown</Text>
                    <Ionicons name="chevron-forward" size={16} color="#2563EB" />
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : hasSearched ? (
            <View style={styles.centerBox}>
              <Ionicons name="search-outline" size={44} color="#94A3B8" />
              <Text style={styles.emptyText}>No student found matching "{searchQuery}"</Text>
            </View>
          ) : (
            <View style={styles.centerBox}>
              <Ionicons name="ribbon-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyText}>Enter student name or roll no to search Reward Points</Text>
            </View>
          )}
        </View>
      )}

      {/* LEADERBOARD TAB CONTENT */}
      {activeTab === 'leaderboard' && (
        <View style={styles.tabBody}>
          {/* Year Filter Chips */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeaderRow}>
              <Ionicons name="filter-outline" size={14} color="#64748B" />
              <Text style={styles.filterTitle}>SELECT YEAR</Text>
            </View>
            <View style={styles.chipRow}>
              {YEARS.map((y) => (
                <TouchableOpacity
                  key={y || 'all'}
                  style={[styles.chip, selectedYear === y && styles.activeChip]}
                  onPress={() => setSelectedYear(y)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selectedYear === y && styles.activeChipText]}>
                    {y ? `Year ${y}` : 'All Years'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Department Horizontal Selector */}
          <View style={styles.deptSection}>
            <View style={styles.filterHeaderRow}>
              <Ionicons name="business-outline" size={14} color="#64748B" />
              <Text style={styles.filterTitle}>DEPARTMENT</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll}>
              {DEPARTMENTS.map((d) => (
                <TouchableOpacity
                  key={d.code || 'all'}
                  style={[styles.deptChip, selectedDept === d.code && styles.activeDeptChip]}
                  onPress={() => setSelectedDept(d.code)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.deptChipText, selectedDept === d.code && styles.activeDeptChipText]}>
                    {d.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {leaderboardLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Fetching Top Students...</Text>
            </View>
          ) : leaderboardList.length > 0 ? (
            <FlatList
              data={leaderboardList}
              keyExtractor={(item, index) => item.roll_no || index.toString()}
              contentContainerStyle={styles.listPadding}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const rankInfo = getRankStyle(index);
                return (
                  <TouchableOpacity
                    style={[
                      styles.leaderboardCard,
                      index < 3 && { backgroundColor: rankInfo.badgeBg, borderColor: rankInfo.badgeBorder },
                    ]}
                    onPress={() => openRewardsModal(item, 1)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.rankBadge, { backgroundColor: rankInfo.bg }]}>
                      {rankInfo.icon ? (
                        <Ionicons name={rankInfo.icon} size={15} color={rankInfo.iconColor} />
                      ) : (
                        <Text style={[styles.rankText, { color: rankInfo.text }]}>{index + 1}</Text>
                      )}
                    </View>

                    <View style={styles.lbInfo}>
                      <Text style={styles.lbName}>{item.student_name}</Text>
                      <Text style={styles.lbSub}>
                        {item.roll_no} &bull; {item.department || 'BIT'}
                      </Text>
                    </View>

                    <View style={styles.lbPointsBox}>
                      <Text style={styles.lbPointsValue}>{item.balance_points || 0}</Text>
                      <Text style={styles.lbPointsLabel}>PTS</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View style={styles.centerBox}>
              <Ionicons name="trophy-outline" size={44} color="#94A3B8" />
              <Text style={styles.emptyText}>No records found for selected filter</Text>
            </View>
          )}
        </View>
      )}

      {/* AVERAGES TAB CONTENT */}
      {activeTab === 'averages' && (
        <ScrollView contentContainerStyle={styles.averagesPadding} showsVerticalScrollIndicator={false}>
          <View style={styles.averagesHeaderBanner}>
            <Ionicons name="stats-chart" size={24} color="#2563EB" style={styles.averagesHeaderIcon} />
            <View>
              <Text style={styles.averagesHeading}>Year-wise RP Averages</Text>
              <Text style={styles.averagesSub}>Average RP collected per academic year</Text>
            </View>
          </View>

          {averagesLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : (
            <View style={styles.averagesGrid}>
              <View style={[styles.avgCard, styles.avgCardYear1]}>
                <View style={styles.avgBadgeRow}>
                  <Ionicons name="school" size={14} color="#2563EB" />
                  <Text style={[styles.avgYearLabel, styles.avgYearLabel1]}>YEAR I</Text>
                </View>
                <Text style={styles.avgValue}>{averages.year_1 || 0}</Text>
                <Text style={styles.avgUnit}>Avg Reward Points</Text>
              </View>

              <View style={[styles.avgCard, styles.avgCardYear2]}>
                <View style={styles.avgBadgeRow}>
                  <Ionicons name="school" size={14} color="#7C3AED" />
                  <Text style={[styles.avgYearLabel, styles.avgYearLabel2]}>YEAR II</Text>
                </View>
                <Text style={styles.avgValue}>{averages.year_2 || 0}</Text>
                <Text style={styles.avgUnit}>Avg Reward Points</Text>
              </View>

              <View style={[styles.avgCard, styles.avgCardYear3]}>
                <View style={styles.avgBadgeRow}>
                  <Ionicons name="school" size={14} color="#059669" />
                  <Text style={[styles.avgYearLabel, styles.avgYearLabel3]}>YEAR III</Text>
                </View>
                <Text style={styles.avgValue}>{averages.year_3 || 0}</Text>
                <Text style={styles.avgUnit}>Avg Reward Points</Text>
              </View>

              <View style={[styles.avgCard, styles.avgCardYear4]}>
                <View style={styles.avgBadgeRow}>
                  <Ionicons name="school" size={14} color="#D97706" />
                  <Text style={[styles.avgYearLabel, styles.avgYearLabel4]}>YEAR IV</Text>
                </View>
                <Text style={styles.avgValue}>{averages.year_4 || 0}</Text>
                <Text style={styles.avgUnit}>Avg Reward Points</Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* DETAILED REWARDS MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Reward Points Breakdown</Text>
                <Text style={styles.modalSub}>
                  {selectedStudent?.student_name} ({selectedStudent?.roll_no})
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            {rewardsLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Fetching points breakdown...</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={styles.modalScroll}>
                {/* Year Average Comparison Banner */}
                {renderAverageDiffBanner()}

                {rewardsList.length > 0 ? (
                  rewardsList.map((item, idx) => (
                    <View key={idx} style={styles.activityItem}>
                      <View style={styles.activityMain}>
                        <Text style={styles.activityName}>{item.activity_name || 'Activity'}</Text>
                        <Text
                          style={[
                            styles.activityPoints,
                            item.type === 'negative' ? styles.negPoints : styles.posPoints,
                          ]}
                        >
                          {item.type === 'negative' ? '-' : '+'}
                          {item.reward_points || 0}
                        </Text>
                      </View>
                      <View style={styles.activityMetaRow}>
                        {item.activity_type ? (
                          <View style={styles.typeBadge}>
                            <Text style={styles.typeBadgeText}>{item.activity_type}</Text>
                          </View>
                        ) : null}
                        <Text style={styles.activityDate}>{item.date || ''}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.modalEmpty}>
                    <Text style={styles.emptyText}>No activity history records found.</Text>
                  </View>
                )}
              </ScrollView>
            )}

            {/* Modal Pagination Footer */}
            {!rewardsLoading && rewardsTotal > 10 && (
              <View style={styles.paginationFooter}>
                <TouchableOpacity
                  style={[styles.pageBtn, rewardsPage === 1 && styles.disabledPageBtn]}
                  disabled={rewardsPage === 1}
                  onPress={() => openRewardsModal(selectedStudent, rewardsPage - 1)}
                >
                  <Ionicons name="chevron-back" size={16} color={rewardsPage === 1 ? '#94A3B8' : '#2563EB'} />
                  <Text style={[styles.pageBtnText, rewardsPage === 1 && styles.disabledPageText]}>Prev</Text>
                </TouchableOpacity>

                <Text style={styles.pageInfo}>
                  Page {rewardsPage} of {Math.ceil(rewardsTotal / 10)}
                </Text>

                <TouchableOpacity
                  style={[styles.pageBtn, rewardsPage * 10 >= rewardsTotal && styles.disabledPageBtn]}
                  disabled={rewardsPage * 10 >= rewardsTotal}
                  onPress={() => openRewardsModal(selectedStudent, rewardsPage + 1)}
                >
                  <Text style={[styles.pageBtnText, rewardsPage * 10 >= rewardsTotal && styles.disabledPageText]}>
                    Next
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={rewardsPage * 10 >= rewardsTotal ? '#94A3B8' : '#2563EB'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  segmentWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeSegmentBtn: {
    backgroundColor: '#2563EB',
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  segmentIcon: {
    marginRight: 5,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  activeSegmentText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabBody: {
    flex: 1,
  },
  searchBarBox: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  searchIconLeft: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 9,
    fontSize: 14,
    color: '#0F172A',
  },
  clearBtn: {
    padding: 4,
  },
  searchBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    width: 44,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  listPadding: {
    padding: 14,
  },
  rpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameBlock: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  rollNo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 6,
  },
  pointsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  pointItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  borderLeftRight: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  pointLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pointValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  activeChip: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  deptSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  deptScroll: {
    flexDirection: 'row',
  },
  deptChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 6,
  },
  activeDeptChip: {
    backgroundColor: '#2563EB',
  },
  deptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  activeDeptChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  rankBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '800',
  },
  lbInfo: {
    flex: 1,
  },
  lbName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  lbSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  lbPointsBox: {
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lbPointsValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  lbPointsLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  averagesPadding: {
    padding: 16,
  },
  averagesHeaderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  averagesHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  averagesSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  averagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avgCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avgBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avgYearLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  avgValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 6,
  },
  averagesHeaderIcon: {
    marginRight: 10,
  },
  avgCardYear1: {
    borderTopColor: '#2563EB',
    borderTopWidth: 4,
  },
  avgCardYear2: {
    borderTopColor: '#7C3AED',
    borderTopWidth: 4,
  },
  avgCardYear3: {
    borderTopColor: '#059669',
    borderTopWidth: 4,
  },
  avgCardYear4: {
    borderTopColor: '#D97706',
    borderTopWidth: 4,
  },
  avgYearLabel1: {
    color: '#2563EB',
  },
  avgYearLabel2: {
    color: '#7C3AED',
  },
  avgYearLabel3: {
    color: '#059669',
  },
  avgYearLabel4: {
    color: '#D97706',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  modalLoading: {
    padding: 40,
    alignItems: 'center',
  },
  modalScroll: {
    padding: 16,
  },
  comparisonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
  },
  bannerIcon: {
    marginRight: 10,
  },
  bannerTextCol: {
    flex: 1,
  },
  aboveBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  belowBanner: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  neutralBanner: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  comparisonLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  aboveLabel: {
    color: '#047857',
  },
  belowLabel: {
    color: '#BE123C',
  },
  comparisonText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  aboveText: {
    color: '#065F46',
  },
  belowText: {
    color: '#9F1239',
  },
  activityItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activityName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    paddingRight: 8,
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '700',
  },
  posPoints: {
    color: '#10B981',
  },
  negPoints: {
    color: '#EF4444',
  },
  activityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  typeBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    color: '#475569',
  },
  activityDate: {
    fontSize: 11,
    color: '#64748B',
  },
  modalEmpty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  paginationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  disabledPageBtn: {
    opacity: 0.5,
  },
  pageBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  disabledPageText: {
    color: '#94A3B8',
  },
  pageInfo: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  earnedText: {
    color: '#0F172A',
  },
  balanceText: {
    color: '#D97706',
  },
  redeemedText: {
    color: '#10B981',
  },
  boldValueText: {
    fontWeight: '700',
  },
});
