import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AlumniDrawer from "../../Drawer/drawer";
import HomeCards from "./HomeCards";

// ── Static notifications ──────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: "1",
    icon: "people",
    iconBg: "#E8F0FE",
    iconColor: "#1a2a6c",
    title: "New Alumni Joined",
    body: "Rahul Sharma (Batch '22) just joined the Alumni Network.",
    time: "2 min ago",
  },
  {
    id: "2",
    icon: "megaphone",
    iconBg: "#FFF3E0",
    iconColor: "#F57C00",
    title: "Placement Drive",
    body: "TCS Campus Drive for 2025 passouts opens tomorrow. Register now!",
    time: "1 hr ago",
  },
  {
    id: "3",
    icon: "calendar",
    iconBg: "#E8F5E9",
    iconColor: "#2E7D32",
    title: "Alumni Reunion 2025",
    body: "Annual Alumni Reunion is scheduled for Dec 20–21 at the campus auditorium.",
    time: "3 hr ago",
  },
  {
    id: "4",
    icon: "trophy",
    iconBg: "#FCE4EC",
    iconColor: "#C62828",
    title: "Achievement Spotlight",
    body: "Karan Malhotra (Batch '20) featured in MIT Tech Review 35 Under 35!",
    time: "Yesterday",
  },
  {
    id: "5",
    icon: "briefcase",
    iconBg: "#E3F2FD",
    iconColor: "#1565C0",
    title: "Job Referral Request",
    body: "Pooja Iyer sent you a referral request for Senior BA role at Deloitte.",
    time: "Yesterday",
  },
  {
    id: "6",
    icon: "school",
    iconBg: "#F3E5F5",
    iconColor: "#6A1B9A",
    title: "Mentorship Match",
    body: "You've been matched as a mentor to Sneha Verma (Batch '24). Say hello!",
    time: "2 days ago",
  },
  {
    id: "7",
    icon: "newspaper",
    iconBg: "#E0F7FA",
    iconColor: "#00695C",
    title: "Alumni Newsletter",
    body: "The October Alumni Newsletter is live. Read about batch highlights & more.",
    time: "3 days ago",
  },
];

// ── Notification Item ─────────────────────────────────────────
function NotifItem({ item }) {
  return (
    <TouchableOpacity style={notifStyles.item}>
      <View style={[notifStyles.iconCircle, { backgroundColor: item.iconBg }]}>
        <Icon name={item.icon} size={20} color={item.iconColor} />
      </View>
      <View style={notifStyles.textBlock}>
        <Text style={notifStyles.title}>{item.title}</Text>
        <Text style={notifStyles.body}>{item.body}</Text>
        <Text style={notifStyles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── HomeTab ───────────────────────────────────────────────────
export default function HomeTab() {
  const navigation = useNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        {/* Hamburger */}
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.menuBtn}
        >
          <Icon name="menu-outline" size={28} color="#1a2a6c" />
        </TouchableOpacity>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={16} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search alumni, posts..."
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Icon name="close-circle" size={16} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* Notification bell */}
        <TouchableOpacity
          onPress={() => setNotifVisible(true)}
          style={styles.bellBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="notifications-outline" size={25} color="#1a2a6c" />
          {/* Badge dot */}
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      {/* ── Feed ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feed}
      >
        <HomeCards />
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── Notification Modal ── */}
      <Modal
        visible={notifVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setNotifVisible(false)}
      >
        <View style={modalStyles.backdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setNotifVisible(false)}
          />
          <View style={modalStyles.sheet}>
            {/* Sheet handle */}
            <View style={modalStyles.handle} />

            {/* Header */}
            <View style={modalStyles.header}>
              <Text style={modalStyles.headerTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setNotifVisible(false)}>
                <Icon name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
              data={NOTIFICATIONS}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => <NotifItem item={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 30 }}
            />
          </View>
        </View>
      </Modal>

      {/* ── Drawer ── */}
      <AlumniDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigate}
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f2f5" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ebebeb",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  menuBtn: { padding: 2 },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  searchIcon: { marginRight: 2 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
    padding: 0,
  },

  bellBtn: { padding: 2, position: "relative" },
  badgeDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E53935",
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  feed: { paddingTop: 8 },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: "80%",
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    marginBottom: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a2a6c",
  },
});

const notifStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 14,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: { flex: 1 },
  title: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", marginBottom: 3 },
  body: { fontSize: 13, color: "#555", lineHeight: 18, marginBottom: 4 },
  time: { fontSize: 11, color: "#aaa" },
});