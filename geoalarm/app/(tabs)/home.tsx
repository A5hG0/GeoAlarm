import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAlarmStore } from '@/store/alarmStore';
import { useGeoFence } from '@/hooks/useGeoFence';
import { useAlarm } from '@/hooks/useAlarm';
import { useBackgroundManager } from '@/hooks/useBackgroundManager';
import { useTheme } from '@/hooks/useTheme';
import { saveToHistory } from '@/services/storageService';
import { SPACING, RADIUS } from '@/constants/theme';
import { Alarm } from '@/types';
import AlarmCard from '@/components/features/AlarmCard';

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export default function HomeScreen() {
  useBackgroundManager();
  const C = useTheme();
  const { alarms, removeAlarm } = useAlarmStore();
  const { distances } = useGeoFence();
  useAlarm(distances);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAlarmStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAlarmStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  function getDistInfo(alarm: Alarm) {
    const d = distances.find((x) => x.alarmId === alarm.id);
    return {
      label: d ? formatDistance(d.distanceMeters) : '—',
      isClose: !!d && d.distanceMeters <= alarm.radiusMeters * 2,
      isWithin: !!d?.isWithinRadius,
    };
  }

  function handleDelete(alarm: Alarm) {
    Alert.alert('Remove Alarm', `Remove "${alarm.destinationLabel}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
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
    ]);
  }

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: C.background,
        alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.textSecondary, fontSize: 14 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>

      <View style={{ paddingTop: 60, paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md, flexDirection: 'row',
        alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 34, fontWeight: '700',
          color: C.text, letterSpacing: -0.8 }}>
          Alarms
        </Text>
        {alarms.length > 0 && (
          <Text style={{ fontSize: 14, color: C.textSecondary }}>
            {alarms.length} active
          </Text>
        )}
      </View>

      {alarms.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center',
          justifyContent: 'center', gap: SPACING.sm }}>
          <View style={{ width: 72, height: 72, borderRadius: RADIUS.xl,
            backgroundColor: C.surface, borderWidth: 0.5,
            borderColor: C.surfaceBorder, alignItems: 'center',
            justifyContent: 'center', marginBottom: SPACING.sm }}>
            <Text style={{ fontSize: 32 }}>🔔</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '600',
            color: C.text, letterSpacing: -0.3 }}>
            No alarms set
          </Text>
          <Text style={{ fontSize: 14, color: C.textSecondary }}>
            Tap + to add a destination
          </Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: SPACING.md,
            paddingTop: SPACING.sm,
            paddingBottom: 110,
          }}
          renderItem={({ item }) => {
            const { label, isClose, isWithin } = getDistInfo(item);
            return (
              <AlarmCard
                alarm={item}
                distance={label}
                isClose={isClose}
                isWithin={isWithin}
                onPress={() => router.push(`/edit-alarm?id=${item.id}`)}
              />
            );
          }}
        />
      )}

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 104,
          right: SPACING.lg,
          width: 56, height: 56,
          borderRadius: RADIUS.lg,
          backgroundColor: C.primary,
          alignItems: 'center', justifyContent: 'center',
          elevation: 8,
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
        }}
        onPress={() => router.push('/create-alarm')}
        activeOpacity={0.85}
      >
        <Text style={{ fontSize: 28, color: '#fff',
          lineHeight: 32, fontWeight: '300' }}>+</Text>
      </TouchableOpacity>

    </View>
  );
}