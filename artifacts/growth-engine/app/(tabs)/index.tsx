import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { getDailyQuote, Quote } from "@/lib/aiEngine";
import { getSmokeFreeTime, getStreakInfo } from "@/lib/storage";

function QuoteHero({ quote }: { quote: Quote }) {
  const [expanded, setExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(!expanded);
    Animated.timing(anim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const categoryColor = quote.category === 'stoic' ? Colors.gold : Colors.accent;
  const categoryLabel = quote.category === 'stoic' ? 'Stoic Philosopher' : 'Tech Leader';

  return (
    <Pressable onPress={toggle} style={styles.heroCard}>
      <View style={styles.heroGlow} pointerEvents="none" />
      <View style={styles.heroCategoryRow}>
        <View style={[styles.categoryBadge, { borderColor: categoryColor }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {categoryLabel}
          </Text>
        </View>
        <Text style={styles.heroSubLabel}>Daily Philosopher</Text>
      </View>

      <Text style={styles.quoteText}>"{quote.text}"</Text>
      <Text style={styles.authorText}>— {quote.author}</Text>

      <View style={styles.deepDivePrompt}>
        <Text style={styles.deepDiveLabel}>
          {expanded ? 'Hide' : 'Contextual Deep Dive'}
        </Text>
        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={14} color={Colors.accent} />
      </View>

      {expanded && (
        <View style={styles.deepDiveContent}>
          <View style={styles.deepSection}>
            <Text style={styles.deepSectionTitle}>Historical Context</Text>
            <Text style={styles.deepSectionText}>{quote.context}</Text>
          </View>
          <View style={[styles.deepSection, { marginBottom: 0 }]}>
            <Text style={styles.deepSectionTitle}>Applied to Your Journey</Text>
            <Text style={styles.deepSectionText}>{quote.application}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

function SmokeFreeWidget({ smokeFreeStart }: { smokeFreeStart: string | null }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [time, setTime] = useState(getSmokeFreeTime(smokeFreeStart));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getSmokeFreeTime(smokeFreeStart));
    }, 1000);
    return () => clearInterval(interval);
  }, [smokeFreeStart]);

  useEffect(() => {
    if (!smokeFreeStart) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [smokeFreeStart]);

  const onUrge = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.push('/modals/breath');
  };

  if (!smokeFreeStart) {
    return (
      <View style={styles.smokeCardEmpty}>
        <Feather name="wind" size={28} color={Colors.textMuted} />
        <Text style={styles.smokeEmptyTitle}>Track Cigarette Freedom</Text>
        <Text style={styles.smokeEmptyText}>Set your quit date in Habits</Text>
      </View>
    );
  }

  return (
    <View style={styles.smokeCard}>
      <View style={styles.smokeHeader}>
        <View style={styles.smokeFreeTag}>
          <Animated.View style={[styles.smokePulse, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={styles.smokeFreeLabel}>SMOKE FREE</Text>
        </View>
        <Pressable onPress={onUrge} style={styles.urgeButton}>
          <Feather name="zap" size={14} color={Colors.orange} />
          <Text style={styles.urgeText}>Urge</Text>
        </Pressable>
      </View>

      <View style={styles.timerRow}>
        <View style={styles.timerBlock}>
          <Text style={styles.timerNum}>{time.days}</Text>
          <Text style={styles.timerLabel}>days</Text>
        </View>
        <Text style={styles.timerSep}>:</Text>
        <View style={styles.timerBlock}>
          <Text style={styles.timerNum}>{String(time.hours).padStart(2, '0')}</Text>
          <Text style={styles.timerLabel}>hrs</Text>
        </View>
        <Text style={styles.timerSep}>:</Text>
        <View style={styles.timerBlock}>
          <Text style={styles.timerNum}>{String(time.minutes).padStart(2, '0')}</Text>
          <Text style={styles.timerLabel}>min</Text>
        </View>
        <Text style={styles.timerSep}>:</Text>
        <View style={styles.timerBlock}>
          <Text style={styles.timerNum}>{String(time.seconds).padStart(2, '0')}</Text>
          <Text style={styles.timerLabel}>sec</Text>
        </View>
      </View>

      <Text style={styles.smokeStats}>
        {time.days >= 30
          ? `Your lung capacity has significantly improved. Keep going.`
          : time.days >= 7
          ? `Acute withdrawal is largely over. Your brain is rewiring.`
          : time.days >= 1
          ? `Your body started healing within hours. Every second matters.`
          : `The first 24 hours are the hardest. You can do this.`}
      </Text>
    </View>
  );
}

function HeatmapWidget({ logs }: { logs: { date: string; completed: boolean }[] }) {
  const weeks = 8;
  const days = 7;
  const cells: { date: string; completed: boolean; future: boolean }[] = [];
  const today = new Date();

  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + d));
      const dateStr = date.toISOString().slice(0, 10);
      const isFuture = date > today;
      const log = logs.find(l => l.date === dateStr);
      cells.push({ date: dateStr, completed: log?.completed ?? false, future: isFuture });
    }
  }

  return (
    <View style={styles.heatmapCard}>
      <Text style={styles.cardTitle}>Badminton Heatmap</Text>
      <View style={styles.heatmapGrid}>
        {Array.from({ length: weeks }).map((_, w) => (
          <View key={w} style={styles.heatmapCol}>
            {Array.from({ length: days }).map((_, d) => {
              const cell = cells[w * days + (days - 1 - d)];
              return (
                <View
                  key={d}
                  style={[
                    styles.heatmapCell,
                    cell?.future && styles.heatmapFuture,
                    cell?.completed && styles.heatmapCompleted,
                    !cell?.completed && !cell?.future && styles.heatmapMissed,
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.heatmapLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.green }]} />
          <Text style={styles.legendText}>Played</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.textMuted }]} />
          <Text style={styles.legendText}>Missed</Text>
        </View>
      </View>
    </View>
  );
}

function QuickStats({ streakCurrent, jobCount, tasksDone, tasksTotal }:
  { streakCurrent: number; jobCount: number; tasksDone: number; tasksTotal: number }) {
  return (
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { borderColor: Colors.green + '40' }]}>
        <Text style={[styles.statNum, { color: Colors.green }]}>{streakCurrent}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      <View style={[styles.statCard, { borderColor: Colors.accent + '40' }]}>
        <Text style={[styles.statNum, { color: Colors.accent }]}>{jobCount}</Text>
        <Text style={styles.statLabel}>Applications</Text>
      </View>
      <View style={[styles.statCard, { borderColor: Colors.gold + '40' }]}>
        <Text style={[styles.statNum, { color: Colors.gold }]}>{tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0}%</Text>
        <Text style={styles.statLabel}>Tasks Done</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useApp();
  const quote = getDailyQuote();
  const { current } = getStreakInfo(data.badmintonLogs);
  const completedTasks = data.tasks.filter(t => t.completed).length;

  const onAudit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/modals/audit');
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: Colors.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 100 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good {getGreeting()},</Text>
            <Text style={styles.headline}>Command Center</Text>
          </View>
          <Pressable onPress={onAudit} style={styles.auditBtn}>
            <Feather name="cpu" size={16} color={Colors.accent} />
            <Text style={styles.auditBtnText}>AI Audit</Text>
          </Pressable>
        </View>

        <QuoteHero quote={quote} />
        <SmokeFreeWidget smokeFreeStart={data.smokeFreeStart} />
        <QuickStats
          streakCurrent={current}
          jobCount={data.jobApps.length}
          tasksDone={completedTasks}
          tasksTotal={data.tasks.length}
        />
        <HeatmapWidget logs={data.badmintonLogs} />
      </ScrollView>
    </View>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
  },
  headline: {
    fontSize: 26,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  auditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentDim,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  auditBtnText: {
    color: Colors.accent,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },

  // Hero Quote Card
  heroCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,229,255,0.05)',
  },
  heroCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroSubLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  quoteText: {
    fontSize: 17,
    color: Colors.text,
    fontFamily: 'Inter_500Medium',
    lineHeight: 26,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  authorText: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 14,
  },
  deepDivePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deepDiveLabel: {
    fontSize: 12,
    color: Colors.accent,
    fontFamily: 'Inter_600SemiBold',
  },
  deepDiveContent: {
    marginTop: 14,
  },
  deepSection: {
    marginBottom: 12,
  },
  deepSectionTitle: {
    fontSize: 11,
    color: Colors.gold,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  deepSectionText: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },

  // Smoke Free Widget
  smokeCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.green + '30',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  smokeCardEmpty: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    alignItems: 'center',
    gap: 8,
  },
  smokeEmptyTitle: {
    color: Colors.text,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  smokeEmptyText: {
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  smokeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  smokeFreeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smokePulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.green,
  },
  smokeFreeLabel: {
    fontSize: 11,
    color: Colors.green,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
  },
  urgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.orangeDim,
    borderWidth: 1,
    borderColor: Colors.orange + '50',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  urgeText: {
    color: Colors.orange,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 12,
  },
  timerBlock: {
    alignItems: 'center',
    minWidth: 54,
  },
  timerNum: {
    fontSize: 36,
    color: Colors.green,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },
  timerLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timerSep: {
    fontSize: 28,
    color: Colors.textMuted,
    fontFamily: 'Inter_700Bold',
    marginBottom: 14,
  },
  smokeStats: {
    fontSize: 12,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Quick Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statNum: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },

  // Heatmap
  heatmapCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 14,
  },
  heatmapGrid: {
    flexDirection: 'row',
    gap: 3,
  },
  heatmapCol: {
    flex: 1,
    gap: 3,
  },
  heatmapCell: {
    aspectRatio: 1,
    borderRadius: 3,
    backgroundColor: Colors.surface,
  },
  heatmapCompleted: {
    backgroundColor: Colors.green,
    opacity: 0.85,
  },
  heatmapMissed: {
    backgroundColor: Colors.bgCardBorder,
  },
  heatmapFuture: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heatmapLegend: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
});
