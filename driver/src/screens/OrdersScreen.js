import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

export default function OrdersScreen({ navigation }) {
  const [ride, setRide] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActive = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data } = await api.get('/rides/active');
      setRide(data.ride);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchActive();
    const i = setInterval(fetchActive, 7000);
    return () => clearInterval(i);
  }, [fetchActive]);

  const updateStatus = async (status) => {
    try {
      await api.put(`/rides/${ride.id}/status`, { status });
      if (status === 'accepted' || status === 'in_progress') {
        navigation.navigate('Navigation', { ride });
      }
      await fetchActive();
    } catch (error) {
      Alert.alert('Xatolik', error.response?.data?.message || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ride ? [ride] : []}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchActive} />}
        ListEmptyComponent={<Text style={styles.empty}>Hozircha buyurtma yo'q</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.status}>Status: {item.status}</Text>
            <Text>Mijoz: {item.customer_name}</Text>
            <Text>{item.pickup_address} → {item.dropoff_address}</Text>
            <Text>Narx: {item.fare_uzs.toLocaleString()} so'm</Text>

            <View style={styles.row}>
              {item.status === 'requested' && (
                <>
                  <TouchableOpacity style={[styles.btn, { backgroundColor: '#0F7B6C' }]} onPress={() => updateStatus('accepted')}>
                    <Text style={styles.btnText}>Qabul</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btn, { backgroundColor: '#B02929' }]} onPress={() => updateStatus('rejected')}>
                    <Text style={styles.btnText}>Rad etish</Text>
                  </TouchableOpacity>
                </>
              )}

              {item.status === 'accepted' && (
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#1F5D99', flex: 1 }]} onPress={() => updateStatus('in_progress')}>
                  <Text style={styles.btnText}>Yo'lga chiqish</Text>
                </TouchableOpacity>
              )}

              {item.status === 'in_progress' && (
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#1F5D99', flex: 1 }]} onPress={() => updateStatus('completed')}>
                  <Text style={styles.btnText}>Yakunlash</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.earnings} onPress={() => navigation.navigate('Earnings')}>
        <Text style={styles.earningsText}>Daromad statistikasi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#F5F8FD' },
  empty: { textAlign: 'center', marginTop: 30, color: '#6D7784' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, gap: 5 },
  status: { fontWeight: '800', color: '#1B4C82' },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  earnings: { marginTop: 10, backgroundColor: '#153B66', padding: 12, borderRadius: 10, alignItems: 'center' },
  earningsText: { color: '#fff', fontWeight: '700' }
});
