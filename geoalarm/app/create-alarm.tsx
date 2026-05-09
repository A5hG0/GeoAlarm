import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import MapView, { Circle, Marker, MapPressEvent } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useAlarmStore } from '@/store/alarmStore';
import { COLORS, SPACING } from '@/constants/theme';
import { DEFAULT_RADIUS_METERS } from '@/constants/config';
import { Coordinate } from '@/types';

export default function CreateAlarmScreen() {
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS_METERS);
  const [label, setLabel] = useState('');
  const addAlarm = useAlarmStore((s) => s.addAlarm);

  function handleMapPress(e: MapPressEvent) {
    setDestination(e.nativeEvent.coordinate);
  }

  function handleCreate() {
    if (!destination) {
      Alert.alert('No destination', 'Tap the map to set a destination first.');
      return;
    }

    addAlarm({
      id: Date.now().toString(),
      destination,
      destinationLabel: label.trim() || 'My destination',
      radiusMeters: radius,
      isActive: true,
      status: 'active',
      createdAt: Date.now(),
    });

    router.back();
  }

  return (
    <View style={styles.container}>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 17.3850,
          longitude: 78.4867,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        onPress={handleMapPress}
      >
        {destination && (
          <>
            <Marker
              coordinate={destination}
              draggable
              onDragEnd={(e) => setDestination(e.nativeEvent.coordinate)}
              title={label || 'Destination'}
            />
            <Circle
              center={destination}
              radius={radius}
              strokeColor="rgba(0,122,255,0.8)"
              fillColor="rgba(0,122,255,0.15)"
              strokeWidth={2}
            />
          </>
        )}
      </MapView>

      {/* Bottom sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheet}
      >
        {/* Label input */}
        <Text style={styles.sheetLabel}>Label (optional)</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder="e.g. Majestic Bus Stand"
          placeholderTextColor={COLORS.textSecondary}
          returnKeyType="done"
        />

        {/* Radius slider */}
        <View style={styles.sliderRow}>
          <Text style={styles.sheetLabel}>Alert radius</Text>
          <Text style={styles.radiusValue}>{radius}m</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={100}
          maximumValue={2000}
          step={50}
          value={radius}
          onValueChange={setRadius}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor={COLORS.border}
          thumbTintColor={COLORS.primary}
        />
        <View style={styles.sliderTicks}>
          <Text style={styles.tickLabel}>100m</Text>
          <Text style={styles.tickLabel}>1km</Text>
          <Text style={styles.tickLabel}>2km</Text>
        </View>

        {/* Hint */}
        {!destination && (
          <Text style={styles.hint}>📍 Tap the map to place your destination</Text>
        )}
        {destination && (
          <Text style={styles.hint}>✋ Drag the pin to adjust position precisely</Text>
        )}

        {/* Create button */}
        <TouchableOpacity
          style={[styles.createBtn, !destination && styles.createBtnDisabled]}
          onPress={handleCreate}
          disabled={!destination}
        >
          <Text style={styles.createBtnText}>Create Alarm</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  map: { flex: 1 },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  sheetLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.sm,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radiusValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  slider: { width: '100%', height: 36 },
  sliderTicks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    marginBottom: SPACING.xs,
  },
  tickLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.xs,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  createBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  createBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});