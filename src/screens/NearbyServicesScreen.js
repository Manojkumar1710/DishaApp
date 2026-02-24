import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';

const serviceCategories = [
  {
    id: 'police',
    icon: '👮',
    label: 'Police Stations',
    color: '#3F51B5',
    services: [
      { name: 'Vijayawada Central Police Station', phone: '0866-2571000', address: 'MG Road, Vijayawada' },
      { name: 'Guntur District Police', phone: '0863-2223456', address: 'Guntur City' },
      { name: 'Visakhapatnam CP Office', phone: '0891-2754290', address: 'Vishakapatnam' },
      { name: 'AP Police Helpline', phone: '0866-2970258', address: 'Amaravati, AP' },
    ],
  },
  {
    id: 'hospital',
    icon: '🏥',
    label: 'Hospitals',
    color: '#F44336',
    services: [
      { name: 'GGH Vijayawada', phone: '0866-2574622', address: 'Governorpet, Vijayawada' },
      { name: 'NIMS Hospital', phone: '040-23489000', address: 'Punjagutta, Hyderabad' },
      { name: 'Guntur Govt Hospital', phone: '0863-2229844', address: 'Guntur' },
      { name: 'King George Hospital', phone: '0891-2566666', address: 'Visakhapatnam' },
    ],
  },
  {
    id: 'maternity',
    icon: '🤱',
    label: 'Maternity Centers',
    color: '#E91E63',
    services: [
      { name: "Government Maternity Hospital VJA", phone: '0866-2577200', address: 'Vijayawada' },
      { name: "Mother & Child Hospital", phone: '0863-2229855', address: 'Guntur' },
      { name: "Area Hospital Kurnool", phone: '08518-220000', address: 'Kurnool' },
    ],
  },
  {
    id: 'bloodbank',
    icon: '🩸',
    label: 'Blood Banks',
    color: '#B71C1C',
    services: [
      { name: 'AP Blood Bank Vijayawada', phone: '0866-2577210', address: 'Vijayawada' },
      { name: 'Red Cross Blood Bank', phone: '1800-180-7777', address: 'Guntur' },
      { name: 'Government Blood Bank Vizag', phone: '0891-2764100', address: 'Visakhapatnam' },
      { name: 'LifeSource Blood Bank', phone: '040-23556789', address: 'Amaravati' },
    ],
  },
  {
    id: 'pharmacy',
    icon: '💊',
    label: 'Pharmacies',
    color: '#4CAF50',
    services: [
      { name: 'Janaushadhi Store VJA', phone: '0866-2571234', address: 'Eluru Road, Vijayawada' },
      { name: 'AP MedSupply Guntur', phone: '0863-2233456', address: 'Guntur' },
      { name: 'Government Pharmacy VSP', phone: '0891-2567890', address: 'Visakhapatnam' },
    ],
  },
  {
    id: 'counselling',
    icon: '🧠',
    label: 'Counselling Centers',
    color: '#9C27B0',
    services: [
      { name: 'iCall Helpline', phone: '9152987821', address: 'Pan India (Online)' },
      { name: 'AP Women Counselling Center', phone: '1800-599-0019', address: 'Amaravati' },
      { name: 'Vandrevala Foundation', phone: '1860-2662-345', address: 'Pan India' },
    ],
  },
];

const NearbyServicesScreen = () => {
  const [activeCategory, setActiveCategory] = useState('police');

  const active = serviceCategories.find(s => s.id === activeCategory);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏥 Nearby Services</Text>
        <Text style={styles.headerSub}>Find help near you instantly</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {serviceCategories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.tab,
              activeCategory === cat.id && {
                backgroundColor: cat.color,
                borderColor: cat.color,
              },
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={styles.tabIcon}>{cat.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                activeCategory === cat.id && styles.tabLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services List */}
      <FlatList
        data={active.services}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.serviceCard, { borderLeftColor: active.color }]}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceAddress}>📍 {item.address}</Text>
              <Text style={styles.servicePhone}>📞 {item.phone}</Text>
            </View>
            <TouchableOpacity
              style={[styles.callServiceBtn, { backgroundColor: active.color }]}
              onPress={() => Linking.openURL(`tel:${item.phone.replace(/\s/g, '')}`)}
            >
              <Text style={styles.callServiceText}>Call</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#FF9800',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#FFF3E0', fontSize: 13, marginTop: 4 },
  tabs: { backgroundColor: '#fff', maxHeight: 80 },
  tabsContent: { paddingHorizontal: 10, paddingVertical: 10, gap: 8 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  tabIcon: { fontSize: 16 },
  tabLabel: { fontSize: 13, color: '#555', fontWeight: '600' },
  tabLabelActive: { color: '#fff' },
  list: { padding: 15, gap: 10 },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  serviceAddress: { fontSize: 12, color: '#777', marginTop: 4 },
  servicePhone: { fontSize: 13, color: '#555', marginTop: 2, fontWeight: '600' },
  callServiceBtn: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 10,
  },
  callServiceText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default NearbyServicesScreen;
