import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAlarmStore } from '@/store/alarmStore';
import { useGeoFence } from '@/hooks/useGeoFence';
import { useAlarm } from '@/hooks/useAlarm';
import DistanceIndicator from '@/components/features/DistanceIndicator';
import { COLORS, SPACING } from '@/constants/theme';

export default function ActiveScreen() {
  const { activeAlarm, clearAlarm } = useAlarmStore();
  const { distanceMeters, isWithinRadius } = useGeoFence();
  useAlarm(isWithinRadius); // added useAlarm!

  if (!activeAlarm) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No active alarm</Text>
        <Text style={styles.emptySubText}>Go to Set Alarm tab to create one</Text>
      </View>
    );
  }

  function handleCancel() {
    Alert.alert(
      'Cancel Alarm',
      'Are you sure you want to cancel the active alarm?',
      [
        { text: 'Keep Alarm', style: 'cancel' },
        {
          text: 'Cancel Alarm',
          style: 'destructive',
          onPress: () => {
            clearAlarm();
            router.push('/(tabs)/home');
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>

      {/* Status header */}
      <View style={styles.statusBar}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Alarm Active</Text>
      </View>

      {/* Live distance */}
      <DistanceIndicator
        distanceMeters={distanceMeters}
        radiusMeters={activeAlarm.radiusMeters}
      />

      {/* Alarm info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Destination</Text>
        <Text style={styles.infoValue}>
          {activeAlarm.destination.latitude.toFixed(4)},{' '}
          {activeAlarm.destination.longitude.toFixed(4)}
        </Text>

        <Text style={styles.infoLabel}>Alert radius</Text>
        <Text style={styles.infoValue}>{activeAlarm.radiusMeters}m</Text>
      </View>

      {/* Cancel button */}
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
    gap: SPACING.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
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
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.success,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
    gap: SPACING.xs,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});