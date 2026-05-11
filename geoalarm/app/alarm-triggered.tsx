import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { useAlarmStore } from '@/store/alarmStore';
import { stopAlarm } from '@/services/alarmService';
import { saveToHistory } from '@/services/storageService';
import { SPACING, RADIUS } from '@/constants/theme';

export default function AlarmTriggeredScreen() {
  const { alarms, triggeredAlarmId, removeAlarm, setTriggeredAlarm } = useAlarmStore();
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1, useNativeDriver: true,
        mass: 0.6, stiffness: 160, damping: 12,
      }),
      Animated.timing(opacity, {
        toValue: 1, duration: 300, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  async function handleDismiss() {
    await stopAlarm();
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

  const alarm = alarms.find((a) => a.id === triggeredAlarmId);

  return (
    <View style={{
      flex: 1, backgroundColor: '#0d0005',
      alignItems: 'center', justifyContent: 'center',
      padding: SPACING.xl,
    }}>
      <Animated.View style={{
        alignItems: 'center', gap: SPACING.md,
        opacity, transform: [{ scale }],
      }}>
        <View style={{
          width: 120, height: 120, borderRadius: 60,
          borderWidth: 0.5, borderColor: 'rgba(255,69,58,0.3)',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: SPACING.sm,
        }}>
          <View style={{
            width: 88, height: 88, borderRadius: 44,
            backgroundColor: 'rgba(255,69,58,0.12)',
            borderWidth: 0.5, borderColor: 'rgba(255,69,58,0.35)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 40 }}>⏰</Text>
          </View>
        </View>

        <Text style={{
          fontSize: 44, fontWeight: '800',
          color: '#ffffff', letterSpacing: -1.2,
        }}>
          Wake up!
        </Text>

        <Text style={{
          fontSize: 16, color: 'rgba(255,255,255,0.5)',
          textAlign: 'center', letterSpacing: -0.2,
        }}>
          {alarm
            ? `You've reached ${alarm.destinationLabel}`
            : 'You have reached your destination'}
        </Text>

        <TouchableOpacity
          style={{
            marginTop: SPACING.lg,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderWidth: 0.5,
            borderColor: 'rgba(255,255,255,0.2)',
            borderRadius: RADIUS.pill,
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.xl * 1.5,
          }}
          onPress={handleDismiss}
          activeOpacity={0.8}
        >
          <Text style={{
            fontSize: 18, fontWeight: '600',
            color: '#ffffff', letterSpacing: -0.3,
          }}>
            I'm Awake!
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}