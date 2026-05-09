import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { useAlarmStore } from '@/store/alarmStore';
import { getDistanceMeters } from '@/utils/geoUtils';

export interface AlarmDistance {
  alarmId: string;
  distanceMeters: number;
  isWithinRadius: boolean;
}

export function useGeoFence() {
  const alarms = useAlarmStore((s) => s.alarms);
  const [distances, setDistances] = useState<AlarmDistance[]>([]);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (alarms.length === 0) {
      watchRef.current?.remove();
      watchRef.current = null;
      setDistances([]);
      return;
    }

    let cancelled = false;

    async function startWatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          const updated = alarms.map((alarm) => {
            const dist = getDistanceMeters(
              location.coords.latitude,
              location.coords.longitude,
              alarm.destination.latitude,
              alarm.destination.longitude,
            );
            return {
              alarmId: alarm.id,
              distanceMeters: dist,
              isWithinRadius: dist <= alarm.radiusMeters,
            };
          });
          setDistances(updated);
        }
      );
    }

    startWatching();

    return () => {
      cancelled = true;
      watchRef.current?.remove();
      watchRef.current = null;
    };
  }, [alarms]);

  return { distances };
}