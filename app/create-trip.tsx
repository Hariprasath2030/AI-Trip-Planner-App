import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Calendar, Check, Heart, MapPin, Sparkles, Users } from 'lucide-react-native';
import { createTrip } from '@/lib/trips';

const INTERESTS = ['Culture', 'Food', 'Nature', 'Adventure', 'History', 'Nightlife', 'Beaches', 'Shopping', 'Photography', 'Relaxation'];
const BUDGETS = [{ label: 'Budget', value: 'budget', desc: '$50–100/day' }, { label: 'Mid-range', value: 'mid', desc: '$100–250/day' }, { label: 'Luxury', value: 'luxury', desc: '$250+/day' }];

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

  useEffect(() => { if (typeof params.destination === 'string' && params.destination) setDestination(params.destination); }, [params.destination]);
  const toggleInterest = (interest: string) => setInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  const canProceed = step === 1 ? title.trim().length > 0 && destination.trim().length > 0 : step === 2 ? startDate.trim().length > 0 && endDate.trim().length > 0 : step === 3 ? budget.length > 0 : true;

  const handleNext = async () => {
    if (step < 4) { setStep((current) => current + 1); return; }
    setSaving(true); setError(null);
    const result = await createTrip({ title, source, destination, startDate: normalizeDate(startDate), endDate: normalizeDate(endDate), budget, travelers, description, interests });
    setSaving(false);
    if (result.error) { setError(result.error); return; }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.progressRow}>{[1, 2, 3, 4].map((item) => <View key={item} style={[styles.progressBar, item <= step && styles.progressBarActive]} />)}</View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && <View style={styles.step}><View style={styles.stepIcon}><MapPin size={23} color="#0EA5E9" /></View><Text style={styles.kicker}>STEP 01 · ROUTE</Text><Text style={styles.title}>Add a new trip</Text><Text style={styles.subtitle}>Tell us where you are starting and where the story ends.</Text><Text style={styles.label}>Trip title *</Text><TextInput style={styles.input} placeholder="e.g. Japan Adventure" placeholderTextColor="#94A3B8" value={title} onChangeText={setTitle} /><Text style={styles.label}>Source</Text><TextInput style={styles.input} placeholder="e.g. New Delhi, India" placeholderTextColor="#94A3B8" value={source} onChangeText={setSource} /><Text style={styles.label}>Destination *</Text><TextInput style={styles.input} placeholder="e.g. Tokyo, Japan" placeholderTextColor="#94A3B8" value={destination} onChangeText={setDestination} autoFocus /></View>}
        {step === 2 && <View style={styles.step}><View style={styles.stepIcon}><Calendar size={23} color="#0EA5E9" /></View><Text style={styles.kicker}>STEP 02 · DATES</Text><Text style={styles.title}>When are you traveling?</Text><Text style={styles.subtitle}>Use MM/DD/YYYY or YYYY-MM-DD.</Text><View style={styles.dateRow}><View style={styles.dateField}><Text style={styles.label}>Start date *</Text><TextInput style={styles.input} placeholder="05/20/2025" placeholderTextColor="#94A3B8" value={startDate} onChangeText={setStartDate} /></View><View style={styles.dateField}><Text style={styles.label}>End date *</Text><TextInput style={styles.input} placeholder="05/28/2025" placeholderTextColor="#94A3B8" value={endDate} onChangeText={setEndDate} /></View></View><Text style={styles.label}>Travelers</Text><View style={styles.travelerRow}><Users size={18} color="#0EA5E9" />{['Just me', 'Couple', 'Family', 'Group'].map((item) => <Pressable key={item} onPress={() => setTravelers(item)} style={[styles.travelerChip, travelers === item && styles.travelerActive]}><Text style={[styles.travelerText, travelers === item && styles.travelerTextActive]}>{item}</Text></Pressable>)}</View></View>}
        {step === 3 && <View style={styles.step}><View style={styles.stepIcon}><Sparkles size={23} color="#0EA5E9" /></View><Text style={styles.kicker}>STEP 03 · STYLE</Text><Text style={styles.title}>Shape your experience</Text><Text style={styles.subtitle}>Pick a budget so every recommendation feels realistic.</Text><View style={styles.options}>{BUDGETS.map((item) => <TouchableOpacity key={item.value} style={[styles.option, budget === item.value && styles.optionActive]} onPress={() => setBudget(item.value)}><View style={styles.radio}>{budget === item.value && <View style={styles.radioDot} />}</View><View><Text style={styles.optionTitle}>{item.label}</Text><Text style={styles.optionDescription}>{item.desc}</Text></View></TouchableOpacity>)}</View><Text style={styles.label}>Trip description</Text><TextInput style={[styles.input, styles.multiline]} placeholder="A relaxed food-focused adventure..." placeholderTextColor="#94A3B8" value={description} onChangeText={setDescription} multiline maxLength={200} /></View>}
        {step === 4 && <View style={styles.step}><View style={styles.stepIcon}><Heart size={23} color="#0EA5E9" /></View><Text style={styles.kicker}>STEP 04 · INTERESTS</Text><Text style={styles.title}>What are you into?</Text><Text style={styles.subtitle}>Choose a few signals for a more personal plan.</Text><View style={styles.interests}>{INTERESTS.map((item) => <Pressable key={item} onPress={() => toggleInterest(item)} style={[styles.interest, interests.includes(item) && styles.interestActive]}>{interests.includes(item) && <Check size={14} color="#FFFFFF" />}<Text style={[styles.interestText, interests.includes(item) && styles.interestTextActive]}>{item}</Text></Pressable>)}</View><View style={styles.storageNote}><Text style={styles.storageTitle}>Trip cover image</Text><Text style={styles.storageText}>Private trip photos are stored securely with your plan.</Text></View></View>}
        {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
      </ScrollView>
      <View style={styles.footer}><TouchableOpacity style={styles.backButton} onPress={() => step > 1 ? setStep((current) => current - 1) : router.back()}><Text style={styles.backText}>{step > 1 ? 'Back' : 'Cancel'}</Text></TouchableOpacity><TouchableOpacity style={[styles.nextButton, (!canProceed || saving) && styles.nextDisabled]} onPress={handleNext} disabled={!canProceed || saving}>{saving ? <ActivityIndicator color="#FFFFFF" /> : <><Text style={styles.nextText}>{step < 4 ? 'Continue' : 'Save trip'}</Text><ArrowRight size={18} color="#FFFFFF" /></>}</TouchableOpacity></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F8FAFC' }, progressRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, paddingTop: 16 }, progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' }, progressBarActive: { backgroundColor: '#0EA5E9' }, content: { padding: 24, paddingTop: 28, paddingBottom: 24 }, step: { alignItems: 'stretch' }, stepIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 16, alignSelf: 'center' }, kicker: { textAlign: 'center', color: '#0EA5E9', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }, title: { color: '#0F172A', fontSize: 25, fontWeight: '800', textAlign: 'center', marginTop: 7 }, subtitle: { color: '#64748B', fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 7, marginBottom: 24 }, label: { color: '#334155', fontSize: 12, fontWeight: '700', marginBottom: 7, marginTop: 14 }, input: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', color: '#0F172A', fontSize: 15, paddingHorizontal: 16, paddingVertical: 14 }, multiline: { minHeight: 90, textAlignVertical: 'top' }, dateRow: { flexDirection: 'row', gap: 12 }, dateField: { flex: 1 }, travelerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }, travelerChip: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' }, travelerActive: { backgroundColor: '#E0F2FE', borderColor: '#0EA5E9' }, travelerText: { color: '#64748B', fontSize: 12, fontWeight: '600' }, travelerTextActive: { color: '#0284C7' }, options: { gap: 11 }, option: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 2, borderColor: '#E2E8F0', padding: 16 }, optionActive: { borderColor: '#0EA5E9', backgroundColor: '#F0F9FF' }, radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' }, radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0EA5E9' }, optionTitle: { color: '#0F172A', fontSize: 15, fontWeight: '700' }, optionDescription: { color: '#94A3B8', fontSize: 12, marginTop: 3 }, interests: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 9 }, interest: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 10 }, interestActive: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' }, interestText: { color: '#334155', fontSize: 13, fontWeight: '600' }, interestTextActive: { color: '#FFFFFF' }, storageNote: { marginTop: 24, backgroundColor: '#ECFDF5', borderRadius: 14, padding: 14 }, storageTitle: { color: '#047857', fontWeight: '800', fontSize: 13 }, storageText: { color: '#065F46', fontSize: 12, marginTop: 4 }, errorBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginTop: 20 }, errorText: { color: '#B91C1C', fontSize: 13 }, footer: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', padding: 16 }, backButton: { backgroundColor: '#F1F5F9', borderRadius: 14, paddingHorizontal: 22, justifyContent: 'center' }, backText: { color: '#64748B', fontSize: 14, fontWeight: '700' }, nextButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: '#0EA5E9', borderRadius: 14, paddingVertical: 15 }, nextDisabled: { backgroundColor: '#BAE6FD' }, nextText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' } });
