// app.config.js
export default ({ config }) => {
  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...(config.android?.config || {}),
        googleMaps: {
          // Expo inyectará esto automáticamente al leer el .env
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID
        }
      }
    },
    plugins: [
      ...(config.plugins || []),
      [
        "react-native-maps",
        {
          iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS,
          androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID
        }
      ]
    ]
  };
};