import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';

interface DistanceIndicatorProps {
  distanceMeters: number | null;
  radiusMeters: number;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

export default function DistanceIndicator({ distanceMeters, radiusMeters }: DistanceIndicatorProps) {
  if (distanceMeters === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Getting your location...</Text>
      </View>
    );
  }

  const isClose = distanceMeters <= radiusMeters * 2; // within 2x radius = getting close
  const isWithin = distanceMeters <= radiusMeters;

  return (
    <View style={[
      styles.container,
      isWithin && styles.containerWithin,
      isClose && !isWithin && styles.containerClose,
    ]}>
      <Text style={styles.label}>Distance to destination</Text>
      <Text style={[
        styles.distance,
        isWithin && styles.distanceWithin,
      ]}>
        {formatDistance(distanceMeters)}
      </Text>
      <Text style={styles.radius}>
        Alert radius: {formatDistance(radiusMeters)}
      </Text>
      {isWithin && (
        <Text style={styles.withinText}>You are within range!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  containerClose: {
    borderColor: '#FF9500',
  },
  containerWithin: {
    borderColor: COLORS.success,
    backgroundColor: '#F0FFF4',
  },
  loading: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  distance: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  distanceWithin: {
    color: COLORS.success,
  },
  radius: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  withinText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
});