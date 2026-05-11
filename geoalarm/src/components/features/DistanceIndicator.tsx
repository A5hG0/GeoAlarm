import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, RADIUS } from '@/constants/theme';

interface DistanceIndicatorProps {
  distanceMeters: number | null;
  radiusMeters: number;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export default function DistanceIndicator({ distanceMeters, radiusMeters }: DistanceIndicatorProps) {
  const C = useTheme();

  if (distanceMeters === null) {
    return (
      <View style={{
        backgroundColor: C.card,
        borderRadius: RADIUS.lg,
        borderWidth: 0.5,
        borderColor: C.cardBorder,
        padding: SPACING.lg,
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 14, color: C.textSecondary }}>
          Getting your location...
        </Text>
      </View>
    );
  }

  const isWithin = distanceMeters <= radiusMeters;
  const isClose = distanceMeters <= radiusMeters * 2 && !isWithin;

  return (
    <View style={{
      backgroundColor: C.card,
      borderRadius: RADIUS.lg,
      borderWidth: 0.5,
      borderColor: isWithin ? C.success : isClose ? C.warning : C.cardBorder,
      padding: SPACING.lg,
      alignItems: 'center',
      gap: SPACING.xs,
    }}>
      <Text style={{ fontSize: 12, color: C.textSecondary,
        textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Distance to destination
      </Text>
      <Text style={{
        fontSize: 48, fontWeight: '700', letterSpacing: -1,
        color: isWithin ? C.success : C.text,
      }}>
        {formatDistance(distanceMeters)}
      </Text>
      <Text style={{ fontSize: 13, color: C.textSecondary }}>
        Alert radius: {formatDistance(radiusMeters)}
      </Text>
      {isWithin && (
        <Text style={{ fontSize: 14, fontWeight: '600',
          color: C.success, marginTop: SPACING.xs }}>
          You are within range!
        </Text>
      )}
    </View>
  );
}