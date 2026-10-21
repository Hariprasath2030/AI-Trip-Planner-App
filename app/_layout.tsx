import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Plane } from 'lucide-react-native';

function AuthGate() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || loading) return;

    if (!session) {
      router.replace('/sign-in');
    } else {
      router.replace('/(tabs)');
    }
  }, [session, loading, navigationState?.key]);

  if (loading || !navigationState?.key) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingLogo}>
          <Plane size={28} color="#FFFFFF" />
        </View>
        <ActivityIndicator color="#0EA5E9" size="small" style={styles.loadingSpinner} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="sign-up"
        options={{ headerShown: false }}
      />
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
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  loadingSpinner: {
    marginTop: 8,
  },
});
