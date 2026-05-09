import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAlarmStore } from "@/store/alarmStore";
import {
  startBackgroundTracking,
  stopBackgroundTracking,
  isBackgroundTrackingActive,
} from "@/services/locationService";
import { requestLocationPermissions } from "@/services/locationService";
import { setupNotifications } from "@/services/notificationService";

export function useBackgroundManager() {
  const alarms = useAlarmStore((s) => s.alarms);

  // Start/stop tracking when alarms change
  useEffect(() => {
    async function manage() {
      if (alarms.length > 0) {
        // Make sure we have permissions
        const granted = await requestLocationPermissions();
        if (!granted) {
          console.warn("Location permissions not granted");
          return;
        }
        await setupNotifications();
        await startBackgroundTracking();
      } else {
        // No alarms — stop tracking to save battery
        await stopBackgroundTracking();
      }
    }

    manage();
  }, [alarms.length]);

  // Handle app coming back to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (state: AppStateStatus) => {
        if (state === "active" && alarms.length > 0) {
          const running = await isBackgroundTrackingActive();
          if (!running) {
            await startBackgroundTracking();
          }
        }
      },
    );
    return () => subscription.remove();
  }, [alarms.length]);
}
