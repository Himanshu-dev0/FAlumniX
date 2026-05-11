import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export default function AlumniScreen({ navigation }) {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const departmentOptions = [
    "School of Engineering & Technology",
    "School of Computer Application",
    "School of Leadership & Management",
    "School of Allied Health Sciences",
    "School of Behavioral and Social Sciences",
    "School of Media Studies & Humanities",
    "School of Design",
    "School of Commerce",
    "School of Culinary and Hotel Management",
    "Clear Selection",
  ];

  // FETCH DATA
  const loadDirectory = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://10.156.112.75:3000/api/profile"
      );

      const result = await response.json();

      const formatted = result.map((item, index) => ({
        user_id: item._id || index.toString(),
        name: item.name || "No Name",
        email: item.email || "No Email",
        department: item.department || "",
        graduation_year: item.graduation_year || "",
        company: item.company || "N/A",
      }));

      setData(formatted);
      setAllData(formatted);
      setCount(formatted.length);

      navigation.navigate("HomeScreen", { count: formatted.length });
    } catch (error) {
      console.log("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDirectory();
    }, [])
  );

  // SEARCH FUNCTION
  const handleSearch = () => {
    if (search === "" && department === "" && year === "") {
      setData(allData);
      return;
    }

    const filtered = allData.filter((item) => {
      return (
        (search === "" ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.department.toLowerCase().includes(search.toLowerCase()) ||
          item.graduation_year.includes(search)) &&
        (department === "" ||
          item.department.toLowerCase().trim() ===
            department.toLowerCase().trim()) &&
        (year === "" || item.graduation_year.includes(year))
      );
    });

    setData(filtered);
  };

  const AlumniCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.meta}>{item.email}</Text>
      <Text style={styles.meta}>Department: {item.department}</Text>
      <Text style={styles.meta}>Graduation: {item.graduation_year}</Text>
      <Text style={styles.meta}>Company: {item.company}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Alumni Directory</Text>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Text style={styles.icon}>🔍</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Search by name / department / year"
            placeholderTextColor="#7e7c7c"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.icon}>🏫</Text>
              <Text
                style={[
                  styles.inputField,
                  {
                    color: department ? "#000" : "#7e7c7c",
                    paddingVertical: 2,
                  },
                ]}
              >
                {department || "Department"}
              </Text>
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdown}>
                <FlatList
                  data={departmentOptions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        if (item === "Clear Selection") {
                          setDepartment("");
                          setData(allData); // 🔥 reset list
                        } else {
                          setDepartment(item);
                        }
                        setShowDropdown(false);
                      }}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* Year */}
          <View style={styles.inputWrapper}>
            <Text style={styles.icon}>📅</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Year"
              placeholderTextColor="#7e7c7c"
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
            />
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        {/* List */}
        {loading ? (
          <ActivityIndicator size="large" color="#1a2a6c" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.user_id.toString()}
            renderItem={AlumniCard}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a2a6c",
    marginBottom: 14,
  },
  row: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
    backgroundColor: "#fff",
    flex: 1,
  },
  icon: { fontSize: 16, marginRight: 8 },
  inputField: { flex: 1, paddingVertical: 8, color: "#000", fontSize: 14 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchButton: {
    backgroundColor: "#1a2a6c",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  searchButtonText: { color: "#fff", fontWeight: "600" },
  list: { paddingBottom: 90 },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "700", color: "#1a2a6c" },
  meta: { color: "#7e7c7c" },
});