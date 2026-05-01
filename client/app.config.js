export default {
  expo: {
    name: 'AccessGo Client',
    slug: 'accessgo-client',
    version: '1.0.0',
    platforms: ['web'],
    web: {
      bundler: 'metro'
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000',
      socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000'
    }
  }
};
