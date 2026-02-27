import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import call from "react-native-phone-call"; // ✅ Direct call package

const serviceCategories = [
  {
    id: "police",
    icon: "👮",
    label: "Police Stations",
    color: "#3F51B5",
    services: [
      {
        name: "Vijayawada Central Police Station",
        phone: "08662571000",
        address: "MG Road, Vijayawada",
      },
      {
        name: "Guntur District Police",
        phone: "08632223456",
        address: "Guntur City",
      },
      {
        name: "Visakhapatnam CP Office",
        phone: "08912754290",
        address: "Vishakapatnam",
      },
      {
        name: "AP Police Helpline",
        phone: "08662970258",
        address: "Amaravati, AP",
      },
    ],
  },
  {
    id: "hospital",
    icon: "🏥",
    label: "Hospitals",
    color: "#F44336",
    services: [
      {
        name: "GGH Vijayawada",
        phone: "08662574622",
        address: "Governorpet, Vijayawada",
      },
      {
        name: "NIMS Hospital",
        phone: "04023489000",
        address: "Punjagutta, Hyderabad",
      },
      { name: "Guntur Govt Hospital", phone: "08632229844", address: "Guntur" },
      {
        name: "King George Hospital",
        phone: "08912566666",
        address: "Visakhapatnam",
      },
    ],
  },
  {
    id: "maternity",
    icon: "🤱",
    label: "Maternity Centers",
    color: "#E91E63",
    services: [
      {
        name: "Government Maternity Hospital VJA",
        phone: "08662577200",
        address: "Vijayawada",
      },
      {
        name: "Mother & Child Hospital",
        phone: "08632229855",
        address: "Guntur",
      },
      {
        name: "Area Hospital Kurnool",
        phone: "08518220000",
        address: "Kurnool",
      },
    ],
  },
  {
    id: "bloodbank",
    icon: "🩸",
    label: "Blood Banks",
    color: "#B71C1C",
    services: [
      {
        name: "AP Blood Bank Vijayawada",
        phone: "08662577210",
        address: "Vijayawada",
      },
      { name: "Red Cross Blood Bank", phone: "18001807777", address: "Guntur" },
      {
        name: "Government Blood Bank Vizag",
        phone: "08912764100",
        address: "Visakhapatnam",
      },
      {
        name: "LifeSource Blood Bank",
        phone: "040-23556789",
        address: "Amaravati",
      },
    ],
  },
  {
    id: "pharmacy",
    icon: "💊",
    label: "Pharmacies",
    color: "#4CAF50",
    services: [
      {
        name: "Janaushadhi Store VJA",
        phone: "08662571234",
        address: "Eluru Road, Vijayawada",
      },
      { name: "AP MedSupply Guntur", phone: "08632233456", address: "Guntur" },
      {
        name: "Government Pharmacy VSP",
        phone: "08912567890",
        address: "Visakhapatnam",
      },
    ],
  },
  {
    id: "counselling",
    icon: "🧠",
    label: "Counselling Centers",
    color: "#9C27B0",
    services: [
      {
        name: "iCall Helpline",
        phone: "9152987821",
        address: "Pan India (Online)",
      },
      {
        name: "AP Women Counselling Center",
        phone: "18005990019",
        address: "Amaravati",
      },
      {
        name: "Vandrevala Foundation",
        phone: "18602662345",
        address: "Pan India",
      },
    ],
  },
];

// ✅ DIRECT CALL - No dialer screen, no intermediate app!
const makeDirectCall = (phoneNumber) => {
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");

  const args = {
    number: cleanNumber,
    prompt: false, // 🔑 false = skip dialer, call directly!
  };

  call(args).catch((err) => {
    Alert.alert(
      "Call Failed",
      "Unable to make the call. Please check the number.",
    );
    console.error(err);
  });
};

const NearbyServicesScreen = () => {
  const [activeCategory, setActiveCategory] = useState("police");
  const active = serviceCategories.find((s) => s.id === activeCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏥 Nearby Services</Text>
        <Text style={styles.headerSub}>Find help near you instantly</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {serviceCategories.map((cat) => (
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
              onPress={() => makeDirectCall(item.phone)}
            >
              <Text style={styles.callServiceText}>📞 Call</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { backgroundColor: "#FF9800", padding: 20, paddingTop: 40 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerSub: { color: "#FFF3E0", fontSize: 13, marginTop: 4 },
  tabs: { backgroundColor: "#fff", maxHeight: 80 },
  tabsContent: { paddingHorizontal: 10, paddingVertical: 10, gap: 8 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  tabIcon: { fontSize: 16 },
  tabLabel: { fontSize: 13, color: "#555", fontWeight: "600" },
  tabLabelActive: { color: "#fff" },
  list: { padding: 15, gap: 10 },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 15, fontWeight: "bold", color: "#333" },
  serviceAddress: { fontSize: 12, color: "#777", marginTop: 4 },
  servicePhone: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
    fontWeight: "600",
  },
  callServiceBtn: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 10,
  },
  callServiceText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

export default NearbyServicesScreen;
