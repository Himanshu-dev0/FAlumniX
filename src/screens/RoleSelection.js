import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RoleSelection = ({ navigation }) => {

  const goToAdmin = () => {
    navigation.navigate("Login", { role: "admin" });
  };

  const goToAlumni = () => {
    navigation.navigate("Login", { role: "alumni" });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.appName}>Alumni Connect</Text>

      <TouchableOpacity style={styles.button} onPress={goToAlumni}>
        <Text style={styles.buttonText}>Alumni Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={goToAdmin}>
        <Text style={styles.buttonOutlineText}>Admin Login</Text>
      </TouchableOpacity>

    </View>
  );
};

export default RoleSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    color: "#666",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#000",
  },
  button: {
    width: "100%",
    // backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonOutline: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutlineText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});