import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { HomeDashboard } from '@/components/home-dashboard';
import { listTrips, type Trip } from '@/lib/trips';
import { useAuth } from '@/lib/auth';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    const result = await listTrips();
    setTrips(result.data);
    setError(result.error);
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => {
    loadTrips();
  }, [loadTrips]));

  const firstName = profile?.full_name?.split(' ')[0] || 'traveler';
  const initial = (profile?.full_name || profile?.email || 'T').charAt(0).toUpperCase();

  const openCreateTrip = (destination?: string) => {
    router.push(destination ? { pathname: '/create-trip', params: { destination } } : '/create-trip');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeDashboard
          firstName={firstName}
          initial={initial}
          trips={trips}
          loading={loading}
          error={error}
          onCreateTrip={() => openCreateTrip()}
          onOpenTrips={() => router.push('/(tabs)/trips')}
          onOpenDiscover={() => router.push('/(tabs)/discover')}
          onOpenTrip={(id: string) => router.push(`/trip/${id}`)}
          onSearch={(value: string) => {
            if (value.trim()) openCreateTrip(value.trim());
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 38 },
});
