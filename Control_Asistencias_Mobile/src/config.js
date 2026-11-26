import Constants from 'expo-constants';

const PROD_API_URL = 'https://controldeasistencia.runasp.net/api';

export const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:5110/api`;
    }
  }

  return PROD_API_URL;
};
