import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Linking,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_CONTACTS = 5;

const EmergencyContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', relation: '' });

  const relations = ['Mother', 'Father', 'Sister', 'Brother', 'Friend', 'Husband', 'Other'];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const data = await AsyncStorage.getItem('disha_contacts');
    if (data) setContacts(JSON.parse(data));
  };

  const saveContacts = async (updatedContacts) => {
    setContacts(updatedContacts);
    await AsyncStorage.setItem('disha_contacts', JSON.stringify(updatedContacts));
  };

  const openAddModal = () => {
    if (contacts.length >= MAX_CONTACTS) {
      Alert.alert('Limit Reached', `You can add a maximum of ${MAX_CONTACTS} emergency contacts.`);
      return;
    }
    setEditContact(null);
    setForm({ name: '', phone: '', relation: '' });
    setModalVisible(true);
  };

  const openEditModal = (contact, index) => {
    setEditContact(index);
    setForm({ name: contact.name, phone: contact.phone, relation: contact.relation });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.name || !form.phone) {
      Alert.alert('Error', 'Please enter name and phone number.');
      return;
    }
    if (form.phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
      return;
    }
    const newContact = { ...form, id: Date.now().toString() };
    let updated;
    if (editContact !== null) {
      updated = [...contacts];
      updated[editContact] = newContact;
    } else {
      updated = [...contacts, newContact];
    }
    saveContacts(updated);
    setModalVisible(false);
  };

  const deleteContact = (index) => {
    Alert.alert('Delete Contact', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = contacts.filter((_, i) => i !== index);
          saveContacts(updated);
        },
      },
    ]);
  };

  const renderContact = ({ item, index }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        <Text style={styles.contactRelation}>{item.relation}</Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`tel:${item.phone}`)}
        >
          <Text style={styles.callBtnText}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => openEditModal(item, index)}
        >
          <Text style={styles.editBtnText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteContact(index)}
        >
          <Text style={styles.deleteBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 Emergency Contacts</Text>
        <Text style={styles.headerSub}>
          {contacts.length}/{MAX_CONTACTS} contacts added
        </Text>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>
          🛡️ These contacts will be notified immediately when you trigger an SOS alert.
        </Text>
      </View>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyText}>No emergency contacts added yet</Text>
          <Text style={styles.emptySubText}>
            Add up to 5 trusted people who will be alerted in emergencies
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Add Button */}
      {contacts.length < MAX_CONTACTS && (
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ Add Emergency Contact</Text>
        </TouchableOpacity>
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editContact !== null ? 'Edit Contact' : 'Add Emergency Contact'}
            </Text>

            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter contact's name"
              value={form.name}
              onChangeText={val => setForm({ ...form, name: val })}
            />

            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              value={form.phone}
              keyboardType="phone-pad"
              maxLength={10}
              onChangeText={val => setForm({ ...form, phone: val })}
            />

            <Text style={styles.inputLabel}>Relation</Text>
            <View style={styles.relationRow}>
              {relations.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.relationBtn,
                    form.relation === r && styles.relationBtnActive,
                  ]}
                  onPress={() => setForm({ ...form, relation: r })}
                >
                  <Text
                    style={[
                      styles.relationText,
                      form.relation === r && styles.relationTextActive,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#8B0000',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#ffcccc', fontSize: 13, marginTop: 4 },
  infoBanner: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    margin: 15,
    borderRadius: 8,
  },
  infoText: { color: '#555', fontSize: 13 },
  list: { padding: 15 },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  contactInfo: { flex: 1, marginLeft: 12 },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  contactPhone: { fontSize: 14, color: '#666', marginTop: 2 },
  contactRelation: { fontSize: 12, color: '#8B0000', marginTop: 2, fontWeight: '600' },
  contactActions: { flexDirection: 'row', gap: 8 },
  callBtn: { padding: 8, backgroundColor: '#E8F5E9', borderRadius: 8 },
  callBtnText: { fontSize: 18 },
  editBtn: { padding: 8, backgroundColor: '#E3F2FD', borderRadius: 8 },
  editBtnText: { fontSize: 18 },
  deleteBtn: { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 8 },
  deleteBtnText: { fontSize: 18 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyIcon: { fontSize: 70, marginBottom: 15 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', textAlign: 'center' },
  emptySubText: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  addBtn: {
    backgroundColor: '#8B0000',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  relationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  relationBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  relationBtnActive: { backgroundColor: '#8B0000', borderColor: '#8B0000' },
  relationText: { fontSize: 13, color: '#555' },
  relationTextActive: { color: '#fff', fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelModalBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelModalText: { color: '#555', fontSize: 15 },
  saveBtn: {
    flex: 2,
    backgroundColor: '#8B0000',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});

export default EmergencyContactsScreen;
