import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { getApiUrl } from '../config';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalAsistencias: 0,
    esteMes: 0,
    estaSemana: 0,
  });
  const [userName, setUserName] = useState('Estudiante');
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      const decoded = jwtDecode(token);
      let fullName =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        decoded['unique_name'] ||
        decoded['name'] ||
        decoded['Name'];
      if (!fullName && (decoded['Primer_Nombre'] || decoded['Primer_Apellido'])) {
        fullName = `${decoded['Primer_Nombre'] || ''} ${decoded['Primer_Apellido'] || ''}`.trim();
      }
      if (fullName) setUserName(fullName);

      const API_URL = getApiUrl();
      const resp = await axios.get(`${API_URL}/Asistencias/estadisticas-alumno`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.data) {
        setStats({
          totalAsistencias: resp.data.totalAsistencias || 0,
          esteMes: resp.data.esteMes || 0,
          estaSemana: resp.data.estaSemana || 0,
        });
      }
    } catch (error) {
      console.log('Error al cargar estadísticas:', error?.response?.status || error.message);
    } finally {
      setLoadingStats(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    cargarDatos();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bienvenido</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3C31C6']} />
        }
      >
        {loadingStats && !refreshing ? (
          <ActivityIndicator size="large" color="#3C31C6" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#3C31C6" />
                <Text style={styles.statNumber}>{stats.totalAsistencias}</Text>
                <Text style={styles.statLabel}>Total Asistencias</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="calendar" size={24} color="#16A34A" />
                <Text style={styles.statNumber}>{stats.esteMes}</Text>
                <Text style={styles.statLabel}>Este Mes</Text>
              </View>
            </View>
            <View style={[styles.statCardWide, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time" size={24} color="#D97706" />
              <Text style={styles.statNumber}>{stats.estaSemana}</Text>
              <Text style={styles.statLabel}>Esta Semana</Text>
            </View>
          </>
        )}

        <Text style={styles.menuTitle}>Menú</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Scanner')}>
          <Ionicons name="qr-code" size={24} color="#3C31C6" style={styles.menuIcon} />
          <Text style={styles.menuText}>Escanear QR</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MisAsistencias')}>
          <Ionicons name="list" size={24} color="#3C31C6" style={styles.menuIcon} />
          <Text style={styles.menuText}>Mis Asistencias</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Estadisticas')}>
          <Ionicons name="stats-chart" size={24} color="#3C31C6" style={styles.menuIcon} />
          <Text style={styles.menuText}>Estadísticas</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Perfil')}>
          <Ionicons name="person" size={24} color="#3C31C6" style={styles.menuIcon} />
          <Text style={styles.menuText}>Mi Perfil</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={18} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#3C31C6',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: { color: '#E0E7FF', fontSize: 14 },
  userName: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold', marginTop: 5 },
  content: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statCardWide: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: { marginRight: 16 },
  menuText: { flex: 1, fontSize: 16, color: '#374151', fontWeight: '500' },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
    backgroundColor: '#FEF2F2',
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});