export default {
  expo: {
    name: 'AccessGo Driver',
    slug: 'accessgo-driver',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: false,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ''
      }
    },
    android: {
      package: 'uz.accessgo.driver',
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || ''
        }
      }
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000',
      socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000'
    }
  }
};
