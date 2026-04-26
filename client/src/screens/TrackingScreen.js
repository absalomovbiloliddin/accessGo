import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { getSocket } from '../services/socket';
import AdaptiveMap from '../components/AdaptiveMap';

export default function TrackingScreen({ route, navigation }) {
  const [ride, setRide] = useState(route.params?.ride || null);
  const [driverLocation, setDriverLocation] = useState(null);

  useEffect(() => {
    const socket = getSocket();

    (async () => {
      if (!ride) {
        const { data } = await api.get('/rides/active');
        if (!data.ride) return;
        setRide(data.ride);
      }
    })();

    if (ride?.id) {
      socket.emit('join:ride', ride.id);
    }

    const onLocation = (payload) => {
      if (payload.rideId === ride?.id) {
        setDriverLocation({ latitude: payload.lat, longitude: payload.lng });
      }
    };

    const onStatus = ({ rideId, status }) => {
      if (rideId === ride?.id) setRide((prev) => ({ ...prev, status }));
    };

    socket.on('driver:location:update', onLocation);
    socket.on('ride:status:changed', onStatus);

    return () => {
      socket.off('driver:location:update', onLocation);
      socket.off('ride:status:changed', onStatus);
    };
  }, [ride?.id]);

  const region = useMemo(() => {
    const latitude = driverLocation?.latitude || ride?.pickup_lat || 41.3111;
    const longitude = driverLocation?.longitude || ride?.pickup_lng || 69.2797;
    return { latitude, longitude, latitudeDelta: 0.06, longitudeDelta: 0.06 };
  }, [driverLocation, ride]);

  const cancelRide = async () => {
    try {
      await api.put(`/rides/${ride.id}/status`, { status: 'cancelled' });
      Alert.alert('Bekor qilindi', 'Buyurtma bekor qilindi');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Xatolik', error.response?.data?.message || error.message);
    }
  };

  if (!ride) {
    return (
      <View style={styles.center}>
        <Text>Faol buyurtma topilmadi</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdaptiveMap
        style={styles.map}
        region={region}
        pickup={{ lat: ride.pickup_lat, lng: ride.pickup_lng }}
        dropoff={{ lat: ride.dropoff_lat, lng: ride.dropoff_lng }}
        driverLocation={driverLocation}
      />

      <View style={styles.panel}>
        <Text style={styles.title}>Holat: {ride.status}</Text>
        <Text>Taxminiy narx: {ride.fare_uzs?.toLocaleString()} so'm</Text>

        {ride.status === 'completed' ? (
          <TouchableOpacity style={styles.payBtn} onPress={() => navigation.navigate('Payment', { ride })}>
            <Text style={styles.btnText}>To'lovga o'tish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelRide}>
            <Text style={styles.btnText}>Bekor qilish</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  panel: { backgroundColor: '#fff', padding: 16, gap: 8 },
  title: { fontSize: 18, fontWeight: '700', color: '#0F3F3A' },
  cancelBtn: { marginTop: 6, backgroundColor: '#B02929', borderRadius: 9, padding: 11, alignItems: 'center' },
  payBtn: { marginTop: 6, backgroundColor: '#0F7B6C', borderRadius: 9, padding: 11, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
