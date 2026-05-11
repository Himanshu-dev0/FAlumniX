import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const SplashScreen = () => {

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.replace("RoleSelection"); // next screen
  //   }, 3000);
  // }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.jpg")}
        style={styles.logo}
      />
      <Text style={styles.title}>Alumni Connect</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
  title: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },
});