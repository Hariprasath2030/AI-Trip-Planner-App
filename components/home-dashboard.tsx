import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalendarDays, ChevronDown, ChevronRight, Mic, Plus, Plane, Sparkles } from 'lucide-react-native';
import type { Trip } from '@/lib/trips';
import { formatTripDates, getTripDays } from '@/lib/trips';

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

export function HomeDashboard({ firstName, initial, trips, loading, error, onCreateTrip, onOpenTrips, onOpenDiscover, onOpenTrip, onSearch }: HomeDashboardProps) {
  const [searchValue, setSearchValue] = useState('');
  const visibleTrips = trips.slice(0, 3);

  return (
    <View>
      <View style={styles.topRow}>
        <View style={styles.brand}><View style={styles.brandIcon}><Plane size={17} color="#0F766E" /></View><Text style={styles.brandText}>AI Trip Planner</Text></View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>
      </View>
      <Text style={styles.title}>Let&apos;s plan your next{`\n`}adventures, {firstName}!</Text>

      <View style={styles.destinationStrip}>{DESTINATIONS.map((item) => <TouchableOpacity key={item.name} onPress={() => onSearch(item.name)} activeOpacity={0.8}><Image source={{ uri: item.image }} style={styles.destinationThumb} /></TouchableOpacity>)}</View>
      <View style={styles.searchCard}><View style={styles.searchOrb}><Sparkles size={18} color="#FFFFFF" /></View><TextInput style={styles.searchInput} placeholder="Ask me here..." placeholderTextColor="#94A3B8" value={searchValue} onChangeText={setSearchValue} onSubmitEditing={() => onSearch(searchValue)} returnKeyType="search" /><Mic size={18} color="#334155" /></View>
      <View style={styles.hint}><Sparkles size={13} color="#94A3B8" /><Text style={styles.hintText}>Just type your dream destination, we&apos;ll handle the plan</Text></View>

      <View style={styles.planHeader}><View style={styles.planTabs}><Text style={styles.activeTab}>My Plan</Text><Pressable onPress={onOpenDiscover}><Text style={styles.inactiveTab}>Explore</Text></Pressable></View><Pressable onPress={onOpenTrips} style={styles.planFilter}><Text style={styles.planFilterText}>All Plans</Text><ChevronDown size={14} color="#64748B" /></Pressable></View>
      {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
      {loading && <View style={styles.loadingCard}><Text style={styles.muted}>Loading your plans...</Text></View>}
      {!loading && !error && visibleTrips.length === 0 && <TouchableOpacity style={styles.emptyCard} onPress={onCreateTrip}><Plus size={18} color="#0F766E" /><Text style={styles.emptyText}>Create your first trip plan</Text><ChevronRight size={17} color="#94A3B8" /></TouchableOpacity>}
      {visibleTrips.map((trip, index) => { const progress = progressFor(trip.status); return <Pressable key={trip.id} style={styles.tripCard} onPress={() => onOpenTrip(trip.id)}><View style={styles.tripCopy}><View style={styles.tripTitleRow}><Text style={styles.tripTitle}>{trip.title || trip.destination}</Text><Text style={[styles.status, trip.status === 'Completed' ? styles.statusComplete : styles.statusUpcoming]}>{trip.status.toUpperCase()}</Text></View><Text style={styles.route}>⌖ {trip.source || 'Starting point'} <Text style={styles.routeArrow}>→</Text> {trip.destination}</Text><View style={styles.dateRow}><CalendarDays size={13} color="#64748B" /><Text style={styles.meta}>{formatTripDates(trip)} · {getTripDays(trip) || '—'} days trip</Text></View>{trip.description && <Text style={styles.description} numberOfLines={2}>{trip.description}</Text>}<View style={styles.progressLabel}><Text style={styles.progressText}>Planning progress</Text><Text style={styles.progressText}>{progress}%</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View></View><Image source={{ uri: TRIP_IMAGES[index % TRIP_IMAGES.length] }} style={styles.tripImage} /></Pressable>; })}

      <TouchableOpacity style={styles.createButton} onPress={onCreateTrip} activeOpacity={0.85}><Plus size={18} color="#0F766E" /><Text style={styles.createText}>Create new trip plan</Text></TouchableOpacity>
      <Text style={styles.toolsTitle}>Quick tools</Text>
      <View style={styles.toolsRow}><TouchableOpacity style={styles.toolCard} onPress={onCreateTrip}><View style={styles.toolIcon}><Sparkles size={17} color="#0F766E" /></View><Text style={styles.toolText}>Plan with AI</Text></TouchableOpacity><TouchableOpacity style={[styles.toolCard, styles.toolWarm]} onPress={onCreateTrip}><View style={styles.toolIcon}><Plus size={17} color="#C2410C" /></View><Text style={styles.toolText}>Create trip</Text></TouchableOpacity></View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 }, brandIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, brandText: { color: '#334155', fontSize: 14, fontWeight: '800' },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#0F766E', fontSize: 15, fontWeight: '800' },
  title: { color: '#0F172A', fontSize: 29, lineHeight: 34, fontWeight: '900', letterSpacing: -0.7, marginBottom: 20 }, destinationStrip: { flexDirection: 'row', justifyContent: 'center', gap: 4, marginBottom: 12 }, destinationThumb: { width: 58, height: 51, borderRadius: 8 },
  searchCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 30, padding: 9, shadowColor: '#0F172A', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 }, searchOrb: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center' }, searchInput: { flex: 1, color: '#0F172A', fontSize: 15 }, hint: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, marginLeft: 12 }, hintText: { color: '#94A3B8', fontSize: 12 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 34, marginBottom: 14 }, planTabs: { flexDirection: 'row', gap: 18 }, activeTab: { color: '#0F172A', fontSize: 16, fontWeight: '900', textDecorationLine: 'underline' }, inactiveTab: { color: '#94A3B8', fontSize: 16, fontWeight: '800' }, planFilter: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 7 }, planFilterText: { color: '#64748B', fontSize: 11, fontWeight: '800' },
  tripCard: { flexDirection: 'row', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 21, padding: 14, marginBottom: 12, shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 }, tripCopy: { flex: 1 }, tripTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 }, tripTitle: { flex: 1, color: '#0F172A', fontSize: 16, lineHeight: 19, fontWeight: '900' }, status: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4, fontSize: 9, fontWeight: '900' }, statusComplete: { color: '#475569', backgroundColor: '#F1F5F9' }, statusUpcoming: { color: '#0284C7', backgroundColor: '#E0F2FE' }, route: { color: '#0F172A', fontSize: 11, fontWeight: '700', marginTop: 9 }, routeArrow: { color: '#94A3B8' }, dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 }, meta: { color: '#64748B', fontSize: 10 }, description: { color: '#475569', fontSize: 11, lineHeight: 16, marginTop: 8 }, progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }, progressText: { color: '#475569', fontSize: 10, fontWeight: '700' }, progressTrack: { height: 5, borderRadius: 3, backgroundColor: '#E2E8F0', marginTop: 4, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 3, backgroundColor: '#0F766E' }, tripImage: { width: 115, height: 150, borderRadius: 16 },
  createButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 25, paddingVertical: 14, marginTop: 4 }, createText: { color: '#0F766E', fontSize: 14, fontWeight: '900' }, toolsTitle: { color: '#0F172A', fontSize: 17, fontWeight: '900', marginTop: 30, marginBottom: 12 }, toolsRow: { flexDirection: 'row', gap: 10 }, toolCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 16, padding: 12 }, toolWarm: { backgroundColor: '#FFF1ED', borderColor: '#FED7AA' }, toolIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, toolText: { color: '#0F172A', fontSize: 12, fontWeight: '800' }, emptyCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18 }, emptyText: { flex: 1, color: '#0F172A', fontWeight: '800' }, loadingCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20 }, muted: { color: '#64748B', fontSize: 13 }, errorBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12 }, errorText: { color: '#B91C1C', fontSize: 13 },
});
