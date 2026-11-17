import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Calendar, Camera, CheckSquare, Clock, Hotel, MapPin, Plane, Plus, Ticket, Utensils } from 'lucide-react-native';
import { getTrip, getTripDays, listItineraryItems, type ItineraryItem, type Trip } from '@/lib/trips';
import { colors, radius, shadows } from '@/lib/theme';
import { AnimatedPressable, FadeSlideIn } from '@/components/ui/animated';

const ICONS = { flight: Plane, hotel: Hotel, car: MapPin, activity: Camera, meal: Utensils, extra: Ticket };
const TABS = ['Itinerary', 'Bookings', 'Packing', 'Photos'] as const;
type Tab = (typeof TABS)[number];

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [tab, setTab] = useState<Tab>('Itinerary');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [tripResult, itineraryResult] = await Promise.all([getTrip(id), listItineraryItems(id)]);
    setTrip(tripResult.data);
    setItems(itineraryResult.data);
    setError(tripResult.error || itineraryResult.error);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = items.reduce<Record<number, ItineraryItem[]>>((result, item) => {
    (result[item.day_number] ??= []).push(item);
    return result;
  }, {});

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.mutedCenter}>Loading your trip...</Text>
      </View>
    );
  if (error || !trip)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Trip not found'}</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <FadeSlideIn distance={30}>
        <View style={[styles.hero, shadows.lg]}>
          <View style={styles.heroTop}>
            <View style={styles.heroBadge}><Plane size={18} color={colors.primaryDark} /></View>
            <Text style={styles.heroStatus}>{trip.status.toUpperCase()}</Text>
          </View>
          <Text style={styles.destination}>{trip.title || trip.destination}</Text>
          <Text style={styles.route}>{trip.source || 'Your starting point'} <Text style={styles.arrow}>→</Text> {trip.destination}</Text>
          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <Calendar size={14} color="#FFFFFF" />
              <Text style={styles.metaText}>{trip.start_date && trip.end_date ? `${trip.start_date} · ${trip.end_date}` : 'Flexible dates'}</Text>
            </View>
            <View style={styles.meta}>
              <Clock size={14} color="#FFFFFF" />
              <Text style={styles.metaText}>{getTripDays(trip) || '—'} days</Text>
            </View>
          </View>
        </View>
      </FadeSlideIn>

      <View style={styles.tabs}>
        {TABS.map((item) => (
          <AnimatedPressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]} scaleTo={0.94}>
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
          </AnimatedPressable>
        ))}
      </View>

      {tab === 'Itinerary' && (
        <View style={styles.body}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Your itinerary</Text>
              <Text style={styles.muted}>A thoughtful plan, day by day</Text>
            </View>
            <AnimatedPressable style={styles.addButton} scaleTo={0.93}>
              <Plus size={16} color={colors.primaryDark} />
              <Text style={styles.addText}>Add</Text>
            </AnimatedPressable>
          </View>
          {Object.keys(grouped).length === 0 ? (
            <View style={[styles.empty, shadows.sm]}>
              <MapPin size={24} color={colors.primary} />
              <Text style={styles.emptyTitle}>Your itinerary is ready to be shaped</Text>
              <Text style={styles.muted}>Add flights, hotels, meals, and activities as your plans take form.</Text>
            </View>
          ) : (
            Object.entries(grouped).map(([day, dayItems], dayIndex) => (
              <FadeSlideIn key={day} delay={dayIndex * 90} distance={24}>
                <View style={[styles.dayCard, shadows.sm]}>
                  <View style={styles.dayHeader}>
                    <View style={styles.dayNumber}><Text style={styles.dayNumberText}>{day}</Text></View>
                    <View>
                      <Text style={styles.dayLabel}>DAY {day}</Text>
                      <Text style={styles.dayTitle}>{dayItems[0]?.title || 'Plan your day'}</Text>
                    </View>
                  </View>
                  {dayItems.map((item) => {
                    const Icon = ICONS[item.category] || Camera;
                    return (
                      <View key={item.id} style={styles.item}>
                        <View style={styles.itemIcon}><Icon size={16} color={colors.primary} /></View>
                        <View style={styles.itemCopy}>
                          <Text style={styles.itemTime}>{item.start_time || 'Anytime'}</Text>
                          <Text style={styles.itemTitle}>{item.title}</Text>
                          {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </FadeSlideIn>
            ))
          )}
        </View>
      )}
      {tab !== 'Itinerary' && (
        <View style={styles.body}>
          <View style={[styles.empty, shadows.sm]}>
            <CheckSquare size={26} color={colors.primary} />
            <Text style={styles.emptyTitle}>{tab} will live here</Text>
            <Text style={styles.muted}>Keep this trip organized with everything you need in one place.</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 28 },
  hero: { backgroundColor: colors.primaryDark, paddingHorizontal: 20, paddingTop: 28, paddingBottom: 28, borderBottomLeftRadius: radius.xl + 2, borderBottomRightRadius: radius.xl + 2 },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroBadge: { width: 38, height: 38, borderRadius: radius.md + 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  heroStatus: { color: colors.primaryLight, fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  destination: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 18 },
  route: { color: colors.primaryLight, fontSize: 14, marginTop: 5 },
  arrow: { color: '#FFFFFF', fontWeight: '800' },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 7, borderRadius: radius.md + 1 },
  metaText: { color: '#FFFFFF', fontSize: 12 },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.sm + 1 },
  tabActive: { backgroundColor: colors.primaryLight },
  tabText: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  tabTextActive: { color: colors.primaryDark },
  body: { padding: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: '800' },
  muted: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 4 },
  mutedCenter: { color: colors.textSecondary, fontSize: 14, marginTop: 10 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 8, borderRadius: radius.sm + 2, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primaryMuted },
  addText: { color: colors.primaryDark, fontSize: 12, fontWeight: '800' },
  dayCard: { backgroundColor: colors.surface, borderRadius: radius.lg - 2, padding: 16, marginBottom: 14 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dayNumber: { width: 42, height: 42, borderRadius: radius.md + 1, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  dayNumberText: { color: colors.primaryDark, fontSize: 18, fontWeight: '800' },
  dayLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  dayTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 3 },
  item: { flexDirection: 'row', gap: 11, borderTopWidth: 1, borderTopColor: '#F0F3F2', paddingVertical: 13 },
  itemIcon: { width: 32, height: 32, borderRadius: radius.sm + 1, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  itemCopy: { flex: 1 },
  itemTime: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  itemTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginTop: 2 },
  itemDescription: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
  empty: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg - 2, padding: 28, marginTop: 4 },
  emptyTitle: { color: colors.textPrimary, fontSize: 17, fontWeight: '800', textAlign: 'center', marginTop: 12 },
  error: { color: '#B91C1C', textAlign: 'center' },
});
