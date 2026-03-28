import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const FOCUS_OPTIONS = [
  { id: 'Career Switcher', label: 'Career Switcher', icon: 'trending-up', desc: 'Transitioning into Product Management' },
  { id: 'Student', label: 'Student', icon: 'book', desc: 'Studying and building foundations' },
  { id: 'Athlete', label: 'Athlete', icon: 'activity', desc: 'Sport performance is my core focus' },
  { id: 'Entrepreneur', label: 'Entrepreneur', icon: 'zap', desc: 'Building something of my own' },
  { id: 'Executive', label: 'Executive', icon: 'briefcase', desc: 'Leading teams and organizations' },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const [username, setUsername] = useState('');
  const [focusType, setFocusType] = useState('');
  const [step, setStep] = useState<'name' | 'focus'>('name');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const goToFocus = () => {
    if (!username.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('focus');
  };

  const handleComplete = async () => {
    if (!focusType) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeOnboarding(username.trim(), focusType);
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: topPad, paddingBottom: botPad }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / Brand */}
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoGlyph}>A</Text>
          </View>
          <View>
            <Text style={styles.logoName}>Aurelius AI</Text>
            <Text style={styles.logoTagline}>Your Life Operating System</Text>
          </View>
        </View>

        {step === 'name' ? (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Who are you?</Text>
            <Text style={styles.stepSub}>
              Your identity shapes your system. Aurelius personalizes everything — quotes, energy weighting, and strategies — around who you are.
            </Text>

            <View style={styles.inputWrapper}>
              <Feather name="user" size={16} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Your name or alias"
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={goToFocus}
              />
            </View>

            <View style={styles.infoBox}>
              <Feather name="shield" size={13} color={Colors.accent} />
              <Text style={styles.infoText}>
                All data is stored locally on your device. Nothing is ever transmitted. This is your private operating system.
              </Text>
            </View>

            <Pressable
              onPress={goToFocus}
              style={[styles.nextBtn, !username.trim() && { opacity: 0.4 }]}
              disabled={!username.trim()}
            >
              <Text style={styles.nextBtnText}>Continue</Text>
              <Feather name="arrow-right" size={18} color={Colors.bg} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.stepContainer}>
            <View style={styles.backRow}>
              <Pressable onPress={() => setStep('name')} style={styles.backBtn}>
                <Feather name="arrow-left" size={16} color={Colors.textMuted} />
              </Pressable>
              <Text style={styles.greeting}>Welcome, {username}.</Text>
            </View>

            <Text style={styles.stepTitle}>Your primary focus?</Text>
            <Text style={styles.stepSub}>
              Aurelius will calibrate your Energy Ledger, daily insights, and AI coaching tone around this identity.
            </Text>

            <View style={styles.focusGrid}>
              {FOCUS_OPTIONS.map(opt => (
                <Pressable
                  key={opt.id}
                  onPress={() => { Haptics.selectionAsync(); setFocusType(opt.id); }}
                  style={[styles.focusCard, focusType === opt.id && styles.focusCardActive]}
                >
                  <View style={[styles.focusIcon, focusType === opt.id && styles.focusIconActive]}>
                    <Feather name={opt.icon as any} size={20} color={focusType === opt.id ? Colors.bg : Colors.textMuted} />
                  </View>
                  <Text style={[styles.focusLabel, focusType === opt.id && styles.focusLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.focusDesc}>{opt.desc}</Text>
                  {focusType === opt.id && (
                    <View style={styles.focusCheck}>
                      <Feather name="check" size={12} color={Colors.bg} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleComplete}
              style={[styles.launchBtn, !focusType && { opacity: 0.4 }]}
              disabled={!focusType}
            >
              <Feather name="cpu" size={18} color={Colors.bg} />
              <Text style={styles.launchBtnText}>Initialise Aurelius AI</Text>
            </Pressable>

            <Text style={styles.launchNote}>
              "The first step toward change is awareness. The second step is acceptance." — Nathaniel Branden
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },

  logoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingTop: 32, marginBottom: 48,
  },
  logoMark: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  logoGlyph: { fontSize: 26, fontFamily: 'Inter_700Bold', color: Colors.bg },
  logoName: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text, letterSpacing: -0.5 },
  logoTagline: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted },

  stepContainer: {},
  stepTitle: {
    fontSize: 30, fontFamily: 'Inter_700Bold', color: Colors.text,
    letterSpacing: -1, marginBottom: 12,
  },
  stepSub: {
    fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textSub,
    lineHeight: 22, marginBottom: 32,
  },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 16,
    paddingHorizontal: 16, marginBottom: 16,
  },
  inputIcon: {},
  input: {
    flex: 1, paddingVertical: 16, fontSize: 16,
    color: Colors.text, fontFamily: 'Inter_400Regular',
  },

  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 9,
    backgroundColor: Colors.accentDim, borderWidth: 1,
    borderColor: Colors.accentBorder, borderRadius: 12,
    padding: 12, marginBottom: 28,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.accent, fontFamily: 'Inter_400Regular', lineHeight: 17 },

  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: Colors.accent,
    borderRadius: 16, paddingVertical: 16,
  },
  nextBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.bg },

  backRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  backBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  greeting: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textSub },

  focusGrid: { gap: 10, marginBottom: 28 },
  focusCard: {
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 16, padding: 16,
    position: 'relative',
  },
  focusCardActive: { borderColor: Colors.accent, backgroundColor: Colors.accentDim },
  focusIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  focusIconActive: { backgroundColor: Colors.accent },
  focusLabel: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 3 },
  focusLabelActive: { color: Colors.accent },
  focusDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, lineHeight: 17 },
  focusCheck: {
    position: 'absolute', top: 12, right: 12,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },

  launchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: Colors.accent,
    borderRadius: 16, paddingVertical: 16, marginBottom: 20,
  },
  launchBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.bg },
  launchNote: {
    fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted,
    textAlign: 'center', lineHeight: 18, fontStyle: 'italic',
  },
});
