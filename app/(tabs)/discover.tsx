import { useState } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Star, Heart } from 'lucide-react-native';
import { colors, radius, shadows } from '@/lib/theme';
import { AnimatedPressable, FadeSlideIn } from '@/components/ui/animated';

const CATEGORIES = ['All', 'Beaches', 'Cities', 'Mountains', 'Culture', 'Food'];

const DESTINATIONS = [
  { id: '1', name: 'Bali', country: 'Indonesia', category: 'Beaches', rating: 4.8, description: 'Tropical paradise with stunning temples and rice terraces.', color: '#0F9B8E', emoji: '🌴' },
  { id: '2', name: 'Tokyo', country: 'Japan', category: 'Cities', rating: 4.9, description: 'Vibrant city blend of traditional culture and modern tech.', color: '#E0603C', emoji: '🗼' },
  { id: '3', name: 'Barcelona', country: 'Spain', category: 'Cities', rating: 4.7, description: 'Gaudi architecture, Mediterranean beaches, and tapas.', color: '#F59E0B', emoji: '🏖️' },
  { id: '4', name: 'Reykjavik', country: 'Iceland', category: 'Mountains', rating: 4.6, description: 'Northern lights, geothermal springs, and dramatic landscapes.', color: '#3A7CA5', emoji: '🏔️' },
  { id: '5', name: 'Marrakech', country: 'Morocco', category: 'Culture', rating: 4.5, description: 'Ancient medina, vibrant souks, and stunning riads.', color: '#C2571B', emoji: '🕌' },
  { id: '6', name: 'Bangkok', country: 'Thailand', category: 'Food', rating: 4.7, description: 'World-class street food, temples, and bustling markets.', color: '#16A34A', emoji: '🍜' },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filtered = activeCategory === 'All' ? DESTINATIONS : DESTINATIONS.filter((d) => d.category === activeCategory);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FadeSlideIn distance={16}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Find your next destination</Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={80} distance={16}>
        <View style={[styles.searchBox, shadows.sm]}>
          <Search size={18} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search destinations...</Text>
        </View>
      </FadeSlideIn>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContainer}>
        {CATEGORIES.map((cat) => (
          <AnimatedPressable key={cat} onPress={() => setActiveCategory(cat)} style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]} scaleTo={0.92}>
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
          </AnimatedPressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.destScroll} contentContainerStyle={styles.destContainer} showsVerticalScrollIndicator={false}>
        {filtered.map((dest, index) => (
          <FadeSlideIn key={dest.id} delay={index * 80} distance={26}>
            <View style={[styles.destCard, shadows.md]}>
              <View style={[styles.destImageBox, { backgroundColor: dest.color }]}>
                <Text style={styles.destEmoji}>{dest.emoji}</Text>
                <AnimatedPressable style={styles.heartButton} onPress={() => toggleFavorite(dest.id)} scaleTo={0.8}>
                  <Heart size={18} color={favorites.includes(dest.id) ? '#F43F5E' : '#FFFFFF'} fill={favorites.includes(dest.id) ? '#F43F5E' : 'none'} />
                </AnimatedPressable>
              </View>
              <View style={styles.destContent}>
                <View style={styles.destHeaderRow}>
                  <View>
                    <Text style={styles.destName}>{dest.name}</Text>
                    <Text style={styles.destCountry}>{dest.country}</Text>
                  </View>
                  <View style={styles.ratingBox}>
                    <Star size={13} color="#B45309" fill="#B45309" />
                    <Text style={styles.ratingText}>{dest.rating}</Text>
                  </View>
                </View>
                <Text style={styles.destDescription}>{dest.description}</Text>
                <AnimatedPressable style={styles.planButton} onPress={() => router.push('/create-trip')} scaleTo={0.96}>
                  <Text style={styles.planButtonText}>Plan a trip here</Text>
                </AnimatedPressable>
              </View>
            </View>
          </FadeSlideIn>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 16, marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.md + 2, paddingHorizontal: 16, paddingVertical: 14, marginHorizontal: 20, marginBottom: 16 },
  searchPlaceholder: { fontSize: 15, color: colors.textMuted },
  categoryScroll: { maxHeight: 44, marginBottom: 16 },
  categoryContainer: { paddingHorizontal: 20, gap: 8 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  categoryTextActive: { color: '#FFFFFF' },
  destScroll: { flex: 1 },
  destContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  destCard: { backgroundColor: colors.surface, borderRadius: radius.lg - 2, marginBottom: 16, overflow: 'hidden' },
  destImageBox: { height: 120, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  destEmoji: { fontSize: 44 },
  heartButton: { position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(18, 33, 31, 0.3)', alignItems: 'center', justifyContent: 'center' },
  destContent: { padding: 16 },
  destHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  destName: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  destCountry: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm - 2 },
  ratingText: { fontSize: 12, fontWeight: '600', color: '#92400E' },
  destDescription: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 14 },
  planButton: { backgroundColor: colors.primaryLight, borderRadius: radius.sm + 2, paddingVertical: 11, alignItems: 'center' },
  planButtonText: { fontSize: 14, fontWeight: '700', color: colors.primaryDark },
});
