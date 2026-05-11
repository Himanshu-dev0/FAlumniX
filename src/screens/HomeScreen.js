import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "../navigation/AuthContext";

const BASE_URL = "http://10.156.112.75:3000";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { setUser } = useAuth();

  const [alumniCount, setAlumniCount]             = useState(0);
  const [announcements, setAnnouncements]         = useState([]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [loadingCounts, setLoadingCounts]         = useState(false);

  // ── Fetch all data whenever screen is focused ──────────────
  useFocusEffect(
    useCallback(() => {
      setShowAnnouncements(false); // collapse list on every return
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    setLoadingCounts(true);
    try {
      // Alumni count
      const alumniRes  = await fetch(`${BASE_URL}/api/profile`);
      const alumniData = await alumniRes.json();
      setAlumniCount(Array.isArray(alumniData) ? alumniData.length : 0);
      console.log("✅ [HOME] Alumni count:", alumniData.length);

      // Announcements
      const annRes  = await fetch(`${BASE_URL}/api/announcements`);
      const annData = await annRes.json();
      setAnnouncements(Array.isArray(annData) ? annData : []);
      console.log("✅ [HOME] Announcements count:", annData.length);

    } catch (error) {
      console.log("❌ [HOME] fetchData error:", error.message);
    } finally {
      setLoadingCounts(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────
  const logoutUser = async () => {
    try {
      console.log("🔴 [LOGOUT] Starting logout...");
      await AsyncStorage.clear();
      console.log("✅ [LOGOUT] AsyncStorage cleared");
      setUser(null);
      console.log("✅ [LOGOUT] setUser(null) called");
    } catch (error) {
      console.log("❌ [LOGOUT] Error:", error.message);
    }
  };

  // ── Announcement card (each row) ──────────────────────────
  const renderAnnouncement = ({ item, index }) => (
    <View style={styles.annCard}>
      <View style={styles.annRow}>
        <Text style={styles.annIndex}>{index + 1}.</Text>
        <View style={{ flex: 1 }}>
          <View style={styles.annTitleRow}>
            <Text style={styles.annTitle}>{item.title}</Text>
            <Text style={styles.annDate}>{item.date}</Text>
          </View>
          <Text style={styles.annDesc}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={showAnnouncements ? announcements : []}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={renderAnnouncement}

        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Hello, Admin</Text>

            {/* ── Alumni Card ── */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Alumni")}
            >
              <Text style={styles.cardLabel}>Total Alumni</Text>
              {loadingCounts
                ? <ActivityIndicator color="#1a2a6c" />
                : <Text style={styles.cardValue}>{alumniCount}</Text>
              }
            </TouchableOpacity>

            {/* ── Announcement Card (tap to expand/collapse) ── */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.card, showAnnouncements && styles.cardActive]}
              onPress={() => setShowAnnouncements((prev) => !prev)}
            >
              <View style={styles.cardRowSpace}>
                <View>
                  <Text style={[styles.cardLabel, showAnnouncements && styles.lightText]}>
                    Announcements
                  </Text>
                  {loadingCounts
                    ? <ActivityIndicator color={showAnnouncements ? "#fff" : "#1a2a6c"} />
                    : <Text style={[styles.cardValue, showAnnouncements && styles.lightText]}>
                        {announcements.length}
                      </Text>
                  }
                </View>
                <Text style={[styles.chevron, showAnnouncements && styles.lightText]}>
                  {showAnnouncements ? "▲" : "▼"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* ── Section heading shown only when expanded ── */}
            {showAnnouncements && (
              <Text style={styles.sectionHeading}>All Announcements</Text>
            )}
          </View>
        }

        ListEmptyComponent={
          showAnnouncements && !loadingCounts ? (
            <Text style={styles.emptyText}>No announcements found.</Text>
          ) : null
        }

        ListFooterComponent={
          <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        }

        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: "#f4f6fb" },
  container: { padding: 20 },

  title:    { fontSize: 28, fontWeight: "bold", color: "#1a2a6c" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 25 },

  // ── Stat cards ──
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
  },
  cardActive: {
    backgroundColor: "#1a2a6c",
    borderColor: "#1a2a6c",
  },
  cardRowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: { fontSize: 16, color: "#666" },
  cardValue: { fontSize: 28, fontWeight: "bold", color: "#1a2a6c" },
  lightText: { color: "#fff" },
  chevron:   { fontSize: 20, color: "#1a2a6c", fontWeight: "bold" },

  sectionHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a2a6c",
    marginBottom: 10,
    marginTop: -5,
  },

  // ── Announcement list cards ──
  annCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#1a2a6c",
    elevation: 1,
  },
  annRow:     { flexDirection: "row", alignItems: "flex-start" },
  annIndex:   { fontSize: 14, fontWeight: "700", color: "#1a2a6c", marginRight: 8, marginTop: 2 },
  annTitleRow:{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  annTitle:   { fontSize: 15, fontWeight: "700", color: "#1a2a6c", flex: 1 },
  annDate:    { fontSize: 12, color: "#888", marginLeft: 8 },
  annDesc:    { fontSize: 13, color: "#555", lineHeight: 19 },

  emptyText: { textAlign: "center", color: "#aaa", marginTop: 10, fontSize: 14 },

  // ── Logout ──
  logoutButton: {
    margin: 20,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#1a2a6c",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  logoutText: { fontSize: 16, fontWeight: "600", color: "#1a2a6c" },
});