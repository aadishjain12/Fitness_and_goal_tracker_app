import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
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
import { getMicroAlternative } from "@/lib/aiEngine";
import { getSmokeFreeTime, getStreakInfo, getSmokingROI } from "@/lib/storage";

function MissReasonModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const quickReasons = ["Too busy", "Feeling sick", "Too tired", "No motivation", "Court unavailable"];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>What happened today?</Text>
          <Text style={styles.modalSub}>
            The AI will activate the Pivot Protocol to keep your neural pathway active.
          </Text>
          <View style={styles.quickReasons}>
            {quickReasons.map((r) => (
              <Pressable
                key={r}
                onPress={() => setReason(r)}
                style={[styles.reasonChip, reason === r && styles.reasonChipActive]}
              >
                <Text style={[styles.reasonChipText, reason === r && styles.reasonChipTextActive]}>{r}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Or type your reason..."
            placeholderTextColor={Colors.textMuted}
            style={styles.reasonInput}
            multiline
          />
          <View style={styles.modalButtons}>
            <Pressable onPress={onClose} style={styles.modalCancelBtn}>
              <Text style={styles.modalCancelText}>Skip</Text>
            </Pressable>
            <Pressable
              onPress={() => { onSubmit(reason || 'Not specified'); setReason(""); }}
              style={styles.modalSubmitBtn}
            >
              <Text style={styles.modalSubmitText}>Activate Protocol</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function PivotProtocolModal({
  visible,
  onComplete,
  onSkip,
}: {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const alt = getMicroAlternative('badminton');
  const [done, setDone] = useState(false);

  const handleDone = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDone(true);
    setTimeout(() => { setDone(false); onComplete(); }, 800);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onSkip}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.pivotHeader}>
            <View style={styles.pivotBadge}>
              <Feather name="zap" size={12} color={Colors.orange} />
              <Text style={styles.pivotBadgeText}>PIVOT PROTOCOL</Text>
            </View>
            <Text style={styles.pivotSub}>2-minute micro-alternative to keep your neural pathway active</Text>
          </View>

          <View style={styles.pivotCard}>
            <View style={styles.pivotCardTop}>
              <Text style={styles.pivotTitle}>{alt.title}</Text>
              <View style={styles.pivotDuration}>
                <Feather name="clock" size={11} color={Colors.accent} />
                <Text style={styles.pivotDurationText}>{alt.duration}</Text>
              </View>
            </View>
            <Text style={styles.pivotInstruction}>{alt.instruction}</Text>
            <View style={styles.pivotPrinciple}>
              <Feather name="zap" size={12} color={Colors.gold} />
              <Text style={styles.pivotPrincipleText}>{alt.principle}</Text>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <Pressable onPress={onSkip} style={styles.modalCancelBtn}>
              <Text style={styles.modalCancelText}>Skip</Text>
            </Pressable>
            <Pressable
              onPress={handleDone}
              style={[styles.pivotDoneBtn, done && { backgroundColor: Colors.green }]}
            >
              <Feather name={done ? "check" : "play"} size={15} color={Colors.bg} />
              <Text style={styles.pivotDoneBtnText}>{done ? 'Great work!' : 'I Did It!'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SmokingSettingsModal({
  visible, cigsPerDay, costPerPack, cigsPerPack,
  onClose, onSave,
}: {
  visible: boolean; cigsPerDay: number; costPerPack: number; cigsPerPack: number;
  onClose: () => void; onSave: (cpd: number, cpp: number, cig: number) => void;
}) {
  const [cpd, setCpd] = useState(String(cigsPerDay));
  const [cpp, setCpp] = useState(String(costPerPack));
  const [cig, setCig] = useState(String(cigsPerPack));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>ROI Settings</Text>
          <Text style={styles.modalSub}>Calibrate to calculate your accurate money saved & life regained.</Text>
          {[
            { label: 'Cigarettes per day', val: cpd, set: setCpd },
            { label: 'Cost per pack ($)', val: cpp, set: setCpp },
            { label: 'Cigarettes per pack', val: cig, set: setCig },
          ].map(({ label, val, set }) => (
            <View key={label} style={{ marginBottom: 12 }}>
              <Text style={styles.settingsLabel}>{label}</Text>
              <TextInput
                value={val}
                onChangeText={set}
                keyboardType="numeric"
                style={styles.settingsInput}
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          ))}
          <View style={styles.modalButtons}>
            <Pressable onPress={onClose} style={styles.modalCancelBtn}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onSave(parseFloat(cpd) || cigsPerDay, parseFloat(cpp) || costPerPack, parseFloat(cig) || cigsPerPack);
                onClose();
              }}
              style={styles.modalSubmitBtn}
            >
              <Text style={styles.modalSubmitText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const { data, logBadminton, setSmokeFreeStart, updateSmokingSettings } = useApp();
  const [showMissModal, setShowMissModal] = useState(false);
  const [showPivotModal, setShowPivotModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [pendingReason, setPendingReason] = useState('');

  const { current, best, todayLogged } = getStreakInfo(data.badmintonLogs);
  const todayLog = data.badmintonLogs.find(l => l.date === new Date().toISOString().slice(0, 10));
  const smokeFreeTime = getSmokeFreeTime(data.smokeFreeStart);
  const roi = getSmokingROI(data.smokeFreeStart, data.smokingSettings);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const onPlayedToday = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await logBadminton(true);
  };

  const onMissedToday = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowMissModal(true);
  };

  const onMissSubmit = async (reason: string) => {
    setShowMissModal(false);
    await logBadminton(false, reason);
    setPendingReason(reason);
    setShowPivotModal(true);
  };

  const onPivotComplete = () => {
    setShowPivotModal(false);
    router.push({ pathname: '/modals/bounceBack', params: { reason: pendingReason } });
  };

  const onPivotSkip = () => {
    setShowPivotModal(false);
    router.push({ pathname: '/modals/bounceBack', params: { reason: pendingReason } });
  };

  return (
    <View style={styles.container}>
      <MissReasonModal
        visible={showMissModal}
        onClose={() => setShowMissModal(false)}
        onSubmit={onMissSubmit}
      />
      <PivotProtocolModal
        visible={showPivotModal}
        onComplete={onPivotComplete}
        onSkip={onPivotSkip}
      />
      <SmokingSettingsModal
        visible={showSettingsModal}
        cigsPerDay={data.smokingSettings.cigsPerDay}
        costPerPack={data.smokingSettings.costPerPack}
        cigsPerPack={data.smokingSettings.cigsPerPack}
        onClose={() => setShowSettingsModal(false)}
        onSave={(cpd, cpp, cig) => updateSmokingSettings({ cigsPerDay: cpd, costPerPack: cpp, cigsPerPack: cig })}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 16, paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 100 }]}
      >
        <Text style={styles.pageTitle}>Habit Architect</Text>

        {/* Badminton Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconWrap}>
            <Feather name="activity" size={16} color={Colors.accent} />
          </View>
          <Text style={styles.sectionTitle}>Badminton Tracker</Text>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakRow}>
            <View style={styles.streakBlock}>
              <Text style={[styles.streakNum, { color: Colors.accent }]}>{current}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakBlock}>
              <Text style={[styles.streakNum, { color: Colors.gold }]}>{best}</Text>
              <Text style={styles.streakLabel}>Best Streak</Text>
            </View>
          </View>
          {current > 0 && (
            <View style={styles.streakMsgCard}>
              <Text style={styles.streakMsg}>
                {current >= 7
                  ? `${current} day streak. You are in flow state. Don't break the chain.`
                  : current >= 3
                  ? `${current} days strong. Habits form at 21 days. Keep building.`
                  : `${current} day start. The first week is the hardest — push through.`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.todaySection}>
          <Text style={styles.todayLabel}>Log Today</Text>
          <View style={styles.logButtons}>
            <Pressable
              onPress={onPlayedToday}
              disabled={todayLog?.completed === true}
              style={({ pressed }) => [
                styles.logBtn, styles.logBtnGreen,
                (todayLog?.completed === true) && styles.logBtnActive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Feather name="check" size={20} color={todayLog?.completed ? Colors.bg : Colors.green} />
              <Text style={[styles.logBtnText, { color: todayLog?.completed ? Colors.bg : Colors.green }]}>
                Played Today
              </Text>
            </Pressable>
            <Pressable
              onPress={onMissedToday}
              disabled={todayLog?.completed === false}
              style={({ pressed }) => [
                styles.logBtn, styles.logBtnRed,
                (todayLog?.completed === false) && styles.logBtnMissedActive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Feather name="x" size={20} color={Colors.red} />
              <Text style={[styles.logBtnText, { color: Colors.red }]}>Missed</Text>
            </Pressable>
          </View>

          {todayLog?.completed === false && (
            <View style={styles.pivotProtocolTag}>
              <Feather name="zap" size={12} color={Colors.orange} />
              <Text style={styles.pivotProtocolTagText}>Pivot Protocol activated — neural pathway preserved.</Text>
            </View>
          )}

          {todayLog?.completed === false && todayLog.reason && (
            <View style={styles.missReasonTag}>
              <Feather name="alert-circle" size={12} color={Colors.red} />
              <Text style={styles.missReasonText}>Reason: {todayLog.reason}</Text>
            </View>
          )}
        </View>

        {/* Cessation Section */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <View style={[styles.sectionIconWrap, { backgroundColor: Colors.greenDim }]}>
            <Feather name="wind" size={16} color={Colors.green} />
          </View>
          <Text style={styles.sectionTitle}>Cessation Tracker</Text>
        </View>

        <View style={styles.cessationCard}>
          {!data.smokeFreeStart ? (
            <View style={styles.cessationEmpty}>
              <Text style={styles.cessationEmptyTitle}>Start Your Smoke-Free Journey</Text>
              <Text style={styles.cessationEmptyText}>
                Every second counts. Your body begins healing within 20 minutes of your last cigarette.
              </Text>
              <Pressable onPress={() => setSmokeFreeStart(new Date().toISOString())} style={styles.quitBtn}>
                <Feather name="zap" size={16} color={Colors.bg} />
                <Text style={styles.quitBtnText}>Quit Starting Now</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {/* Primary Timer Stats */}
              <View style={styles.cessationStats}>
                <View style={styles.cessStatBlock}>
                  <Text style={[styles.cessStatNum, { color: Colors.green }]}>{smokeFreeTime.days}</Text>
                  <Text style={styles.cessStatLabel}>Days Free</Text>
                </View>
                <View style={styles.cessStatBlock}>
                  <Text style={[styles.cessStatNum, { color: Colors.accent }]}>{roi.cigsAvoided}</Text>
                  <Text style={styles.cessStatLabel}>Cigs Avoided</Text>
                </View>
                <View style={styles.cessStatBlock}>
                  <Text style={[styles.cessStatNum, { color: Colors.gold }]}>{String(smokeFreeTime.hours).padStart(2,'0')}:{String(smokeFreeTime.minutes).padStart(2,'0')}</Text>
                  <Text style={styles.cessStatLabel}>Today's Clock</Text>
                </View>
              </View>

              {/* Financial / Health ROI Card */}
              <View style={styles.roiCard}>
                <View style={styles.roiHeader}>
                  <Feather name="trending-up" size={14} color={Colors.gold} />
                  <Text style={styles.roiHeaderText}>Financial & Health ROI</Text>
                  <Pressable onPress={() => setShowSettingsModal(true)} style={styles.roiSettingsBtn}>
                    <Feather name="settings" size={12} color={Colors.textMuted} />
                  </Pressable>
                </View>
                <View style={styles.roiRow}>
                  <View style={styles.roiBlock}>
                    <Text style={styles.roiIcon}>💰</Text>
                    <Text style={[styles.roiValue, { color: Colors.gold }]}>${roi.moneySaved.toFixed(2)}</Text>
                    <Text style={styles.roiLabel}>Money Saved</Text>
                    <Text style={styles.roiSub}>${(roi.moneySaved / Math.max(smokeFreeTime.days, 1)).toFixed(2)}/day</Text>
                  </View>
                  <View style={styles.roiDivider} />
                  <View style={styles.roiBlock}>
                    <Text style={styles.roiIcon}>🫁</Text>
                    <Text style={[styles.roiValue, { color: Colors.green }]}>
                      {roi.lifeMinutesRegained >= 60
                        ? `${(roi.lifeMinutesRegained / 60).toFixed(1)}h`
                        : `${roi.lifeMinutesRegained}m`}
                    </Text>
                    <Text style={styles.roiLabel}>Life Regained</Text>
                    <Text style={styles.roiSub}>~11 min per cig avoided</Text>
                  </View>
                </View>
                <Text style={styles.roiNote}>
                  Based on {data.smokingSettings.cigsPerDay} cigs/day @ ${data.smokingSettings.costPerPack}/{data.smokingSettings.cigsPerPack} cigs per pack.
                  Tap ⚙ to adjust.
                </Text>
              </View>

              {/* Recovery Timeline */}
              <View style={styles.cessationMilestones}>
                <Text style={styles.milestonesTitle}>Recovery Timeline</Text>
                {[
                  { days: 1, text: "Blood oxygen normalized" },
                  { days: 3, text: "Nicotine eliminated" },
                  { days: 14, text: "Circulation improved" },
                  { days: 30, text: "Lung capacity increasing" },
                  { days: 90, text: "Addiction pathways fading" },
                ].map(m => (
                  <View key={m.days} style={styles.milestone}>
                    <View style={[styles.milestoneDot, smokeFreeTime.days >= m.days && styles.milestoneDotDone]} />
                    <Text style={[styles.milestoneText, smokeFreeTime.days >= m.days && styles.milestoneDone]}>
                      Day {m.days}: {m.text}
                    </Text>
                    {smokeFreeTime.days >= m.days && <Feather name="check" size={12} color={Colors.green} />}
                  </View>
                ))}
              </View>

              <View style={styles.cessationActions}>
                <Pressable onPress={() => router.push('/modals/breath')} style={styles.breathBtn}>
                  <Feather name="wind" size={16} color={Colors.accent} />
                  <Text style={styles.breathBtnText}>Stoic Breathing</Text>
                </Pressable>
                <Pressable onPress={() => setSmokeFreeStart(new Date().toISOString())} style={styles.resetBtn}>
                  <Text style={styles.resetBtnText}>Reset Date</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 16 },
  pageTitle: { fontSize: 26, color: Colors.text, fontFamily: 'Inter_700Bold', marginBottom: 20, letterSpacing: -0.5 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Colors.accentDim,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 17, color: Colors.text, fontFamily: 'Inter_700Bold' },

  streakCard: {
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 20,
    padding: 20, marginBottom: 14,
  },
  streakRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  streakBlock: { alignItems: 'center' },
  streakNum: { fontSize: 48, fontFamily: 'Inter_700Bold', letterSpacing: -2 },
  streakLabel: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_500Medium' },
  streakDivider: { width: 1, backgroundColor: Colors.border, alignSelf: 'stretch' },
  streakMsgCard: {
    backgroundColor: Colors.accentDim, borderWidth: 1,
    borderColor: Colors.accentBorder, borderRadius: 12, padding: 12,
  },
  streakMsg: { fontSize: 13, color: Colors.accent, fontFamily: 'Inter_400Regular', lineHeight: 19, textAlign: 'center' },

  todaySection: {
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 20,
    padding: 18, marginBottom: 8,
  },
  todayLabel: { fontSize: 14, color: Colors.textSub, fontFamily: 'Inter_600SemiBold', marginBottom: 12 },
  logButtons: { flexDirection: 'row', gap: 10 },
  logBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    padding: 14, borderRadius: 14, borderWidth: 1,
  },
  logBtnGreen: { borderColor: Colors.green + '50', backgroundColor: Colors.greenDim },
  logBtnActive: { backgroundColor: Colors.green, borderColor: Colors.green },
  logBtnRed: { borderColor: Colors.red + '50', backgroundColor: Colors.redDim },
  logBtnMissedActive: { opacity: 0.6 },
  logBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  pivotProtocolTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 10, backgroundColor: Colors.orangeDim,
    borderRadius: 8, padding: 8,
    borderWidth: 1, borderColor: Colors.orange + '30',
  },
  pivotProtocolTagText: { fontSize: 12, color: Colors.orange, fontFamily: 'Inter_500Medium', flex: 1 },
  missReasonTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 6, backgroundColor: Colors.redDim,
    borderRadius: 8, padding: 8,
  },
  missReasonText: { fontSize: 12, color: Colors.red, fontFamily: 'Inter_400Regular', flex: 1 },

  cessationCard: {
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.green + '25', borderRadius: 20,
    padding: 20, marginBottom: 14,
  },
  cessationEmpty: { alignItems: 'center', gap: 10 },
  cessationEmptyTitle: { fontSize: 17, color: Colors.text, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  cessationEmptyText: { fontSize: 13, color: Colors.textSub, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 19 },
  quitBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.green, borderRadius: 14,
    paddingHorizontal: 24, paddingVertical: 14, marginTop: 6,
  },
  quitBtnText: { color: Colors.bg, fontSize: 15, fontFamily: 'Inter_700Bold' },
  cessationStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  cessStatBlock: { alignItems: 'center' },
  cessStatNum: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1 },
  cessStatLabel: { fontSize: 11, color: Colors.textMuted, fontFamily: 'Inter_500Medium' },

  roiCard: {
    backgroundColor: Colors.goldDim, borderWidth: 1,
    borderColor: Colors.goldBorder, borderRadius: 14,
    padding: 14, marginBottom: 16,
  },
  roiHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginBottom: 12,
  },
  roiHeaderText: {
    flex: 1, fontSize: 12, color: Colors.gold,
    fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  roiSettingsBtn: { padding: 4 },
  roiRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  roiBlock: { alignItems: 'center', gap: 2 },
  roiIcon: { fontSize: 20, marginBottom: 2 },
  roiValue: { fontSize: 26, fontFamily: 'Inter_700Bold', letterSpacing: -1 },
  roiLabel: { fontSize: 11, color: Colors.textSub, fontFamily: 'Inter_600SemiBold' },
  roiSub: { fontSize: 10, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  roiDivider: { width: 1, backgroundColor: Colors.goldBorder, alignSelf: 'stretch', marginHorizontal: 8 },
  roiNote: { fontSize: 10, color: Colors.textMuted, fontFamily: 'Inter_400Regular', lineHeight: 14 },

  cessationMilestones: {
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingTop: 14, marginBottom: 16,
  },
  milestonesTitle: {
    fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  milestone: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  milestoneDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },
  milestoneDotDone: { backgroundColor: Colors.green },
  milestoneText: { flex: 1, fontSize: 13, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  milestoneDone: { color: Colors.text },
  cessationActions: { flexDirection: 'row', gap: 10 },
  breathBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    backgroundColor: Colors.accentDim, borderWidth: 1,
    borderColor: Colors.accentBorder, borderRadius: 14, paddingVertical: 12,
  },
  breathBtnText: { color: Colors.accent, fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  resetBtn: {
    paddingHorizontal: 16, justifyContent: 'center',
    backgroundColor: Colors.redDim, borderWidth: 1,
    borderColor: Colors.red + '30', borderRadius: 14, paddingVertical: 12,
  },
  resetBtnText: { color: Colors.red, fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.bgCard, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, color: Colors.text, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  modalSub: { fontSize: 13, color: Colors.textSub, fontFamily: 'Inter_400Regular', marginBottom: 16, lineHeight: 19 },
  quickReasons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  reasonChip: {
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: Colors.surface,
  },
  reasonChipActive: { borderColor: Colors.accent, backgroundColor: Colors.accentDim },
  reasonChipText: { fontSize: 13, color: Colors.textSub, fontFamily: 'Inter_500Medium' },
  reasonChipTextActive: { color: Colors.accent },
  reasonInput: {
    backgroundColor: Colors.surface, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 12,
    padding: 12, color: Colors.text, fontFamily: 'Inter_400Regular',
    fontSize: 14, minHeight: 60, marginBottom: 16,
  },
  modalButtons: { flexDirection: 'row', gap: 10 },
  modalCancelBtn: {
    flex: 1, padding: 14, borderRadius: 14,
    alignItems: 'center', backgroundColor: Colors.surface,
  },
  modalCancelText: { color: Colors.textSub, fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  modalSubmitBtn: {
    flex: 2, padding: 14, borderRadius: 14,
    alignItems: 'center', backgroundColor: Colors.accent,
  },
  modalSubmitText: { color: Colors.bg, fontFamily: 'Inter_700Bold', fontSize: 15 },

  // Pivot Protocol Modal
  pivotHeader: { marginBottom: 16 },
  pivotBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.orangeDim, borderWidth: 1,
    borderColor: Colors.orange + '40', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  pivotBadgeText: {
    fontSize: 10, color: Colors.orange, fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  pivotSub: { fontSize: 13, color: Colors.textSub, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  pivotCard: {
    backgroundColor: Colors.surface, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 14, padding: 14, marginBottom: 20,
  },
  pivotCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  pivotTitle: { fontSize: 16, color: Colors.text, fontFamily: 'Inter_700Bold', flex: 1 },
  pivotDuration: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.accentDim, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  pivotDurationText: { fontSize: 11, color: Colors.accent, fontFamily: 'Inter_600SemiBold' },
  pivotInstruction: { fontSize: 14, color: Colors.textSub, fontFamily: 'Inter_400Regular', lineHeight: 20, marginBottom: 12 },
  pivotPrinciple: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 4 },
  pivotPrincipleText: { flex: 1, fontSize: 12, color: Colors.gold, fontFamily: 'Inter_400Regular', lineHeight: 17, fontStyle: 'italic' },
  pivotDoneBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 7,
    padding: 14, borderRadius: 14, backgroundColor: Colors.orange,
  },
  pivotDoneBtnText: { color: Colors.bg, fontFamily: 'Inter_700Bold', fontSize: 15 },

  // Settings
  settingsLabel: { fontSize: 13, color: Colors.textSub, fontFamily: 'Inter_500Medium', marginBottom: 6 },
  settingsInput: {
    backgroundColor: Colors.surface, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 10,
    padding: 12, color: Colors.text, fontFamily: 'Inter_400Regular', fontSize: 14,
  },
});
