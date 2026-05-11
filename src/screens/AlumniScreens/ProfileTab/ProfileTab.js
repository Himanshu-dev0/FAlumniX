import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import AlumniDrawer from "../../Drawer/drawer";
import { useNavigation } from "@react-navigation/native";

// ── Static seed data (replace with API/AsyncStorage data) ─────
const INITIAL_PROFILE = {
  name: "Arjun Kapoor",
  email: "arjun.kapoor@gmail.com",
  phone: "+91 98765 43210",
  department: "Computer Science & Engineering",
  graduation_year: "2021",
  skills: "React Native, Node.js, Python, AWS, MongoDB",
  job_title: "Software Engineer",
  company: "Google",
  location: "Bengaluru, Karnataka",
  linkedin_profile: "linkedin.com/in/arjunkapoor",
};

// ── Helpers ───────────────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// ── Field row for VIEW mode ───────────────────────────────────
function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.iconBox}>
        <Icon name={icon} size={17} color="#1a2a6c" />
      </View>
      <View style={rowStyles.textBox}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

// ── Editable field for EDIT modal ────────────────────────────
function EditField({ label, icon, value, onChangeText, multiline, keyboardType, autoCapitalize }) {
  return (
    <View style={editStyles.fieldWrap}>
      <Text style={editStyles.fieldLabel}>
        <Icon name={icon} size={13} color="#1a2a6c" />
        {"  "}{label}
      </Text>
      <TextInput
        style={[editStyles.input, multiline && editStyles.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType || "default"}
        autoCapitalize={autoCapitalize || "words"}
        placeholderTextColor="#bbb"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </View>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function ProfileTab() {
  const navigation = useNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [editVisible, setEditVisible] = useState(false);
  const [draft, setDraft] = useState(profile);

  const handleNavigate = (screen) => navigation.navigate(screen);

  const openEdit = () => {
    setDraft({ ...profile });
    setEditVisible(true);
  };

  const handleSave = () => {
    if (!draft.name.trim()) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }
    setProfile({ ...draft });
    setEditVisible(false);
  };

  const set = (key) => (val) => setDraft((prev) => ({ ...prev, [key]: val }));

  // Parse skills into pill array
  const skillList = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="menu-outline" size={28} color="#1a2a6c" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>My Profile</Text>
        <TouchableOpacity
          onPress={openEdit}
          style={styles.editTopBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="create-outline" size={22} color="#1a2a6c" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Hero card ── */}
        <View style={styles.heroCard}>
          {/* Banner strip */}
          <View style={styles.banner} />

          {/* Avatar */}
          <View style={styles.avatarRing}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
            </View>
          </View>

          {/* Name & role */}
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{profile.name}</Text>
            {(profile.job_title || profile.company) && (
              <Text style={styles.heroRole}>
                {[profile.job_title, profile.company].filter(Boolean).join(" · ")}
              </Text>
            )}
            {profile.location && (
              <View style={styles.heroLocationRow}>
                <Icon name="location-outline" size={13} color="#888" />
                <Text style={styles.heroLocation}>{profile.location}</Text>
              </View>
            )}
            {profile.graduation_year && (
              <View style={styles.batchPill}>
                <Icon name="school-outline" size={12} color="#1a2a6c" />
                <Text style={styles.batchText}>Batch of {profile.graduation_year}</Text>
              </View>
            )}
          </View>

          {/* LinkedIn button */}
          {profile.linkedin_profile ? (
            <TouchableOpacity style={styles.linkedinBtn}>
              <Icon name="logo-linkedin" size={15} color="#fff" />
              <Text style={styles.linkedinText}>View LinkedIn</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── Skills section ── */}
        {skillList.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="flash" size={16} color="#1a2a6c" />
              <Text style={styles.sectionTitle}>Skills</Text>
            </View>
            <View style={styles.skillsWrap}>
              {skillList.map((skill, i) => (
                <View key={i} style={styles.skillPill}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Personal Info ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="person-circle-outline" size={16} color="#1a2a6c" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <InfoRow icon="mail-outline"       label="Email"       value={profile.email} />
          <InfoRow icon="call-outline"        label="Phone"       value={profile.phone} />
          <InfoRow icon="location-outline"    label="Location"    value={profile.location} />
        </View>

        {/* ── Academic Info ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="school-outline" size={16} color="#1a2a6c" />
            <Text style={styles.sectionTitle}>Academic Details</Text>
          </View>
          <InfoRow icon="library-outline"     label="Department"       value={profile.department} />
          <InfoRow icon="calendar-outline"    label="Graduation Year"  value={profile.graduation_year} />
        </View>

        {/* ── Professional Info ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="briefcase-outline" size={16} color="#1a2a6c" />
            <Text style={styles.sectionTitle}>Professional Details</Text>
          </View>
          <InfoRow icon="briefcase-outline"   label="Job Title"   value={profile.job_title} />
          <InfoRow icon="business-outline"    label="Company"     value={profile.company} />
          <InfoRow icon="logo-linkedin"       label="LinkedIn"    value={profile.linkedin_profile} />
        </View>

        {/* ── Edit CTA ── */}
        <TouchableOpacity style={styles.editCta} onPress={openEdit}>
          <Icon name="create-outline" size={18} color="#fff" />
          <Text style={styles.editCtaText}>Edit Profile</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ══════════ EDIT MODAL ══════════ */}
      <Modal
        visible={editVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <SafeAreaView style={editStyles.modalSafe}>

            {/* Modal header */}
            <View style={editStyles.modalHeader}>
              <TouchableOpacity onPress={() => setEditVisible(false)} style={editStyles.cancelBtn}>
                <Text style={editStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={editStyles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={handleSave} style={editStyles.saveBtn}>
                <Text style={editStyles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={editStyles.scroll}
              keyboardShouldPersistTaps="handled"
            >
              {/* Avatar preview */}
              <View style={editStyles.avatarPreviewWrap}>
                <View style={editStyles.avatarPreview}>
                  <Text style={editStyles.avatarPreviewText}>{getInitials(draft.name)}</Text>
                </View>
                <Text style={editStyles.avatarHint}>Initials auto-generated from name</Text>
              </View>

              {/* Personal */}
              <Text style={editStyles.groupLabel}>PERSONAL</Text>
              <EditField label="Full Name"  icon="person-outline"   value={draft.name}     onChangeText={set("name")} />
              <EditField label="Email"      icon="mail-outline"     value={draft.email}    onChangeText={set("email")} keyboardType="email-address" autoCapitalize="none" />
              <EditField label="Phone"      icon="call-outline"     value={draft.phone}    onChangeText={set("phone")} keyboardType="phone-pad" autoCapitalize="none" />
              <EditField label="Location"   icon="location-outline" value={draft.location} onChangeText={set("location")} />

              {/* Academic */}
              <Text style={editStyles.groupLabel}>ACADEMIC</Text>
              <EditField label="Department"      icon="library-outline"   value={draft.department}      onChangeText={set("department")} />
              <EditField label="Graduation Year" icon="calendar-outline"  value={draft.graduation_year} onChangeText={set("graduation_year")} keyboardType="numeric" autoCapitalize="none" />

              {/* Professional */}
              <Text style={editStyles.groupLabel}>PROFESSIONAL</Text>
              <EditField label="Job Title" icon="briefcase-outline" value={draft.job_title} onChangeText={set("job_title")} />
              <EditField label="Company"   icon="business-outline"  value={draft.company}   onChangeText={set("company")} />
              <EditField label="LinkedIn"  icon="logo-linkedin"     value={draft.linkedin_profile} onChangeText={set("linkedin_profile")} autoCapitalize="none" />
              <EditField
                label="Skills (comma separated)"
                icon="flash-outline"
                value={draft.skills}
                onChangeText={set("skills")}
                multiline
                autoCapitalize="none"
              />

              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
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
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ebebeb",
    elevation: 2,
  },
  topTitle: { fontSize: 17, fontWeight: "700", color: "#1a2a6c" },
  editTopBtn: { padding: 2 },

  // Hero
  heroCard: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  banner: {
    width: "100%",
    height: 90,
    backgroundColor: "#1a2a6c",
  },
  avatarRing: {
    marginTop: -38,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1a2a6c",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26, fontWeight: "800", color: "#fff" },

  heroInfo: { alignItems: "center", marginTop: 10, paddingHorizontal: 20 },
  heroName: { fontSize: 22, fontWeight: "800", color: "#111", letterSpacing: 0.2 },
  heroRole: { fontSize: 14, color: "#444", marginTop: 3, fontWeight: "500" },
  heroLocationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 5 },
  heroLocation: { fontSize: 13, color: "#888" },
  batchPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  batchText: { fontSize: 12, color: "#1a2a6c", fontWeight: "600" },

  linkedinBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0A66C2",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
    marginTop: 14,
  },
  linkedinText: { fontSize: 13, color: "#fff", fontWeight: "700" },

  // Sections
  section: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#1a2a6c", letterSpacing: 0.4 },

  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillPill: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c5d5f5",
  },
  skillText: { fontSize: 13, color: "#1a2a6c", fontWeight: "600" },

  editCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1a2a6c",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 4,
    elevation: 3,
    shadowColor: "#1a2a6c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  editCtaText: { fontSize: 16, color: "#fff", fontWeight: "700" },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f7f7f7",
    gap: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#f0f2f5",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: { flex: 1 },
  label: { fontSize: 11, color: "#aaa", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  value: { fontSize: 14, color: "#222", fontWeight: "500", marginTop: 2 },
});

const editStyles = StyleSheet.create({
  modalSafe: { flex: 1, backgroundColor: "#f4f6fb" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#1a2a6c" },
  cancelBtn: { padding: 4 },
  cancelText: { fontSize: 15, color: "#888" },
  saveBtn: {
    backgroundColor: "#1a2a6c",
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
  },
  saveText: { fontSize: 14, color: "#fff", fontWeight: "700" },

  scroll: { paddingHorizontal: 16, paddingTop: 10 },

  avatarPreviewWrap: { alignItems: "center", marginVertical: 18 },
  avatarPreview: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1a2a6c",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPreviewText: { fontSize: 26, fontWeight: "800", color: "#fff" },
  avatarHint: { fontSize: 11, color: "#aaa", marginTop: 6 },

  groupLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#aaa",
    letterSpacing: 1.2,
    marginTop: 16,
    marginBottom: 6,
    marginLeft: 2,
  },

  fieldWrap: { marginBottom: 10 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e4ef",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#1a1a1a",
  },
  inputMulti: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});