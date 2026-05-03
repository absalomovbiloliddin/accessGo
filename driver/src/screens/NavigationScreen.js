import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { useDriverAuth } from '../context/DriverAuthContext';
import { getDriverSocket } from '../services/socket';
import api from '../services/api';

const mapsModule = Platform.OS === 'web' ? null : require('react-native-maps');
const MapView = mapsModule?.default;
const Marker = mapsModule?.Marker;

export default function NavigationScreen({ route }) {
  const { user } = useDriverAuth();
  const [ride] = useState(route.params?.ride);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    let sub;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const socket = getDriverSocket();
      socket.emit('join:ride', ride.id);

      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 15 },
        (loc) => {
          setCurrent(loc.coords);
          socket.emit('driver:location', {
            rideId: ride.id,
            driverId: user.id,
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            heading: loc.coords.heading,
            speed: loc.coords.speed
          });
        }
      );
    })();

    return () => {
      if (sub) sub.remove();
    };
  }, [ride.id, user.id]);

  const setStatus = async (status) => {
    await api.put(`/rides/${ride.id}/status`, { status });
    const socket = getDriverSocket();
    socket.emit('ride:status:update', { rideId: ride.id, status });
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={[styles.map, styles.webMapPlaceholder]}>
          <Text style={styles.webMapText}>Xarita web versiyada keyinroq qo'shiladi</Text>
        </View>
      ) : MapView && Marker ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: ride.pickup_lat,
            longitude: ride.pickup_lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }}
        >
          <Marker coordinate={{ latitude: ride.pickup_lat, longitude: ride.pickup_lng }} title="Pickup" />
          <Marker coordinate={{ latitude: ride.dropoff_lat, longitude: ride.dropoff_lng }} title="Dropoff" pinColor="blue" />
          {current && <Marker coordinate={{ latitude: current.latitude, longitude: current.longitude }} title="Men" pinColor="green" />}
        </MapView>
      ) : (
        <View style={[styles.map, styles.webMapPlaceholder]}>
          <Text style={styles.webMapText}>Xarita moduli topilmadi</Text>
        </View>
      )}

      <View style={styles.panel}>
        <Text style={styles.title}>Safar navigatsiyasi</Text>
        <Text>Pickup: {ride.pickup_address}</Text>
        <Text>Dropoff: {ride.dropoff_address}</Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#1F5D99' }]} onPress={() => setStatus('arrived')}>
            <Text style={styles.btnText}>Yetib keldim</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#0F7B6C' }]} onPress={() => setStatus('in_progress')}>
            <Text style={styles.btnText}>Boshlash</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  webMapPlaceholder: {
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  webMapText: {
    color: '#153B66',
    fontWeight: '700'
  },
  panel: { backgroundColor: '#fff', padding: 12, gap: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#153B66' },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { flex: 1, borderRadius: 8, padding: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' }
});
