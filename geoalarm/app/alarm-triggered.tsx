import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAlarmStore } from '@/store/alarmStore';
import { stopAlarm } from '@/services/alarmService';
import { saveToHistory } from '@/services/storageService';
import { SPACING } from '@/constants/theme';

export default function AlarmTriggeredScreen() {
  const { alarms, triggeredAlarmId, removeAlarm, setTriggeredAlarm } = useAlarmStore();

  async function handleDismiss() {
    await stopAlarm();

    // Save to history as triggered
    const alarm = alarms.find((a) => a.id === triggeredAlarmId);
    if (alarm) {
      await saveToHistory({
        id: alarm.id,
        destination: alarm.destination,
        destinationLabel: alarm.destinationLabel,
        radiusMeters: alarm.radiusMeters,
        status: 'triggered',
        createdAt: alarm.createdAt,
        resolvedAt: Date.now(),
      });
      removeAlarm(alarm.id);
    }

    setTriggeredAlarm(null);
    router.replace('/(tabs)/home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⏰</Text>
      <Text style={styles.title}>Wake Up!</Text>
      <Text style={styles.subtitle}>You have reached your destination</Text>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={handleDismiss}
        activeOpacity={0.8}
      >
        <Text style={styles.dismissText}>I'm Awake!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  emoji: { fontSize: 80 },
  title: {
    fontSize: 52,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  dismissButton: {
    backgroundColor: 'white',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl * 2,
    borderRadius: 50,
    marginTop: SPACING.xl,
    elevation: 8,
  },
  dismissText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF3B30',
  },
});