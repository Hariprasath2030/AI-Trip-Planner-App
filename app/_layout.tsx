import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="trip/[id]"
          options={{
            headerShown: true,
            title: 'Trip Details',
            headerStyle: { backgroundColor: '#0EA5E9' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
        <Stack.Screen
          name="create-trip"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Create Trip',
            headerStyle: { backgroundColor: '#0EA5E9' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
