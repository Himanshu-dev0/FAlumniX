import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons";


function LoginScreen({ navigation, route }) {
  const { setUser } = route.params || {};         // ✅ receive setUser from App.js
  const role = route?.params?.role || 'alumni';
  const isAdmin = role === 'admin';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginUser = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', `Please enter ${isAdmin ? 'Admin ID' : 'Email'} and Password`);
      return;
    }

    if (isAdmin) {
      if (identifier === 'admin@gmail.com' && password === 'Admin123') {
        await AsyncStorage.setItem('token', 'admin-token');
        await AsyncStorage.setItem('role', 'admin');

        Toast.show({ type: 'success', text1: 'Admin Login Successful' });

        // ✅ Update App state → triggers re-render → navigates to Home automatically
        setUser({ token: 'admin-token', role: 'admin' });
      } else {
        Toast.show({ type: 'error', text1: 'Invalid Admin Credentials' });
      }
      return;
    }

    // ALUMNI LOGIN (FIREBASE)
    const auth = getAuth(getApp());

    signInWithEmailAndPassword(auth, identifier, password)
      .then(async (userCredential) => {
        const token = userCredential.user.uid;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', 'alumni');

        Toast.show({ type: 'success', text1: 'Login successful' });

        // ✅ Update App state → triggers re-render → navigates to Home automatically
        setUser({ token, role: 'alumni' });
      })
      .catch(error => {
        Toast.show({ type: 'error', text1: 'Login failed', text2: error.message });
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>
            {isAdmin ? 'Admin Connect' : 'Alumni Connect'}
          </Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            placeholder={isAdmin ? 'Enter Admin ID' : 'Enter Email'}
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType={isAdmin ? 'default' : 'email-address'}
            autoCapitalize="none"
            value={identifier}
            onChangeText={setIdentifier}
          />

          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
         <TouchableOpacity
  style={styles.eyeIcon}
  onPress={() => setShowPassword(!showPassword)}
>
  <Icon
    name={showPassword ? "eye-off-outline" : "eye-outline"}
    size={20}
    color="#888"
  />
</TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          {!isAdmin && (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerText}>New user? Create an account</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f6fb' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#1a2a6c' },
  subtitle: { textAlign: 'center', fontSize: 16, marginBottom: 30, color: '#555' },
  input: {
    backgroundColor: 'white', padding: 14, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd', marginBottom: 15, fontSize: 16, color: 'black',
  },
  eyeIcon: { position: 'absolute', right: 15, top: 18 },
  loginButton: { backgroundColor: '#1a2a6c', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  loginText: { color: 'white', fontSize: 18, fontWeight: '600' },
  registerButton: { marginTop: 15, alignItems: 'center' },
  registerText: { color: '#1a2a6c', fontSize: 15, fontWeight: '600' },
});

export default LoginScreen;