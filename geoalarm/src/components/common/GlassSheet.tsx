import { View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/constants/theme';

interface GlassSheetProps {
  children: React.ReactNode;
  style?: any;
}

export default function GlassSheet({ children, style }: GlassSheetProps) {
  const C = useTheme();
  return (
    <View style={[{
      backgroundColor: C.sheet,
      borderTopLeftRadius: RADIUS.xl,
      borderTopRightRadius: RADIUS.xl,
      borderTopWidth: 0.5,
      borderLeftWidth: 0.5,
      borderRightWidth: 0.5,
      borderColor: C.sheetBorder,
      paddingTop: 12,
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.lg,
    }, style]}>
      <View style={{
        width: 36, height: 4,
        backgroundColor: C.textTertiary,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: SPACING.md,
      }} />
      {children}
    </View>
  );
}