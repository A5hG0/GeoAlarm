import "dotenv/config";

export default {
  expo: {
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
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },

      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GMAP_API,
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

      package: "com.anonymous.geoalarm",
    },

    plugins: [
      "expo-router",

      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "GeoAlarm needs your location to wake you up when you reach your destination.",
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
  },
};
