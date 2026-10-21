import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, Clock, MapPin, Star, Camera, Utensils, Bed } from 'lucide-react-native';

type Activity = {
  time: string;
  title: string;
  description: string;
  icon: 'camera' | 'utensils' | 'bed' | 'mappin';
};

type Day = {
  day: number;
  title: string;
  activities: Activity[];
};

const ICON_MAP = {
  camera: Camera,
  utensils: Utensils,
  bed: Bed,
  mappin: MapPin,
};

const ITINERARY: Day[] = [
  {
    day: 1,
    title: 'Arrival & Old Town',
    activities: [
      { time: '10:00', title: 'Arrive at Hotel', description: 'Check-in and settle in at your accommodation.', icon: 'bed' },
      { time: '13:00', title: 'Lunch at Local Tavern', description: 'Try traditional cuisine at a nearby restaurant.', icon: 'utensils' },
      { time: '15:00', title: 'Explore Old Town', description: 'Wander through historic streets and landmarks.', icon: 'camera' },
      { time: '19:00', title: 'Sunset Viewpoint', description: 'Scenic overlook for golden hour photos.', icon: 'mappin' },
    ],
  },
  {
    day: 2,
    title: 'Temples & Gardens',
    activities: [
      { time: '08:00', title: 'Morning Temple Visit', description: 'Visit the most famous temple before crowds arrive.', icon: 'mappin' },
      { time: '12:00', title: 'Garden Lunch', description: 'Picnic in the botanical gardens.', icon: 'utensils' },
      { time: '14:00', title: 'Tea Ceremony', description: 'Experience a traditional tea ceremony.', icon: 'camera' },
      { time: '18:00', title: 'Dinner & Rest', description: 'Relaxing dinner at the hotel.', icon: 'bed' },
    ],
  },
  {
    day: 3,
    title: 'Day Trip to Mountains',
    activities: [
      { time: '07:00', title: 'Early Departure', description: 'Head out to the mountain trailhead.', icon: 'mappin' },
      { time: '10:00', title: 'Hiking & Photography', description: 'Guided hike with scenic photo stops.', icon: 'camera' },
      { time: '13:00', title: 'Mountain Lunch', description: 'Packed lunch at the summit viewpoint.', icon: 'utensils' },
      { time: '17:00', title: 'Return to City', description: 'Head back and relax at the hotel.', icon: 'bed' },
    ],
  },
];

export default function TripDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <Text style={styles.heroEmoji}>🗺️</Text>
        <Text style={styles.heroDestination}>Kyoto, Japan</Text>
        <View style={styles.heroMetaRow}>
          <View style={styles.metaPill}>
            <Calendar size={13} color="#FFFFFF" />
            <Text style={styles.metaPillText}>Oct 15 - 22</Text>
          </View>
          <View style={styles.metaPill}>
            <Clock size={13} color="#FFFFFF" />
            <Text style={styles.metaPillText}>7 days</Text>
          </View>
          <View style={styles.metaPill}>
            <Star size={13} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.metaPillText}>4.8</Text>
          </View>
        </View>
      </View>

      <View style={styles.itinerarySection}>
        <Text style={styles.sectionTitle}>Your Itinerary</Text>
        {ITINERARY.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayNumber}>{day.day}</Text>
              </View>
              <View>
                <Text style={styles.dayLabel}>DAY {day.day}</Text>
                <Text style={styles.dayTitle}>{day.title}</Text>
              </View>
            </View>
            <View style={styles.timeline}>
              {day.activities.map((activity, index) => {
                const Icon = ICON_MAP[activity.icon];
                return (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineLine}>
                      <View style={styles.timelineDot}>
                        <Icon size={12} color="#0EA5E9" />
                      </View>
                      {index < day.activities.length - 1 && <View style={styles.timelineConnector} />}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.activityTime}>{activity.time}</Text>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.activityDescription}>{activity.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroSection: {
    backgroundColor: '#0EA5E9',
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  heroDestination: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  metaPillText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  itinerarySection: {
    padding: 20,
    paddingTop: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  dayBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineLine: {
    alignItems: 'center',
    width: 28,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 2,
    marginBottom: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 18,
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0EA5E9',
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 3,
  },
  activityDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },
});
