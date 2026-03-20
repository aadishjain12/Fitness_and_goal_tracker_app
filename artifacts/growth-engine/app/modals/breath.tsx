import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { getRandomBreathingExercise, BreathingExercise } from "@/lib/aiEngine";

export default function BreathModal() {
  const insets = useSafeAreaInsets();
  const [exercise] = useState<BreathingExercise>(getRandomBreathingExercise());
  const [currentStep, setCurrentStep] = useState(-1);
  const [done, setDone] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.8, duration: 2000, useNativeDriver: true }),
      ])
    );
    loopRef.current.start();
    return () => loopRef.current?.stop();
  }, []);

  const startExercise = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentStep(0);
    runStep(0);
  };

  const runStep = (step: number) => {
    if (step >= exercise.steps.length) {
      setDone(true);
      setCurrentStep(-1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }
    setCurrentStep(step);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => runStep(step + 1), 8000);
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={20} color={Colors.textSub} />
        </Pressable>
        <Text style={styles.headerTitle}>{exercise.title}</Text>
        <Text style={styles.headerDuration}>{exercise.duration}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Breathing Circle */}
        <View style={styles.circleWrap}>
          <Animated.View style={[styles.circlePulse, { transform: [{ scale: pulseAnim }] }]} />
          <View style={styles.circleInner}>
            <Feather name="wind" size={32} color={Colors.accent} />
            <Text style={styles.circleText}>
              {done ? 'Complete' : currentStep >= 0 ? `Step ${currentStep + 1}/${exercise.steps.length}` : 'Ready'}
            </Text>
          </View>
        </View>

        {/* Current Step */}
        {currentStep >= 0 && (
          <View style={styles.activeStep}>
            <Text style={styles.activeStepText}>{exercise.steps[currentStep]}</Text>
          </View>
        )}

        {done && (
          <View style={styles.doneCard}>
            <Feather name="check-circle" size={24} color={Colors.green} />
            <Text style={styles.doneTitle}>The craving has passed.</Text>
            <Text style={styles.doneText}>
              Cravings peak within 20 seconds and then subside — whether you smoke or not. You proved it just now.
            </Text>
          </View>
        )}

        {/* Philosophy */}
        <View style={styles.philosophyCard}>
          <View style={styles.philosophyHeader}>
            <Feather name="book-open" size={14} color={Colors.gold} />
            <Text style={styles.philosophyLabel}>Stoic Foundation</Text>
          </View>
          <Text style={styles.philosophyText}>{exercise.philosophy}</Text>
        </View>

        {/* Steps List */}
        <Text style={styles.stepsTitle}>Exercise Steps</Text>
        {exercise.steps.map((step, i) => (
          <View key={i} style={[
            styles.stepItem,
            currentStep === i && styles.stepItemActive,
            currentStep > i && styles.stepItemDone,
          ]}>
            <View style={[
              styles.stepNum,
              currentStep === i && { backgroundColor: Colors.accent },
              currentStep > i && { backgroundColor: Colors.green },
            ]}>
              {currentStep > i
                ? <Feather name="check" size={12} color={Colors.bg} />
                : <Text style={[styles.stepNumText, currentStep === i && { color: Colors.bg }]}>{i + 1}</Text>
              }
            </View>
            <Text style={[styles.stepText, currentStep === i && { color: Colors.text }]}>{step}</Text>
          </View>
        ))}

        {/* Start Button */}
        {currentStep === -1 && !done && (
          <Pressable onPress={startExercise} style={styles.startBtn}>
            <Feather name="play" size={16} color={Colors.bg} />
            <Text style={styles.startBtnText}>Begin Exercise</Text>
          </Pressable>
        )}

        {done && (
          <Pressable onPress={() => router.back()} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>I'm Good Now</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  headerTitle: {
    fontSize: 22,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
  },
  headerDuration: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },

  circleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    height: 160,
  },
  circlePulse: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.accentDim,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
  },
  circleInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  circleText: {
    fontSize: 12,
    color: Colors.textSub,
    fontFamily: 'Inter_500Medium',
  },

  activeStep: {
    backgroundColor: Colors.accentDim,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  activeStepText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'Inter_500Medium',
    lineHeight: 24,
    textAlign: 'center',
  },

  doneCard: {
    backgroundColor: Colors.greenDim,
    borderWidth: 1,
    borderColor: Colors.greenBorder,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  doneTitle: {
    fontSize: 18,
    color: Colors.green,
    fontFamily: 'Inter_700Bold',
  },
  doneText: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 19,
  },

  philosophyCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  philosophyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  philosophyLabel: {
    fontSize: 11,
    color: Colors.gold,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  philosophyText: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },

  stepsTitle: {
    fontSize: 14,
    color: Colors.textSub,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
    opacity: 0.5,
  },
  stepItemActive: { opacity: 1 },
  stepItemDone: { opacity: 0.7 },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    flexShrink: 0,
  },
  stepNumText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter_700Bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    lineHeight: 21,
  },

  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  startBtnText: {
    color: Colors.bg,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  doneBtn: {
    backgroundColor: Colors.green,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  doneBtnText: {
    color: Colors.bg,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
