import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plane, Plus, Calendar, Clock, MapPin, Sparkles } from 'lucide-react-native';

type Trip = {
  id: string;
  destination: string;
  dates: string;
  status: 'Upcoming' | 'Completed' | 'Planning';
  days: number;
  emoji: string;
};

const TRIPS: Trip[] = [
  {
    id: '1',
    destination: 'Kyoto, Japan',
    dates: 'Oct 15 - Oct 22',
    status: 'Upcoming',
    days: 7,
    emoji: '🗾',
  },
  {
    id: '2',
    destination: 'Lisbon, Portugal',
    dates: 'Sep 3 - Sep 10',
    status: 'Completed',
    days: 7,
    emoji: '🌊',
  },
  {
    id: '3',
    destination: 'Banff, Canada',
    dates: 'Nov 10 - Nov 14',
    status: 'Planning',
    days: 5,
    emoji: '🏔️',
  },
];

const FILTERS = ['All', 'Upcoming', 'Planning', 'Completed'] as const;

export default function TripsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const filteredTrips =
    filter === 'All' ? TRIPS : TRIPS.filter((t) => t.status === filter);

  const handleCreateTrip = () => {
    router.push('/create-trip');
  };

  const handleViewTrip = (id: string) => {
    router.push(`/trip/${id}`);
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => handleViewTrip(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.tripEmojiBox}>
        <Text style={styles.tripEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.tripInfo}>
        <View style={styles.tripHeaderRow}>
          <Text style={styles.tripDestination}>{item.destination}</Text>
          <View
            style={[
              styles.statusBadge,
              item.status === 'Upcoming' && styles.statusUpcoming,
              item.status === 'Completed' && styles.statusCompleted,
              item.status === 'Planning' && styles.statusPlanning,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === 'Upcoming' && styles.statusTextUpcoming,
                item.status === 'Completed' && styles.statusTextCompleted,
                item.status === 'Planning' && styles.statusTextPlanning,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <View style={styles.tripMetaRow}>
          <View style={styles.metaItem}>
            <Calendar size={12} color="#94A3B8" />
            <Text style={styles.metaText}>{item.dates}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={12} color="#94A3B8" />
            <Text style={styles.metaText}>{item.days} days</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconBox}>
        <Plane size={32} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>No trips yet</Text>
      <Text style={styles.emptyDescription}>
        Create your first AI-powered trip plan and it will appear here.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleCreateTrip} activeOpacity={0.85}>
        <Plus size={18} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Create Trip</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateTrip} activeOpacity={0.85}>
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.createButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      {TRIPS.length > 0 && (
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterChip,
                filter === f && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        contentContainerStyle={
          filteredTrips.length === 0 ? styles.emptyList : styles.listContent
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyList: {
    flex: 1,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tripEmojiBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripEmoji: {
    fontSize: 26,
  },
  tripInfo: {
    flex: 1,
  },
  tripHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tripDestination: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusUpcoming: {
    backgroundColor: '#DCFCE7',
  },
  statusCompleted: {
    backgroundColor: '#F1F5F9',
  },
  statusPlanning: {
    backgroundColor: '#FEF3C7',
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
  statusTextPlanning: {
    color: '#D97706',
  },
  tripMetaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
