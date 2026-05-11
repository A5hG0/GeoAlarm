import { Stack } from 'expo-router';
import '@/services/backgroundTask';
import { useTheme } from '@/hooks/useTheme';

export default function RootLayout() {
  const C = useTheme();
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create-alarm"
        options={{
          title: 'New Alarm',
          presentation: 'modal',
          headerStyle: { backgroundColor: C.sheet },
          headerTintColor: C.text,
        }}
      />
      <Stack.Screen
        name="edit-alarm"
        options={{
          title: 'Edit Alarm',
          presentation: 'modal',
          headerStyle: { backgroundColor: C.sheet },
          headerTintColor: C.text,
        }}
      />
      <Stack.Screen name="alarm-triggered" options={{ headerShown: false }} />
    </Stack>
  );
}