import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    Department: "",
    graduation_year: "",
    skills: "",
    job_title: "",
    company: "",
    location: "",
    linkedin_profile: "",
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://10.156.112.75:3000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Profile saved to database");

        // Reset form after save
        setForm({
          name: "",
          email: "",
          phone: "",
          Department: "",
          graduation_year: "",
          skills: "",
          job_title: "",
          company: "",
          location: "",
          linkedin_profile: "",
        });
      } else {
        Alert.alert("Error", data.error || "Something went wrong");
      }

    } catch (error) {
      Alert.alert("Error", "Cannot connect to server");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fieldConfig = {
    name: { placeholder: "NAME", keyboardType: "default" },
    email: { placeholder: "EMAIL", keyboardType: "email-address" },
    phone: { placeholder: "PHONE", keyboardType: "phone-pad" },
    department: { placeholder: "Department", keyboardType: "default" },
    graduation_year: { placeholder: "GRADUATION YEAR", keyboardType: "numeric" },
    skills: { placeholder: "SKILLS", keyboardType: "default" },
    job_title: { placeholder: "JOB TITLE", keyboardType: "default" },
    company: { placeholder: "COMPANY", keyboardType: "default" },
    location: { placeholder: "LOCATION", keyboardType: "default" },
    linkedin_profile: { placeholder: "LINKEDIN PROFILE URL", keyboardType: "url" },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Add Alumni Profile</Text>
          <Text style={styles.subtitle}>
            Keep your details current for better networking.
          </Text>

          {Object.keys(form).map((key) => (
            <View key={key}>
              {key === "linkedin_profile" && (
                <Text style={styles.sectionLabel}>🔗 LinkedIn</Text>
              )}
              <TextInput
                placeholder={
                  fieldConfig[key]?.placeholder ??
                  key.replace(/_/g, " ").toUpperCase()
                }
                placeholderTextColor="#7e7c7c"
                style={[
                  styles.input,
                  key === "linkedin_profile" && styles.linkedinInput,
                ]}
                value={form[key]}
                onChangeText={(v) => update(key, v)}
                keyboardType={fieldConfig[key]?.keyboardType ?? "default"}
                autoCapitalize={
                  key === "linkedin_profile" ? "none" : "sentences"
                }
                autoCorrect={key === "linkedin_profile" ? false : true}
              />
            </View>
          ))}

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={save}
              disabled={loading}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {loading ? "Saving..." : "Save Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    color: "#1a2a6c",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 18,
    color: "#666",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  linkedinInput: {
    borderColor: "#0077b5",
    borderWidth: 1.5,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0077b5",
    marginBottom: 4,
    marginLeft: 2,
  },
  button: {
    backgroundColor: "#1a2a6c",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
});