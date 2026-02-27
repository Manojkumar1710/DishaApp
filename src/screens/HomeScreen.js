<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
=======
 import React, { useState, useEffect, useRef } from 'react';
>>>>>>> fd73130b212244174c24625327f5029392dce163
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  ScrollView,
  Linking,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── SOS sizing ───────────────────────────────────────────────────────────────
const SOS_R = Math.floor(SCREEN_WIDTH * 0.42);
const RING_GAP = Math.floor(SCREEN_WIDTH * 0.055);

// ─── Arc card sizing ─────────────────────────────────────────────────────────
const ARC_W = SCREEN_WIDTH * 1.1;
const ARC_SIDE = (ARC_W - SCREEN_WIDTH) / 2;

// Circle sizes
const CIRCLE_SM = Math.floor(SCREEN_WIDTH * 0.21);
const CIRCLE_MD = Math.floor(SCREEN_WIDTH * 0.26);

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [sosActive, setSosActive] = useState(false);

  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUser();
    startRingPulse(pulse1, 0);
    startRingPulse(pulse2, 600);
    startRingPulse(pulse3, 1200);
  }, []);

  const loadUser = async () => {
<<<<<<< HEAD
    try {
      const data = await AsyncStorage.getItem("disha_user");
      if (data) setUser(JSON.parse(data));
    } catch (_) {}
  };

  const startRingPulse = (anim, delay) => {
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.05,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, delay);
=======
    const userData = await AsyncStorage.getItem('disha_user');
    if (userData) setUser(JSON.parse(userData));
  };

  // Shake Detection using Accelerometer
  const setupShakeDetection = () => {
    try {
      setUpdateIntervalForType(SensorTypes.accelerometer, 100);
      accelerometer.subscribe(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        // Detect shake: magnitude > 18 and at least 200ms since last shake
        if (magnitude > 18 && now - lastShakeRef.current > 200) {
          lastShakeRef.current = now;
          shakeCountRef.current += 1;
          setShakeCount(shakeCountRef.current);

          // Reset shake count after 2 seconds of no shaking
          if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
          shakeTimerRef.current = setTimeout(() => {
            shakeCountRef.current = 0;
            setShakeCount(0);
          }, 2000);

          // Trigger SOS after 5 shakes
          if (shakeCountRef.current >= 5) {
            shakeCountRef.current = 0;
            setShakeCount(0);
            triggerSOS('shake');
          }
        }
      });
    } catch (error) {
      console.log('Accelerometer not available:', error);
    }
  };

  // SOS Trigger
  const triggerSOS = (type = 'button') => {
    if (sosActive) return;
    setSosActive(true);
    Vibration.vibrate([500, 500, 500, 500, 500]);

    navigation.navigate('SOSAlert', { triggerType: type, user });
    setTimeout(() => setSosActive(false), 5000);
>>>>>>> fd73130b212244174c24625327f5029392dce163
  };

  const handleSOSPress = () => {
    Alert.alert(
      "🚨 SEND SOS ALERT?",
      "This will immediately alert the Disha Control Room and your emergency contacts with your current location.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "SEND SOS NOW",
          style: "destructive",
          onPress: () => triggerSOS("button"),
        },
      ],
    );
  };

<<<<<<< HEAD
  const triggerSOS = (type = "button") => {
    if (sosActive) return;
    setSosActive(true);
    Vibration.vibrate([500, 300, 500, 300, 500]);
    navigation.navigate("SOSAlert", { triggerType: type, user });
    setTimeout(() => setSosActive(false), 5000);
  };

  const row1 = [
    { label: "TRACK MY\nLOCATION", screen: "Track" },
    { label: "FILE\nCOMPLAINT", screen: "Complaint" },
    { label: "NEARBY\nSERVICES", screen: "Nearby" },
  ];

  const row2 = [
    { label: "EMERGENCY\nCONTACTS", screen: "Contacts", large: false },
    { label: "HELP\nLINES", screen: "Helpline", large: true },
    { label: "BLOOD\nBANKS", screen: "Nearby", large: false },
  ];

  const emergencyDials = [
    { num: "100", lbl: "Police", tel: "100", bg: "#E53935" },
    { num: "108", lbl: "Ambulance", tel: "108", bg: "#43A047" },
    { num: "112", lbl: "Emergency", tel: "112", bg: "#1E88E5" },
    { num: "181", lbl: "Women Help", tel: "181", bg: "#FB8C00" },
  ];

  const navTabs = [
    { icon: "🏠", label: "Home", active: true, screen: "Home" },
    { icon: "👥", label: "Contacts", active: false, screen: "Contacts" },
    { icon: "🚗", label: "Track", active: false, screen: "Track" },
    { icon: "📍", label: "Nearby", active: false, screen: "Nearby" },
    { icon: "📋", label: "Complaint", active: false, screen: "Complaint" },
    { icon: "⚙️", label: "Admin", active: false, screen: "Admin" },
=======
  const quickActions = [
    { icon: '👥', label: 'Emergency\nContacts', screen: 'Contacts', color: '#4CAF50' },
    { icon: '📍', label: 'Track My\nTravel', screen: 'Track', color: '#2196F3' },
    { icon: '🏥', label: 'Nearby\nServices', screen: 'Nearby', color: '#FF9800' },
    { icon: '📋', label: 'File\nComplaint', screen: 'Complaint', color: '#9C27B0' },
    { icon: '📞', label: 'Helplines', screen: 'Helpline', color: '#F44336' },
    { icon: '🩸', label: 'Blood\nBanks', screen: 'Nearby', color: '#E91E63' },
>>>>>>> fd73130b212244174c24625327f5029392dce163
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFEFEF" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ══ HEADER ══ */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name || "Vennela"} 👋
            </Text>
            <Text style={styles.subGreeting}>STAY SAFE · DISHA APP</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.avatarIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ══ ARC CARD ROW 1 — 3 equal circles ══ */}
        <View style={[styles.arcCardWrap, { height: CIRCLE_SM + 48 }]}>
          <View
            style={[
              styles.arcBg,
              {
                top: -(ARC_W * 0.52 - CIRCLE_SM - 24),
              },
            ]}
          />
          <View style={styles.circleRow}>
            {row1.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.circle,
                  {
                    width: CIRCLE_SM,
                    height: CIRCLE_SM,
                    borderRadius: CIRCLE_SM / 2,
                  },
                ]}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.75}
              >
                <Text style={styles.circleLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ══ ARC CARD ROW 2 — center circle larger ══ */}
        <View
          style={[
            styles.arcCardWrap,
            { height: CIRCLE_MD + 48, marginTop: -8 },
          ]}
        >
          <View
            style={[
              styles.arcBg,
              {
                top: -(ARC_W * 0.52 - CIRCLE_MD - 24),
              },
            ]}
          />
          <View style={[styles.circleRow, { alignItems: "center" }]}>
            {row2.map((item, i) => {
              const d = item.large ? CIRCLE_MD : CIRCLE_SM;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.circle,
                    { width: d, height: d, borderRadius: d / 2 },
                  ]}
                  onPress={() => navigation.navigate(item.screen)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.circleLabel,
                      item.large && styles.circleLabelLg,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ══ EMERGENCY LABEL ══ */}
        <View style={styles.emergencyLabelRow}>
          <View style={styles.emergencyLine} />
          <Text style={styles.emergencyLabel}>PRESS IN CASE OF EMERGENCY</Text>
          <View style={styles.emergencyLine} />
        </View>

        {/* ══ SOS — white rings + deep red filled circle ══ */}
        <View style={styles.sosSection}>
          {/* Ring 3 — outermost */}
          <Animated.View
            style={[
              styles.ring,
              {
                width: (SOS_R + RING_GAP * 3) * 2,
                height: (SOS_R + RING_GAP * 3) * 2,
                borderRadius: SOS_R + RING_GAP * 3,
                transform: [{ scale: pulse3 }],
              },
            ]}
          />

          {/* Ring 2 */}
          <Animated.View
            style={[
              styles.ring,
              styles.ring2,
              {
                width: (SOS_R + RING_GAP * 2) * 2,
                height: (SOS_R + RING_GAP * 2) * 2,
                borderRadius: SOS_R + RING_GAP * 2,
                transform: [{ scale: pulse2 }],
              },
            ]}
          />

          {/* Ring 1 — innermost white ring */}
          <Animated.View
            style={[
              styles.ring,
              styles.ring1,
              {
                width: (SOS_R + RING_GAP) * 2,
                height: (SOS_R + RING_GAP) * 2,
                borderRadius: SOS_R + RING_GAP,
                transform: [{ scale: pulse1 }],
              },
            ]}
          />

          {/* Deep red SOS circle */}
          <TouchableOpacity
            style={[
              styles.sosBtn,
              { width: SOS_R * 2, height: SOS_R * 2, borderRadius: SOS_R },
              sosActive && styles.sosBtnActive,
            ]}
            onPress={handleSOSPress}
            activeOpacity={0.88}
          >
            <Text style={styles.sosText}>SOS</Text>
            <Text style={styles.sosSub}>PRESS FOR HELP</Text>
          </TouchableOpacity>
        </View>

        {/* ══ EMERGENCY DIAL PILLS ══ */}
        <View style={styles.dialSection}>
          <Text style={styles.dialTitle}>Emergency Dial</Text>
          <View style={styles.dialRow}>
            {emergencyDials.map((d, idx) => (
              <TouchableOpacity
                key={d.num}
                style={[
                  styles.dialPill,
                  { backgroundColor: d.bg },
                  idx < emergencyDials.length - 1 && { marginRight: 8 },
                ]}
                onPress={() => Linking.openURL(`tel:${d.tel}`)}
                activeOpacity={0.8}
              >
                <Text style={styles.dialNum}>{d.num}</Text>
                <Text style={styles.dialLbl}>{d.lbl}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>

      {/* ══ BOTTOM NAV BAR ══ */}
      <View style={styles.navBar}>
        {navTabs.map((tab) => (
          <TouchableOpacity
            key={tab.label}
            style={styles.navItem}
            onPress={() => !tab.active && navigation.navigate(tab.screen)}
            activeOpacity={tab.active ? 1 : 0.7}
          >
            <Text style={styles.navIcon}>{tab.icon}</Text>
            <Text
              style={[styles.navLabel, tab.active && styles.navLabelActive]}
            >
              {tab.label}
            </Text>
            {tab.active && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
<<<<<<< HEAD
    </View>
=======

      {/* Emergency Dial Buttons */}
      <View style={styles.dialSection}>
        <Text style={styles.sectionTitle}>Emergency Dial</Text>
        <View style={styles.dialRow}>
          <TouchableOpacity
            style={[styles.dialBtn, { backgroundColor: '#F44336' }]}
            onPress={() => Linking.openURL('tel:100')}
          >
            <Text style={styles.dialNumber}>100</Text>
            <Text style={styles.dialLabel}>Police</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialBtn, { backgroundColor: '#4CAF50' }]}
            onPress={() => Linking.openURL('tel:108')}
          >
            <Text style={styles.dialNumber}>108</Text>
            <Text style={styles.dialLabel}>Ambulance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialBtn, { backgroundColor: '#2196F3' }]}
            onPress={() => Linking.openURL('tel:112')}
          >
            <Text style={styles.dialNumber}>112</Text>
            <Text style={styles.dialLabel}>Emergency</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dialBtn, { backgroundColor: '#FF9800' }]}
            onPress={() => Linking.openURL('tel:181')}
          >
            <Text style={styles.dialNumber}>181</Text>
            <Text style={styles.dialLabel}>Women Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Safety Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Safety Tip 💡</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            Always inform a trusted person about your whereabouts. Use the 
            "Track My Travel" feature when traveling alone at night.
          </Text>
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
>>>>>>> fd73130b212244174c24625327f5029392dce163
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#EFEFEF" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 8 },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: "#EFEFEF",
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    letterSpacing: 0.2,
  },
  subGreeting: {
    fontSize: 11,
    color: "#AAAAAA",
    letterSpacing: 4,
    marginTop: 3,
    fontWeight: "500",
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { fontSize: 20 },
  divider: { height: 1.5, backgroundColor: "#E0E0E0", marginBottom: 18 },

  // ── Arc Card ─────────────────────────────────────────────────────────────────
  arcCardWrap: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "visible",
    paddingBottom: 10,
  },

  // Oversized white ellipse = the arc background shape
  arcBg: {
    position: "absolute",
    width: ARC_W,
    height: ARC_W * 0.52,
    borderRadius: ARC_W * 0.5,
    left: -ARC_SIDE,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 7,
  },

  // Row of 3 circles
  circleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: SCREEN_WIDTH,
    paddingHorizontal: 10,
    zIndex: 2,
  },

  // Individual circle button
  circle: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 7,
  },
  circleLabel: {
    color: "#E53935",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 9,
    letterSpacing: 0.3,
    lineHeight: 13,
  },
  circleLabelLg: { fontSize: 10, lineHeight: 14 },

  // ── Emergency label ──────────────────────────────────────────────────────────
  emergencyLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 22,
    marginBottom: 10,
  },
  emergencyLine: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
  emergencyLabel: {
    fontSize: 10,
    color: "#BBBBBB",
    letterSpacing: 2.5,
    marginHorizontal: 10,
    fontWeight: "600",
  },

  // ── SOS Section ──────────────────────────────────────────────────────────────
  sosSection: {
    alignItems: "center",
    justifyContent: "center",
    height: (SOS_R + RING_GAP * 3) * 2 + 32,
  },

  // White ring layers — solid white filled circles stacked (biggest first = back)
  ring: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    shadowColor: "#AAAAAA",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  ring2: {
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  ring1: {
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },

  // Deep red filled SOS — NO border, pure fill with shadow
  sosBtn: {
    backgroundColor: "#BB0000",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#770000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 22,
    elevation: 14,
  },
  sosBtnActive: { backgroundColor: "#990000" },
  sosText: {
    fontSize: Math.floor(SOS_R * 0.58),
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 8,
    lineHeight: Math.floor(SOS_R * 0.68),
  },
  sosSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 2.5,
    fontWeight: "700",
    marginTop: 6,
  },

  // ── Dial ─────────────────────────────────────────────────────────────────────
  dialSection: { paddingHorizontal: 20, paddingTop: 16 },
  dialTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#444",
    fontStyle: "italic",
    marginBottom: 10,
  },
  dialRow: { flexDirection: "row" },
  dialPill: {
    flex: 1,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  dialNum: { color: "#FFF", fontSize: 20, fontWeight: "900", lineHeight: 22 },
  dialLbl: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // ── Nav Bar ───────────────────────────────────────────────────────────────────
  navBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopWidth: 1.5,
    borderTopColor: "#E2E2E2",
    paddingBottom: 8,
    paddingTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    position: "relative",
  },
  navIcon: { fontSize: 18 },
  navLabel: {
    fontSize: 9,
    color: "#AAAAAA",
    marginTop: 2,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  navLabelActive: { color: "#E53935", fontWeight: "700" },
  navDot: {
    position: "absolute",
    top: 0,
    width: 24,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#E53935",
  },
});

export default HomeScreen;
