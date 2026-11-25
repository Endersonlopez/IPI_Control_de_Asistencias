import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { getApiUrl } from '../config';

export default function MisAsistenciasScreen() {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarAsistencias = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const API_URL = getApiUrl();
      const resp = await axios.get(`${API_URL}/Asistencias/mis-asistencias`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAsistencias(resp.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarAsistencias();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    cargarAsistencias();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatearHora = (hora) => hora?.substring(0, 5) || '';

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.materia}>{item.nombre_Materia}</Text>
        <Text
          style={[
            styles.estado,
            item.nombre_Estado_Asistencia === 'Presente' ? styles.presente : styles.otro,
          ]}
        >
          {item.nombre_Estado_Asistencia}
        </Text>
      </View>
      <Text style={styles.fecha}>
        {formatearFecha(item.fecha)} {formatearHora(item.hora)}
      </Text>
      <Text style={styles.profesor}>Prof: {item.nombre_Profesor}</Text>
      <Text style={styles.horario}>
        Clase: {item.hora_Clase_Inicio} - {item.hora_Clase_Fin}
      </Text>
      <Text style={styles.retraso}>Retraso: {item.retraso || 'Ninguno'}</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3C31C6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Asistencias</Text>
      <FlatList
        data={asistencias}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_Asistencia.toString()}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <Text style={styles.empty}>No tienes asistencias registradas.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingTop: 50, paddingHorizontal: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 20 },
  list: { paddingBottom: 20 },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  materia: { fontSize: 16, fontWeight: '600', color: '#3C31C6' },
  estado: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  presente: { backgroundColor: '#DCFCE7', color: '#16A34A' },
  otro: { backgroundColor: '#FEE2E2', color: '#EF4444' },
  fecha: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  profesor: { fontSize: 13, color: '#6B7280', marginBottom: 2 },
  horario: { fontSize: 12, color: '#9CA3AF' },
  retraso: { fontSize: 12, color: '#F59E0B', marginTop: 4 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontSize: 16 },
});