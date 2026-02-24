import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
