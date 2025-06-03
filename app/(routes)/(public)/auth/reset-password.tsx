import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function getTokenFromParams(tokenParam: string | string[] | undefined): string {
  if (Array.isArray(tokenParam)) return tokenParam[0] || '';
  return tokenParam || '';
}

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const [token, setToken] = useState(getTokenFromParams(params.token));
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      Alert.alert('Resultado', data.message || 'Contraseña actualizada');
    } catch (e) {
      Alert.alert('Error', 'No se pudo restablecer la contraseña');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Restablecer contraseña</Text>
      <TextInput
        placeholder="Token del correo"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20 }}
      />
      <TextInput
        placeholder="Nueva contraseña"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 20 }}
      />
      <Button title={loading ? 'Enviando...' : 'Restablecer'} onPress={handleResetPassword} disabled={loading} />
    </View>
  );
} 