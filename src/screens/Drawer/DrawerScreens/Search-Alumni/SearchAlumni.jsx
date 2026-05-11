import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AlumniDrawer from '../../drawer';
import { SafeAreaView } from 'react-native';

const SearchAlumni = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleNavigate = (screen) => {
    navigation.navigate(screen); // make sure AddPost and SearchAlumni are registered in your navigator
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => setDrawerOpen(true)}
        hitSlop={{ top: 10, bottom: 10, left: 2, right: 10 }}
      >
        <Icon name="menu-outline" size={28} color="#1a2a6c" />
      </TouchableOpacity>
      <Text>search alumni</Text>
      {/* ── Drawer renders as floating overlay, not wrapping the screen ── */}
      <AlumniDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigate}
      />
    </SafeAreaView>
  );
};

export default SearchAlumni;
const styles= StyleSheet.create({
  container:{
    flex:1,
    paddingTop:40,
    paddingLeft:10
  }
})
