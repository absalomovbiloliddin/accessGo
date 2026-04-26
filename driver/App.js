import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DriverAuthProvider, useDriverAuth } from './src/context/DriverAuthContext';
import DriverLoginScreen from './src/screens/DriverLoginScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import NavigationScreen from './src/screens/NavigationScreen';
import EarningsScreen from './src/screens/EarningsScreen';

const Stack = createNativeStackNavigator();

function Root() {
  const { token } = useDriverAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login" component={DriverLoginScreen} options={{ title: 'Driver Login' }} />
        ) : (
          <>
            <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Buyurtmalar' }} />
            <Stack.Screen name="Navigation" component={NavigationScreen} options={{ title: 'Navigatsiya' }} />
            <Stack.Screen name="Earnings" component={EarningsScreen} options={{ title: 'Daromad' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <DriverAuthProvider>
      <Root />
    </DriverAuthProvider>
  );
}
