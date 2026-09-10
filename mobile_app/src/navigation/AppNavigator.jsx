import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { useAuth } from '../context/StudentContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FeaturesScreen from '../screens/FeaturesScreen';
import BitBotScreen from '../screens/BitBotScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FacultyDirectoryScreen from '../screens/FacultyDirectoryScreen';
import MessMenuScreen from '../screens/MessMenuScreen';
import WifiDetailsScreen from '../screens/WifiDetailsScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const renderTabBarIcon = (route, focused, color, size) => {
  let iconName;
  if (route.name === 'Home') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === 'Tools') {
    iconName = focused ? 'grid' : 'grid-outline';
  } else if (route.name === 'BitBot') {
    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
  } else if (route.name === 'Profile') {
    iconName = focused ? 'person' : 'person-outline';
  }
  return <Ionicons name={iconName} size={size || 22} color={color} />;
};

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
        },
        tabBarIcon: ({ focused, color, size }) => renderTabBarIcon(route, focused, color, size),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tools" component={FeaturesScreen} />
      <Tab.Screen name="BitBot" component={BitBotScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="FacultyDirectory" component={FacultyDirectoryScreen} />
            <Stack.Screen name="MessMenu" component={MessMenuScreen} />
            <Stack.Screen name="WifiDetails" component={WifiDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
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
