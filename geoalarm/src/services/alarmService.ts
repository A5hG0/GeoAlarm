import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

let soundObject: Audio.Sound | null = null;
let vibrationInterval: ReturnType<typeof setInterval> | null = null;
let isStarting = false; // prevent double-start

export async function startAlarm(): Promise<void> {
  if (isStarting || soundObject) return; // already running
  isStarting = true;

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });

    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/alarm.mp3"),
      {
        shouldPlay: true,
        isLooping: true,
        volume: 1.0,
      },
    );

    soundObject = sound;

    vibrationInterval = setInterval(async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }, 800);
  } catch (error) {
    console.error("Failed to start alarm:", error);
  } finally {
    isStarting = false;
  }
}

export async function stopAlarm(): Promise<void> {
  // Stop vibration first (synchronous)
  if (vibrationInterval) {
    clearInterval(vibrationInterval);
    vibrationInterval = null;
  }

  // Stop and unload sound
  const sound = soundObject;
  soundObject = null; // clear reference immediately

  if (sound) {
    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } catch (error) {
      console.error("Failed to stop alarm sound:", error);
    }
  }

  // Reset audio mode
  try {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: false,
    });
  } catch {}
}

export function isAlarmRunning(): boolean {
  return soundObject !== null;
}
