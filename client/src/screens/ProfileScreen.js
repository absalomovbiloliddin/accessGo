import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
        <Text style={styles.role}>Maqom: Mijoz</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sozlamalar</Text>
        <Text>- Bildirishnomalar: Yoniq</Text>
        <Text>- Til: O'zbek</Text>
        <Text>- Maxsus ehtiyoj profili: Faol</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Chiqish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FBFF', gap: 10 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, gap: 5 },
  name: { fontSize: 24, fontWeight: '800', color: '#153B66' },
  phone: { color: '#36587E' },
  role: { color: '#0F7B6C', fontWeight: '700' },
  sectionTitle: { fontWeight: '700', marginBottom: 4 },
  logoutBtn: { marginTop: 'auto', backgroundColor: '#B02929', borderRadius: 10, padding: 12, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '700' }
});
