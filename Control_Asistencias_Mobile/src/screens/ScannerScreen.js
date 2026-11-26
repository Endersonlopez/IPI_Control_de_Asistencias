import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getApiUrl } from '../config';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || loading) return;    
    
    setScanned(true);
    setLoading(true);
    setErrorMsg(null);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Sesión expirada', 'Debes iniciar sesión nuevamente.');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      const API_URL = getApiUrl();
      const response = await axios.post(
        `${API_URL}/Asistencias/registrar-qr`,
        { TokenQR: data },   // Enviamos el texto completo del QR
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.clase) {
        setResultado(response.data.clase);
      } else {
        setErrorMsg('No se pudo registrar la asistencia.');
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        Alert.alert('Sesión expirada', 'Inicia sesión nuevamente.');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else {
        const mensaje = error.response?.data?.message || error.response?.data || 'Error al registrar asistencia.';
        setErrorMsg(typeof mensaje === 'string' ? mensaje : 'Error desconocido.');
      }
    } finally {
      setLoading(false);
    }
  };

  const reiniciarEscaneo = () => {
    setScanned(false);
    setResultado(null);
    setErrorMsg(null);
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3C31C6" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Ionicons name="camera" size={64} color="#9CA3AF" />
        <Text style={styles.permissionText}>Permiso de cámara requerido</Text>
        <TouchableOpacity style={styles.backButton} onPress={requestPermission}>
          <Text style={styles.backButtonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (resultado || errorMsg) {
    return (
      <View style={styles.resultContainer}>
        {resultado ? (
          <>
            <Ionicons name="checkmark-circle" size={80} color="#16A34A" />
            <Text style={styles.successTitle}>¡Asistencia registrada!</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Materia</Text>
              <Text style={styles.infoValue}>{resultado.nombre_Materia}</Text>
              <Text style={styles.infoSubvalue}>{resultado.codigo_Materia}</Text>
              
              <Text style={[styles.infoLabel, { marginTop: 12 }]}>Profesor</Text>
              <Text style={styles.infoValue}>{resultado.nombre_Profesor}</Text>
              
              <Text style={[styles.infoLabel, { marginTop: 12 }]}>Horario</Text>
              <Text style={styles.infoValue}>{resultado.hora_Inicio} - {resultado.hora_Fin}</Text>
            </View>
          </>
        ) : (
          <>
            <Ionicons name="close-circle" size={80} color="#EF4444" />
            <Text style={styles.errorTitle}>Error al registrar</Text>
            <Text style={styles.errorMessage}>{errorMsg}</Text>
          </>
        )}
        
        <TouchableOpacity style={styles.actionButton} onPress={reiniciarEscaneo}>
          <Ionicons name="scan" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Volver a intentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.middleOverlay}>
          <View style={styles.leftOverlay} />
          <View style={styles.scannerFrame}>
            <Ionicons name="scan-outline" size={200} color="rgba(255,255,255,0.3)" />
          </View>
          <View style={styles.rightOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Registrando asistencia...</Text>
            </View>
          ) : (
            <Text style={styles.hintText}>Apunta la cámara al código QR de la clase</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 30 },
  permissionText: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 16 },
  backButton: { marginTop: 20, backgroundColor: '#3C31C6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  backButtonText: { color: '#FFFFFF', fontWeight: '600' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
  topOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 50, paddingRight: 20 },
  closeButton: { padding: 8 },
  middleOverlay: { flexDirection: 'row', height: 250 },
  leftOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  scannerFrame: { width: 250, height: 250, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(60, 49, 198, 0.8)', borderRadius: 20, backgroundColor: 'transparent' },
  rightOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingBottom: 40 },
  hintText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500', textAlign: 'center', paddingHorizontal: 40 },
  loadingBox: { alignItems: 'center' },
  loadingText: { color: '#FFFFFF', fontSize: 16, marginTop: 12 },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, backgroundColor: '#F3F4F6' },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginTop: 16 },
  errorTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginTop: 16 },
  errorMessage: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginTop: 20, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  infoLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 },
  infoValue: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginTop: 2 },
  infoSubvalue: { fontSize: 14, color: '#3C31C6', fontWeight: '500', marginTop: 2 },
  actionButton: { backgroundColor: '#3C31C6', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, width: '100%' },
  actionButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { marginTop: 12, padding: 12 },
  secondaryButtonText: { color: '#3C31C6', fontWeight: '600', fontSize: 14 },
});