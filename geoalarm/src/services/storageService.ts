import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlarmHistoryEntry } from "@/types";

const HISTORY_KEY = "geoalarm_history";

export async function saveToHistory(entry: AlarmHistoryEntry): Promise<void> {
  try {
    const existing = await getHistory();
    const updated = [entry, ...existing].slice(0, 50); // keep last 50
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save history:", e);
  }
}

export async function getHistory(): Promise<AlarmHistoryEntry[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
