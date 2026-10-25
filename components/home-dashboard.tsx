import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowRight, CalendarDays, ChevronRight, Compass, MapPin, Mic, Plus, Search, Sparkles } from 'lucide-react-native';
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
  { name: 'Kyoto', country: 'Japan', image: 'https://images.pexels.com/photos/31117323/pexels-photo-31117323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Bali', country: 'Indonesia', image: 'https://images.pexels.com/photos/21336630/pexels-photo-21336630.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Lisbon', country: 'Portugal', image: 'https://images.pexels.com/photos/12433849/pexels-photo-12433849.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Manarola', country: 'Italy', image: 'https://images.pexels.com/photos/31117323/pexels-photo-31117323.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export function HomeDashboard({
  firstName,
  initial,
  trips,
  loading,
  error,
  onCreateTrip,
  onOpenTrips,
  onOpenDiscover,
  onOpenTrip,
  onSearch,
}: HomeDashboardProps) {
  const [searchValue, setSearchValue] = useState('');
  const featuredTrip = trips[0];
  const visibleTrips = trips.slice(0, 2);

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.brandMark}><Compass size={18} color="#FFFFFF" strokeWidth={2.5} /></View>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>AI TRIP PLANNER</Text>
          <Text style={styles.greeting}>Let&apos;s plan your next adventure.</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>
      </View>

      <View style={styles.heroIntro}>
        <Text style={styles.welcome}>Good morning, {firstName}</Text>
        <Text style={styles.heroTitle}>Where will you go next?</Text>
        <Text style={styles.heroSubtitle}>Share a destination, a feeling, or a dream. We&apos;ll shape it into a thoughtful itinerary.</Text>
      </View>

      <View style={styles.searchCard}>
        <View style={styles.searchIcon}><Sparkles size={18} color="#0EA5E9" /></View>
        <TextInput
          style={styles.searchInput}
          placeholder="Ask me about a destination..."
          placeholderTextColor="#94A3B8"
          value={searchValue}
          onChangeText={setSearchValue}
          onSubmitEditing={() => onSearch(searchValue)}
          returnKeyType="search"
        />
        <Mic size={18} color="#64748B" />
      </View>
      <View style={styles.searchHint}><Text style={styles.searchHintStar}>✦</Text><Text style={styles.searchHintText}>Try “a slow 5-day food trip through Tokyo”</Text></View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryAction} onPress={onCreateTrip} activeOpacity={0.85}>
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>Create a plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryAction} onPress={onOpenDiscover} activeOpacity={0.8}>
          <Compass size={18} color="#0EA5E9" />
          <Text style={styles.secondaryActionText}>Explore ideas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeading}>
        <View><Text style={styles.sectionTitle}>My plan</Text><Text style={styles.sectionCaption}>Your next adventures, in one place</Text></View>
        <Pressable onPress={onOpenTrips} style={styles.seeAll}><Text style={styles.seeAllText}>See all</Text><ChevronRight size={16} color="#0EA5E9" /></Pressable>
      </View>

      {error ? <View style={styles.inlineError}><Text style={styles.inlineErrorText}>{error}</Text></View> : null}
      {loading ? <View style={styles.loadingCard}><Text style={styles.loadingText}>Loading your plans...</Text></View> : null}
      {!loading && !error && visibleTrips.length === 0 ? (
        <TouchableOpacity style={styles.emptyPlan} onPress={onCreateTrip} activeOpacity={0.8}>
          <View style={styles.emptyIcon}><Sparkles size={20} color="#0EA5E9" /></View>
          <View style={styles.emptyCopy}><Text style={styles.emptyTitle}>Your first plan starts here</Text><Text style={styles.emptyText}>Create a trip and make the map feel a little closer.</Text></View>
          <ArrowRight size={18} color="#0EA5E9" />
        </TouchableOpacity>
      ) : null}
      {visibleTrips.map((trip) => (
        <Pressable key={trip.id} style={styles.tripCard} onPress={() => onOpenTrip(trip.id)}>
          <View style={styles.tripArt}><MapPin size={20} color="#0EA5E9" /><View style={styles.tripDotOne} /><View style={styles.tripDotTwo} /></View>
          <View style={styles.tripCopy}><View style={styles.tripTitleRow}><Text style={styles.tripTitle}>{trip.destination}</Text><View style={styles.statusPill}><Text style={styles.statusText}>{trip.status}</Text></View></View><View style={styles.tripMeta}><CalendarDays size={13} color="#64748B" /><Text style={styles.tripMetaText}>{formatTripDates(trip)}</Text><Text style={styles.tripMetaText}>{getTripDays(trip) ? `${getTripDays(trip)} days` : 'Flexible'}</Text></View><View style={styles.tagRow}>{trip.interests.slice(0, 2).map((interest) => <Text key={interest} style={styles.tag}>{interest}</Text>)}</View></View>
          <ChevronRight size={18} color="#CBD5E1" />
        </Pressable>
      ))}

      <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Explore next</Text><Text style={styles.sectionCaption}>Inspiration for your next escape</Text></View><Pressable onPress={onOpenDiscover} style={styles.seeAll}><Text style={styles.seeAllText}>Discover</Text><ChevronRight size={16} color="#0EA5E9" /></Pressable></View>
      <View style={styles.destinationGrid}>{DESTINATIONS.map((destination) => <TouchableOpacity key={destination.name} style={styles.destinationCard} onPress={onCreateTrip} activeOpacity={0.85}><Image source={{ uri: destination.image }} style={styles.destinationImage} /><View style={styles.destinationOverlay} /><View style={styles.destinationCopy}><Text style={styles.destinationName}>{destination.name}</Text><Text style={styles.destinationCountry}>{destination.country}</Text></View></TouchableOpacity>)}</View>
      <Text style={styles.toolsTitle}>Quick tools</Text>
      <View style={styles.toolsRow}><TouchableOpacity style={styles.toolCard} onPress={onCreateTrip} activeOpacity={0.85}><View style={styles.toolIcon}><Sparkles size={17} color="#0F766E" /></View><Text style={styles.toolText}>Plan with AI</Text></TouchableOpacity><TouchableOpacity style={[styles.toolCard, styles.toolCardWarm]} onPress={onCreateTrip} activeOpacity={0.85}><View style={[styles.toolIcon, styles.toolIconWarm]}><Plus size={17} color="#C2410C" /></View><Text style={styles.toolText}>Create trip</Text></TouchableOpacity></View>
      {featuredTrip ? <Text style={styles.footerNote}>Your latest plan is ready whenever you are.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  brandMark: { width: 38, height: 38, borderRadius: 14, backgroundColor: '#0EA5E9', alignItems: 'center', justifyContent: 'center', shadowColor: '#0EA5E9', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 },
  headerCopy: { flex: 1, marginLeft: 10 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, color: '#0EA5E9' },
  greeting: { fontSize: 13, color: '#64748B', marginTop: 3 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FCE7F3', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  avatarText: { color: '#BE185D', fontWeight: '700', fontSize: 16 },
  heroIntro: { marginBottom: 20 },
  welcome: { fontSize: 14, color: '#64748B', marginBottom: 5 },
  heroTitle: { fontSize: 29, lineHeight: 34, color: '#0F172A', fontWeight: '800', letterSpacing: -0.6 },
  heroSubtitle: { color: '#64748B', fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 330 },
  searchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#BAE6FD', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12, shadowColor: '#0EA5E9', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  searchIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A', marginHorizontal: 10 },
  searchHint: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 8 },
  searchHintStar: { color: '#F59E0B', marginRight: 5 },
  searchHintText: { fontSize: 12, color: '#94A3B8' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 18, marginBottom: 30 },
  primaryAction: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, backgroundColor: '#0EA5E9', borderRadius: 14, paddingVertical: 14 },
  primaryActionText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryAction: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  secondaryActionText: { color: '#0F172A', fontSize: 14, fontWeight: '600' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, color: '#0F172A', fontWeight: '800' },
  sectionCaption: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 1, paddingBottom: 2 },
  seeAllText: { color: '#0EA5E9', fontSize: 13, fontWeight: '600' },
  inlineError: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginBottom: 10 },
  inlineErrorText: { color: '#B91C1C', fontSize: 13 },
  loadingCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 22, marginBottom: 10 },
  loadingText: { color: '#64748B', fontSize: 14 },
  emptyPlan: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E0F2FE' },
  emptyIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' },
  emptyCopy: { flex: 1, marginHorizontal: 12 },
  emptyTitle: { color: '#0F172A', fontSize: 14, fontWeight: '700' },
  emptyText: { color: '#64748B', fontSize: 12, marginTop: 3, lineHeight: 17 },
  tripCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  tripArt: { width: 68, height: 68, borderRadius: 15, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  tripDotOne: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: '#F59E0B', left: 14, bottom: 15 },
  tripDotTwo: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', right: 13, top: 14 },
  tripCopy: { flex: 1, marginLeft: 12 },
  tripTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  tripTitle: { flex: 1, color: '#0F172A', fontSize: 15, fontWeight: '700' },
  statusPill: { backgroundColor: '#DCFCE7', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4 },
  statusText: { color: '#15803D', fontSize: 10, fontWeight: '700' },
  tripMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  tripMetaText: { color: '#64748B', fontSize: 11 },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  tag: { color: '#0F766E', backgroundColor: '#CCFBF1', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, fontSize: 10, fontWeight: '600' },
  destinationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toolsTitle: { color: '#0F172A', fontSize: 17, fontWeight: '800', marginTop: 26, marginBottom: 12 },
  toolsRow: { flexDirection: 'row', gap: 10 },
  toolCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 16, padding: 12 },
  toolCardWarm: { backgroundColor: '#FFF1ED', borderColor: '#FED7AA' },
  toolIcon: { width: 32, height: 32, borderRadius: 11, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  toolIconWarm: { backgroundColor: '#FFFFFF' },
  toolText: { color: '#0F172A', fontSize: 12, fontWeight: '800' },
  destinationCard: { width: '48%', height: 128, borderRadius: 17, overflow: 'hidden', backgroundColor: '#CBD5E1' }
  destinationImage: { width: '100%', height: '100%' },
  destinationOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.22)' },
  destinationCopy: { position: 'absolute', left: 12, bottom: 11 },
  destinationName: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  destinationCountry: { color: '#E0F2FE', fontSize: 11, marginTop: 2 },
  footerNote: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 24, marginBottom: 4 },
});
