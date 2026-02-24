import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    checkUserRegistered();
  }, []);

  const checkUserRegistered = async () => {
    try {
      // Wait 2.5 seconds for splash display
      await new Promise(resolve => setTimeout(resolve, 2500));
      const user = await AsyncStorage.getItem('disha_user');
      if (user) {
        navigation.replace('MainApp');
      } else {
        navigation.replace('Register');
      }
    } catch (error) {
      navigation.replace('Register');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo / Shield Icon */}
      <View style={styles.logoContainer}>
        <Text style={styles.shieldIcon}>🛡️</Text>
        <Text style={styles.appName}>DISHA</Text>
        <Text style={styles.tagline}>Women Safety App</Text>
        <Text style={styles.subTagline}>Andhra Pradesh Police</Text>
      </View>

      <ActivityIndicator size="large" color="#fff" style={styles.loader} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Government of Andhra Pradesh</Text>
        <Text style={styles.footerSub}>Powered by AP Police Technical Services</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  shieldIcon: {
    fontSize: 90,
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#FFD700',
    marginTop: 8,
    fontWeight: '600',
  },
  subTagline: {
    fontSize: 14,
    color: '#ffcccc',
    marginTop: 4,
  },
  loader: {
    marginTop: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  footerSub: {
    color: '#ffcccc',
    fontSize: 11,
    marginTop: 3,
  },
});

export default SplashScreen;
