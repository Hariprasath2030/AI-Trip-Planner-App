import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Plus, Plane } from 'lucide-react-native';
import { listTrips, type Trip, type TripStatus } from '@/lib/api/trips';
import { TripCard } from '@/components/trip-card';
import { colors, radius, shadows } from '@/lib/theme';
import { AnimatedPressable, FadeSlideIn } from '@/components/ui/animated';

const FILTERS = ['All', 'Upcoming', 'Planning', 'Completed'] as const;
type Filter = (typeof FILTERS)[number];

export default function TripsScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState<Filter>('All');
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

  const filteredTrips = filter === 'All' ? trips : trips.filter((trip) => trip.status === filter as TripStatus);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FadeSlideIn distance={16}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>YOUR JOURNEY</Text>
            <Text style={styles.title}>My trips</Text>
          </View>
          <AnimatedPressable style={[styles.createButton, shadows.sm]} onPress={() => router.push('/create-trip')}>
            <Plus size={17} color="#FFFFFF" />
            <Text style={styles.createText}>New trip</Text>
          </AnimatedPressable>
        </View>
      </FadeSlideIn>

      <View style={styles.filterRow}>
        {FILTERS.map((item) => (
          <AnimatedPressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]} scaleTo={0.93}>
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
          </AnimatedPressable>
        ))}
      </View>

      {loading ? <View style={styles.center}><ActivityIndicator color={colors.primary} /><Text style={styles.centerText}>Loading your trips...</Text></View> : null}
      {!loading && error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><TouchableOpacity onPress={loadTrips}><Text style={styles.retry}>Try again</Text></TouchableOpacity></View> : null}
      {!loading && !error ? <FlatList data={filteredTrips} keyExtractor={(item) => item.id} renderItem={({ item, index }) => <FadeSlideIn delay={index * 70} distance={24}><TripCard trip={item} onPress={() => router.push(`/trip/${item.id}`)} /></FadeSlideIn>} contentContainerStyle={filteredTrips.length ? styles.list : styles.emptyList} showsVerticalScrollIndicator={false} ListEmptyComponent={<View style={styles.empty}><View style={styles.emptyIcon}><Plane size={28} color={colors.primary} /></View><Text style={styles.emptyTitle}>No trips in this view</Text><Text style={styles.emptyDescription}>Create a plan and keep every detail close at hand.</Text><AnimatedPressable style={[styles.emptyButton, shadows.sm]} onPress={() => router.push('/create-trip')}><Plus size={17} color="#FFFFFF" /><Text style={styles.emptyButtonText}>Create a trip</Text></AnimatedPressable></View>} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18 },
  kicker: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '800', marginTop: 4 },
  createButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: radius.sm + 3, paddingHorizontal: 13, paddingVertical: 11 },
  createText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  filter: { paddingHorizontal: 13, paddingVertical: 8, backgroundColor: colors.surface, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
  emptyList: { flexGrow: 1, paddingHorizontal: 20 },
  center: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  centerText: { color: colors.textSecondary, fontSize: 14, marginTop: 10 },
  errorBox: { margin: 20, padding: 15, borderRadius: radius.md, backgroundColor: colors.dangerSoft },
  errorText: { color: '#B91C1C', fontSize: 13 },
  retry: { color: colors.primary, fontWeight: '700', marginTop: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  emptyIcon: { width: 68, height: 68, borderRadius: radius.lg + 4, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '800' },
  emptyDescription: { textAlign: 'center', color: colors.textSecondary, lineHeight: 20, fontSize: 14, marginTop: 8, marginBottom: 20 },
  emptyButton: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.primary, borderRadius: radius.sm + 3, paddingHorizontal: 18, paddingVertical: 13 },
  emptyButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});
