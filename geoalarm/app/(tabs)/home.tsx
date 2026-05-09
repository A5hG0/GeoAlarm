import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAlarmStore } from '@/store/alarmStore';
import { useGeoFence } from '@/hooks/useGeoFence';
import { useAlarm } from '@/hooks/useAlarm';
import { saveToHistory } from '@/services/storageService';
import { useBackgroundManager } from '@/hooks/useBackgroundManager';
import { COLORS, SPACING } from '@/constants/theme';
import { Alarm } from '@/types';

export default function HomeScreen() {
  useBackgroundManager();
  const { alarms, removeAlarm } = useAlarmStore();
  const { distances } = useGeoFence();
  useAlarm(distances);

  function getDistance(alarmId: string): string {
    const d = distances.find((x) => x.alarmId === alarmId);
    if (!d) return '—';
    const m = d.distanceMeters;
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
  }

  function handleDelete(alarm: Alarm) {
    Alert.alert(
      'Remove Alarm',
      `Remove alarm for "${alarm.destinationLabel}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await saveToHistory({
              id: alarm.id,
              destination: alarm.destination,
              destinationLabel: alarm.destinationLabel,
              radiusMeters: alarm.radiusMeters,
              status: 'cancelled',
              createdAt: alarm.createdAt,
              resolvedAt: Date.now(),
            });
            removeAlarm(alarm.id);
          },
        },
      ]
    );
  }

  function renderAlarm({ item }: { item: Alarm }) {
  const dist = getDistance(item.id);
  const d = distances.find((x) => x.alarmId === item.id);
  const isClose = d && d.distanceMeters <= item.radiusMeters * 2;
  const isWithin = d && d.isWithinRadius;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/edit-alarm?id=${item.id}`)}  // ← tap to edit
      activeOpacity={0.8}
    >
      <View style={[
        styles.alarmCard,
        isWithin && styles.alarmCardWithin,
        isClose && !isWithin && styles.alarmCardClose,
      ]}>
        <View style={styles.alarmInfo}>
          <Text style={styles.alarmLabel}>{item.destinationLabel}</Text>
          <Text style={styles.alarmMeta}>Radius: {item.radiusMeters}m</Text>
          <Text style={[
            styles.alarmDistance,
            isWithin && styles.alarmDistanceWithin,
          ]}>
            {dist} away
          </Text>
        </View>

        {/* Edit hint */}
        <View style={styles.editHint}>
          <Text style={styles.editHintText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
    // Zustand persist hydrates asynchronously
    const unsub = useAlarmStore.persist.onFinishHydration(() => {
        setHydrated(true);
    });

    // If already hydrated (fast devices), set immediately
    if (useAlarmStore.persist.hasHydrated()) {
        setHydrated(true);
    }

    return unsub;
    }, []);

    if (!hydrated) {
        return (
            <View style={styles.container}>
            <View style={styles.empty}>
                <Text style={styles.emptySubtitle}>Loading...</Text>
            </View>
            </View>
        );
    }

  return (
    <View style={styles.container}>
      {alarms.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No alarms set</Text>
          <Text style={styles.emptySubtitle}>
            Tap + to add a destination alarm
          </Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id}
          renderItem={renderAlarm}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-alarm')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, gap: SPACING.sm },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  alarmCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  alarmCardClose: { borderColor: '#FF9500' },
  alarmCardWithin: { borderColor: COLORS.success, backgroundColor: '#F0FFF4' },
  alarmInfo: { flex: 1, gap: 3 },
  alarmLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  alarmMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  alarmDistance: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 4,
  },
  alarmDistanceWithin: { color: COLORS.success },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  editHint: {
  width: 28,
  justifyContent: 'center',
  alignItems: 'center',
},
editHintText: {
  fontSize: 22,
  color: COLORS.textSecondary,
  fontWeight: '300',
},
  fabText: {
    fontSize: 32,
    color: 'white',
    lineHeight: 36,
  },
});