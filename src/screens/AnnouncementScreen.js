import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BASE_URL = "mongodb-production-44a3.up.railway.app";

export default function AnnouncementScreen() {
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate]               = useState("");
  const [saving, setSaving]           = useState(false);

  const handleSave = async () => {
    if (!title || !description || !date) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date }),
      });

      if (!response.ok) throw new Error("Failed to store announcement");

      const result = await response.json();
      console.log("✅ [ANNOUNCEMENT] Saved:", result.data._id);

      Alert.alert("Success", "Announcement saved successfully!");

      setTitle("");
      setDescription("");
      setDate("");

    } catch (error) {
      console.log("❌ [ANNOUNCEMENT] Error:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <Text style={styles.header}>Create Announcement</Text>

        <View style={styles.card}>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#7e7c7c"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="Description"
            placeholderTextColor="#7e7c7c"
            style={[styles.input, { height: 80 }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            placeholderTextColor="#7e7c7c"
            style={styles.input}
            value={date}
            onChangeText={setDate}
          />

          <TouchableOpacity
            style={[styles.createBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.createText}>Save Announcement</Text>
            }
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:   { flex: 1, backgroundColor: "#f0f2f7" },
  container:  { padding: 20 },
  header:     { fontSize: 28, fontWeight: "bold", color: "#1a2a6c", marginBottom: 20 },
  card:       { backgroundColor: "#fff", padding: 15, borderRadius: 15 },
  input:      { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginBottom: 10, color: "#000" },
  createBtn:  { backgroundColor: "#1a2a6c", padding: 15, borderRadius: 30, alignItems: "center" },
  createText: { color: "#fff", fontWeight: "600" },
});