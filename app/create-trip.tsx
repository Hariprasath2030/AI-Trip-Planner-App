import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Sparkles, MapPin, Calendar, DollarSign, Heart, ArrowRight, Check } from 'lucide-react-native';

const INTERESTS = [
  'Culture', 'Food', 'Nature', 'Adventure', 'History',
  'Nightlife', 'Beaches', 'Shopping', 'Photography', 'Relaxation',
];

const BUDGETS = [
  { label: 'Budget', value: 'budget', desc: '$50-100/day' },
  { label: 'Mid-range', value: 'mid', desc: '$100-250/day' },
  { label: 'Luxury', value: 'luxury', desc: '$250+/day' },
];

export default function CreateTripScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const canProceed = () => {
    if (step === 1) return destination.trim().length > 0;
    if (step === 2) return startDate.trim().length > 0 && endDate.trim().length > 0;
    if (step === 3) return budget.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      router.back();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.progressRow}>
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            style={[
              styles.progressBar,
              s <= step && styles.progressBarActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <View style={styles.step}>
            <View style={styles.stepIconBox}>
              <MapPin size={22} color="#0EA5E9" />
            </View>
            <Text style={styles.stepTitle}>Where are you going?</Text>
            <Text style={styles.stepSubtitle}>Enter your dream destination</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Kyoto, Japan"
              placeholderTextColor="#CBD5E1"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.step}>
            <View style={styles.stepIconBox}>
              <Calendar size={22} color="#0EA5E9" />
            </View>
            <Text style={styles.stepTitle}>When are you traveling?</Text>
            <Text style={styles.stepSubtitle}>Choose your travel dates</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#CBD5E1"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>End Date</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#CBD5E1"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.step}>
            <View style={styles.stepIconBox}>
              <DollarSign size={22} color="#0EA5E9" />
            </View>
            <Text style={styles.stepTitle}>What's your budget?</Text>
            <Text style={styles.stepSubtitle}>Pick a spending range per day</Text>
            <View style={styles.budgetOptions}>
              {BUDGETS.map((b) => (
                <TouchableOpacity
                  key={b.value}
                  style={[
                    styles.budgetCard,
                    budget === b.value && styles.budgetCardActive,
                  ]}
                  onPress={() => setBudget(b.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.budgetRadio}>
                    {budget === b.value && <View style={styles.budgetRadioDot} />}
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.budgetLabel,
                        budget === b.value && styles.budgetLabelActive,
                      ]}
                    >
                      {b.label}
                    </Text>
                    <Text style={styles.budgetDesc}>{b.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.step}>
            <View style={styles.stepIconBox}>
              <Heart size={22} color="#0EA5E9" />
            </View>
            <Text style={styles.stepTitle}>What are you into?</Text>
            <Text style={styles.stepSubtitle}>Select your interests (pick any)</Text>
            <View style={styles.interestsGrid}>
              {INTERESTS.map((interest) => (
                <Pressable
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  style={[
                    styles.interestChip,
                    interests.includes(interest) && styles.interestChipActive,
                  ]}
                >
                  {interests.includes(interest) && <Check size={14} color="#FFFFFF" />}
                  <Text
                    style={[
                      styles.interestText,
                      interests.includes(interest) && styles.interestTextActive,
                    ]}
                  >
                    {interest}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backText}>{step > 1 ? 'Back' : 'Cancel'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
          activeOpacity={0.85}
        >
          {step < 4 ? (
            <>
              <Text style={styles.nextText}>Continue</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </>
          ) : (
            <>
              <Sparkles size={18} color="#FFFFFF" />
              <Text style={styles.nextText}>Generate Trip</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  progressBarActive: {
    backgroundColor: '#0EA5E9',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
  },
  step: {
    alignItems: 'center',
  },
  stepIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 28,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  budgetOptions: {
    width: '100%',
    gap: 12,
  },
  budgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  budgetCardActive: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  budgetRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0EA5E9',
  },
  budgetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  budgetLabelActive: {
    color: '#0284C7',
  },
  budgetDesc: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  interestChipActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  interestTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 15,
  },
  nextButtonDisabled: {
    backgroundColor: '#BAE6FD',
  },
  nextText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
