import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, Linking,
} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';

const AdminDashboard = () => {
  const [sosAlerts, setSosAlerts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('sos');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load SOS Alerts from Firebase in real-time
    const sosRef = ref(db, 'sos_alerts');
    onValue(sosRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const alerts = Object.values(data).reverse();
        setSosAlerts(alerts);
      } else {
        setSosAlerts([]);
      }
    });

    // Load Complaints from Firebase in real-time
    const complaintRef = ref(db, 'complaints');
    onValue(complaintRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data).reverse();
        setComplaints(list);
      } else {
        setComplaints([]);
      }
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  const renderSOSAlerts = () => (
    sosAlerts.length === 0 ? (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🚨</Text>
        <Text style={styles.emptyText}>No SOS Alerts Yet</Text>
        <Text style={styles.emptySubText}>SOS alerts will appear here in real-time</Text>
      </View>
    ) : (
      sosAlerts.map((alert, index) => (
        <View key={index} style={styles.alertCard}>
          {/* Header */}
          <View style={styles.alertCardHeader}>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>🚨 SOS ALERT</Text>
            </View>
            <Text style={styles.alertTime}>{formatTime(alert.timestamp)}</Text>
          </View>

          {/* User Info */}
          <View style={styles.alertRow}>
            <Text style={styles.alertLabel}>👤 Name:</Text>
            <Text style={styles.alertValue}>{alert.user?.name}</Text>
          </View>
          <View style={styles.alertRow}>
            <Text style={styles.alertLabel}>📱 Phone:</Text>
            <Text style={styles.alertValue}>{alert.user?.phone}</Text>
          </View>
          <View style={styles.alertRow}>
            <Text style={styles.alertLabel}>🩸 Blood:</Text>
            <Text style={styles.alertValue}>{alert.user?.bloodGroup}</Text>
          </View>
          <View style={styles.alertRow}>
            <Text style={styles.alertLabel}>⚡ Trigger:</Text>
            <Text style={styles.alertValue}>
              {alert.triggerType === 'shake' ? '📳 Phone Shake' : '🆘 SOS Button'}
            </Text>
          </View>

          {/* Location */}
          <TouchableOpacity
            style={styles.locationBtn}
            onPress={() => Linking.openURL(alert.location?.mapsLink)}
          >
            <Text style={styles.locationBtnText}>
              📍 View Location on Maps
            </Text>
          </TouchableOpacity>

          {/* Status */}
          <View style={[styles.statusBadge, { backgroundColor: '#FFEBEE' }]}>
            <Text style={[styles.statusText, { color: '#F44336' }]}>
              ● {alert.status}
            </Text>
          </View>
        </View>
      ))
    )
  );

  const renderComplaints = () => (
    complaints.length === 0 ? (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>No Complaints Yet</Text>
        <Text style={styles.emptySubText}>Complaints will appear here in real-time</Text>
      </View>
    ) : (
      complaints.map((complaint, index) => (
        <View key={index} style={styles.complaintCard}>
          <View style={styles.complaintHeader}>
            <Text style={styles.complaintId}>#{complaint.id}</Text>
            <Text style={styles.complaintTime}>{formatTime(complaint.timestamp)}</Text>
          </View>
          <View style={styles.alertRow}>
            <Text style={styles.alertLabel}>👤 Name:</Text>
            <Text style={styles.alertValue}>
              {complaint.anonymous ? 'Anonymous' : complaint.complainantName}
            </Text>
          </View>
          <View style={styles.alertRow}>
            <Text style={styles.alertLabel}>📋 Type:</Text>
            <Text style={styles.alertValue}>{complaint.complaintType}</Text>
          </View>
          <View style={styles.alertRow}>
            <Text style={styles.alertLabel}>📍 Location:</Text>
            <Text style={styles.alertValue}>{complaint.location || 'Not specified'}</Text>
          </View>
          <Text style={styles.descriptionLabel}>📝 Description:</Text>
          <Text style={styles.descriptionText}>{complaint.description}</Text>
          <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.statusText, { color: '#4CAF50' }]}>
              ● {complaint.status}
            </Text>
          </View>
        </View>
      ))
    )
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛡️ Disha Admin Dashboard</Text>
        <Text style={styles.headerSub}>Real-time Firebase Data</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{sosAlerts.length}</Text>
            <Text style={styles.statLabel}>SOS Alerts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{complaints.length}</Text>
            <Text style={styles.statLabel}>Complaints</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sos' && styles.tabActive]}
          onPress={() => setActiveTab('sos')}
        >
          <Text style={[styles.tabText, activeTab === 'sos' && styles.tabTextActive]}>
            🚨 SOS Alerts ({sosAlerts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'complaints' && styles.tabActive]}
          onPress={() => setActiveTab('complaints')}
        >
          <Text style={[styles.tabText, activeTab === 'complaints' && styles.tabTextActive]}>
            📋 Complaints ({complaints.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'sos' ? renderSOSAlerts() : renderComplaints()}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#8B0000', padding: 20, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#ffcccc', fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10,
    padding: 12, alignItems: 'center', flex: 1,
  },
  statNum: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  statLabel: { color: '#ffcccc', fontSize: 12, marginTop: 2 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tab: { flex: 1, padding: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#8B0000' },
  tabText: { fontSize: 13, color: '#999', fontWeight: '600' },
  tabTextActive: { color: '#8B0000' },
  content: { flex: 1, padding: 15 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 60 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 15 },
  emptySubText: { fontSize: 13, color: '#999', marginTop: 5, textAlign: 'center' },
  alertCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 15,
    marginBottom: 15, elevation: 3, borderLeftWidth: 4, borderLeftColor: '#F44336',
  },
  alertCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  alertBadge: { backgroundColor: '#FFEBEE', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  alertBadgeText: { color: '#F44336', fontWeight: 'bold', fontSize: 12 },
  alertTime: { color: '#999', fontSize: 11 },
  alertRow: { flexDirection: 'row', marginBottom: 6 },
  alertLabel: { color: '#888', fontSize: 13, width: 90 },
  alertValue: { color: '#333', fontSize: 13, fontWeight: '600', flex: 1 },
  locationBtn: { backgroundColor: '#E3F2FD', borderRadius: 8, padding: 10, marginTop: 8, alignItems: 'center' },
  locationBtnText: { color: '#2196F3', fontWeight: 'bold', fontSize: 13 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5, marginTop: 10, alignSelf: 'flex-start' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  complaintCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 15,
    marginBottom: 15, elevation: 3, borderLeftWidth: 4, borderLeftColor: '#9C27B0',
  },
  complaintHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  complaintId: { color: '#9C27B0', fontWeight: 'bold', fontSize: 14 },
  complaintTime: { color: '#999', fontSize: 11 },
  descriptionLabel: { color: '#888', fontSize: 13, marginTop: 6 },
  descriptionText: { color: '#333', fontSize: 13, marginTop: 4, lineHeight: 20 },
});

export default AdminDashboard;
