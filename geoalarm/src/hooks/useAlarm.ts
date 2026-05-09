import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { startAlarm, stopAlarm } from "@/services/alarmService";
import { useAlarmStore } from "@/store/alarmStore";

export function useAlarm(isWithinRadius: boolean) {
  const hasTriggered = useRef(false);
  const activeAlarm = useAlarmStore((s) => s.activeAlarm);

  // Reset trigger flag when alarm is cleared
  useEffect(() => {
    if (!activeAlarm) {
      hasTriggered.current = false;
    }
  }, [activeAlarm]);

  useEffect(() => {
    if (isWithinRadius && !hasTriggered.current) {
      hasTriggered.current = true;
      startAlarm();
      router.push("/alarm-triggered");
    }
  }, [isWithinRadius]);

  // Safety: stop alarm if active screen unmounts while alarm is running
  useEffect(() => {
    return () => {
      if (hasTriggered.current) {
        stopAlarm();
      }
    };
  }, []);
}
