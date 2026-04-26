import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import FareEstimateScreen from './src/screens/FareEstimateScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SosScreen from './src/screens/SosScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { loading, token, hasSeenOnboarding } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!hasSeenOnboarding && <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />}
        {!token ? (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Kirish / Ro\'yxatdan o\'tish' }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'AccessGo' }} />
            <Stack.Screen name="FareEstimate" component={FareEstimateScreen} options={{ title: 'Narx Hisobi' }} />
            <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Haydovchi Joylashuvi' }} />
            <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'To\'lov' }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Sayohat Tarixi' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil va Sozlamalar' }} />
            <Stack.Screen name="Sos" component={SosScreen} options={{ title: 'Favqulodda sos' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
