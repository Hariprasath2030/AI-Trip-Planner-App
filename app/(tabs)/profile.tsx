import { Alert, StyleSheet, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Bell, HelpCircle, Shield, ChevronRight, LogOut } from 'lucide-react-native';
import { useAuth } from '@/lib/auth';
import { colors, radius, shadows } from '@/lib/theme';
import { AnimatedPressable, FadeSlideIn } from '@/components/ui/animated';

const MENU_ITEMS = [
  { icon: Bell, label: 'Notifications', value: 'On' },
  { icon: Shield, label: 'Privacy & Security', value: null },
  { icon: HelpCircle, label: 'Help & Support', value: null },
  { icon: Settings, label: 'Settings', value: null },
];

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  const displayName = profile?.full_name || 'Traveler';
  const displayEmail = profile?.email || '';
  const initials = displayName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeSlideIn distance={16}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={70} distance={22}>
          <View style={[styles.profileCard, shadows.md]}>
            <View style={[styles.avatarBox, shadows.sm]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{displayEmail}</Text>
            </View>
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={140} distance={22}>
          <View style={[styles.statsRow, shadows.md]}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Destinations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>19</Text>
              <Text style={styles.statLabel}>Days Planned</Text>
            </View>
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={210} distance={22}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={[styles.menuContainer, shadows.md]}>
              {MENU_ITEMS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <AnimatedPressable
                    key={index}
                    style={[styles.menuItem, index === MENU_ITEMS.length - 1 && styles.menuItemLast]}
                    scaleTo={0.985}
                  >
                    <View style={styles.menuIconBox}>
                      <Icon size={18} color={colors.primary} />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {item.value ? (
                      <Text style={styles.menuValue}>{item.value}</Text>
                    ) : (
                      <ChevronRight size={18} color={colors.border} />
                    )}
                  </AnimatedPressable>
                );
              })}
            </View>
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={280} distance={22}>
          <AnimatedPressable style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={18} color={colors.danger} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </AnimatedPressable>
        </FadeSlideIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg - 2, padding: 20, marginBottom: 16, gap: 16 },
  avatarBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  profileEmail: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  statsRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg - 2, padding: 20, marginBottom: 28 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: colors.border },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  menuContainer: { backgroundColor: colors.surface, borderRadius: radius.lg - 2, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14, borderBottomWidth: 1, borderBottomColor: '#F0F3F2' },
  menuItemLast: { borderBottomWidth: 0 },
  menuIconBox: { width: 38, height: 38, borderRadius: radius.sm + 1, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
  menuValue: { fontSize: 14, color: colors.textMuted },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.dangerSoft, borderRadius: radius.md, paddingVertical: 15, borderWidth: 1, borderColor: '#F5C8C8' },
  signOutText: { fontSize: 15, fontWeight: '700', color: colors.danger },
});
