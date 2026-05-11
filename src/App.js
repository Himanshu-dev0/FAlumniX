import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TabNavigator from './navigation/TabNavigator';
import SplashScreen from './screens/SplashScreen';
import RoleSelection from './screens/RoleSelection';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './navigation/AuthContext';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const checkStoredLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const role = await AsyncStorage.getItem('role');
        console.log('🔍 [APP] Stored token:', token, '| role:', role);
        if (token && role) {
          setUser({ token, role });
        }
      } catch (error) {
        console.log('❌ [APP] AsyncStorage error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStoredLogin();
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || loading) {
    return <SplashScreen />;
  }

 return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthProvider setUser={setUser}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#1a2a6c" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen
              name="Home"
              component={TabNavigator}
              initialParams={{ role: user.role }}
            />
          ) : (
            <>
              <Stack.Screen name="RoleSelection" component={RoleSelection} />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                initialParams={{ setUser }}
              />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </AuthProvider>
  </GestureHandlerRootView>
);
}