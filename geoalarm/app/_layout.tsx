import { Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';

// Import SIDE EFFECTS first — task must be defined before app loads
import '@/services/backgroundTask';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-alarm"
        options={{
          title: 'New Alarm',
          presentation: 'modal',
          headerStyle: { backgroundColor: COLORS.card },
          headerTintColor: COLORS.text,
        }}
      />
      <Stack.Screen
        name="edit-alarm"
        options={{
          title: 'Edit Alarm',
          presentation: 'modal',
          headerStyle: { backgroundColor: COLORS.card },
          headerTintColor: COLORS.text,
        }}
      />
      <Stack.Screen name="alarm-triggered" options={{ headerShown: false }} />
    </Stack>
  );
}