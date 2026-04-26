import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';

export default function HistoryScreen() {
  const [rides, setRides] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const { data } = await api.get('/rides/history');
      setRides(data.rides || []);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
        ListEmptyComponent={<Text style={styles.empty}>Tarix bo'sh</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.status}>{item.status.toUpperCase()}</Text>
            <Text>{item.pickup_address} → {item.dropoff_address}</Text>
            <Text>{item.fare_uzs.toLocaleString()} so'm</Text>
            <Text style={styles.date}>{new Date(item.updated_at).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#F6F8FC' },
  empty: { textAlign: 'center', marginTop: 30, color: '#5E6B7A' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, gap: 4 },
  status: { fontWeight: '800', color: '#153B66' },
  date: { color: '#607286', fontSize: 12 }
});
