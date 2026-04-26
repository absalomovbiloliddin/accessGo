import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';

export default function EarningsScreen() {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/driver/earnings');
      setSummary(data.summary);
      setWeekly(data.weekly || []);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Jami daromad</Text>
        <Text style={styles.big}>{summary?.total_earnings?.toLocaleString() || 0} so'm</Text>
        <Text>Tugatilgan safarlar: {summary?.completed_rides || 0}</Text>
        <Text>O'rtacha chek: {summary?.avg_fare?.toLocaleString() || 0} so'm</Text>
      </View>

      <Text style={styles.subtitle}>So'nggi 7 kun</Text>
      <FlatList
        data={weekly}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{new Date(item.day).toLocaleDateString()}</Text>
            <Text>{item.earnings.toLocaleString()} so'm</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Ma'lumot yo'q</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFF', padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, gap: 4, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700', color: '#153B66' },
  big: { fontSize: 28, fontWeight: '900', color: '#0F7B6C' },
  subtitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  row: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }
});
