import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { useAlarmStore } from "@/store/alarmStore";
import { getDistanceMeters } from "@/utils/geoUtils";

export function useGeoFence() {
  const activeAlarm = useAlarmStore((s) => s.activeAlarm);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    // No alarm active — stop watching
    if (!activeAlarm) {
      watchRef.current?.remove();
      watchRef.current = null;
      setDistanceMeters(null);
      setIsWithinRadius(false);
      return;
    }

    // Start watching location
    let cancelled = false;

    async function startWatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted" || cancelled) return;

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // update every 5 seconds
          distanceInterval: 10, // or every 10 meters moved
        },
        (location) => {
          if (!activeAlarm) return;

          const dist = getDistanceMeters(
            location.coords.latitude,
            location.coords.longitude,
            activeAlarm.destination.latitude,
            activeAlarm.destination.longitude,
          );

          setDistanceMeters(dist);
          setIsWithinRadius(dist <= activeAlarm.radiusMeters);
        },
      );
    }

    startWatching();

    return () => {
      cancelled = true;
      watchRef.current?.remove();
      watchRef.current = null;
    };
  }, [activeAlarm]);

  return { distanceMeters, isWithinRadius };
}
