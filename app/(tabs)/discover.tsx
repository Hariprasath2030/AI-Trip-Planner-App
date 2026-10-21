import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Star, Heart } from 'lucide-react-native';

const CATEGORIES = ['All', 'Beaches', 'Cities', 'Mountains', 'Culture', 'Food'];

const DESTINATIONS = [
  {
    id: '1',
    name: 'Bali',
    country: 'Indonesia',
    category: 'Beaches',
    rating: 4.8,
    description: 'Tropical paradise with stunning temples and rice terraces.',
    color: '#0EA5E9',
    emoji: '🌴',
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    category: 'Cities',
    rating: 4.9,
    description: 'Vibrant city blend of traditional culture and modern tech.',
    color: '#F43F5E',
    emoji: '🗼',
  },
  {
    id: '3',
    name: 'Barcelona',
    country: 'Spain',
    category: 'Cities',
    rating: 4.7,
    description: 'Gaudi architecture, Mediterranean beaches, and tapas.',
    color: '#F59E0B',
    emoji: '🏖️',
  },
  {
    id: '4',
    name: 'Reykjavik',
    country: 'Iceland',
    category: 'Mountains',
    rating: 4.6,
    description: 'Northern lights, geothermal springs, and dramatic landscapes.',
    color: '#6366F1',
    emoji: '🏔️',
  },
  {
    id: '5',
    name: 'Marrakech',
    country: 'Morocco',
    category: 'Culture',
    rating: 4.5,
    description: 'Ancient medina, vibrant souks, and stunning riads.',
    color: '#EA580C',
    emoji: '🕌',
  },
  {
    id: '6',
    name: 'Bangkok',
    country: 'Thailand',
    category: 'Food',
    rating: 4.7,
    description: 'World-class street food, temples, and bustling markets.',
    color: '#16A34A',
    emoji: '🍜',
  },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filtered =
    activeCategory === 'All'
      ? DESTINATIONS
      : DESTINATIONS.filter((d) => d.category === activeCategory);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find your next destination</Text>
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color="#94A3B8" />
        <Text style={styles.searchPlaceholder}>Search destinations...</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[
              styles.categoryChip,
              activeCategory === cat && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.destScroll}
        contentContainerStyle={styles.destContainer}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((dest) => (
          <View key={dest.id} style={styles.destCard}>
            <View style={[styles.destImageBox, { backgroundColor: dest.color }]}>
              <Text style={styles.destEmoji}>{dest.emoji}</Text>
              <TouchableOpacity
                style={styles.heartButton}
                onPress={() => toggleFavorite(dest.id)}
                activeOpacity={0.7}
              >
                <Heart
                  size={18}
                  color={favorites.includes(dest.id) ? '#F43F5E' : '#FFFFFF'}
                  fill={favorites.includes(dest.id) ? '#F43F5E' : 'none'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.destContent}>
              <View style={styles.destHeaderRow}>
                <View>
                  <Text style={styles.destName}>{dest.name}</Text>
                  <Text style={styles.destCountry}>{dest.country}</Text>
                </View>
                <View style={styles.ratingBox}>
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{dest.rating}</Text>
                </View>
              </View>
              <Text style={styles.destDescription}>{dest.description}</Text>
              <TouchableOpacity
                style={styles.planButton}
                onPress={() => router.push('/create-trip')}
                activeOpacity={0.7}
              >
                <Text style={styles.planButtonText}>Plan a trip here</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#94A3B8',
  },
  categoryScroll: {
    maxHeight: 44,
    marginBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  destScroll: {
    flex: 1,
  },
  destContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  destCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  destImageBox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  destEmoji: {
    fontSize: 44,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destContent: {
    padding: 16,
  },
  destHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  destName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  destCountry: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  destDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 14,
  },
  planButton: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  planButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284C7',
  },
});
