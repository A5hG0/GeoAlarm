import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAlarmStore } from '@/store/alarmStore';
import { COLORS, SPACING } from '@/constants/theme';

export default function ActiveScreen() {
  const { activeAlarm, clearAlarm } = useAlarmStore();

  if (!activeAlarm) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No active alarm</Text>
        <Text style={styles.emptySubText}>Go to Set Alarm tab to create one</Text>
      </View>
    );
  }

  function handleCancel() {
    clearAlarm();
    router.push('/(tabs)/home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Destination</Text>
        <Text style={styles.value}>{activeAlarm.destinationLabel}</Text>

        <Text style={styles.label}>Coordinates</Text>
        <Text style={styles.value}>
          {activeAlarm.destination.latitude.toFixed(4)},{' '}
          {activeAlarm.destination.longitude.toFixed(4)}
        </Text>

        <Text style={styles.label}>Alert radius</Text>
        <Text style={styles.value}>{activeAlarm.radiusMeters}m</Text>

        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Alarm is active</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelText}>Cancel Alarm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});