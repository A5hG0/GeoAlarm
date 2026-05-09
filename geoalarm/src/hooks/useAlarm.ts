import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { startAlarm, stopAlarm } from "@/services/alarmService";
import { useAlarmStore } from "@/store/alarmStore";
import { AlarmDistance } from "@/hooks/useGeoFence";

export function useAlarm(distances: AlarmDistance[]) {
  const triggeredRef = useRef<Set<string>>(new Set());
  const { setTriggeredAlarm, alarms } = useAlarmStore();

  useEffect(() => {
    if (alarms.length === 0) {
      triggeredRef.current.clear();
      return;
    }

    for (const d of distances) {
      if (d.isWithinRadius && !triggeredRef.current.has(d.alarmId)) {
        triggeredRef.current.add(d.alarmId);
        setTriggeredAlarm(d.alarmId);
        startAlarm();
        router.push("/alarm-triggered");
        break; // trigger one at a time
      }
    }
  }, [distances]);

  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, []);
}
