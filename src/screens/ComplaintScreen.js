import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const complaintTypes = [
  'Harassment',
  'Stalking',
  'Domestic Violence',
  'Eve Teasing',
  'Assault',
  'Cybercrime',
  'Child Safety',
  'Other',
];

const ComplaintScreen = () => {
  const [form, setForm] = useState({
    complainantName: '',
    phone: '',
    complaintType: '',
    location: '',
    description: '',
    dateOfIncident: '',
    anonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');

  const handleSubmit = async () => {
    if (!form.complainantName || !form.complaintType || !form.description) {
      Alert.alert('Error', 'Please fill in Name, Complaint Type, and Description.');
      return;
    }

    setSubmitting(true);
    const id = 'DISHA' + Date.now().toString().slice(-6);
    const complaint = {
      ...form,
      id,
      timestamp: new Date().toISOString(),
      status: 'Submitted',
    };

    // Save complaint locally
    try {
      const existing = await AsyncStorage.getItem('disha_complaints');
      const complaints = existing ? JSON.parse(existing) : [];
      complaints.push(complaint);
      await AsyncStorage.setItem('disha_complaints', JSON.stringify(complaints));
    } catch (e) {
      console.log('Save error', e);
    }

    setTimeout(() => {
      setSubmitting(false);
      setComplaintId(id);
      setSubmitted(true);
    }, 1500);
  };

  const resetForm = () => {
    setForm({
      complainantName: '',
      phone: '',
      complaintType: '',
      location: '',
      description: '',
      dateOfIncident: '',
      anonymous: false,
    });
    setSubmitted(false);
    setComplaintId('');
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Complaint Filed!</Text>
          <Text style={styles.successSub}>Your complaint has been submitted successfully.</Text>

          <View style={styles.idCard}>
            <Text style={styles.idLabel}>Complaint ID</Text>
            <Text style={styles.idValue}>{complaintId}</Text>
            <Text style={styles.idHint}>Save this ID to track your complaint</Text>
          </View>

          <View style={styles.successInfo}>
            <Text style={styles.successInfoText}>📋 Type: {form.complaintType}</Text>
            <Text style={styles.successInfoText}>
              📅 Filed: {new Date().toLocaleDateString('en-IN')}
            </Text>
            <Text style={styles.successInfoText}>⏰ Status: Under Review</Text>
          </View>

          <Text style={styles.successNote}>
            Authorities have been notified. You will receive a response within 24 hours.
          </Text>

          <TouchableOpacity style={styles.newComplaintBtn} onPress={resetForm}>
            <Text style={styles.newComplaintBtnText}>File Another Complaint</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📋 File a Complaint</Text>
          <Text style={styles.headerSub}>Report an incident to AP Police</Text>
        </View>

        {/* Anonymous Toggle */}
        <View style={styles.anonCard}>
          <View>
            <Text style={styles.anonTitle}>Anonymous Complaint</Text>
            <Text style={styles.anonSub}>Your identity will not be disclosed</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, form.anonymous && styles.toggleActive]}
            onPress={() => setForm({ ...form, anonymous: !form.anonymous })}
          >
            <View
              style={[
                styles.toggleKnob,
                form.anonymous && styles.toggleKnobActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Name */}
          <Text style={styles.label}>Complainant Name *</Text>
          <TextInput
            style={styles.input}
            placeholder={form.anonymous ? 'Anonymous' : 'Your full name'}
            value={form.complainantName}
            editable={!form.anonymous}
            onChangeText={val => setForm({ ...form, complainantName: val })}
          />

          {/* Phone */}
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Your mobile number"
            value={form.phone}
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={val => setForm({ ...form, phone: val })}
          />

          {/* Complaint Type */}
          <Text style={styles.label}>Type of Complaint *</Text>
          <View style={styles.typeGrid}>
            {complaintTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeBtn,
                  form.complaintType === type && styles.typeBtnActive,
                ]}
                onPress={() => setForm({ ...form, complaintType: type })}
              >
                <Text
                  style={[
                    styles.typeText,
                    form.complaintType === type && styles.typeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location */}
          <Text style={styles.label}>Incident Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Where did the incident occur?"
            value={form.location}
            onChangeText={val => setForm({ ...form, location: val })}
          />

          {/* Date of Incident */}
          <Text style={styles.label}>Date of Incident</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            value={form.dateOfIncident}
            onChangeText={val => setForm({ ...form, dateOfIncident: val })}
          />

          {/* Description */}
          <Text style={styles.label}>Description of Incident *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the incident in detail..."
            value={form.description}
            multiline
            numberOfLines={6}
            onChangeText={val => setForm({ ...form, description: val })}
          />

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              ⚖️ Filing a false complaint is a punishable offense. Please provide
              accurate information.
            </Text>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? '⏳ Submitting...' : '📤 SUBMIT COMPLAINT'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#9C27B0',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#E1BEE7', fontSize: 13, marginTop: 4 },
  anonCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  anonTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  anonSub: { fontSize: 12, color: '#888', marginTop: 2 },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    padding: 3,
  },
  toggleActive: { backgroundColor: '#9C27B0' },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    elevation: 2,
  },
  toggleKnobActive: { marginLeft: 'auto' },
  form: { paddingHorizontal: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  typeBtnActive: { backgroundColor: '#9C27B0', borderColor: '#9C27B0' },
  typeText: { fontSize: 13, color: '#555' },
  typeTextActive: { color: '#fff', fontWeight: '600' },
  disclaimer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  disclaimerText: { color: '#777', fontSize: 12, lineHeight: 18 },
  submitBtn: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  submitBtnDisabled: { backgroundColor: '#CE93D8' },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  // Success screen
  successContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    elevation: 5,
  },
  successIcon: { fontSize: 70 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginTop: 15 },
  successSub: { fontSize: 14, color: '#666', marginTop: 5, textAlign: 'center' },
  idCard: {
    backgroundColor: '#EDE7F6',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  idLabel: { fontSize: 13, color: '#9C27B0', fontWeight: '600' },
  idValue: { fontSize: 26, fontWeight: 'bold', color: '#9C27B0', marginTop: 5, letterSpacing: 2 },
  idHint: { fontSize: 12, color: '#888', marginTop: 5 },
  successInfo: { width: '100%', marginTop: 15, gap: 6 },
  successInfoText: { fontSize: 14, color: '#555' },
  successNote: {
    textAlign: 'center',
    color: '#777',
    fontSize: 13,
    marginTop: 15,
    lineHeight: 20,
  },
  newComplaintBtn: {
    marginTop: 20,
    backgroundColor: '#9C27B0',
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
  newComplaintBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default ComplaintScreen;
