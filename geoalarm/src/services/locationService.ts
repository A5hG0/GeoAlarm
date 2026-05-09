import * as Location from "expo-location";

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

export async function startLocationUpdates(
  taskName: string,
  intervalMs: number,
): Promise<void> {
  await Location.startLocationUpdatesAsync(taskName, {
    accuracy: Location.Accuracy.High,
    timeInterval: intervalMs,
    distanceInterval: 10,
    foregroundService: {
      notificationTitle: "GeoAlarm is active",
      notificationBody: "Watching your location...",
      notificationColor: "#007AFF",
    },
    pausesUpdatesAutomatically: false,
  });
}

export async function stopLocationUpdates(taskName: string): Promise<void> {
  const isRunning = await Location.hasStartedLocationUpdatesAsync(taskName);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(taskName);
  }
}
