import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plane, Sparkles, MapPin, Compass, ChevronRight, Plus, Clock, Calendar } from 'lucide-react-native';
import { useAuth } from '@/lib/auth';

const RECENT_TRIPS = [
  { id: '1', destination: 'Kyoto, Japan', dates: 'Oct 15 - Oct 22', status: 'Upcoming' },
  { id: '2', destination: 'Lisbon, Portugal', dates: 'Sep 3 - Sep 10', status: 'Completed' },
];

const POPULAR = [
  { id: '1', name: 'Bali', country: 'Indonesia', emoji: '🌴' },
  { id: '2', name: 'Tokyo', country: 'Japan', emoji: '🗼' },
  { id: '3', name: 'Barcelona', country: 'Spain', emoji: '🇪🇸' },
  { id: '4', name: 'Reykjavik', country: 'Iceland', emoji: '🏔️' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();

  const userInitial = (profile?.full_name || profile?.email || 'T').charAt(0).toUpperCase();
  const greetingName = profile?.full_name?.split(' ')[0] || 'traveler';

  const handleCreateTrip = () => {
    router.push('/create-trip');
  };

  const handleViewTrip = (id: string) => {
    router.push(`/trip/${id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {greetingName}</Text>
            <Text style={styles.userName}>Where to next?</Text>
          </View>
          <TouchableOpacity style={styles.avatarBox}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIconRow}>
            <Sparkles size={20} color="#0EA5E9" />
            <Text style={styles.heroBadge}>AI PLANNER</Text>
          </View>
          <Text style={styles.heroTitle}>Plan a trip in seconds</Text>
          <Text style={styles.heroSubtitle}>
            Tell us your destination, dates, and interests. AI builds your itinerary.
          </Text>
          <TouchableOpacity style={styles.heroButton} onPress={handleCreateTrip} activeOpacity={0.85}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.heroButtonText}>Create New Trip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={handleCreateTrip}
            activeOpacity={0.7}
          >
            <View style={[styles.quickIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Sparkles size={20} color="#0EA5E9" />
            </View>
            <Text style={styles.quickActionLabel}>AI Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/discover')}
            activeOpacity={0.7}
          >
            <View style={[styles.quickIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Compass size={20} color="#16A34A" />
            </View>
            <Text style={styles.quickActionLabel}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/trips')}
            activeOpacity={0.7}
          >
            <View style={[styles.quickIconBox, { backgroundColor: '#FEF3C7' }]}>
              <MapPin size={20} color="#D97706" />
            </View>
            <Text style={styles.quickActionLabel}>My Trips</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <Pressable onPress={() => router.push('/(tabs)/trips')}>
              <View style={styles.seeAllRow}>
                <Text style={styles.seeAllText}>See all</Text>
                <ChevronRight size={16} color="#0EA5E9" />
              </View>
            </Pressable>
          </View>
          {RECENT_TRIPS.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => handleViewTrip(trip.id)}
              activeOpacity={0.7}
            >
              <View style={styles.tripIconBox}>
                <Plane size={18} color="#0EA5E9" />
              </View>
              <View style={styles.tripInfo}>
                <Text style={styles.tripDestination}>{trip.destination}</Text>
                <View style={styles.tripMetaRow}>
                  <Calendar size={12} color="#94A3B8" />
                  <Text style={styles.tripDates}>{trip.dates}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  trip.status === 'Upcoming'
                    ? styles.statusUpcoming
                    : styles.statusCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    trip.status === 'Upcoming'
                      ? styles.statusTextUpcoming
                      : styles.statusTextCompleted,
                  ]}
                >
                  {trip.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <Pressable onPress={() => router.push('/(tabs)/discover')}>
              <View style={styles.seeAllRow}>
                <Text style={styles.seeAllText}>See all</Text>
                <ChevronRight size={16} color="#0EA5E9" />
              </View>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll}>
            {POPULAR.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={styles.popularCard}
                onPress={handleCreateTrip}
                activeOpacity={0.7}
              >
                <Text style={styles.popularEmoji}>{dest.emoji}</Text>
                <Text style={styles.popularName}>{dest.name}</Text>
                <Text style={styles.popularCountry}>{dest.country}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  avatarBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  heroBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0EA5E9',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 18,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0EA5E9',
    paddingVertical: 14,
    borderRadius: 14,
  },
  heroButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  quickActionCard: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  quickIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '500',
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tripIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripInfo: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 3,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDates: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusUpcoming: {
    backgroundColor: '#DCFCE7',
  },
  statusCompleted: {
    backgroundColor: '#F1F5F9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextUpcoming: {
    color: '#16A34A',
  },
  statusTextCompleted: {
    color: '#64748B',
  },
  popularScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  popularCard: {
    width: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  popularEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  popularName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  popularCountry: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
