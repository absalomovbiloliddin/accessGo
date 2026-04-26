import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AccessGo</Text>
      <Text style={styles.text}>Maxsus liftli va pandusli furgon taksi xizmati</Text>
      <Text style={styles.text}>Oson buyurtma, xavfsiz safar, real vaqt kuzatuv</Text>
      <Text style={styles.text}>sos tugma orqali tezkor yordam chaqirish</Text>

      <TouchableOpacity style={styles.btn} onPress={completeOnboarding}>
        <Text style={styles.btnText}>Boshlash</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F1F8FF', gap: 14 },
  title: { fontSize: 42, fontWeight: '900', color: '#0B3A6D' },
  text: { fontSize: 16, color: '#28415C' },
  btn: { marginTop: 18, backgroundColor: '#0B3A6D', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' }
});
