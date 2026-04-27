import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDriverAuth } from '../context/DriverAuthContext';

export default function DriverLoginScreen() {
  const { login } = useDriverAuth();
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      await login({ phone, password });
    } catch (error) {
      Alert.alert('Xatolik', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Haydovchi Kabineti</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Telefon" keyboardType="phone-pad" />
      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
          placeholder="Parol"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.eyeBtn}>
          <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onLogin} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Kirilmoqda...' : 'Kirish'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#fff', gap: 10 },
  title: { fontSize: 30, fontWeight: '900', color: '#153B66', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#CFD8E6', borderRadius: 9, padding: 10 },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFD8E6',
    borderRadius: 9
  },
  passwordInput: { flex: 1, padding: 10 },
  eyeBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  eyeText: { fontSize: 18 },
  btn: { backgroundColor: '#0F7B6C', padding: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' }
});
