import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

const helplines = [
  {
    section: '🚨 Emergency Numbers',
    items: [
      { name: 'Police', number: '100', desc: '24x7 Police Emergency', color: '#3F51B5' },
      { name: 'Ambulance', number: '108', desc: 'Medical Emergency', color: '#F44336' },
      { name: 'National Emergency', number: '112', desc: 'All Emergencies', color: '#9C27B0' },
      { name: 'Fire', number: '101', desc: 'Fire Emergency', color: '#FF5722' },
    ],
  },
  {
    section: '👩 Women Helplines',
    items: [
      { name: 'Women Helpline', number: '181', desc: 'AP Women Safety Helpline', color: '#E91E63' },
      { name: 'Disha SOS', number: '0866-2970258', desc: 'Disha Control Room', color: '#8B0000' },
      { name: 'Domestic Violence', number: '181', desc: 'Domestic Abuse Support', color: '#880E4F' },
      { name: "Women's Commission", number: '1800-425-2977', desc: 'AP Women Commission', color: '#AD1457' },
    ],
  },
  {
    section: '🧒 Child Safety',
    items: [
      { name: 'Childline', number: '1098', desc: 'Child Abuse & Safety', color: '#FF9800' },
      { name: 'Child Helpline', number: '1800-599-0019', desc: 'Government Child Helpline', color: '#F57C00' },
    ],
  },
  {
    section: '🧠 Mental Health',
    items: [
      { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24x7 Mental Health Support', color: '#4CAF50' },
      { name: 'iCall', number: '9152987821', desc: 'Psychosocial Helpline', color: '#388E3C' },
      { name: 'NIMHANS', number: '080-46110007', desc: 'Mental Health Helpline', color: '#2E7D32' },
    ],
  },
  {
    section: '🩸 Medical',
    items: [
      { name: 'Blood Emergency', number: '1800-180-7777', desc: 'Blood Bank Emergency', color: '#B71C1C' },
      { name: 'Poison Control', number: '1800-116-117', desc: 'Poison Helpline', color: '#6A1B9A' },
      { name: 'COVID Helpline', number: '1075', desc: 'Health Emergency', color: '#0288D1' },
    ],
  },
];

const HelplineScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📞 Emergency Helplines</Text>
        <Text style={styles.headerSub}>
          Tap any number to call instantly
        </Text>
      </View>

      {/* Quick Dial */}
      <View style={styles.quickDial}>
        <Text style={styles.quickTitle}>Quick Dial</Text>
        <View style={styles.quickGrid}>
          {[
            { num: '100', label: 'Police', color: '#3F51B5' },
            { num: '108', label: 'Ambulance', color: '#F44336' },
            { num: '112', label: 'Emergency', color: '#9C27B0' },
            { num: '181', label: 'Women', color: '#E91E63' },
          ].map(item => (
            <TouchableOpacity
              key={item.num}
              style={[styles.quickBtn, { backgroundColor: item.color }]}
              onPress={() => Linking.openURL(`tel:${item.num}`)}
            >
              <Text style={styles.quickNum}>{item.num}</Text>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Helplines by Section */}
      {helplines.map((section, sIdx) => (
        <View key={sIdx} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          {section.items.map((item, iIdx) => (
            <TouchableOpacity
              key={iIdx}
              style={styles.helplineCard}
              onPress={() => Linking.openURL(`tel:${item.number.replace(/-/g, '')}`)}
            >
              <View style={[styles.iconDot, { backgroundColor: item.color }]}>
                <Text style={styles.iconDotText}>📞</Text>
              </View>
              <View style={styles.helplineInfo}>
                <Text style={styles.helplineName}>{item.name}</Text>
                <Text style={styles.helplineDesc}>{item.desc}</Text>
              </View>
              <View style={[styles.numberBadge, { backgroundColor: item.color + '22' }]}>
                <Text style={[styles.helplineNumber, { color: item.color }]}>
                  {item.number}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#F44336',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#FFCDD2', fontSize: 13, marginTop: 4 },
  quickDial: { backgroundColor: '#fff', margin: 15, borderRadius: 12, padding: 15 },
  quickTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  quickGrid: { flexDirection: 'row', gap: 10 },
  quickBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
  },
  quickNum: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  quickLabel: { color: '#fff', fontSize: 11, marginTop: 3, fontWeight: '600' },
  section: { marginHorizontal: 15, marginBottom: 15 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  helplineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  iconDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDotText: { fontSize: 18 },
  helplineInfo: { flex: 1, marginLeft: 12 },
  helplineName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  helplineDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  numberBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  helplineNumber: { fontSize: 14, fontWeight: 'bold' },
});

export default HelplineScreen;
