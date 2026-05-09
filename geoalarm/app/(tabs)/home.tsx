import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import MapPicker from '@/components/features/MapPicker';
import RadiusSlider from '@/components/features/RadiusSlider';
import { useAlarmStore } from '@/store/alarmStore';
import { COLORS, SPACING } from '@/constants/theme';
import { DEFAULT_RADIUS_METERS } from '@/constants/config';
import { Coordinate } from '@/types';

export default function HomeScreen() {
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS_METERS);
  const setAlarm = useAlarmStore((s) => s.setAlarm);

  function handleSetAlarm() {
    if (!destination) {
      Alert.alert('No destination', 'Tap anywhere on the map to set your destination first.');
      return;
    }

    setAlarm({
      id: Date.now().toString(),
      destination,
      destinationLabel: 'My destination',
      radiusMeters: radius,
      isActive: true,
      createdAt: Date.now(),
    });

    router.push('/(tabs)/active');
  }

  return (
    <View style={styles.container}>

      {/* Instruction banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          {destination
            ? '✅ Destination set — adjust radius below'
            : '📍 Tap the map to set your destination'}
        </Text>
      </View>

      {/* Map takes up most of the screen */}
      <View style={styles.mapContainer}>
        <MapPicker
          radiusMeters={radius}
          onDestinationSet={setDestination}
        />
      </View>

      {/* Bottom panel */}
      <View style={styles.bottomPanel}>
        <RadiusSlider value={radius} onChange={setRadius} />

        <TouchableOpacity
          style={[
            styles.button,
            !destination && styles.buttonDisabled,
          ]}
          onPress={handleSetAlarm}
          disabled={!destination}
        >
          <Text style={styles.buttonText}>Set Alarm</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  banner: {
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bannerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  bottomPanel: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});