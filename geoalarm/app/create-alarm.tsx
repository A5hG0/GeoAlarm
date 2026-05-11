import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import MapPicker from '@/components/features/MapPicker';
import { useAlarmStore } from '@/store/alarmStore';
import { useTheme } from '@/hooks/useTheme';
import { SPACING, RADIUS } from '@/constants/theme';
import { DEFAULT_RADIUS_METERS } from '@/constants/config';
import { Coordinate } from '@/types';

export default function CreateAlarmScreen() {
  const C = useTheme();
  const [destination, setDestination] = useState<Coordinate | null>(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS_METERS);
  const [label, setLabel] = useState('');
  const addAlarm = useAlarmStore((s) => s.addAlarm);

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
    <View style={{ flex: 1, backgroundColor: C.background }}>
      <View style={{ flex: 1 }}>
        <MapPicker
          radiusMeters={radius}
          onDestinationSet={setDestination}
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
          }}>Label (optional)</Text>

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

          <Text style={{ fontSize: 13, color: C.textSecondary, textAlign: 'center', paddingVertical: SPACING.xs }}>
            {destination ? '✋ Drag the pin to adjust precisely' : '📍 Tap the map to set destination'}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: destination ? C.primary : C.surface,
              padding: SPACING.md,
              borderRadius: RADIUS.md,
              alignItems: 'center',
              marginTop: SPACING.sm,
              borderWidth: 0.5,
              borderColor: destination ? 'transparent' : C.border,
            }}
            onPress={handleCreate}
            disabled={!destination}
          >
            <Text style={{
              color: destination ? '#fff' : C.textTertiary,
              fontSize: 16, fontWeight: '600',
            }}>
              Create Alarm
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}