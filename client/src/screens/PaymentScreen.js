import React, { useState } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

const methods = [
  { key: 'click', label: 'Click' },
  { key: 'payme', label: 'Payme' },
  { key: 'cash', label: 'Naqd' }
];

export default function PaymentScreen({ route, navigation }) {
  const ride = route.params?.ride;
  const [selected, setSelected] = useState('click');
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    try {
      if (!ride?.id) {
        Alert.alert('Xatolik', 'Ride topilmadi');
        return;
      }

      setLoading(true);
      const { data } = await api.post('/payment/initiate', {
        rideId: ride.id,
        method: selected
      });

      if (data.checkoutUrl) {
        await Linking.openURL(data.checkoutUrl);
      } else {
        Alert.alert('Muvaffaqiyatli', 'Naqd to\'lov qayd qilindi.');
      }

      navigation.navigate('History');
    } catch (error) {
      Alert.alert('Xatolik', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To'lov usuli</Text>
      <Text style={styles.price}>{ride?.fare_uzs?.toLocaleString()} so'm</Text>

      {methods.map((m) => (
        <TouchableOpacity
          key={m.key}
          style={[styles.method, selected === m.key && styles.methodSelected]}
          onPress={() => setSelected(m.key)}
        >
          <Text style={styles.methodText}>{m.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.payBtn} onPress={pay} disabled={loading}>
        <Text style={styles.payText}>{loading ? 'Yuborilmoqda...' : 'To\'lovni boshlash'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', gap: 10 },
  title: { fontSize: 27, fontWeight: '800', color: '#153B66' },
  price: { fontSize: 32, fontWeight: '900', color: '#0F7B6C', marginBottom: 12 },
  method: { borderWidth: 1, borderColor: '#D1D8E5', borderRadius: 10, padding: 12 },
  methodSelected: { borderColor: '#0F7B6C', backgroundColor: '#ECFBF8' },
  methodText: { fontWeight: '600' },
  payBtn: { marginTop: 14, backgroundColor: '#153B66', borderRadius: 10, padding: 13, alignItems: 'center' },
  payText: { color: '#fff', fontWeight: '700' }
});
