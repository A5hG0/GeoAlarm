import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import MapPicker from '@/components/features/MapPicker';
import { useAlarmStore } from '@/store/alarmStore';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, RADIUS } from '@/constants/theme';
import { Coordinate } from '@/types';

export default function EditAlarmScreen() {
  const C = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { alarms, updateAlarm, removeAlarm } = useAlarmStore();
  const alarm = alarms.find((a) => a.id === id);

  const [destination, setDestination] = useState<Coordinate | null>(
    alarm?.destination ?? null
  );
  const [radius, setRadius] = useState(alarm?.radiusMeters ?? 500);
  const [label, setLabel] = useState(alarm?.destinationLabel ?? '');

  if (!alarm) {
    return (
      <View style={{ flex: 1, backgroundColor: C.background,
        alignItems: 'center', justifyContent: 'center', gap: SPACING.md }}>
        <Text style={{ fontSize: 16, color: C.textSecondary }}>Alarm not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 15, color: C.primary }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
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
    Alert.alert(
      'Remove Alarm',
      `Remove "${alarm?.destinationLabel ?? 'alarm'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: () => {
            removeAlarm(id);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <View style={{ flex: 1 }}>
        <MapPicker
          radiusMeters={radius}
          onDestinationSet={setDestination}
          initialDestination={alarm.destination}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{
          backgroundColor: C.sheet,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          borderTopWidth: 0.5,
          borderColor: C.sheetBorder,
          padding: SPACING.lg,
          paddingBottom: SPACING.xl,
          gap: SPACING.sm,
        }}>
          <View style={{
            width: 36, height: 4,
            backgroundColor: C.textTertiary,
            borderRadius: 2, alignSelf: 'center',
            marginBottom: SPACING.sm,
          }} />

          <Text style={{
            fontSize: 12, color: C.textSecondary,
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Label</Text>

          <TextInput
            style={{
              borderWidth: 0.5, borderColor: C.border,
              borderRadius: RADIUS.md,
              padding: SPACING.md,
              fontSize: 15, color: C.text,
              backgroundColor: C.surface,
              marginBottom: SPACING.sm,
            }}
            value={label}
            onChangeText={setLabel}
            placeholder="e.g. Majestic Bus Stand"
            placeholderTextColor={C.textTertiary}
            returnKeyType="done"
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Alert radius
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.primary }}>
              {radius}m
            </Text>
          </View>

          <Slider
            style={{ width: '100%', height: 36 }}
            minimumValue={100}
            maximumValue={2000}
            step={50}
            value={radius}
            onValueChange={setRadius}
            minimumTrackTintColor={C.primary}
            maximumTrackTintColor={C.border}
            thumbTintColor={C.primary}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -8 }}>
            <Text style={{ fontSize: 11, color: C.textTertiary }}>100m</Text>
            <Text style={{ fontSize: 11, color: C.textTertiary }}>1km</Text>
            <Text style={{ fontSize: 11, color: C.textTertiary }}>2km</Text>
          </View>

          <Text style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center' }}>
            {destination ? '✋ Drag the pin to adjust precisely' : '📍 Tap to change destination'}
          </Text>

          <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm }}>
            <TouchableOpacity
              style={{
                flex: 1, padding: SPACING.md,
                borderRadius: RADIUS.md, alignItems: 'center',
                borderWidth: 0.5, borderColor: C.danger,
              }}
              onPress={handleDelete}
            >
              <Text style={{ color: C.danger, fontSize: 15, fontWeight: '600' }}>
                Delete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 2, backgroundColor: C.primary,
                padding: SPACING.md, borderRadius: RADIUS.md,
                alignItems: 'center',
              }}
              onPress={handleSave}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}