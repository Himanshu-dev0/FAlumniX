import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import AlumniScreen from "../screens/AlumniScreen";
import AnnouncementScreen from "../screens/AnnouncementScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileTab from "../screens/AlumniScreens/ProfileTab/ProfileTab";
import AnnouncementTab from "../screens/AlumniScreens/AnnouncemnentTab/AnnouncementTab";
import HomeTab from "../screens/AlumniScreens/HomeTab/HomeTab";
import AddPost from "../screens/Drawer/DrawerScreens/Add-Post/AddPost";
import SearchAlumni from "../screens/Drawer/DrawerScreens/Search-Alumni/SearchAlumni";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabBarScreenOptions = ({ route }) => ({
  headerShown: false,
  tabBarStyle: {
    marginBottom: -10,
    height: 60,
    borderRadius: 15,
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    elevation: 5,
    backgroundColor: "#fff",
  },
  tabBarActiveTintColor: "#007bff",
  tabBarInactiveTintColor: "#777",
  tabBarIcon: ({ color, size, focused }) => {
    let iconName;
    if (route.name === "Dashboard")    iconName = focused ? "home" : "home-outline";
    else if (route.name === "Alumni")  iconName = focused ? "people" : "people-outline";
    else if (route.name === "Announcements") iconName = focused ? "notifications" : "notifications-outline";
    else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
    else if (route.name === "Home")    iconName = focused ? "home" : "home-outline";
    return <Icon name={iconName} size={size} color={color} />;
  },
});

// ─── Admin: 4 tabs ────────────────────────────────────────────
function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarScreenOptions}>
      <Tab.Screen name="Dashboard"     component={HomeScreen}         options={{ tabBarLabel: "Dashboard" }} />
      <Tab.Screen name="Alumni"        component={AlumniScreen}       options={{ tabBarLabel: "Alumni" }} />
      <Tab.Screen name="Announcements" component={AnnouncementScreen} options={{ tabBarLabel: "Announcements" }} />
      <Tab.Screen name="Profile"       component={ProfileScreen}      options={{ tabBarLabel: "Profile" }} />
    </Tab.Navigator>
  );
}

// ─── Alumni: 3 tabs (no stack screens here) ───────────────────
function AlumniTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarScreenOptions}>
      <Tab.Screen name="Home"          component={HomeTab}         options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="Announcements" component={AnnouncementTab} options={{ tabBarLabel: "Announcements" }} />
      <Tab.Screen name="Profile"       component={ProfileTab}      options={{ tabBarLabel: "Profile" }} />
    </Tab.Navigator>
  );
}

// ─── Alumni Stack: tabs + full-screen drawer destinations ─────
//     AddPost and SearchAlumni render WITHOUT the tab bar
function AlumniStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* The tab layout is the "home" of this stack */}
      <Stack.Screen name="AlumniTabs" component={AlumniTabs} />

      {/* Drawer destinations — pushed on top, no tab bar */}
      <Stack.Screen
        name="AddPost"
        component={AddPost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchAlumni"
        component={SearchAlumni}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// ─── Root: picks tabs based on role ──────────────────────────
export default function TabNavigator({ route }) {
  const { role } = route?.params || {};
  return role === "admin" ? <AdminTabs /> : <AlumniStack />;
}