import Constants from 'expo-constants';

export const getApiUrl = () => {
  // Variable de entorno para producción
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // En desarrollo, usar la IP de Expo
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:5110/api`;
    }
  }
  // Si no se puede determinar la IP, usar una IP local por defecto
  return 'http://10.79.26.165:5110/api';
};