import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';

export default function SosScreen() {
  const [sent, setSent] = useState(false);

  const sendSos = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ruxsat kerak', 'sos yuborish uchun joylashuv ruxsati kerak.');
      return;
    }

    const pos = await Location.getCurrentPositionAsync({});
    setSent(true);

    Alert.alert(
      'sos yuborildi',
      `Koordinata: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}\nYaqinlaringiz va call-markazga xabar yuborildi.`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favqulodda Yordam</Text>
      <Text style={styles.subtitle}>sos bosilganda operatorga joylashuvingiz yuboriladi.</Text>

      <TouchableOpacity style={[styles.sosBtn, sent && styles.sent]} onPress={sendSos}>
        <Text style={styles.sosText}>{sent ? 'sos yuborildi' : 'sos'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#1D0000' },
  title: { fontSize: 30, fontWeight: '900', color: '#FFDADA' },
  subtitle: { color: '#FFDADA', textAlign: 'center', marginVertical: 14 },
  sosBtn: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E20000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#FFD9D9'
  },
  sent: { backgroundColor: '#5A0000' },
  sosText: { color: '#fff', fontSize: 36, fontWeight: '900' }
});
