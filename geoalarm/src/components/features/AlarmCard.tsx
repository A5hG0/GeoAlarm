import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, RADIUS } from '@/constants/theme';
import { Alarm } from '@/types';

interface AlarmCardProps {
  alarm: Alarm;
  distance: string;
  isClose: boolean;
  isWithin: boolean;
  onPress: () => void;
}

export default function AlarmCard({
  alarm, distance, isClose, isWithin, onPress,
}: AlarmCardProps) {
  const C = useTheme();

  const borderColor = isWithin
    ? C.success
    : isClose
    ? C.warning
    : C.cardBorder;

  const distColor = isWithin
    ? C.success
    : isClose
    ? C.warning
    : C.primary;

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: C.card,
        borderRadius: RADIUS.lg,
        borderWidth: 0.5,
        borderColor,
        padding: SPACING.md,
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
      }}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={{
        width: 44, height: 44,
        borderRadius: RADIUS.md,
        backgroundColor: isWithin
          ? 'rgba(48,209,88,0.1)'
          : isClose
          ? 'rgba(255,159,10,0.1)'
          : C.surface,
        borderWidth: 0.5,
        borderColor: isWithin
          ? 'rgba(48,209,88,0.25)'
          : isClose
          ? 'rgba(255,159,10,0.25)'
          : C.surfaceBorder,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Text style={{ fontSize: 20 }}>📍</Text>
      </View>

      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{
          fontSize: 15, fontWeight: '600',
          color: C.text, letterSpacing: -0.2,
        }} numberOfLines={1}>
          {alarm.destinationLabel}
        </Text>
        <Text style={{ fontSize: 12, color: C.textSecondary }}>
          Radius · {alarm.radiusMeters}m
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end', gap: 3 }}>
        <Text style={{
          fontSize: 14, fontWeight: '600',
          color: distColor, letterSpacing: -0.3,
        }}>
          {distance}
        </Text>
        <Text style={{
          fontSize: 18, color: C.textTertiary, lineHeight: 20,
        }}>›</Text>
      </View>
    </TouchableOpacity>
  );
}