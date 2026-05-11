import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "../../navigation/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.72;

export default function AlumniDrawer({ visible, onClose, onNavigate }) {
  const { setUser } = useAuth();
  const slideAnim   = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // ── Animate open/close based on `visible` prop ─────────────
  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 240, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const logoutUser = async () => {
    try {
      onClose();
      await AsyncStorage.clear();
      setUser(null);
    } catch (error) {
      console.log(error)
      Toast.show({
        type:"error",
        text1:"Async storage not cleaered"
    });
    }
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">

      {/* Dark overlay — tap to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sliding drawer panel */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>

        {/* Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <Text style={styles.drawerName}>Alumni Connect</Text>
          <Text style={styles.drawerSub}>Welcome back!</Text>
        </View>

        <View style={styles.divider} />

        {/* Menu items */}
        <View style={styles.menuItems}>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => { onClose(); onNavigate("AddPost"); }}
          >
            <View style={styles.menuIcon}><Text style={styles.menuIconText}>✏️</Text></View>
            <Text style={styles.menuLabel}>Add Post</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => { onClose(); onNavigate("SearchAlumni"); }}
          >
            <View style={styles.menuIcon}><Text style={styles.menuIconText}>🔍</Text></View>
            <Text style={styles.menuLabel}>Search Alumni</Text>
            <Text style={styles.menuArrow}></Text>
          </TouchableOpacity>

        </View>

        {/* Sticky logout at bottom */}
        <View style={styles.drawerFooter}>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.logoutBtn} onPress={logoutUser}>
              <Icon name="log-out-outline" size={16} color="red" style={styles.logoutIcon}/>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 10,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#fff",
    zIndex: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  drawerHeader: {
    backgroundColor: "#1a2a6c",
    paddingTop: 55,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  avatarCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  drawerName: { fontSize: 18, fontWeight: "700", color: "#fff" },
  drawerSub:  { fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 3 },

  divider:   { height: 1, backgroundColor: "#f0f0f0", marginHorizontal: 20 },
  menuItems: { paddingTop: 12, flex: 1 },

  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 15,
  },
  menuIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: "#f0f2f7",
    alignItems: "center", justifyContent: "center",
    marginRight: 14,
  },
  menuIconText: { fontSize: 18 },
  menuLabel:    { flex: 1, fontSize: 15, fontWeight: "600", color: "#1a2a6c" },
  menuArrow:    { fontSize: 20, color: "#bbb" },

  drawerFooter: { paddingVertical: 60 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 16,
  },
  logoutIcon: { fontSize: 20, marginRight: 14 },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#e53935" },
});