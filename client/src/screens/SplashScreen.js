import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AccessGo</Text>
      <Text style={styles.subtitle}>Hamma uchun erkin harakat</Text>
      <ActivityIndicator size="large" color="#0F7B6C" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: '#F4FFFD' },
  logo: { fontSize: 38, fontWeight: '800', color: '#0F7B6C' },
  subtitle: { color: '#2D514A', marginBottom: 8 }
});
