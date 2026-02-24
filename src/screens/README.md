# 🛡️ Disha Women Safety App — React Native Clone
### College Project | Inspired by AP Government's Disha App

---

## 📱 Features Implemented

| Feature | Status |
|---|---|
| 🆘 SOS Button with Countdown | ✅ |
| 📳 Shake-to-Alert (5 shakes) | ✅ |
| 📍 GPS Location Tracking | ✅ |
| 👥 Emergency Contacts (up to 5) | ✅ |
| 📤 Share Live Location | ✅ |
| 🏥 Nearby Services Directory | ✅ |
| 📋 File a Complaint | ✅ |
| 📞 Emergency Helplines | ✅ |
| 🗺️ Track My Travel | ✅ |
| 👤 User Registration | ✅ |
| 💾 Local Data Storage | ✅ |

---

## 🗂️ Project Structure

```
DishaApp/
├── App.js                          # Main entry
├── index.js                        # App registration
├── package.json                    # Dependencies
└── src/
    ├── navigation/
    │   └── MainNavigator.js        # Stack + Tab navigation
    └── screens/
        ├── SplashScreen.js         # App loading screen
        ├── RegisterScreen.js       # User onboarding
        ├── HomeScreen.js           # Main screen + SOS button
        ├── SOSAlertScreen.js       # Full-screen SOS modal
        ├── EmergencyContactsScreen.js  # Manage contacts
        ├── TrackTravelScreen.js    # Live GPS tracking
        ├── NearbyServicesScreen.js # Nearby police/hospitals
        ├── ComplaintScreen.js      # File complaints
        └── HelplineScreen.js      # Emergency numbers
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- React Native CLI
- Android Studio
- Android SDK

### Step 1 — Clone / Open the project
```bash
cd DishaApp
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Install iOS pods (Mac only)
```bash
cd ios && pod install && cd ..
```

### Step 4 — Add Android permissions
In `android/app/src/main/AndroidManifest.xml`, add:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.CALL_PHONE" />
<uses-permission android:name="android.permission.SEND_SMS" />
```

### Step 5 — Run the app
```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

---

## 🔑 Key Dependencies

| Package | Purpose |
|---|---|
| `@react-navigation/native` | App navigation |
| `@react-navigation/bottom-tabs` | Bottom tab bar |
| `@react-native-async-storage/async-storage` | Local data storage |
| `@react-native-community/geolocation` | GPS location |
| `react-native-sensors` | Shake detection |
| `react-native-screens` | Screen optimization |

---

## 🧪 How to Test Each Feature

### SOS Button
1. Go to Home screen
2. Press the red SOS button
3. A confirmation dialog appears
4. Confirm → SOSAlert screen opens with countdown

### Shake Detection
1. On a physical device, shake the phone 5 times rapidly
2. SOS Alert screen activates automatically

### Emergency Contacts
1. Go to Contacts tab
2. Add up to 5 contacts with name, phone, and relation

### Track My Travel
1. Go to Track tab
2. Press "Start Tracking"
3. Grant location permission
4. Share location via "Share Location Now"

### File a Complaint
1. Go to Complaint tab
2. Fill in details and select complaint type
3. Submit → Complaint ID is generated

---

## ⚠️ Disclaimer

This is a **college educational project** and a functional clone
of the AP Government's Disha Women Safety App concept.
This is NOT the official app and is NOT connected to AP Police servers.
For real emergencies, please use the official Disha app or call 100/112.

---

## 👨‍💻 Built With
- React Native 0.73
- React Navigation 6
- AsyncStorage
- Geolocation API
- Accelerometer (Shake Detection)
