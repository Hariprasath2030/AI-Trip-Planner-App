import { CalendarDays, ChevronRight, Clock, MapPin } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import type { Trip } from '@/lib/trips';
import { formatTripDates, getTripDays } from '@/lib/trips';
import { colors, radius, shadows } from '@/lib/theme';
import { AnimatedPressable } from '@/components/ui/animated';

type TripCardProps = { trip: Trip; onPress: () => void };

export function TripCard({ trip, onPress }: TripCardProps) {
  return (
    <AnimatedPressable style={[styles.card, shadows.sm]} onPress={onPress} scaleTo={0.97}>
      <View style={styles.iconBox}><MapPin size={21} color={colors.primary} /></View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{trip.title || trip.destination}</Text>
          <Text style={styles.status}>{trip.status}</Text>
        </View>
        <View style={styles.metaRow}>
          <CalendarDays size={13} color={colors.textMuted} />
          <Text style={styles.meta}>{formatTripDates(trip)}</Text>
          <Clock size={13} color={colors.textMuted} />
          <Text style={styles.meta}>{getTripDays(trip) || '—'} days</Text>
        </View>
        <View style={styles.tags}>
          {trip.interests.slice(0, 3).map((interest) => (
            <Text key={interest} style={styles.tag}>{interest}</Text>
          ))}
        </View>
      </View>
      <ChevronRight size={18} color={colors.border} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md + 3, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#EFF3F2' },
  iconBox: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, marginHorizontal: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  status: { color: colors.primaryDark, backgroundColor: colors.primaryLight, borderRadius: radius.sm - 3, paddingHorizontal: 7, paddingVertical: 3, fontSize: 10, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  meta: { color: colors.textSecondary, fontSize: 11 },
  tags: { flexDirection: 'row', gap: 5, marginTop: 8 },
  tag: { color: colors.primaryDark, backgroundColor: colors.primaryLight, borderRadius: radius.sm - 4, paddingHorizontal: 6, paddingVertical: 3, fontSize: 10, fontWeight: '600' },
});
