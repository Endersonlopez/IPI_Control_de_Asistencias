import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { getApiUrl } from '../config';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function EstadisticasScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const API_URL = getApiUrl();
      const resp = await axios.get(`${API_URL}/Asistencias/estadisticas-alumno`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(resp.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarStats();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    cargarStats();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3C31C6" />
      </View>
    );
  }

  const data = {
    labels: ['Total', 'Mes', 'Semana'],
    datasets: [{
      data: [
        stats?.totalAsistencias || 0,
        stats?.esteMes || 0,
        stats?.estaSemana || 0,
      ],
    }],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(60, 49, 198, ${opacity})`,
    labelColor: () => '#374151',
    barPercentage: 0.5,
    decimalCount: 0,
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3C31C6']} />
      }
    >
      <Text style={styles.title}>Mis Estadísticas</Text>

      <BarChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero
      />

      <View style={styles.row}>
        <View style={[styles.card, styles.half]}>
          <Ionicons name="calendar" size={32} color="#16A34A" />
          <Text style={styles.number}>{stats?.esteMes || 0}</Text>
          <Text style={styles.label}>Este Mes</Text>
        </View>
        <View style={[styles.card, styles.half]}>
          <Ionicons name="time" size={32} color="#D97706" />
          <Text style={styles.number}>{stats?.estaSemana || 0}</Text>
          <Text style={styles.label}>Esta Semana</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, backgroundColor: '#F3F4F6', flexGrow: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 20 },
  chart: { borderRadius: 16, marginBottom: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: { flexDirection: 'row', gap: 16 },
  half: { flex: 1 },
  number: { fontSize: 36, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  label: { fontSize: 14, color: '#6B7280', marginTop: 4 },
});