import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const BASE_URL = "http://10.156.112.75:3000/api/announcements";

export default function AnnouncementTab() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [refreshing, setRefreshing]       = useState(false);

  // ── Apply modal state ──────────────────────────────────────
  const [modalVisible, setModalVisible]   = useState(false);
  const [selectedAnn, setSelectedAnn]     = useState(null); // which event user is applying for
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [submitting, setSubmitting]       = useState(false);

  // ── Fetch announcements ────────────────────────────────────
  const fetchAnnouncements = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res  = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Server error: " + res.status);
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
      console.log("✅ [ALUMNI ANN] Fetched:", data.length, "announcements");
    } catch (error) {
      console.log("❌ [ALUMNI ANN] Fetch error:", error.message);
      Alert.alert("Error", "Could not load announcements. Check your connection.");
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  // Reload every time tab comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

  // ── Open apply modal ───────────────────────────────────────
  const openApplyModal = (announcement) => {
    setSelectedAnn(announcement);
    setApplicantName("");
    setApplicantEmail("");
    setModalVisible(true);
  };

  // ── Submit application ─────────────────────────────────────
  const handleApply = async () => {
    if (!applicantName.trim() || !applicantEmail.trim()) {
      Alert.alert("Error", "Please fill your name and email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicantEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      // POST application to backend
      // You can create a separate /api/applications route later
      // For now we log and show success
      console.log("📩 [APPLY] Applying for:", selectedAnn?.title);
      console.log("📩 [APPLY] Name:", applicantName, "| Email:", applicantEmail);

      // Simulate a short delay (replace with real API call when ready)
      await new Promise((res) => setTimeout(res, 800));

      setModalVisible(false);
      Alert.alert(
        "Application Submitted! 🎉",
        `You have successfully applied for:\n"${selectedAnn?.title}"\n\nWe will contact you at ${applicantEmail}.`
      );
    } catch (error) {
      console.log("❌ [APPLY] Error:", error.message);
      Alert.alert("Error", "Failed to submit application. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render each announcement card ─────────────────────────
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>EVENT</Text>
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      {/* Title & Description */}
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>

      {/* Apply button */}
      <TouchableOpacity
        style={styles.applyBtn}
        onPress={() => openApplyModal(item)}
      >
        <Text style={styles.applyBtnText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#1a2a6c" />
        <Text style={styles.loadingText}>Loading announcements...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ── Main List ── */}
      <FlatList
        data={announcements}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAnnouncements(true)}
            colors={["#1a2a6c"]}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Announcements</Text>
            <Text style={styles.subheader}>
              {announcements.length} event{announcements.length !== 1 ? "s" : ""} available
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📢</Text>
            <Text style={styles.emptyText}>No announcements yet.</Text>
            <Text style={styles.emptySubText}>Pull down to refresh.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* ── Apply Modal ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Modal header */}
              <Text style={styles.modalTitle}>Apply for Event</Text>
              <View style={styles.modalEventBox}>
                <Text style={styles.modalEventName}>{selectedAnn?.title}</Text>
                <Text style={styles.modalEventDate}>{selectedAnn?.date}</Text>
              </View>

              {/* Form */}
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={applicantName}
                onChangeText={setApplicantName}
              />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={applicantEmail}
                onChangeText={setApplicantEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Buttons */}
              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={handleApply}
                disabled={submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.submitBtnText}>Submit Application</Text>
                }
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: "#f0f2f7" },
  centered:  { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f2f7" },
  loadingText: { marginTop: 10, color: "#666", fontSize: 14 },

  // ── Header ──
  headerContainer: { padding: 20, paddingBottom: 10 },
  header:    { fontSize: 28, fontWeight: "bold", color: "#1a2a6c" },
  subheader: { fontSize: 14, color: "#888", marginTop: 4 },

  // ── Announcement card ──
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#e8eeff",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#1a2a6c" },
  dateText:  { fontSize: 12, color: "#888" },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#1a2a6c", marginBottom: 6 },
  cardDesc:  { fontSize: 14, color: "#555", lineHeight: 20, marginBottom: 14 },

  applyBtn: {
    backgroundColor: "#1a2a6c",
    borderRadius: 25,
    paddingVertical: 11,
    alignItems: "center",
  },
  applyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // ── Empty state ──
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyIcon:    { fontSize: 48, marginBottom: 12 },
  emptyText:    { fontSize: 16, color: "#aaa", fontWeight: "600" },
  emptySubText: { fontSize: 13, color: "#ccc", marginTop: 4 },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a2a6c",
    marginBottom: 14,
  },
  modalEventBox: {
    backgroundColor: "#f0f2f7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#1a2a6c",
  },
  modalEventName: { fontSize: 15, fontWeight: "700", color: "#1a2a6c" },
  modalEventDate: { fontSize: 12, color: "#888", marginTop: 3 },

  inputLabel: { fontSize: 13, fontWeight: "600", color: "#444", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#fafafa",
  },

  submitBtn: {
    backgroundColor: "#1a2a6c",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  cancelBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelBtnText: { color: "#666", fontWeight: "600", fontSize: 15 },
});