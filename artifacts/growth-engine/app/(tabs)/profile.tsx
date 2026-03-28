import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { getResilienceRating, getSmokeFreeTime, getSmokingROI, getStreakInfo } from "@/lib/storage";

const ENERGY_COLOR = (level: number) => {
  if (level >= 80) return Colors.accent;
  if (level >= 60) return Colors.green;
  if (level >= 40) return Colors.gold;
  if (level >= 20) return Colors.orange;
  return Colors.red;
};

const ENERGY_LABEL = (level: number) => {
  if (level >= 80) return 'Peak State';
  if (level >= 60) return 'Energised';
  if (level >= 40) return 'Moderate';
  if (level >= 20) return 'Low Energy';
  return 'Critical';
};

function HumanBattery({ level }: { level: number }) {
  const color = ENERGY_COLOR(level);
  const label = ENERGY_LABEL(level);
  const blocks = 20;
  const filled = Math.round((level / 100) * blocks);

  return (
    <View style={styles.batteryCard}>
      <View style={styles.batteryTop}>
        <View>
          <Text style={styles.batteryTitle}>Human Battery</Text>
          <Text style={[styles.batteryLevel, { color }]}>{label}</Text>
        </View>
        <View style={styles.batteryPercContainer}>
          <Text style={[styles.batteryPerc, { color }]}>{level}</Text>
          <Text style={styles.batteryPercUnit}>%</Text>
          {/* Battery terminal cap */}
          <View style={[styles.batteryTerminal, { borderColor: color }]} />
        </View>
      </View>

      {/* Block bar */}
      <View style={styles.batteryBlocks}>
        {Array.from({ length: blocks }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.batteryBlock,
              i < filled
                ? { backgroundColor: color, opacity: 0.7 + (i / blocks) * 0.3 }
                : { backgroundColor: Colors.surface },
            ]}
          />
        ))}
      </View>

      {/* Gains/Drains legend */}
      <View style={styles.batteryLegend}>
        <View style={styles.legendRow}>
          <Feather name="plus-circle" size={11} color={Colors.green} />
          <Text style={styles.legendKey}>Sports +25</Text>
          <Text style={styles.legendSep}>|</Text>
          <Feather name="plus-circle" size={11} color={Colors.green} />
          <Text style={styles.legendKey}>Resilient +12</Text>
          <Text style={styles.legendSep}>|</Text>
          <Feather name="plus-circle" size={11} color={Colors.green} />
          <Text style={styles.legendKey}>Commit +10</Text>
        </View>
        <View style={styles.legendRow}>
          <Feather name="minus-circle" size={11} color={Colors.red} />
          <Text style={styles.legendKey}>Apply −15</Text>
          <Text style={styles.legendSep}>|</Text>
          <Feather name="minus-circle" size={11} color={Colors.red} />
          <Text style={styles.legendKey}>Interview −20</Text>
          <Text style={styles.legendSep}>|</Text>
          <Feather name="minus-circle" size={11} color={Colors.red} />
          <Text style={styles.legendKey}>Lapse −10</Text>
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useApp();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const resilience = getResilienceRating(data.badmintonLogs);
  const { current, best } = getStreakInfo(data.badmintonLogs);
  const smokeFreeTime = getSmokeFreeTime(data.smokeFreeStart);
  const roi = getSmokingROI(data.smokeFreeStart, data.smokingSettings);
  const interviews = data.jobApps.filter(j => j.status === 'interview').length;
  const offers = data.jobApps.filter(j => j.status === 'offer').length;
  const completedTasks = data.tasks.filter(t => t.completed).length;
  const recentEvents = data.energyEvents.slice(0, 8);

  const focusColor = {
    'Career Switcher': Colors.accent,
    'Student': Colors.gold,
    'Athlete': Colors.green,
    'Entrepreneur': Colors.orange,
    'Executive': Colors.purple,
  }[data.focusType] ?? Colors.accent;

  return (
    <View style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scroll, {
          paddingTop: topPad + 16,
          paddingBottom: botPad + 100,
        }]}
      >
        {/* Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.avatarRing}>
            <View style={[styles.avatar, { borderColor: focusColor }]}>
              <Text style={styles.avatarText}>{data.username ? data.username[0].toUpperCase() : '?'}</Text>
            </View>
          </View>
          <View style={styles.identityInfo}>
            <Text style={styles.username}>{data.username || 'Unknown Operator'}</Text>
            <View style={[styles.focusBadge, { backgroundColor: focusColor + '20', borderColor: focusColor + '60' }]}>
              <Text style={[styles.focusBadgeText, { color: focusColor }]}>{data.focusType}</Text>
            </View>
          </View>
          <View style={[styles.energyPill, { backgroundColor: ENERGY_COLOR(data.energyLevel) + '20', borderColor: ENERGY_COLOR(data.energyLevel) + '50' }]}>
            <View style={[styles.energyDot, { backgroundColor: ENERGY_COLOR(data.energyLevel) }]} />
            <Text style={[styles.energyPillText, { color: ENERGY_COLOR(data.energyLevel) }]}>{data.energyLevel}%</Text>
          </View>
        </View>

        {/* Human Battery */}
        <HumanBattery level={data.energyLevel} />

        {/* Resilience Rating */}
        <View style={styles.resilienceCard}>
          <View style={styles.resilienceTop}>
            <Text style={styles.resilienceTitle}>Resilience Rating</Text>
            <View style={styles.gradeCircle}>
              <Text style={styles.gradeText}>{resilience.grade}</Text>
            </View>
          </View>
          <Text style={[styles.resilienceLabel, {
            color: resilience.rating >= 70 ? Colors.green : resilience.rating >= 45 ? Colors.gold : Colors.red
          }]}>{resilience.label}</Text>
          {resilience.total > 0 && (
            <View style={styles.resilienceBar}>
              <View style={[styles.resilienceFill, { width: `${resilience.rating}%` as any }]} />
            </View>
          )}
          <View style={styles.resilienceBreakdown}>
            <View style={styles.resBreakItem}>
              <View style={[styles.resBreakDot, { backgroundColor: Colors.green }]} />
              <Text style={styles.resBreakText}>{resilience.victorious} Victorious</Text>
            </View>
            <View style={styles.resBreakItem}>
              <View style={[styles.resBreakDot, { backgroundColor: Colors.gold }]} />
              <Text style={styles.resBreakText}>{resilience.resilient} Resilient</Text>
            </View>
            <View style={styles.resBreakItem}>
              <View style={[styles.resBreakDot, { backgroundColor: Colors.red }]} />
              <Text style={styles.resBreakText}>{resilience.lapsed} Lapsed</Text>
            </View>
          </View>
        </View>

        {/* Vitality Stats */}
        <Text style={styles.sectionTitle}>Vitality Stats</Text>
        <View style={styles.vitalGrid}>
          {[
            { label: 'Streak', value: String(current), sub: `Best: ${best}`, color: Colors.accent },
            { label: 'Days Free', value: String(smokeFreeTime.days), sub: `${roi.cigsAvoided} cigs avoided`, color: Colors.green },
            { label: 'Money Saved', value: `$${roi.moneySaved.toFixed(0)}`, sub: `$${(roi.moneySaved / Math.max(smokeFreeTime.days, 1)).toFixed(2)}/day`, color: Colors.gold },
            { label: 'Life Regained', value: roi.lifeMinutesRegained >= 60 ? `${(roi.lifeMinutesRegained / 60).toFixed(1)}h` : `${roi.lifeMinutesRegained}m`, sub: '11 min per cig', color: Colors.green },
            { label: 'Applications', value: String(data.jobApps.length), sub: `${interviews} interviewing`, color: Colors.accent },
            { label: 'Offers', value: String(offers), sub: 'pipeline wins', color: Colors.gold },
            { label: 'Tasks Done', value: String(completedTasks), sub: `of ${data.tasks.length} total`, color: Colors.accent },
            { label: 'Commitments', value: String(data.stoicCommitments.length), sub: 'days reflected', color: Colors.gold },
          ].map(stat => (
            <View key={stat.label} style={styles.vitalCard}>
              <Text style={[styles.vitalValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.vitalLabel}>{stat.label}</Text>
              <Text style={styles.vitalSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>

        {/* Energy Event Log */}
        {recentEvents.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Energy Ledger</Text>
            <View style={styles.ledgerCard}>
              {recentEvents.map((ev, i) => (
                <View key={ev.id} style={[styles.ledgerRow, i < recentEvents.length - 1 && styles.ledgerRowBorder]}>
                  <View style={[styles.ledgerDelta, {
                    backgroundColor: ev.delta > 0 ? Colors.green + '20' : Colors.red + '20',
                    borderColor: ev.delta > 0 ? Colors.green + '40' : Colors.red + '40',
                  }]}>
                    <Text style={[styles.ledgerDeltaText, { color: ev.delta > 0 ? Colors.green : Colors.red }]}>
                      {ev.delta > 0 ? '+' : ''}{ev.delta}
                    </Text>
                  </View>
                  <View style={styles.ledgerInfo}>
                    <Text style={styles.ledgerLabel}>{ev.label}</Text>
                    <Text style={styles.ledgerDate}>{new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 14, color: Colors.textMuted, fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 20,
  },

  identityCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 20, padding: 16, marginBottom: 14,
  },
  avatarRing: { padding: 2, borderRadius: 28, borderWidth: 1, borderColor: Colors.border },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.surface, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.text },
  identityInfo: { flex: 1 },
  username: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 5 },
  focusBadge: {
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
  },
  focusBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  energyPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6,
  },
  energyDot: { width: 8, height: 8, borderRadius: 4 },
  energyPillText: { fontSize: 13, fontFamily: 'Inter_700Bold' },

  batteryCard: {
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 20, padding: 18, marginBottom: 14,
  },
  batteryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  batteryTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text, marginBottom: 3 },
  batteryLevel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  batteryPercContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 0 },
  batteryPerc: { fontSize: 42, fontFamily: 'Inter_700Bold', letterSpacing: -2 },
  batteryPercUnit: { fontSize: 18, fontFamily: 'Inter_500Medium', color: Colors.textMuted, marginBottom: 6 },
  batteryTerminal: {
    width: 6, height: 14, borderRadius: 2, borderWidth: 2,
    alignSelf: 'center', marginLeft: 2,
  },
  batteryBlocks: { flexDirection: 'row', gap: 3, marginBottom: 14 },
  batteryBlock: { flex: 1, height: 20, borderRadius: 3 },
  batteryLegend: { gap: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  legendKey: { fontSize: 10, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  legendSep: { fontSize: 10, color: Colors.border, marginHorizontal: 2 },

  resilienceCard: {
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 20, padding: 18, marginBottom: 4,
  },
  resilienceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  resilienceTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.text },
  gradeCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.accentDim, borderWidth: 1,
    borderColor: Colors.accentBorder, alignItems: 'center', justifyContent: 'center',
  },
  gradeText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.accent },
  resilienceLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 10 },
  resilienceBar: {
    height: 6, backgroundColor: Colors.surface, borderRadius: 3, marginBottom: 12, overflow: 'hidden',
  },
  resilienceFill: { height: 6, backgroundColor: Colors.accent, borderRadius: 3 },
  resilienceBreakdown: { flexDirection: 'row', gap: 16 },
  resBreakItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  resBreakDot: { width: 8, height: 8, borderRadius: 4 },
  resBreakText: { fontSize: 12, color: Colors.textSub, fontFamily: 'Inter_400Regular' },

  vitalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  vitalCard: {
    width: '47.5%', backgroundColor: Colors.bgCard,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 16, padding: 14, gap: 2,
  },
  vitalValue: { fontSize: 26, fontFamily: 'Inter_700Bold', letterSpacing: -1 },
  vitalLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.textSub },
  vitalSub: { fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.textMuted },

  ledgerCard: {
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 20, overflow: 'hidden',
  },
  ledgerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  ledgerRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  ledgerDelta: {
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4, minWidth: 44, alignItems: 'center',
  },
  ledgerDeltaText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  ledgerInfo: { flex: 1 },
  ledgerLabel: { fontSize: 13, color: Colors.text, fontFamily: 'Inter_500Medium' },
  ledgerDate: { fontSize: 11, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
});
