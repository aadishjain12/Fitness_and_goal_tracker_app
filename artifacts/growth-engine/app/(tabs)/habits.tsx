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

  const { current, best } = getStreakInfo(data.badmintonLogs);
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = data.badmintonLogs.find(l => l.date === today);
  const smokeFreeTime = getSmokeFreeTime(data.smokeFreeStart);
  const roi = getSmokingROI(data.smokeFreeStart, data.smokingSettings);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const lowEnergy = data.energyLevel < 30;
  const alreadyLogged = !!todayLog?.habitState;

  const onVictorious = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await logBadminton('victorious');
  };

  const onResilient = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logBadminton('resilient', 'Safety Net — micro-alternative completed');
    setShowPivotModal(true);
  };

  const onLapsed = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowMissModal(true);
  };

  const onMissSubmit = async (reason: string) => {
    setShowMissModal(false);
    await logBadminton('lapsed', reason);
    setPendingReason(reason);
    setTimeout(() => {
      router.push({ pathname: '/modals/bounceBack', params: { reason } });
    }, 300);
  };

  const onPivotComplete = () => {
    setShowPivotModal(false);
  };

  const onPivotSkip = () => setShowPivotModal(false);

  const STATE_COLOR = { victorious: Colors.green, resilient: Colors.gold, lapsed: Colors.red };
  const STATE_ICON = { victorious: 'award', resilient: 'shield', lapsed: 'x-circle' } as const;
  const STATE_LABEL = { victorious: 'Victorious', resilient: 'Resilient', lapsed: 'Lapsed' };

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

          {/* Safety Net Banner — shown when energy < 30% and not yet logged */}
          {lowEnergy && !alreadyLogged && (
            <View style={styles.safetyNetBanner}>
              <View style={styles.safetyNetHeader}>
                <Feather name="zap" size={14} color={Colors.orange} />
                <Text style={styles.safetyNetTitle}>Safety Net Active — Energy Critical</Text>
              </View>
              <Text style={styles.safetyNetText}>
                Your Human Battery is at {data.energyLevel}%. A full session may not be realistic. Try the micro-alternative (Resilient) to keep your neural pathway alive — your streak is preserved.
              </Text>
            </View>
          )}

          {/* Already logged state */}
          {alreadyLogged && todayLog?.habitState ? (
            <View style={[styles.loggedState, { borderColor: STATE_COLOR[todayLog.habitState] + '50', backgroundColor: STATE_COLOR[todayLog.habitState] + '12' }]}>
              <Feather name={STATE_ICON[todayLog.habitState]} size={22} color={STATE_COLOR[todayLog.habitState]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.loggedStateTitle, { color: STATE_COLOR[todayLog.habitState] }]}>
                  {STATE_LABEL[todayLog.habitState]}
                </Text>
                <Text style={styles.loggedStateSub}>
                  {todayLog.habitState === 'victorious'
                    ? 'Full session completed. Energy +25.'
                    : todayLog.habitState === 'resilient'
                    ? 'Micro-alternative done. Streak saved. Energy +12.'
                    : `Logged lapsed. Energy −10. ${todayLog.reason ? `Reason: ${todayLog.reason}` : ''}`}
                </Text>
              </View>
            </View>
          ) : (
            /* Three-state buttons */
            <View style={styles.threeStateButtons}>
              {/* Victorious */}
              <Pressable
                onPress={onVictorious}
                style={({ pressed }) => [styles.stateBtn, styles.stateBtnVictorious, pressed && { opacity: 0.8 }]}
              >
                <Feather name="award" size={20} color={Colors.green} />
                <Text style={[styles.stateBtnLabel, { color: Colors.green }]}>Victorious</Text>
                <Text style={styles.stateBtnSub}>Full session{'\n'}+25 ⚡</Text>
              </Pressable>

              {/* Resilient — highlighted when low energy */}
              <Pressable
                onPress={onResilient}
                style={({ pressed }) => [
                  styles.stateBtn, styles.stateBtnResilient,
                  lowEnergy && styles.stateBtnResilientHighlight,
                  pressed && { opacity: 0.8 },
                ]}
              >
                {lowEnergy && (
                  <View style={styles.safetyNetBadge}>
                    <Text style={styles.safetyNetBadgeText}>RECOMMENDED</Text>
                  </View>
                )}
                <Feather name="shield" size={20} color={Colors.gold} />
                <Text style={[styles.stateBtnLabel, { color: Colors.gold }]}>Resilient</Text>
                <Text style={styles.stateBtnSub}>Micro-alt{'\n'}+12 ⚡</Text>
              </Pressable>

              {/* Lapsed */}
              <Pressable
                onPress={onLapsed}
                style={({ pressed }) => [styles.stateBtn, styles.stateBtnLapsed, pressed && { opacity: 0.8 }]}
              >
                <Feather name="x-circle" size={20} color={Colors.red} />
                <Text style={[styles.stateBtnLabel, { color: Colors.red }]}>Lapsed</Text>
                <Text style={styles.stateBtnSub}>Missed{'\n'}−10 ⚡</Text>
              </Pressable>
            </View>
          )}

          {/* State legend */}
          {!alreadyLogged && (
            <View style={styles.stateLegend}>
              <Feather name="info" size={11} color={Colors.textMuted} />
              <Text style={styles.stateLegendText}>
                Resilient = micro-alternative done (streak preserved). Lapsed = fully missed.
              </Text>
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
  safetyNetBanner: {
    backgroundColor: Colors.orangeDim, borderWidth: 1,
    borderColor: Colors.orange + '40', borderRadius: 14,
    padding: 12, marginBottom: 12,
  },
  safetyNetHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  safetyNetTitle: { fontSize: 13, color: Colors.orange, fontFamily: 'Inter_700Bold', flex: 1 },
  safetyNetText: { fontSize: 12, color: Colors.orange, fontFamily: 'Inter_400Regular', lineHeight: 17, opacity: 0.9 },

  loggedState: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderRadius: 14, padding: 14,
  },
  loggedStateTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  loggedStateSub: { fontSize: 12, color: Colors.textSub, fontFamily: 'Inter_400Regular', lineHeight: 17 },

  threeStateButtons: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  stateBtn: {
    flex: 1, borderWidth: 1, borderRadius: 14, padding: 12,
    alignItems: 'center', gap: 6, position: 'relative', overflow: 'hidden',
  },
  stateBtnVictorious: { borderColor: Colors.green + '50', backgroundColor: Colors.greenDim },
  stateBtnResilient: { borderColor: Colors.gold + '50', backgroundColor: Colors.goldDim },
  stateBtnResilientHighlight: { borderColor: Colors.orange, borderWidth: 2 },
  stateBtnLapsed: { borderColor: Colors.red + '40', backgroundColor: Colors.redDim },
  stateBtnLabel: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  stateBtnSub: { fontSize: 10, color: Colors.textMuted, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 14 },

  safetyNetBadge: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: Colors.orange, paddingVertical: 2,
  },
  safetyNetBadgeText: { fontSize: 8, color: Colors.bg, fontFamily: 'Inter_700Bold', textAlign: 'center', letterSpacing: 0.5 },

  stateLegend: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 4,
  },
  stateLegendText: { flex: 1, fontSize: 10, color: Colors.textMuted, fontFamily: 'Inter_400Regular', lineHeight: 14 },

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
