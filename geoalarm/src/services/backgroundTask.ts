import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { getDistanceMeters } from "@/utils/geoUtils";
import { startAlarm } from "@/services/alarmService";
import { BACKGROUND_TASK_NAME } from "@/constants/config";

const triggeredAlarms = new Set<string>();
let lastNotificationBody = "";

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

async function updateLiveNotification(body: string): Promise<void> {
  // Only update if content actually changed
  if (body === lastNotificationBody) return;
  lastNotificationBody = body;

  // Dismiss old notification
  await Notifications.dismissNotificationAsync("geoalarm-live");

  // Repost updated notification
  await Notifications.scheduleNotificationAsync({
    identifier: "geoalarm-live",
    content: {
      title: "📍 GeoAlarm",
      body,
      sticky: true,
      autoDismiss: false,
      priority: Notifications.AndroidNotificationPriority.LOW,
    },
    trigger: null,
  });
}

TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background task error:", error);
    return;
  }

  if (!data) return;

  const { locations } = data as { locations: Location.LocationObject[] };

  const current = locations[0]?.coords;

  if (!current) return;

  try {
    const AsyncStorage = (
      await import("@react-native-async-storage/async-storage")
    ).default;

    const raw = await AsyncStorage.getItem("geoalarm-store");

    if (!raw) return;

    const parsed = JSON.parse(raw);

    const alarms = parsed?.state?.alarms ?? [];

    if (alarms.length === 0) return;

    const distances = alarms.map((alarm: any) => ({
      alarm,
      distance: getDistanceMeters(
        current.latitude,
        current.longitude,
        alarm.destination.latitude,
        alarm.destination.longitude,
      ),
    }));

    // Find closest alarm
    const closest = distances.reduce((a: any, b: any) =>
      a.distance < b.distance ? a : b,
    );

    // Round distance to nearest 50m
    const roundedDistance = Math.round(closest.distance / 50) * 50;

    const distanceText = formatDistance(roundedDistance);

    const body =
      alarms.length === 1
        ? `${closest.alarm.destinationLabel} — ${distanceText} away`
        : `Closest: ${closest.alarm.destinationLabel} — ${distanceText} away`;

    await updateLiveNotification(body);

    // Check alarms
    for (const { alarm, distance } of distances) {
      if (distance <= alarm.radiusMeters && !triggeredAlarms.has(alarm.id)) {
        triggeredAlarms.add(alarm.id);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "⏰ Wake Up!",
            body: `You have reached ${alarm.destinationLabel}!`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
            vibrate: [0, 500, 200, 500],
          },
          trigger: null,
        });

        await startAlarm();
      }
    }
  } catch (e) {
    console.error("Background task failed:", e);
  }
});
