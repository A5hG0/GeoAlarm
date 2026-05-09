import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAlarmStore } from '@/store/alarmStore';
import { stopAlarm } from '@/services/alarmService';
import { SPACING } from '@/constants/theme';

export default function AlarmTriggeredScreen() {
  const clearAlarm = useAlarmStore((s) => s.clearAlarm);

  // Prevent back button from bypassing dismiss
  useEffect(() => {
    // intentionally empty — no cleanup here
    // stopAlarm is only called by handleDismiss
  }, []);

  async function handleDismiss() {
    await stopAlarm();    // stop first
    clearAlarm();         // then clear state
    router.replace('/(tabs)/home');  // then navigate
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
  emoji: {
    fontSize: 80,
  },
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