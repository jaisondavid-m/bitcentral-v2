import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StudentProvider } from './src/context/StudentContext';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <StudentProvider>
        <AppNavigator />
      </StudentProvider>
    </SafeAreaProvider>
  );
}

export default App;
