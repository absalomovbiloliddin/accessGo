import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import api from '../services/api';
import AdaptiveMap from '../components/AdaptiveMap';

export default function HomeScreen({ navigation }) {
  const [pickup, setPickup] = useState({ lat: 41.3111, lng: 69.2797, address: 'Toshkent markazi' });
  const [dropoff, setDropoff] = useState({ lat: 41.3275, lng: 69.2812, address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({});
      setPickup({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        address: 'Joriy joylashuv'
      });
    })();
  }, []);

  const handleEstimate = async () => {
    if (!dropoff.address.trim()) {
      Alert.alert('Xatolik', 'Manzil kiriting');
      return;
    }
    navigation.navigate('FareEstimate', { pickup, dropoff });
  };

  const requestRide = async () => {
    try {
      setLoading(true);
      const { data } = await api.post('/rides/request', { pickup, dropoff });
      navigation.navigate('Tracking', { ride: data.ride });
    } catch (error) {
      Alert.alert('Xatolik', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AdaptiveMap
        style={styles.map}
        region={{ latitude: pickup.lat, longitude: pickup.lng, latitudeDelta: 0.06, longitudeDelta: 0.06 }}
        pickup={pickup}
        dropoff={dropoff}
        onPress={(e) =>
          setDropoff((prev) => ({
            ...prev,
            lat: e.nativeEvent.coordinate.latitude,
            lng: e.nativeEvent.coordinate.longitude,
            address: prev.address || 'Xaritadan tanlangan nuqta'
          }))
        }
      />

      <View style={styles.panel}>
        <Text style={styles.heading}>Furgon chaqirish</Text>
        <TextInput
          style={styles.input}
          value={pickup.address}
          onChangeText={(text) => setPickup({ ...pickup, address: text })}
          placeholder="Qayerdan?"
        />
        <TextInput
          style={styles.input}
          value={dropoff.address}
          onChangeText={(text) => setDropoff({ ...dropoff, address: text })}
          placeholder="Qayerga?"
        />
        {Platform.OS === 'web' && (
          <>
            <TextInput
              style={styles.input}
              value={String(dropoff.lat)}
              onChangeText={(text) =>
                setDropoff({
                  ...dropoff,
                  lat: Number.isNaN(Number.parseFloat(text)) ? dropoff.lat : Number.parseFloat(text)
                })
              }
              placeholder="Dropoff latitude"
            />
            <TextInput
              style={styles.input}
              value={String(dropoff.lng)}
              onChangeText={(text) =>
                setDropoff({
                  ...dropoff,
                  lng: Number.isNaN(Number.parseFloat(text)) ? dropoff.lng : Number.parseFloat(text)
                })
              }
              placeholder="Dropoff longitude"
            />
          </>
        )}

        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={handleEstimate}>
            <Text style={styles.btnText}>Narxni ko'rish</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.primary]} onPress={requestRide} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Yuborilmoqda...' : 'Chaqirish'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('History')}>
            <Text>Tarix</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Profile')}>
            <Text>Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkBtn, { backgroundColor: '#FFDEDE' }]} onPress={() => navigation.navigate('Sos')}>
            <Text style={{ color: '#A00000', fontWeight: '700' }}>sos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 8
  },
  heading: { fontSize: 20, fontWeight: '700', color: '#0F3F3A' },
  input: { borderWidth: 1, borderColor: '#D8E2E0', borderRadius: 9, padding: 10, backgroundColor: '#F6FBFA' },
  row: { flexDirection: 'row', gap: 8, marginTop: 4 },
  btn: { flex: 1, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  primary: { backgroundColor: '#0F7B6C' },
  secondary: { backgroundColor: '#2264AA' },
  btnText: { color: '#fff', fontWeight: '700' },
  linkBtn: { flex: 1, paddingVertical: 9, alignItems: 'center', backgroundColor: '#F0F4FB', borderRadius: 8 }
});
