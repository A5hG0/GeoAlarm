import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alarm } from "@/types";

interface AlarmStore {
  alarms: Alarm[];
  triggeredAlarmId: string | null;
  addAlarm: (alarm: Alarm) => void;
  removeAlarm: (id: string) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void; // ← new
  clearAll: () => void;
  setTriggeredAlarm: (id: string | null) => void;
}

export const useAlarmStore = create<AlarmStore>()(
  persist(
    (set) => ({
      alarms: [],
      triggeredAlarmId: null,
      addAlarm: (alarm) =>
        set((state) => ({ alarms: [...state.alarms, alarm] })),
      removeAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.filter((a) => a.id !== id),
        })),
      updateAlarm: (
        id,
        updates, // ← new
      ) =>
        set((state) => ({
          alarms: state.alarms.map((a) =>
            a.id === id ? { ...a, ...updates } : a,
          ),
        })),
      clearAll: () => set({ alarms: [] }),
      setTriggeredAlarm: (id) => set({ triggeredAlarmId: id }),
    }),
    {
      name: "geoalarm-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ alarms: state.alarms }),
    },
  ),
);
