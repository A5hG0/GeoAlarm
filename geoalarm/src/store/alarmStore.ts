import { create } from 'zustand';
import { Alarm } from '@/types';

interface AlarmStore {
  activeAlarm: Alarm | null;
  setAlarm: (alarm: Alarm) => void;
  clearAlarm: () => void;
}

export const useAlarmStore = create<AlarmStore>((set) => ({
  activeAlarm: null,
  setAlarm: (alarm) => set({ activeAlarm: alarm }),
  clearAlarm: () => set({ activeAlarm: null }),
}));