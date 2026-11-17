import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Calendar, Check, Heart, MapPin, Sparkles, Users } from 'lucide-react-native';
import { createTrip } from '@/lib/trips';
import { colors, radius, shadows } from '@/lib/theme';
import { AnimatedPressable, FadeSlideIn } from '@/components/ui/animated';

const INTERESTS = ['Culture', 'Food', 'Nature', 'Adventure', 'History', 'Nightlife', 'Beaches', 'Shopping', 'Photography', 'Relaxation'];
const BUDGETS = [
  { label: 'Budget', value: 'budget', desc: '$50–100/day' },
  { label: 'Mid-range', value: 'mid', desc: '$100–250/day' },
  { label: 'Luxury', value: 'luxury', desc: '$250+/day' },
];

function normalizeDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return slashMatch ? `${slashMatch[3]}-${slashMatch[1].padStart(2, '0')}-${slashMatch[2].padStart(2, '0')}` : trimmed;
}

export default function CreateTripScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ destination?: string }>();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [travelers, setTravelers] = useState('Just me');
  const [description, setDescription] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepFade = useRef(new Animated.Value(1)).current;
  const barWidth = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    if (typeof params.destination === 'string' && params.destination) setDestination(params.destination);
  }, [params.destination]);

  useEffect(() => {
    barWidth.setValue((step - 1) / 4);
    Animated.timing(barWidth, {
      toValue: step / 4,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [step, barWidth]);

  const changeStep = (next: number) => {
    Animated.timing(stepFade, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setStep(next);
      stepFade.setValue(0);
      Animated.timing(stepFade, { toValue: 1, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    });
  };

  const toggleInterest = (interest: string) =>
    setInterests((current) => (current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]));

  const canProceed =
    step === 1 ? title.trim().length > 0 && destination.trim().length > 0
    : step === 2 ? startDate.trim().length > 0 && endDate.trim().length > 0
    : step === 3 ? budget.length > 0
    : true;

  const handleNext = async () => {
    if (step < 4) {
      changeStep(step + 1);
      return;
    }
    setSaving(true);
    setError(null);
    const result = await createTrip({ title, source, destination, startDate: normalizeDate(startDate), endDate: normalizeDate(endDate), budget, travelers, description, interests });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: barWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: stepFade, transform: [{ translateX: stepFade.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }}>
          {step === 1 && (
            <View style={styles.step}>
              <View style={[styles.stepIcon, shadows.sm]}><MapPin size={23} color={colors.primary} /></View>
              <Text style={styles.kicker}>STEP 01 · ROUTE</Text>
              <Text style={styles.title}>Add a new trip</Text>
              <Text style={styles.subtitle}>Tell us where you are starting and where the story ends.</Text>
              <Text style={styles.label}>Trip title *</Text>
              <TextInput style={styles.input} placeholder="e.g. Japan Adventure" placeholderTextColor={colors.textMuted} value={title} onChangeText={setTitle} />
              <Text style={styles.label}>Source</Text>
              <TextInput style={styles.input} placeholder="e.g. New Delhi, India" placeholderTextColor={colors.textMuted} value={source} onChangeText={setSource} />
              <Text style={styles.label}>Destination *</Text>
              <TextInput style={styles.input} placeholder="e.g. Tokyo, Japan" placeholderTextColor={colors.textMuted} value={destination} onChangeText={setDestination} autoFocus />
            </View>
          )}
          {step === 2 && (
            <View style={styles.step}>
              <View style={[styles.stepIcon, shadows.sm]}><Calendar size={23} color={colors.primary} /></View>
              <Text style={styles.kicker}>STEP 02 · DATES</Text>
              <Text style={styles.title}>When are you traveling?</Text>
              <Text style={styles.subtitle}>Use MM/DD/YYYY or YYYY-MM-DD.</Text>
              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <Text style={styles.label}>Start date *</Text>
                  <TextInput style={styles.input} placeholder="05/20/2025" placeholderTextColor={colors.textMuted} value={startDate} onChangeText={setStartDate} />
                </View>
                <View style={styles.dateField}>
                  <Text style={styles.label}>End date *</Text>
                  <TextInput style={styles.input} placeholder="05/28/2025" placeholderTextColor={colors.textMuted} value={endDate} onChangeText={setEndDate} />
                </View>
              </View>
              <Text style={styles.label}>Travelers</Text>
              <View style={styles.travelerRow}>
                <Users size={18} color={colors.primary} />
                {['Just me', 'Couple', 'Family', 'Group'].map((item) => (
                  <AnimatedPressable key={item} onPress={() => setTravelers(item)} style={[styles.travelerChip, travelers === item && styles.travelerActive]} scaleTo={0.92}>
                    <Text style={[styles.travelerText, travelers === item && styles.travelerTextActive]}>{item}</Text>
                  </AnimatedPressable>
                ))}
              </View>
            </View>
          )}
          {step === 3 && (
            <View style={styles.step}>
              <View style={[styles.stepIcon, shadows.sm]}><Sparkles size={23} color={colors.primary} /></View>
              <Text style={styles.kicker}>STEP 03 · STYLE</Text>
              <Text style={styles.title}>Shape your experience</Text>
              <Text style={styles.subtitle}>Pick a budget so every recommendation feels realistic.</Text>
              <View style={styles.options}>
                {BUDGETS.map((item) => (
                  <AnimatedPressable key={item.value} style={[styles.option, budget === item.value && styles.optionActive]} onPress={() => setBudget(item.value)} scaleTo={0.975}>
                    <View style={styles.radio}>{budget === item.value && <View style={styles.radioDot} />}</View>
                    <View>
                      <Text style={styles.optionTitle}>{item.label}</Text>
                      <Text style={styles.optionDescription}>{item.desc}</Text>
                    </View>
                  </AnimatedPressable>
                ))}
              </View>
              <Text style={styles.label}>Trip description</Text>
              <TextInput style={[styles.input, styles.multiline]} placeholder="A relaxed food-focused adventure..." placeholderTextColor={colors.textMuted} value={description} onChangeText={setDescription} multiline maxLength={200} />
            </View>
          )}
          {step === 4 && (
            <View style={styles.step}>
              <View style={[styles.stepIcon, shadows.sm]}><Heart size={23} color={colors.primary} /></View>
              <Text style={styles.kicker}>STEP 04 · INTERESTS</Text>
              <Text style={styles.title}>What are you into?</Text>
              <Text style={styles.subtitle}>Choose a few signals for a more personal plan.</Text>
              <View style={styles.interests}>
                {INTERESTS.map((item) => (
                  <AnimatedPressable key={item} onPress={() => toggleInterest(item)} style={[styles.interest, interests.includes(item) && styles.interestActive]} scaleTo={0.9}>
                    {interests.includes(item) && <Check size={14} color="#FFFFFF" />}
                    <Text style={[styles.interestText, interests.includes(item) && styles.interestTextActive]}>{item}</Text>
                  </AnimatedPressable>
                ))}
              </View>
              <View style={styles.storageNote}>
                <Text style={styles.storageTitle}>Trip cover image</Text>
                <Text style={styles.storageText}>Private trip photos are stored securely with your plan.</Text>
              </View>
            </View>
          )}
          {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
        </Animated.View>
      </ScrollView>
      <View style={styles.footer}>
        <AnimatedPressable style={styles.backButton} onPress={() => (step > 1 ? changeStep(step - 1) : router.back())}>
          <Text style={styles.backText}>{step > 1 ? 'Back' : 'Cancel'}</Text>
        </AnimatedPressable>
        <AnimatedPressable style={[styles.nextButton, (!canProceed || saving) && styles.nextDisabled, shadows.sm]} onPress={handleNext} disabled={!canProceed || saving}>
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.nextText}>{step < 4 ? 'Continue' : 'Save trip'}</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </>
          )}
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progressRow: { paddingHorizontal: 20, paddingTop: 16 },
  progressTrack: { height: 5, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.primary },
  content: { padding: 24, paddingTop: 28, paddingBottom: 24 },
  step: { alignItems: 'stretch' },
  stepIcon: { width: 58, height: 58, borderRadius: radius.lg + 2, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16, alignSelf: 'center' },
  kicker: { textAlign: 'center', color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.textPrimary, fontSize: 25, fontWeight: '800', textAlign: 'center', marginTop: 7 },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 7, marginBottom: 24 },
  label: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 7, marginTop: 14 },
  input: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, color: colors.textPrimary, fontSize: 15, paddingHorizontal: 16, paddingVertical: 14 },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  dateRow: { flexDirection: 'row', gap: 12 },
  dateField: { flex: 1 },
  travelerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  travelerChip: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  travelerActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  travelerText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  travelerTextActive: { color: colors.primaryDark },
  options: { gap: 11 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: colors.surface, borderRadius: radius.md + 1, borderWidth: 2, borderColor: colors.border, padding: 16 },
  optionActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  optionTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  optionDescription: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  interests: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 9 },
  interest: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 10 },
  interestActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  interestText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  interestTextActive: { color: '#FFFFFF' },
  storageNote: { marginTop: 24, backgroundColor: colors.successSoft, borderRadius: radius.md, padding: 14 },
  storageTitle: { color: '#166534', fontWeight: '800', fontSize: 13 },
  storageText: { color: '#166534', fontSize: 12, marginTop: 4, opacity: 0.8 },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: radius.sm + 2, padding: 12, marginTop: 20 },
  errorText: { color: '#B91C1C', fontSize: 13 },
  footer: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: 16 },
  backButton: { backgroundColor: '#F0F3F2', borderRadius: radius.md, paddingHorizontal: 22, justifyContent: 'center' },
  backText: { color: colors.textSecondary, fontSize: 14, fontWeight: '700' },
  nextButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 15 },
  nextDisabled: { backgroundColor: colors.primaryMuted },
  nextText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
