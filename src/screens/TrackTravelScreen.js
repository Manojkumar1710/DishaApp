import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const TrackTravelScreen = () => {
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [travelLog, setTravelLog] = useState([]);
  const [duration, setDuration] = useState(0);
  const [destination, setDestination] = useState('');
  const watchIdRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  const startTracking = () => {
    setLoading(true);
    startTimeRef.current = Date.now();

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const locText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setLocation({ latitude, longitude });
        setLocationText(locText);
        setLoading(false);
        setTracking(true);

        // Add to log
        addToLog('Travel Started', locText);

        // Start watching position
        watchIdRef.current = Geolocation.watchPosition(
          pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setLocation({ latitude: lat, longitude: lng });
            setLocationText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          },
          err => console.log('Location update error:', err),
          { enableHighAccuracy: true, distanceFilter: 50 }
        );

        // Duration timer
        timerRef.current = setInterval(() => {
          setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
      },
      error => {
        setLoading(false);
        Alert.alert('Location Error', 'Could not get your location. Please enable GPS.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTracking(false);
    if (travelLog.length > 0) {
      addToLog('Travel Ended', locationText);
    }
  };

  const addToLog = (event, location) => {
    const logEntry = {
      event,
      location,
      time: new Date().toLocaleTimeString('en-IN'),
    };
    setTravelLog(prev => [logEntry, ...prev]);
  };

  const shareLocation = async () => {
    if (!location) {
      Alert.alert('No Location', 'Location not available yet.');
      return;
    }
    try {
      const mapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
      await Share.share({
        message: `🛡️ Disha Safety App - Live Location\n\nI am currently at:\n📍 ${locationText}\n\n🗺️ View on Maps: ${mapsLink}\n\nShared via Disha Women Safety App`,
        title: 'My Live Location - Disha App',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share location.');
    }
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Track My Travel</Text>
        <Text style={styles.headerSub}>
          Share your live location with trusted contacts
        </Text>
      </View>

      {/* Status Card */}
      <View style={[styles.statusCard, tracking && styles.statusCardActive]}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, tracking && styles.statusDotActive]} />
          <Text style={[styles.statusText, tracking && styles.statusTextActive]}>
            {tracking ? 'TRACKING ACTIVE' : 'TRACKING INACTIVE'}
          </Text>
        </View>
        {tracking && (
          <>
            <Text style={styles.durationText}>
              ⏱️ Duration: {formatDuration(duration)}
            </Text>
            <Text style={styles.currentLocation}>
              📍 {locationText || 'Fetching...'}
            </Text>
          </>
        )}
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapText}>
          {tracking
            ? `📍 Currently at:\n${locationText}`
            : 'Start tracking to see your location'}
        </Text>
        {tracking && location && (
          <TouchableOpacity style={styles.openMapsBtn} onPress={shareLocation}>
            <Text style={styles.openMapsBtnText}>📌 Open in Google Maps</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {!tracking ? (
          <TouchableOpacity
            style={styles.startBtn}
            onPress={startTracking}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.startBtnText}>▶️ START TRACKING</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={stopTracking}>
            <Text style={styles.stopBtnText}>⏹️ STOP TRACKING</Text>
          </TouchableOpacity>
        )}

        {tracking && (
          <TouchableOpacity style={styles.shareBtn} onPress={shareLocation}>
            <Text style={styles.shareBtnText}>📤 SHARE LOCATION NOW</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* How it Works */}
      <View style={styles.howItWorks}>
        <Text style={styles.howTitle}>How Track My Travel Works</Text>
        <View style={styles.step}>
          <Text style={styles.stepNum}>1</Text>
          <Text style={styles.stepText}>Press "Start Tracking" before you travel</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNum}>2</Text>
          <Text style={styles.stepText}>Share your live location with emergency contacts</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNum}>3</Text>
          <Text style={styles.stepText}>Your location updates continuously while tracking</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNum}>4</Text>
          <Text style={styles.stepText}>Press "Stop" when you arrive safely</Text>
        </View>
      </View>

      {/* Travel Log */}
      {travelLog.length > 0 && (
        <View style={styles.logSection}>
          <Text style={styles.logTitle}>Travel Log</Text>
          {travelLog.map((log, index) => (
            <View key={index} style={styles.logEntry}>
              <Text style={styles.logEvent}>{log.event}</Text>
              <Text style={styles.logTime}>{log.time}</Text>
              <Text style={styles.logLocation}>{log.location}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#BBDEFB', fontSize: 13, marginTop: 4 },
  statusCard: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
    elevation: 3,
  },
  statusCardActive: {
    borderLeftColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  statusDotActive: { backgroundColor: '#4CAF50' },
  statusText: { fontSize: 14, fontWeight: 'bold', color: '#999' },
  statusTextActive: { color: '#4CAF50' },
  durationText: { color: '#555', marginTop: 8, fontSize: 14 },
  currentLocation: { color: '#333', marginTop: 4, fontSize: 13 },
  mapPlaceholder: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 15,
    borderRadius: 12,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
  },
  mapIcon: { fontSize: 50 },
  mapText: { color: '#2196F3', marginTop: 10, textAlign: 'center', fontSize: 14 },
  openMapsBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 10,
  },
  openMapsBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  actionButtons: { padding: 15, gap: 10 },
  startBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  stopBtn: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
  },
  stopBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  shareBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
  },
  shareBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  howItWorks: { margin: 15, backgroundColor: '#fff', borderRadius: 12, padding: 15 },
  howTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12 },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: 'bold',
  },
  stepText: { flex: 1, color: '#555', fontSize: 14 },
  logSection: { margin: 15, backgroundColor: '#fff', borderRadius: 12, padding: 15 },
  logTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  logEntry: { borderLeftWidth: 3, borderLeftColor: '#2196F3', paddingLeft: 12, marginBottom: 12 },
  logEvent: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  logTime: { color: '#999', fontSize: 12, marginTop: 2 },
  logLocation: { color: '#555', fontSize: 12, marginTop: 2 },
});

export default TrackTravelScreen;
