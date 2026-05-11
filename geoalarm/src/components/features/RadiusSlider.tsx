import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '@/hooks/useTheme';
import { SPACING } from '@/constants/theme';

interface RadiusSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  const C = useTheme();

  return (
    <View style={{
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      backgroundColor: C.card,
      gap: SPACING.xs,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: C.textSecondary,
          textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Alert radius
        </Text>
        <Text style={{ fontSize: 15, fontWeight: '600', color: C.primary }}>
          {value}m
        </Text>
      </View>
      <Slider
        style={{ width: '100%', height: 36 }}
        minimumValue={100}
        maximumValue={2000}
        step={50}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={C.primary}
        maximumTrackTintColor={C.border}
        thumbTintColor={C.primary}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 11, color: C.textTertiary }}>100m</Text>
        <Text style={{ fontSize: 11, color: C.textTertiary }}>1km</Text>
        <Text style={{ fontSize: 11, color: C.textTertiary }}>2km</Text>
      </View>
    </View>
  );
}