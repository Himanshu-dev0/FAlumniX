import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

// ── Visibility options ────────────────────────────────────────
const VISIBILITY = ["Public", "Alumni Only", "Connections"];

// ── Action options (bottom sheet style) ──────────────────────
const ACTIONS = [
  { id: "photo",    icon: "image",              iconBg: "#4CAF50", iconColor: "#fff", label: "Photo / Video" },
  { id: "tag",      icon: "people",             iconBg: "#2196F3", iconColor: "#fff", label: "Tag People" },
  { id: "feeling",  icon: "happy",              iconBg: "#FFC107", iconColor: "#fff", label: "Feeling / Activity" },
  { id: "checkin",  icon: "location",           iconBg: "#F44336", iconColor: "#fff", label: "Check In" },
  { id: "job",      icon: "briefcase",          iconBg: "#9C27B0", iconColor: "#fff", label: "Share Job Update" },
  { id: "achieve",  icon: "trophy",             iconBg: "#FF9800", iconColor: "#fff", label: "Achievement" },
];

// ── Feeling chips ─────────────────────────────────────────────
const FEELINGS = ["😊 Happy", "🎉 Excited", "💼 Working", "🎓 Proud", "🙏 Grateful", "💪 Motivated", "🤔 Thoughtful"];

export default function AddPost() {
  const navigation = useNavigation();
  const inputRef = useRef(null);

  const [postText, setPostText]           = useState("");
  const [visibility, setVisibility]       = useState("Public");
  const [visDropOpen, setVisDropOpen]     = useState(false);
  const [selectedFeeling, setFeeling]     = useState(null);
  const [feelingPickerOpen, setFeelingOpen] = useState(false);
  const [posting, setPosting]             = useState(false);
  const [selectedImages, setImages]       = useState([]); // placeholder for image URIs

  // ── Visibility icon ──────────────────────────────────────────
  const visIcon =
    visibility === "Public" ? "globe-outline" :
    visibility === "Alumni Only" ? "school-outline" : "people-outline";

  // ── Post handler ─────────────────────────────────────────────
  const handlePost = async () => {
    if (!postText.trim() && selectedImages.length === 0) {
      Alert.alert("Empty Post", "Write something or add a photo before posting.");
      return;
    }
    setPosting(true);
    // TODO: wire to your API / Firestore here
    setTimeout(() => {
      setPosting(false);
      Alert.alert("Posted!", "Your post has been shared.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }, 1200);
  };

  // ── Action tap ───────────────────────────────────────────────
  const handleAction = (id) => {
    if (id === "feeling") { setFeelingOpen(true); return; }
    if (id === "photo") {
      Alert.alert("Photo / Video", "Image picker integration goes here.");
      return;
    }
    Alert.alert("Coming Soon", `"${ACTIONS.find(a => a.id === id)?.label}" will be available soon.`);
  };

  const isPostable = postText.trim().length > 0 || selectedImages.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={22} color="#1a2a6c" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Create Post</Text>
          <TouchableOpacity
            style={[styles.postBtn, isPostable && styles.postBtnActive]}
            onPress={handlePost}
            disabled={posting}
          >
            {posting
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={[styles.postBtnText, isPostable && styles.postBtnTextActive]}>POST</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── Author row ── */}
          <View style={styles.authorRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>AK</Text>
            </View>
            <View style={styles.authorMeta}>
              <Text style={styles.authorName}>Arjun Kapoor</Text>

              {/* Visibility selector */}
              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  style={styles.visPill}
                  onPress={() => setVisDropOpen(!visDropOpen)}
                >
                  <Icon name={visIcon} size={12} color="#1a2a6c" />
                  <Text style={styles.visText}>{visibility}</Text>
                  <Icon name="chevron-down" size={12} color="#1a2a6c" />
                </TouchableOpacity>

                {visDropOpen && (
                  <View style={styles.visDropdown}>
                    {VISIBILITY.map((v) => (
                      <TouchableOpacity
                        key={v}
                        style={styles.visOption}
                        onPress={() => { setVisibility(v); setVisDropOpen(false); }}
                      >
                        <Text style={[styles.visOptionText, v === visibility && styles.visOptionActive]}>
                          {v}
                        </Text>
                        {v === visibility && <Icon name="checkmark" size={14} color="#1a2a6c" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* ── Feeling chip (if selected) ── */}
          {selectedFeeling && (
            <View style={styles.feelingChip}>
              <Text style={styles.feelingChipText}>— feeling {selectedFeeling}</Text>
              <TouchableOpacity onPress={() => setFeeling(null)}>
                <Icon name="close-circle" size={16} color="#888" />
              </TouchableOpacity>
            </View>
          )}

          {/* ── Text input ── */}
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder={`What's on your mind, Arjun?`}
            placeholderTextColor="#c0c0c0"
            multiline
            value={postText}
            onChangeText={setPostText}
            autoFocus
            textAlignVertical="top"
          />

          {/* ── Image preview strip (placeholder) ── */}
          {selectedImages.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imgStrip}>
              {selectedImages.map((uri, i) => (
                <View key={i} style={styles.imgThumb}>
                  <Image source={{ uri }} style={styles.imgThumbImg} />
                  <TouchableOpacity
                    style={styles.imgRemove}
                    onPress={() => setImages(selectedImages.filter((_, j) => j !== i))}
                  >
                    <Icon name="close-circle" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* ── Divider ── */}
          <View style={styles.divider} />

          {/* ── Action rows ── */}
          <View style={styles.actionsCard}>
            <Text style={styles.addToPostLabel}>Add to your post</Text>
            {ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionRow}
                onPress={() => handleAction(action.id)}
              >
                <View style={[styles.actionIconBox, { backgroundColor: action.iconBg }]}>
                  <Icon name={action.icon} size={18} color={action.iconColor} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Icon name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* ── Feeling picker bottom panel ── */}
        {feelingPickerOpen && (
          <View style={styles.feelingPanel}>
            <View style={styles.feelingPanelHeader}>
              <Text style={styles.feelingPanelTitle}>How are you feeling?</Text>
              <TouchableOpacity onPress={() => setFeelingOpen(false)}>
                <Icon name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.feelingGrid}>
              {FEELINGS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.feelingItem, selectedFeeling === f && styles.feelingItemActive]}
                  onPress={() => { setFeeling(f); setFeelingOpen(false); }}
                >
                  <Text style={styles.feelingItemText}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  backBtn: { padding: 4 },
  topTitle: { fontSize: 17, fontWeight: "700", color: "#1a2a6c" },
  postBtn: {
    backgroundColor: "#e8ecf8",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 64,
    alignItems: "center",
  },
  postBtnActive: { backgroundColor: "#1a2a6c" },
  postBtnText: { fontSize: 13, fontWeight: "800", color: "#aab4d4", letterSpacing: 0.5 },
  postBtnTextActive: { color: "#fff" },

  // Author
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 12,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#1a2a6c",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  authorMeta: { gap: 5 },
  authorName: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },

  // Visibility
  visPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e0e4ef",
  },
  visText: { fontSize: 12, color: "#1a2a6c", fontWeight: "600" },
  visDropdown: {
    position: "absolute",
    top: 34,
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    zIndex: 100,
    minWidth: 160,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  visOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f7f7f7",
  },
  visOptionText: { fontSize: 14, color: "#333" },
  visOptionActive: { color: "#1a2a6c", fontWeight: "700" },

  // Feeling
  feelingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  feelingChipText: { fontSize: 14, color: "#666", fontStyle: "italic" },

  // Text input
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 18,
    color: "#1a1a1a",
    minHeight: 140,
    lineHeight: 26,
    textAlignVertical: "top",
  },

  // Image strip
  imgStrip: { paddingHorizontal: 16, marginBottom: 10 },
  imgThumb: { marginRight: 10, position: "relative" },
  imgThumbImg: { width: 90, height: 90, borderRadius: 10 },
  imgRemove: { position: "absolute", top: -6, right: -6 },

  // Divider
  divider: { height: 8, backgroundColor: "#f4f6fb", marginVertical: 6 },

  // Actions
  actionsCard: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  addToPostLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    letterSpacing: 0.6,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 14,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },

  // Feeling panel
  feelingPanel: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  feelingPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  feelingPanelTitle: { fontSize: 16, fontWeight: "700", color: "#1a2a6c" },
  feelingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 10,
  },
  feelingItem: {
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e4ef",
  },
  feelingItemActive: {
    backgroundColor: "#1a2a6c",
    borderColor: "#1a2a6c",
  },
  feelingItemText: { fontSize: 13, color: "#333", fontWeight: "500" },
});