import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { CalendarDays, ChevronDown, ChevronRight, Mic, Plus, Plane, Sparkles } from 'lucide-react-native';
import type { Trip } from '@/lib/api/trips';
import { formatTripDates, getTripDays } from '@/lib/api/trips';
import { colors, radius, shadows } from '@/lib/theme';
import { AnimatedPressable, FadeSlideIn, usePulse } from '@/components/ui/animated';

type HomeDashboardProps = {
  firstName: string;
  initial: string;
  trips: Trip[];
  loading: boolean;
  error: string | null;
  onCreateTrip: () => void;
  onOpenTrips: () => void;
  onOpenDiscover: () => void;
  onOpenTrip: (id: string) => void;
  onSearch: (value: string) => void;
};

const DESTINATIONS = [
  { name: 'San Francisco', image: 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { name: 'Barcelona', image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { name: 'Kyoto', image: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { name: 'Dubai', image: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { name: 'Lisbon', image: 'https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg?auto=compress&cs=tinysrgb&w=500' },
];

const TRIP_IMAGES = [
  'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=500',
  'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=500',
];

function progressFor(status: Trip['status']): number {
  if (status === 'Completed') return 100;
  if (status === 'Upcoming') return 58;
  return 22;
}

function AnimatedProgress({ percent, delay }: { percent: number; delay: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: percent,
      duration: 900,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, percent, delay]);

  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: progress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

export function HomeDashboard({ firstName, initial, trips, loading, error, onCreateTrip, onOpenTrips, onOpenDiscover, onOpenTrip, onSearch }: HomeDashboardProps) {
  const [searchValue, setSearchValue] = useState('');
  const visibleTrips = trips.slice(0, 3);
  const orbGlow = usePulse(2000);

  return (
    <View>
      <FadeSlideIn delay={0} distance={18}>
        <View style={styles.topRow}>
          <View style={styles.brand}>
            <View style={styles.brandIcon}><Plane size={17} color={colors.primaryDark} /></View>
            <Text style={styles.brandText}>AI Trip Planner</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={60} distance={22}>
        <Text style={styles.title}>Let&apos;s plan your next{`\n`}adventures, {firstName}!</Text>
      </FadeSlideIn>

      <FadeSlideIn delay={120} distance={22}>
        <View style={styles.destinationStrip}>
          {DESTINATIONS.map((item, index) => (
            <AnimatedPressable key={item.name} onPress={() => onSearch(item.name)} scaleTo={0.9}>
              <Image source={{ uri: item.image }} style={styles.destinationThumb} />
            </AnimatedPressable>
          ))}
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={180} distance={24}>
        <View style={[styles.searchCard, shadows.md]}>
          <Animated.View style={[styles.searchOrb, { transform: [{ scale: orbGlow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }] }]}>
            <Sparkles size={18} color="#FFFFFF" />
          </Animated.View>
          <TextInput
            style={styles.searchInput}
            placeholder="Ask me here..."
            placeholderTextColor={colors.textMuted}
            value={searchValue}
            onChangeText={setSearchValue}
            onSubmitEditing={() => onSearch(searchValue)}
            returnKeyType="search"
          />
          <Mic size={18} color={colors.textSecondary} />
        </View>
        <View style={styles.hint}>
          <Sparkles size={13} color={colors.textMuted} />
          <Text style={styles.hintText}>Just type your dream destination, we&apos;ll handle the plan</Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={240} distance={22}>
        <View style={styles.planHeader}>
          <View style={styles.planTabs}>
            <Text style={styles.activeTab}>My Plan</Text>
            <AnimatedPressable onPress={onOpenDiscover} scaleTo={0.94}>
              <Text style={styles.inactiveTab}>Explore</Text>
            </AnimatedPressable>
          </View>
          <AnimatedPressable onPress={onOpenTrips} style={styles.planFilter} scaleTo={0.94}>
            <Text style={styles.planFilterText}>All Plans</Text>
            <ChevronDown size={14} color={colors.textSecondary} />
          </AnimatedPressable>
        </View>
      </FadeSlideIn>

      {error && (
        <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
      )}
      {loading && <View style={styles.loadingCard}><Text style={styles.muted}>Loading your plans...</Text></View>}
      {!loading && !error && visibleTrips.length === 0 && (
        <FadeSlideIn delay={300}>
          <AnimatedPressable style={[styles.emptyCard, shadows.sm]} onPress={onCreateTrip}>
            <Plus size={18} color={colors.primaryDark} />
            <Text style={styles.emptyText}>Create your first trip plan</Text>
            <ChevronRight size={17} color={colors.textMuted} />
          </AnimatedPressable>
        </FadeSlideIn>
      )}

      {visibleTrips.map((trip, index) => {
        const progress = progressFor(trip.status);
        return (
          <FadeSlideIn key={trip.id} delay={300 + index * 110} distance={30}>
            <AnimatedPressable style={[styles.tripCard, shadows.md]} onPress={() => onOpenTrip(trip.id)} scaleTo={0.975}>
              <View style={styles.tripCopy}>
                <View style={styles.tripTitleRow}>
                  <Text style={styles.tripTitle}>{trip.title || trip.destination}</Text>
                  <Text style={[styles.status, trip.status === 'Completed' ? styles.statusComplete : styles.statusUpcoming]}>{trip.status.toUpperCase()}</Text>
                </View>
                <Text style={styles.route}>⌖ {trip.source || 'Starting point'} <Text style={styles.routeArrow}>→</Text> {trip.destination}</Text>
                <View style={styles.dateRow}>
                  <CalendarDays size={13} color={colors.textSecondary} />
                  <Text style={styles.meta}>{formatTripDates(trip)} · {getTripDays(trip) || '—'} days trip</Text>
                </View>
                {trip.description && <Text style={styles.description} numberOfLines={2}>{trip.description}</Text>}
                <View style={styles.progressLabel}>
                  <Text style={styles.progressText}>Planning progress</Text>
                  <Text style={styles.progressText}>{progress}%</Text>
                </View>
                <AnimatedProgress percent={progress} delay={400 + index * 110} />
              </View>
              <Image source={{ uri: TRIP_IMAGES[index % TRIP_IMAGES.length] }} style={styles.tripImage} />
            </AnimatedPressable>
          </FadeSlideIn>
        );
      })}

      <FadeSlideIn delay={520} distance={22}>
        <AnimatedPressable style={styles.createButton} onPress={onCreateTrip}>
          <Plus size={18} color={colors.primaryDark} />
          <Text style={styles.createText}>Create new trip plan</Text>
        </AnimatedPressable>
      </FadeSlideIn>

      <FadeSlideIn delay={600} distance={22}>
        <Text style={styles.toolsTitle}>Quick tools</Text>
        <View style={styles.toolsRow}>
          <AnimatedPressable style={[styles.toolCard, shadows.sm]} onPress={onCreateTrip}>
            <View style={styles.toolIcon}><Sparkles size={17} color={colors.primaryDark} /></View>
            <Text style={styles.toolText}>Plan with AI</Text>
          </AnimatedPressable>
          <AnimatedPressable style={[styles.toolCard, styles.toolWarm, shadows.sm]} onPress={onCreateTrip}>
            <View style={styles.toolIcon}><Plus size={17} color="#C2410C" /></View>
            <Text style={styles.toolText}>Create trip</Text>
          </AnimatedPressable>
        </View>
      </FadeSlideIn>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  brandText: { color: colors.textSecondary, fontSize: 14, fontWeight: '800' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.primaryDark, fontSize: 15, fontWeight: '800' },
  title: { color: colors.textPrimary, fontSize: 29, lineHeight: 34, fontWeight: '900', letterSpacing: -0.7, marginBottom: 20 },
  destinationStrip: { flexDirection: 'row', justifyContent: 'center', gap: 4, marginBottom: 12 },
  destinationThumb: { width: 58, height: 51, borderRadius: radius.sm - 2 },
  searchCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.full, padding: 9 },
  searchOrb: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 15 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, marginLeft: 12 },
  hintText: { color: colors.textMuted, fontSize: 12 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 34, marginBottom: 14 },
  planTabs: { flexDirection: 'row', gap: 18, alignItems: 'center' },
  activeTab: { color: colors.textPrimary, fontSize: 16, fontWeight: '900', textDecorationLine: 'underline' },
  inactiveTab: { color: colors.textMuted, fontSize: 16, fontWeight: '800' },
  planFilter: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface, borderRadius: radius.md + 2, paddingHorizontal: 10, paddingVertical: 7 },
  planFilterText: { color: colors.textSecondary, fontSize: 11, fontWeight: '800' },
  tripCard: { flexDirection: 'row', gap: 10, backgroundColor: colors.surface, borderRadius: radius.lg + 1, padding: 14, marginBottom: 12 },
  tripCopy: { flex: 1 },
  tripTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  tripTitle: { flex: 1, color: colors.textPrimary, fontSize: 16, lineHeight: 19, fontWeight: '900' },
  status: { borderRadius: radius.sm - 2, paddingHorizontal: 7, paddingVertical: 4, fontSize: 9, fontWeight: '900' },
  statusComplete: { color: '#475569', backgroundColor: '#F1F5F9' },
  statusUpcoming: { color: colors.primaryDark, backgroundColor: colors.primaryLight },
  route: { color: colors.textPrimary, fontSize: 11, fontWeight: '700', marginTop: 9 },
  routeArrow: { color: colors.textMuted },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  meta: { color: colors.textSecondary, fontSize: 10 },
  description: { color: colors.textSecondary, fontSize: 11, lineHeight: 16, marginTop: 8 },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  progressText: { color: colors.textSecondary, fontSize: 10, fontWeight: '700' },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: colors.border, marginTop: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.primary },
  tripImage: { width: 115, height: 150, borderRadius: radius.md + 2 },
  createButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingVertical: 14, marginTop: 4 },
  createText: { color: colors.primaryDark, fontSize: 14, fontWeight: '900' },
  toolsTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '900', marginTop: 30, marginBottom: 12 },
  toolsRow: { flexDirection: 'row', gap: 10 },
  toolCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: '#BCE5E0', borderRadius: radius.md + 2, padding: 12 },
  toolWarm: { backgroundColor: '#FFF1ED', borderColor: '#FED7AA' },
  toolIcon: { width: 32, height: 32, borderRadius: radius.sm + 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  toolText: { color: colors.textPrimary, fontSize: 12, fontWeight: '800' },
  emptyCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md + 4, padding: 18 },
  emptyText: { flex: 1, color: colors.textPrimary, fontWeight: '800' },
  loadingCard: { backgroundColor: colors.surface, borderRadius: radius.md + 4, padding: 20 },
  muted: { color: colors.textSecondary, fontSize: 13 },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: radius.sm + 2, padding: 12 },
  errorText: { color: '#B91C1C', fontSize: 13 },
});
