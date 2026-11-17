import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, Plane } from 'lucide-react-native';
import { useAuth } from '@/lib/auth';
import { colors, radius, shadows } from '@/lib/theme';
import { AnimatedPressable, FadeSlideIn, usePulse } from '@/components/ui/animated';

const BACKDROP =
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planeFloat = useRef(new Animated.Value(0)).current;
  const buttonBreath = usePulse(2200);
  const errorHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(planeFloat, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(planeFloat, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, [planeFloat]);

  useEffect(() => {
    Animated.timing(errorHeight, {
      toValue: error ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [error, errorHeight]);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password to continue.');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(email.trim(), password);
    setLoading(false);
    if (result.error) setError(result.error);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    setGoogleLoading(false);
    if (result.error) setError(result.error);
  };

  return (
    <ImageBackground source={{ uri: BACKDROP }} style={styles.background} imageStyle={styles.backgroundImage}>
      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.brand,
            {
              transform: [
                { translateY: planeFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) },
                { rotate: planeFloat.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-8deg'] }) },
              ],
            },
          ]}
        >
          <View style={styles.brandIcon}>
            <Plane size={17} color={colors.primaryDark} />
          </View>
          <Text style={styles.brandText}>AI Trip Planner</Text>
        </Animated.View>

        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <FadeSlideIn delay={80} distance={34}>
              <View style={styles.card}>
                <Text style={styles.title}>Plan your trips with ease and confidence</Text>
                <Text style={styles.subtitle}>Build your itinerary in minutes, not hours.</Text>

                <Animated.View style={{ height: errorHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 56] }), opacity: errorHeight, overflow: 'hidden' }}>
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                </Animated.View>

                <Text style={styles.label}>Email address</Text>
                <View style={styles.input}>
                  <Mail size={16} color={colors.textMuted} />
                  <TextInput
                    style={styles.inputText}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <Text style={styles.label}>Password</Text>
                <View style={styles.input}>
                  <Lock size={16} color={colors.textMuted} />
                  <TextInput
                    style={styles.inputText}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword((value) => !value)}>
                    {showPassword ? <EyeOff size={17} color={colors.textSecondary} /> : <Eye size={17} color={colors.textSecondary} />}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgot}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>

                <AnimatedPressable style={[styles.primary, shadows.md]} onPress={handleSignIn} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Animated.View style={{ transform: [{ scale: buttonBreath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }] }}>
                      <Text style={styles.primaryText}>Get Started</Text>
                    </Animated.View>
                  )}
                </AnimatedPressable>

                <View style={styles.or}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.line} />
                </View>

                <AnimatedPressable style={styles.google} onPress={handleGoogle} disabled={googleLoading}>
                  {googleLoading ? (
                    <ActivityIndicator color="#4285F4" />
                  ) : (
                    <>
                      <Text style={styles.googleIcon}>G</Text>
                      <Text style={styles.googleText}>Continue with Google</Text>
                    </>
                  )}
                </AnimatedPressable>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>New here? </Text>
                  <TouchableOpacity onPress={() => router.push('/sign-up')}>
                    <Text style={styles.link}>Create account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </FadeSlideIn>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: colors.heroFrom },
  backgroundImage: { opacity: 0.86 },
  safe: { flex: 1, backgroundColor: 'rgba(11,59,54,0.18)' },
  flex: { flex: 1 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingTop: 8, alignSelf: 'flex-start' },
  brandIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  brandText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  content: { flexGrow: 1, justifyContent: 'flex-start', padding: 20, paddingTop: 100 },
  card: { backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: radius.xl + 2, padding: 22 },
  title: { color: colors.textPrimary, fontSize: 24, lineHeight: 30, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 7, marginBottom: 16 },
  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: radius.sm + 1, padding: 12, marginBottom: 4, marginTop: 10 },
  errorText: { color: '#B91C1C', fontSize: 12 },
  label: { color: colors.textSecondary, fontSize: 11, fontWeight: '800', marginBottom: 6, marginTop: 12 },
  input: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surfaceAlt, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 12 },
  inputText: { flex: 1, color: colors.textPrimary, fontSize: 13 },
  forgot: { alignSelf: 'flex-end', paddingVertical: 10 },
  forgotText: { color: colors.primaryDark, fontSize: 11, fontWeight: '700' },
  primary: { backgroundColor: colors.primary, borderRadius: radius.full, alignItems: 'center', paddingVertical: 15, marginTop: 4 },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', letterSpacing: 0.2 },
  or: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 },
  line: { height: 1, flex: 1, backgroundColor: colors.border },
  orText: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  google: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: radius.full, paddingVertical: 14, borderWidth: 1, borderColor: colors.border },
  googleIcon: { color: '#4285F4', fontSize: 15, fontWeight: '900' },
  googleText: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  footerText: { color: colors.textSecondary, fontSize: 12 },
  link: { color: colors.primaryDark, fontSize: 12, fontWeight: '800' },
});
