import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (isRegister) {
        await register({ fullName, phone, password });
      } else {
        await login({ phone, password });
      }
    } catch (error) {
      Alert.alert('Xatolik', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Ro\'yxatdan o\'tish' : 'Kirish'}</Text>

      {isRegister && <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="To'liq ism" />}
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Telefon" />
      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholder="Parol"
        />
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.eyeBtn}>
          <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.mainBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.mainBtnText}>{loading ? 'Yuklanmoqda...' : isRegister ? 'Hisob yaratish' : 'Kirish'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.switchText}>{isRegister ? 'Akkount bor? Kirish' : 'Akkount yo\'qmi? Ro\'yxatdan o\'ting'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff', gap: 12 },
  title: { fontSize: 30, fontWeight: '800', color: '#1F2A44', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#C8D1E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFCFF'
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8D1E1',
    borderRadius: 10,
    backgroundColor: '#FAFCFF'
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  eyeText: { fontSize: 18 },
  mainBtn: { marginTop: 10, backgroundColor: '#0F7B6C', padding: 13, borderRadius: 10, alignItems: 'center' },
  mainBtnText: { color: '#fff', fontWeight: '700' },
  switchText: { textAlign: 'center', marginTop: 8, color: '#2E4E7E' }
});
