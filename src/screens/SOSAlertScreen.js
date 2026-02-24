import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const SOSAlertScreen = ({ navigation, route }) => {
  const { triggerType, user } = route.params || {};
  const [countdown, setCountdown] = useState(10);
  const [sosSent, setSosSent] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState('Fetching location...');
  const flashAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startFlashAnimation();
    getLocation();
    Vibration.vibrate([300, 200, 300, 200, 300]);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          sendSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      Vibration.cancel();
    };
  }, []);

  const startFlashAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLocationText(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      error => {
        setLocationText('Location unavailable — GPS may be off');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const sendSOS = () => {
    setSosSent(true);
    Vibration.vibrate(1000);

    // In a real app, this would call an API to alert the control room
    // For demo, we log the event
    console.log('SOS SENT:', {
      user,
      location,
      timestamp: new Date().toISOString(),
      triggerType,
    });
  };

  const cancelSOS = () => {
    Vibration.cancel();
    Alert.alert(
      'Cancel SOS?',
      'Are you sure you want to cancel the SOS alert?',
      [
        { text: 'No, Keep SOS', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Flashing SOS header */}
      <Animated.View style={[styles.alertHeader, { opacity: flashAnim }]}>
        <Text style={styles.alertHeaderText}>🚨 SOS ALERT 🚨</Text>
      </Animated.View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        {!sosSent ? (
          <>
            <Text style={styles.countdownLabel}>Sending SOS in</Text>
            <Text style={styles.countdown}>{countdown}</Text>
            <Text style={styles.countdownSub}>seconds</Text>
          </>
        ) : (
          <>
            <Text style={styles.sentIcon}>✅</Text>
            <Text style={styles.sentText}>SOS ALERT SENT!</Text>
            <Text style={styles.sentSub}>
              Disha Control Room has been notified
            </Text>
          </>
        )}
      </View>

      {/* Info Cards */}
      <View style={styles.infoSection}>
        {/* User Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>👤</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>User Details</Text>
            <Text style={styles.infoValue}>
              {user?.name || 'Unknown'} • {user?.age || '--'} years • {user?.gender || '--'}
            </Text>
            <Text style={styles.infoValue}>{user?.phone || '--'}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>📍</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Current Location</Text>
            <Text style={styles.infoValue}>{locationText}</Text>
            {location && (
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://maps.google.com/?q=${location.latitude},${location.longitude}`
                  )
                }
              >
                <Text style={styles.mapLink}>📌 Open in Maps</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Trigger Type */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>
            {triggerType === 'shake' ? '📳' : '🆘'}
          </Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Alert Triggered By</Text>
            <Text style={styles.infoValue}>
              {triggerType === 'shake' ? 'Phone Shake (5 times)' : 'SOS Button Press'}
            </Text>
          </View>
        </View>

        {/* Time */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🕐</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Alert Time</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'medium',
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.callPoliceBtn}
          onPress={() => Linking.openURL('tel:100')}
        >
          <Text style={styles.callPoliceText}>📞 Call Police - 100</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={cancelSOS}>
          <Text style={styles.cancelBtnText}>
            {sosSent ? '← Go Back' : 'Cancel SOS'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0000',
  },
  alertHeader: {
    backgroundColor: '#FF0000',
    padding: 20,
    alignItems: 'center',
    paddingTop: 50,
  },
  alertHeaderText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  statusCard: {
    backgroundColor: '#2a0000',
    margin: 20,
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  countdownLabel: {
    color: '#ffcccc',
    fontSize: 16,
    fontWeight: '600',
  },
  countdown: {
    color: '#FF0000',
    fontSize: 72,
    fontWeight: '900',
    marginVertical: 5,
  },
  countdownSub: {
    color: '#ffcccc',
    fontSize: 16,
  },
  sentIcon: {
    fontSize: 60,
  },
  sentText: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sentSub: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  infoSection: {
    paddingHorizontal: 20,
    gap: 10,
  },
  infoCard: {
    backgroundColor: '#2a0000',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: '#FF6666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
  },
  mapLink: {
    color: '#4CAF50',
    fontSize: 13,
    marginTop: 5,
    fontWeight: '600',
  },
  actions: {
    padding: 20,
    gap: 10,
    marginTop: 'auto',
  },
  callPoliceBtn: {
    backgroundColor: '#FF0000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 5,
  },
  callPoliceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  cancelBtnText: {
    color: '#aaa',
    fontSize: 15,
  },
});

export default SOSAlertScreen;
