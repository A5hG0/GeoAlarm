import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
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
  try {
    // Check task is registered before starting
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
    if (!isRegistered) {
      console.warn("Background task not registered yet — skipping start");
      return;
    }

    const isRunning =
      await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);
    if (isRunning) return;

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
  } catch (e) {
    console.error("startBackgroundTracking failed:", e);
  }
}

export async function stopBackgroundTracking(): Promise<void> {
  try {
    // Guard 1 — check task is registered
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
    if (!isRegistered) return;

    // Guard 2 — check it's actually running
    const isRunning =
      await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);
    if (!isRunning) return;

    await Location.stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
  } catch (e) {
    console.error("stopBackgroundTracking failed:", e);
  }
}

export async function isBackgroundTrackingActive(): Promise<boolean> {
  try {
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
    if (!isRegistered) return false;
    return await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);
  } catch {
    return false;
  }
}
