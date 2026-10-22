import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Calendar, Check, DollarSign, Heart, MapPin, Sparkles } from 'lucide-react-native';
import { createTrip } from '@/lib/trips';

const INTERESTS = ['Culture', 'Food', 'Nature', 'Adventure', 'History', 'Nightlife', 'Beaches', 'Shopping', 'Photography', 'Relaxation'];
const BUDGETS = [{ label: 'Budget', value: 'budget', desc: '$50–100/day' }, { label: 'Mid-range', value: 'mid', desc: '$100–250/day' }, { label: 'Luxury', value: 'luxury', desc: '$250+/day' }];

function normalizeDate(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) return `${slashMatch[3]}-${slashMatch[1].padStart(2, '0')}-${slashMatch[2].padStart(2, '0')}`;
  return trimmed;
}

export default function CreateTripScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ destination?: string }>();
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof params.destination === 'string' && params.destination) setDestination(params.destination);
  }, [params.destination]);

  const toggleInterest = (interest: string) => setInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  const canProceed = step === 1 ? destination.trim().length > 0 : step === 2 ? startDate.trim().length > 0 && endDate.trim().length > 0 : step === 3 ? budget.length > 0 : true;

  const handleNext = async () => {
    if (step < 4) {
      setStep((current) => current + 1);
      return;
    }
    setSaving(true);
    setError(null);
    const result = await createTrip({ destination: destination.trim(), startDate: normalizeDate(startDate), endDate: normalizeDate(endDate), budget, interests });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.progressRow}>{[1, 2, 3, 4].map((item) => <View key={item} style={[styles.progressBar, item <= step && styles.progressBarActive]} />)}</View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 ? <View style={styles.step}><View style={styles.stepIcon}><MapPin size={23} color="#0EA5E9" /></View><Text style={styles.title}>Where are you going?</Text><Text style={styles.subtitle}>Start with a place you can&apos;t stop thinking about.</Text><TextInput style={styles.input} placeholder="e.g. Kyoto, Japan" placeholderTextColor="#CBD5E1" value={destination} onChangeText={setDestination} autoFocus /></View> : null}
        {step === 2 ? <View style={styles.step}><View style={styles.stepIcon}><Calendar size={23} color="#0EA5E9" /></View><Text style={styles.title}>When are you traveling?</Text><Text style={styles.subtitle}>Use MM/DD/YYYY or YYYY-MM-DD.</Text><View style={styles.dateRow}><View style={styles.dateField}><Text style={styles.label}>Start date</Text><TextInput style={styles.input} placeholder="MM/DD/YYYY" placeholderTextColor="#CBD5E1" value={startDate} onChangeText={setStartDate} /></View><View style={styles.dateField}><Text style={styles.label}>End date</Text><TextInput style={styles.input} placeholder="MM/DD/YYYY" placeholderTextColor="#CBD5E1" value={endDate} onChangeText={setEndDate} /></View></View></View> : null}
        {step === 3 ? <View style={styles.step}><View style={styles.stepIcon}><DollarSign size={23} color="#0EA5E9" /></View><Text style={styles.title}>What&apos;s your budget?</Text><Text style={styles.subtitle}>We&apos;ll use this to keep recommendations realistic.</Text><View style={styles.options}>{BUDGETS.map((item) => <TouchableOpacity key={item.value} style={[styles.option, budget === item.value && styles.optionActive]} onPress={() => setBudget(item.value)} activeOpacity={0.8}><View style={styles.radio}>{budget === item.value ? <View style={styles.radioDot} /> : null}</View><View><Text style={styles.optionTitle}>{item.label}</Text><Text style={styles.optionDescription}>{item.desc}</Text></View></TouchableOpacity>)}</View></View> : null}
        {step === 4 ? <View style={styles.step}><View style={styles.stepIcon}><Heart size={23} color="#0EA5E9" /></View><Text style={styles.title}>What are you into?</Text><Text style={styles.subtitle}>Pick a few signals for a more personal plan.</Text><View style={styles.interests}>{INTERESTS.map((item) => <Pressable key={item} onPress={() => toggleInterest(item)} style={[styles.interest, interests.includes(item) && styles.interestActive]}>{interests.includes(item) ? <Check size={14} color="#FFFFFF" /> : null}<Text style={[styles.interestText, interests.includes(item) && styles.interestTextActive]}>{item}</Text></Pressable>)}</View></View> : null}
        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
      </ScrollView>
      <View style={styles.footer}><TouchableOpacity style={styles.backButton} onPress={() => step > 1 ? setStep((current) => current - 1) : router.back()}><Text style={styles.backText}>{step > 1 ? 'Back' : 'Cancel'}</Text></TouchableOpacity><TouchableOpacity style={[styles.nextButton, (!canProceed || saving) && styles.nextDisabled]} onPress={handleNext} disabled={!canProceed || saving}>{saving ? <ActivityIndicator color="#FFFFFF" /> : step < 4 ? <><Text style={styles.nextText}>Continue</Text><ArrowRight size={18} color="#FFFFFF" /></> : <><Sparkles size={18} color="#FFFFFF" /><Text style={styles.nextText}>Save my plan</Text></>}</TouchableOpacity></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  progressRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, paddingTop: 16 },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' },
  progressBarActive: { backgroundColor: '#0EA5E9' },
  content: { padding: 24, paddingTop: 34, paddingBottom: 24 },
  step: { alignItems: 'center' },
  stepIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { color: '#0F172A', fontSize: 23, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#64748B', fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 7, marginBottom: 28 },
  input: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', color: '#0F172A', fontSize: 15, paddingHorizontal: 16, paddingVertical: 15 },
  dateRow: { width: '100%', flexDirection: 'row', gap: 12 },
  dateField: { flex: 1 },
  label: { color: '#334155', fontSize: 12, fontWeight: '700', marginBottom: 7 },
  options: { width: '100%', gap: 11 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 2, borderColor: '#E2E8F0', padding: 16 },
  optionActive: { borderColor: '#0EA5E9', backgroundColor: '#F0F9FF' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0EA5E9' },
  optionTitle: { color: '#0F172A', fontSize: 15, fontWeight: '700' },
  optionDescription: { color: '#94A3B8', fontSize: 12, marginTop: 3 },
  interests: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 9 },
  interest: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 10 },
  interestActive: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  interestText: { color: '#334155', fontSize: 13, fontWeight: '600' },
  interestTextActive: { color: '#FFFFFF' },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginTop: 20, width: '100%' },
  errorText: { color: '#B91C1C', fontSize: 13 },
  footer: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', padding: 16 },
  backButton: { backgroundColor: '#F1F5F9', borderRadius: 14, paddingHorizontal: 22, justifyContent: 'center' },
  backText: { color: '#64748B', fontSize: 14, fontWeight: '700' },
  nextButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: '#0EA5E9', borderRadius: 14, paddingVertical: 15 },
  nextDisabled: { backgroundColor: '#BAE6FD' },
  nextText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
