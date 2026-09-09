import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../context/StudentContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FeaturesScreen from '../screens/FeaturesScreen';
import BitBotScreen from '../screens/BitBotScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FacultyDirectoryScreen from '../screens/FacultyDirectoryScreen';
import MessMenuScreen from '../screens/MessMenuScreen';
import WifiDetailsScreen from '../screens/WifiDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: 6,
          height: 60,
        },
      }}
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
