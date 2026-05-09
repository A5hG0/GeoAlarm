import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, SPACING } from '@/constants/theme';

interface RadiusSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Alert radius: <Text style={styles.value}>{value}m</Text>
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={100}
        maximumValue={2000}
        step={100}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={COLORS.primary}
        maximumTrackTintColor={COLORS.border}
        thumbTintColor={COLORS.primary}
      />
      <View style={styles.labels}>
        <Text style={styles.rangeLabel}>100m</Text>
        <Text style={styles.rangeLabel}>2km</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
  },
  label: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  value: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});