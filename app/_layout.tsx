import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Plane } from 'lucide-react-native';
import { colors, shadows } from '@/lib/theme';

function AuthGate() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const logoPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(logoPulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [logoPulse]);

  useEffect(() => {
    if (!navigationState?.key || loading) return;

    if (!session) {
      router.replace('/sign-in');
    } else {
      router.replace('/(tabs)');
    }
  }, [session, loading, navigationState?.key]);

  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sign-in" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen
          name="trip/[id]"
          options={{
            headerShown: true,
            title: 'Trip Details',
            headerStyle: { backgroundColor: colors.primaryDark },
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
            headerStyle: { backgroundColor: colors.primaryDark },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600' },
          }}
        />
      </Stack>
      {(loading || !navigationState?.key) && (
        <View style={styles.loadingOverlay}>
          <Animated.View
            style={[
              styles.loadingLogo,
              shadows.lg,
              {
                transform: [
                  { scale: logoPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) },
                ],
                opacity: logoPulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }),
              },
            ]}
          >
            <Plane size={28} color="#FFFFFF" />
          </Animated.View>
          <ActivityIndicator color={colors.primary} size="small" style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Preparing your journeys</Text>
        </View>
      )}
    </View>
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
  root: { flex: 1 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  loadingLogo: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  loadingSpinner: { marginTop: 8 },
  loadingText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginTop: 12 },
});
