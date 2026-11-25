import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { getApiUrl } from '../config';

export default function PerfilScreen() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualPassword, setActualPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const cargarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const API_URL = getApiUrl();
      const resp = await axios.get(`${API_URL}/Alumnos/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerfil(resp.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarPerfil();
    }, [])
  );

  // Valida los requisitos de la nueva contraseña
  const validarNuevaContrasena = (password) => {
    const tieneLongitud = password.length >= 8;
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!tieneLongitud) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!tieneMinuscula) return 'Debe contener al menos una letra minúscula (a-z).';
    if (!tieneMayuscula) return 'Debe contener al menos una letra mayúscula (A-Z).';
    if (!tieneNumero) return 'Debe contener al menos un número (0-9).';
    if (!tieneEspecial) return 'Debe contener al menos un carácter especial (!@#$%^&*()_+-=, etc.).';
    return null;
  };

  const cambiarContrasena = async () => {
    if (!actualPassword || !newPassword) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    const errorValidacion = validarNuevaContrasena(newPassword);
    if (errorValidacion) {
      Alert.alert('Requisito de seguridad', errorValidacion);
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const API_URL = getApiUrl();
      await axios.post(
        `${API_URL}/Auth/cambiar-contrasena`,
        {
          ContrasenaActual: actualPassword,
          ContrasenaNueva: newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Éxito', 'Contraseña actualizada correctamente.');
      setActualPassword('');
      setNewPassword('');
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        error.response?.data ||
        'No se pudo cambiar la contraseña. Verifica tu contraseña actual.';
      Alert.alert('Error', typeof mensaje === 'string' ? mensaje : 'Error desconocido.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3C31C6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatar}>
          <Ionicons name="person-circle" size={80} color="#3C31C6" />
        </View>
        <Text style={styles.name}>
          {perfil?.primer_Nombre} {perfil?.primer_Apellido}
        </Text>

        <View style={styles.infoCard}>
          <InfoRow icon="mail" label="Correo" value={perfil?.correo_Electronico} />
          <InfoRow icon="call" label="Teléfono" value={perfil?.telefono || 'No registrado'} />
        </View>

        {/* Cambio de contraseña */}
        <View style={styles.passwordSection}>
          <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>

          {/* Contraseña actual */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              secureTextEntry={!showActual}
              value={actualPassword}
              onChangeText={setActualPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowActual(!showActual)}
            >
              <Ionicons
                name={showActual ? 'eye-off' : 'eye'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          {/* Nueva contraseña */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNew(!showNew)}
            >
              <Ionicons
                name={showNew ? 'eye-off' : 'eye'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          {/* Requisitos (informativo) */}
          <Text style={styles.requirements}>
            Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
          </Text>

          <TouchableOpacity style={styles.button} onPress={cambiarContrasena} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Actualizar Contraseña</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color="#6B7280" style={{ marginRight: 12 }} />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  passwordSection: {
    width: '100%',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#1F2937',
  },
  eyeButton: {
    padding: 10,
    marginRight: 4,
  },
  requirements: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
    lineHeight: 16,
    paddingLeft: 4,
  },
  button: {
    backgroundColor: '#3C31C6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});