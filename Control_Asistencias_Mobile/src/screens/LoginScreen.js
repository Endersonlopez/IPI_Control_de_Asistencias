import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { getApiUrl } from '../config';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para el modal de recuperación
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Ingresa usuario y contraseña');
      return;
    }

    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const response = await axios.post(`${API_URL}/Auth/login`, {
        Nombre_Usuario: username.trim(),
        Contrasena: password.trim()
      });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        if (response.data.usuario) {
          await AsyncStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        }
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        Alert.alert('Error', 'Credenciales inválidas. Verifica usuario y contraseña.');
      } else {
        Alert.alert('Error', 'No se pudo conectar con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotUsername.trim()) {
      Alert.alert('Error', 'Ingresa tu usuario o correo electrónico');
      return;
    }

    setForgotLoading(true);
    try {
      const API_URL = getApiUrl();
      await axios.post(`${API_URL}/Auth/solicitar-cambio`, {
        Nombre_Usuario: forgotUsername.trim()
      });
      setForgotModalVisible(false);
      setForgotUsername('');
      Alert.alert('Solicitud enviada', 'Un administrador te asignará una nueva contraseña.');
    } catch (error) {
      const mensaje = error.response?.data?.message || error.response?.data || 'No se pudo enviar la solicitud.';
      Alert.alert('Error', typeof mensaje === 'string' ? mensaje : 'Error desconocido.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y título */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="qr-code" size={56} color="#3C31C6" />
          </View>
          <View style={styles.brandInfo}>
            <Text style={styles.brandSubtitle}>Sistema Universitario</Text>
            <Text style={styles.brandTitle}>Control de Asistencias</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcome}>Bienvenido de vuelta</Text>
          <Text style={styles.instructions}>Ingresa tus credenciales para continuar</Text>

          {/* Campo de usuario */}
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          {/* Campo de contraseña con ojo */}
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          {/* Checkbox y enlace */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <Ionicons
                name={rememberMe ? 'checkbox' : 'square-outline'}
                size={18}
                color="#3C31C6"
              />
              <Text style={styles.checkboxLabel}>Recuérdame</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
              <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Botón de ingreso */}
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Ingresar al sistema</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2026 Universidad de Managua — Control de asistencias</Text>
      </ScrollView>

      {/* Modal de recuperación de contraseña (fuera del ScrollView para que se muestre sobre el teclado) */}
      <Modal
        visible={forgotModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar contraseña</Text>
            <Text style={styles.modalSubtitle}>
              Ingresa tu nombre de usuario o correo electrónico para solicitar un cambio de contraseña. Un administrador te asignará una nueva.
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Usuario o correo electrónico"
              value={forgotUsername}
              onChangeText={setForgotUsername}
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setForgotModalVisible(false);
                  setForgotUsername('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleForgotPassword}
                disabled={forgotLoading}
              >
                {forgotLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.sendButtonText}>Enviar solicitud</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#EBE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3C31C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  brandInfo: {
    alignItems: 'center',
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    color: '#1F2937',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#1F2937',
  },
  eyeButton: {
    padding: 10,
    marginRight: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  forgotPassword: {
    fontSize: 13,
    color: '#3C31C6',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#3C31C6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#3C31C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 30,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 18,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 20,
    color: '#1F2937',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#3C31C6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});