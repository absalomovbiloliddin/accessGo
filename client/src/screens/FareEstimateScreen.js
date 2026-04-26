import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

export default function FareEstimateScreen({ route, navigation }) {
  const { pickup, dropoff } = route.params;
  const [fare, setFare] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post('/rides/estimate', { pickup, dropoff });
        setFare(data.fareUzs);
        setDistance(data.distanceKm);
        setDuration(data.durationMin);
      } catch (error) {
        Alert.alert('Xatolik', error.response?.data?.message || error.message);
      }
    })();
  }, [pickup, dropoff]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Narx Hisobi</Text>
      <Text style={styles.text}>Masofa: {distance ?? '-'} km</Text>
      <Text style={styles.text}>Davomiylik: {duration ?? '-'} min</Text>
      <Text style={styles.price}>{fare ? `${fare.toLocaleString()} so'm` : 'Hisoblanmoqda...'}</Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.btnText}>Bosh sahifaga qaytish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', gap: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#153B66' },
  text: { fontSize: 17, color: '#2D4663' },
  price: { fontSize: 34, fontWeight: '900', color: '#0F7B6C', marginVertical: 16 },
  btn: { backgroundColor: '#153B66', borderRadius: 10, padding: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' }
});
