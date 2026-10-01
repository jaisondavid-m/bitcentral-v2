import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/StudentContext';

// Core Screens
import LoginScreen from '../screens/LoginScreen';
import LandingScreen from '../screens/LandingScreen';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileV2Screen from '../screens/ProfileV2Screen';

// Academic & Placement
import SemesterScreen from '../screens/SemesterScreen';
import StudentReportDetailsScreen from '../screens/StudentReportDetailsScreen';
import ExamHallScreen from '../screens/ExamHallScreen';
import PSAssessmentHistoryScreen from '../screens/PSAssessmentHistoryScreen';
import PSPointDetailsScreen from '../screens/PSPointDetailsScreen';
import PSBiometricDetailsScreen from '../screens/PSBiometricDetailsScreen';
import PCDPScreen from '../screens/PCDPScreen';
import ApSiteScreen from '../screens/ApSiteScreen';
import RpSiteScreen from '../screens/RpSiteScreen';
import AnswerKeyScreen from '../screens/AnswerKeyScreen';

// Campus Life & Utilities
import LostAndFoundScreen from '../screens/LostAndFoundScreen';
import LeaveDetailsScreen from '../screens/LeaveDetailsScreen';
import FindMyWayScreen from '../screens/FindMyWayScreen';
import FacultyDirectoryScreen from '../screens/FacultyDirectoryScreen';
import MessMenuScreen from '../screens/MessMenuScreen';
import WifiDetailsScreen from '../screens/WifiDetailsScreen';
import BitBotScreen from '../screens/BitBotScreen';

// Support & Public Information
import SupportScreen from '../screens/SupportScreen';
import PaymentSuccessfulScreen from '../screens/PaymentSuccessfulScreen';
import GuidesIndexScreen from '../screens/GuidesIndexScreen';
import GuideDetailScreen from '../screens/GuideDetailScreen';
import AboutScreen from '../screens/AboutScreen';
import FeaturesScreen from '../screens/FeaturesScreen';
import FAQScreen from '../screens/FAQScreen';
import DeveloperScreen from '../screens/DeveloperScreen';
import ContactScreen from '../screens/ContactScreen';
import LegalScreen from '../screens/LegalScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const AcademicsStack = createNativeStackNavigator();
const CampusLifeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Tab Icon Helper
const renderTabBarIcon = (route, focused, color, size) => {
  let iconName;
  if (route.name === 'HomeTab') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === 'AcademicsTab') {
    iconName = focused ? 'school' : 'school-outline';
  } else if (route.name === 'CampusTab') {
    iconName = focused ? 'compass' : 'compass-outline';
  } else if (route.name === 'BitBotTab') {
    iconName = focused ? 'sparkles' : 'sparkles-outline';
  } else if (route.name === 'ProfileTab') {
    iconName = focused ? 'person' : 'person-outline';
  }
  return <Ionicons name={iconName} size={size || 22} color={color} />;
};

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
      <HomeStack.Screen name="Semester" component={SemesterScreen} />
      <HomeStack.Screen name="StudentReport" component={StudentReportDetailsScreen} />
      <HomeStack.Screen name="ExamHall" component={ExamHallScreen} />
      <HomeStack.Screen name="LostAndFound" component={LostAndFoundScreen} />
      <HomeStack.Screen name="LeaveDetails" component={LeaveDetailsScreen} />
      <HomeStack.Screen name="FindMyWay" component={FindMyWayScreen} />
      <HomeStack.Screen name="FacultyDirectory" component={FacultyDirectoryScreen} />
      <HomeStack.Screen name="MessMenu" component={MessMenuScreen} />
      <HomeStack.Screen name="RpSite" component={RpSiteScreen} />
      <HomeStack.Screen name="ApSite" component={ApSiteScreen} />
      <HomeStack.Screen name="PCDP" component={PCDPScreen} />
      <HomeStack.Screen name="PSAssessmentHistory" component={PSAssessmentHistoryScreen} />
      <HomeStack.Screen name="PSPointDetails" component={PSPointDetailsScreen} />
      <HomeStack.Screen name="PSBiometricDetails" component={PSBiometricDetailsScreen} />
      <HomeStack.Screen name="WifiDetails" component={WifiDetailsScreen} />
      <HomeStack.Screen name="BitBot" component={BitBotScreen} />
      <HomeStack.Screen name="Support" component={SupportScreen} />
      <HomeStack.Screen name="PaymentSuccessful" component={PaymentSuccessfulScreen} />
      <HomeStack.Screen name="GuidesIndex" component={GuidesIndexScreen} />
      <HomeStack.Screen name="GuideDetail" component={GuideDetailScreen} />
      <HomeStack.Screen name="About" component={AboutScreen} />
      <HomeStack.Screen name="Features" component={FeaturesScreen} />
      <HomeStack.Screen name="FAQ" component={FAQScreen} />
      <HomeStack.Screen name="Developer" component={DeveloperScreen} />
      <HomeStack.Screen name="Contact" component={ContactScreen} />
      <HomeStack.Screen name="Legal" component={LegalScreen} />
      <HomeStack.Screen name="AnswerKey" component={AnswerKeyScreen} />
    </HomeStack.Navigator>
  );
}

function AcademicsStackNav() {
  return (
    <AcademicsStack.Navigator screenOptions={{ headerShown: false }}>
      <AcademicsStack.Screen name="AcademicsHome" component={SemesterScreen} />
      <AcademicsStack.Screen name="StudentReport" component={StudentReportDetailsScreen} />
      <AcademicsStack.Screen name="ExamHall" component={ExamHallScreen} />
      <AcademicsStack.Screen name="PCDP" component={PCDPScreen} />
      <AcademicsStack.Screen name="PSAssessmentHistory" component={PSAssessmentHistoryScreen} />
      <AcademicsStack.Screen name="PSPointDetails" component={PSPointDetailsScreen} />
      <AcademicsStack.Screen name="PSBiometricDetails" component={PSBiometricDetailsScreen} />
      <AcademicsStack.Screen name="ApSite" component={ApSiteScreen} />
      <AcademicsStack.Screen name="RpSite" component={RpSiteScreen} />
      <AcademicsStack.Screen name="AnswerKey" component={AnswerKeyScreen} />
    </AcademicsStack.Navigator>
  );
}

function CampusLifeStackNav() {
  return (
    <CampusLifeStack.Navigator screenOptions={{ headerShown: false }}>
      <CampusLifeStack.Screen name="MessMenuHome" component={MessMenuScreen} />
      <CampusLifeStack.Screen name="LostAndFound" component={LostAndFoundScreen} />
      <CampusLifeStack.Screen name="LeaveDetails" component={LeaveDetailsScreen} />
      <CampusLifeStack.Screen name="FindMyWay" component={FindMyWayScreen} />
      <CampusLifeStack.Screen name="FacultyDirectory" component={FacultyDirectoryScreen} />
      <CampusLifeStack.Screen name="WifiDetails" component={WifiDetailsScreen} />
    </CampusLifeStack.Navigator>
  );
}

function ProfileStackNav() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileV2Screen} />
      <ProfileStack.Screen name="Support" component={SupportScreen} />
      <ProfileStack.Screen name="PaymentSuccessful" component={PaymentSuccessfulScreen} />
      <ProfileStack.Screen name="GuidesIndex" component={GuidesIndexScreen} />
      <ProfileStack.Screen name="GuideDetail" component={GuideDetailScreen} />
      <ProfileStack.Screen name="About" component={AboutScreen} />
      <ProfileStack.Screen name="Features" component={FeaturesScreen} />
      <ProfileStack.Screen name="FAQ" component={FAQScreen} />
      <ProfileStack.Screen name="Developer" component={DeveloperScreen} />
      <ProfileStack.Screen name="Contact" component={ContactScreen} />
      <ProfileStack.Screen name="Legal" component={LegalScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: 6,
          height: 60,
          backgroundColor: '#FFFFFF',
        },
        tabBarIcon: ({ focused, color, size }) => renderTabBarIcon(route, focused, color, size),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNav} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="AcademicsTab" component={AcademicsStackNav} options={{ tabBarLabel: 'Academics' }} />
      <Tab.Screen name="CampusTab" component={CampusLifeStackNav} options={{ tabBarLabel: 'Campus' }} />
      <Tab.Screen name="BitBotTab" component={BitBotScreen} options={{ tabBarLabel: 'BitBot AI' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNav} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <RootStack.Screen name="Landing" component={LandingScreen} />
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="GuidesIndex" component={GuidesIndexScreen} />
            <RootStack.Screen name="GuideDetail" component={GuideDetailScreen} />
            <RootStack.Screen name="About" component={AboutScreen} />
            <RootStack.Screen name="Features" component={FeaturesScreen} />
            <RootStack.Screen name="FAQ" component={FAQScreen} />
            <RootStack.Screen name="Developer" component={DeveloperScreen} />
            <RootStack.Screen name="Contact" component={ContactScreen} />
            <RootStack.Screen name="Legal" component={LegalScreen} />
            <RootStack.Screen name="WifiDetails" component={WifiDetailsScreen} />
          </>
        ) : (
          <RootStack.Screen name="MainTabs" component={MainTabs} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
