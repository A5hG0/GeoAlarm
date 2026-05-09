import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Circle, Marker, MapPressEvent } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useAlarmStore } from '@/store/alarmStore';
import { COLORS, SPACING } from '@/constants/theme';
import { Coordinate } from '@/types';

export default function EditAlarmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { alarms, updateAlarm } = useAlarmStore();

  // Find the alarm being edited
  const alarm = alarms.find((a) => a.id === id);

  // Pre-fill state with existing values
  const [destination, setDestination] = useState<Coordinate | null>(
    alarm?.destination ?? null
  );
  const [radius, setRadius] = useState(alarm?.radiusMeters ?? 500);
  const [label, setLabel] = useState(alarm?.destinationLabel ?? '');

  // Safety — if alarm not found (edge case)
  if (!alarm) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Alarm not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleMapPress(e: MapPressEvent) {
    setDestination(e.nativeEvent.coordinate);
  }

  function handleSave() {
    if (!destination) {
      Alert.alert('No destination', 'Tap the map to set a destination.');
      return;
    }

    updateAlarm(id, {
      destination,
      destinationLabel: label.trim() || 'My destination',
      radiusMeters: radius,
    });

    router.back();
  }

  function handleDelete() {
    if (!alarm) return;
    Alert.alert(
      'Remove Alarm',
      `Remove "${alarm.destinationLabel}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            useAlarmStore.getState().removeAlarm(id);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>

      {/* Map — pre-centered on existing destination */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: destination?.latitude ?? 17.3850,
          longitude: destination?.longitude ?? 78.4867,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
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
        {/* Label */}
        <Text style={styles.sheetLabel}>Label</Text>
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

        <Text style={styles.hint}>
          {destination
            ? '✋ Drag the pin to adjust position precisely'
            : '📍 Tap the map to change destination'}
        </Text>

        {/* Action buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  errorText: { fontSize: 16, color: COLORS.textSecondary },
  backLink: { fontSize: 15, color: COLORS.primary },
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
  tickLabel: { fontSize: 11, color: COLORS.textSecondary },
  hint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  deleteBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});