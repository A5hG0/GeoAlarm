import * as Location from "expo-location";
import {
  BACKGROUND_TASK_NAME,
  LOCATION_UPDATE_INTERVAL_MS,
} from "@/constants/config";

export async function requestLocationPermissions(): Promise<boolean> {
  const { status: foreground } =
    await Location.requestForegroundPermissionsAsync();
  if (foreground !== "granted") return false;

  const { status: background } =
    await Location.requestBackgroundPermissionsAsync();
  if (background !== "granted") return false;

  return true;
}

export async function getCurrentLocation(): Promise<Location.LocationObject | null> {
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  } catch {
    return null;
  }
}

export async function startBackgroundTracking(): Promise<void> {
  const isRunning =
    await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);
  if (isRunning) return; // already running, don't start twice

  await Location.startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    timeInterval: LOCATION_UPDATE_INTERVAL_MS,
    distanceInterval: 20,
    foregroundService: {
      notificationTitle: "📍 GeoAlarm",
      notificationBody: "Alarm is active — tap to open",
      notificationColor: "#007AFF",
      killServiceOnDestroy: false,
    },
    pausesUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: true,
  });
}

export async function stopBackgroundTracking(): Promise<void> {
  const isRunning =
    await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
  }
}

export async function isBackgroundTrackingActive(): Promise<boolean> {
  return await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);
}
