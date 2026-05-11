import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "GeoAlarm",
  slug: "geoalarm",
  scheme: "geoalarm",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  android: {
    package: "com.ash.geoalarm",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "VIBRATE",
      "WAKE_LOCK",
      "FOREGROUND_SERVICE",
      "FOREGROUND_SERVICE_LOCATION",
      "RECEIVE_BOOT_COMPLETED",
    ],
  },
  plugins: [
    "expo-router",
    "expo-dev-client",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "GeoAlarm needs your location to wake you up when you reach your destination.",
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/icon.png",
        color: "#ffffff",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "bdc1e533-9971-40af-b2a3-72ecbaf612eb",
    },
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
});
