import { CalendarDays, ChevronRight, Clock, MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Trip } from '@/lib/trips';
import { formatTripDates, getTripDays } from '@/lib/trips';

type TripCardProps = { trip: Trip; onPress: () => void };

export function TripCard({ trip, onPress }: TripCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconBox}><MapPin size={21} color="#0EA5E9" /></View>
      <View style={styles.copy}>
        <View style={styles.titleRow}><Text style={styles.title}>{trip.destination}</Text><Text style={styles.status}>{trip.status}</Text></View>
        <View style={styles.metaRow}><CalendarDays size={13} color="#94A3B8" /><Text style={styles.meta}>{formatTripDates(trip)}</Text><Clock size={13} color="#94A3B8" /><Text style={styles.meta}>{getTripDays(trip) || '—'} days</Text></View>
        <View style={styles.tags}>{trip.interests.slice(0, 3).map((interest) => <Text key={interest} style={styles.tag}>{interest}</Text>)}</View>
      </View>
      <ChevronRight size={18} color="#CBD5E1" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 17, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, marginHorizontal: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, color: '#0F172A', fontSize: 15, fontWeight: '700' },
  status: { color: '#15803D', backgroundColor: '#DCFCE7', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3, fontSize: 10, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  meta: { color: '#64748B', fontSize: 11 },
  tags: { flexDirection: 'row', gap: 5, marginTop: 8 },
  tag: { color: '#0F766E', backgroundColor: '#CCFBF1', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, fontSize: 10, fontWeight: '600' },
});
