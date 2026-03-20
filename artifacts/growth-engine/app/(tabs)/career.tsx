import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
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
import { JobApp, applyPrivacy } from "@/lib/storage";
import { getKanbanTaskOfDay, getMockInterviewQuestions } from "@/lib/aiEngine";

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: Colors.accent, bgColor: Colors.accentDim, icon: 'send' as const },
  interview: { label: 'Interview', color: Colors.gold, bgColor: Colors.goldDim, icon: 'user' as const },
  offer: { label: 'Offer', color: Colors.green, bgColor: Colors.greenDim, icon: 'award' as const },
  rejected: { label: 'Rejected', color: Colors.red, bgColor: Colors.redDim, icon: 'x-circle' as const },
};

const STATUS_ORDER: JobApp['status'][] = ['applied', 'interview', 'offer', 'rejected'];

function MockInterviewModal({
  visible, company, questions, onClose,
}: {
  visible: boolean; company: string; questions: string[]; onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.mockHeader}>
            <View style={styles.mockBadge}>
              <Feather name="cpu" size={12} color={Colors.accent} />
              <Text style={styles.mockBadgeText}>AI MOCK INTERVIEW</Text>
            </View>
            <Text style={styles.mockCompany}>{company}</Text>
            <Text style={styles.mockSub}>3 high-signal Product Management questions for this company. Prep each for 5 minutes — then go crush it.</Text>
          </View>

          {questions.map((q, i) => (
            <View key={i} style={styles.questionCard}>
              <View style={styles.questionNum}>
                <Text style={styles.questionNumText}>Q{i + 1}</Text>
              </View>
              <Text style={styles.questionText}>{q}</Text>
            </View>
          ))}

          <View style={styles.mockTip}>
            <Feather name="zap" size={12} color={Colors.gold} />
            <Text style={styles.mockTipText}>
              Tip: Use the STAR framework (Situation, Task, Action, Result) and anchor every answer with a specific metric.
            </Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeMockBtn}>
            <Text style={styles.closeMockBtnText}>Close & Prep</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function JobCard({ job, privacy, onUpdate, onDelete, onPrepMe }: {
  job: JobApp;
  privacy: { enabled: boolean; codenames: Record<string, string> };
  onUpdate: (id: string, updates: Partial<JobApp>) => void;
  onDelete: (id: string) => void;
  onPrepMe: (job: JobApp) => void;
}) {
  const config = STATUS_CONFIG[job.status];
  const [expanded, setExpanded] = useState(false);
  const taskOfDay = job.status === 'interview' ? getKanbanTaskOfDay(job.company, job.position) : null;

  const displayCompany = applyPrivacy(job.company, privacy);
  const displayPosition = applyPrivacy(job.position, privacy);

  const advanceStatus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const idx = STATUS_ORDER.indexOf(job.status);
    if (idx < STATUS_ORDER.length - 1) {
      onUpdate(job.id, { status: STATUS_ORDER[idx + 1] });
    }
  };

  const handleDelete = () => {
    Alert.alert('Remove Application', `Remove ${displayCompany} from your pipeline?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onDelete(job.id) },
    ]);
  };

  return (
    <Pressable onPress={() => setExpanded(!expanded)} style={styles.jobCard}>
      <View style={styles.jobCardTop}>
        <View style={[styles.statusBadge, { backgroundColor: config.bgColor, borderColor: config.color + '40' }]}>
          <Feather name={config.icon} size={11} color={config.color} />
          <Text style={[styles.statusBadgeText, { color: config.color }]}>{config.label}</Text>
        </View>
        <View style={styles.jobActions}>
          {job.status === 'interview' && (
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPrepMe(job); }}
              style={styles.prepMeBtn}
            >
              <Feather name="cpu" size={12} color={Colors.accent} />
              <Text style={styles.prepMeBtnText}>Prep Me</Text>
            </Pressable>
          )}
          {job.status !== 'offer' && job.status !== 'rejected' && (
            <Pressable onPress={advanceStatus} style={styles.advanceBtn}>
              <Feather name="arrow-right" size={14} color={Colors.accent} />
            </Pressable>
          )}
          <Pressable onPress={handleDelete} style={styles.deleteBtn}>
            <Feather name="trash-2" size={14} color={Colors.red} />
          </Pressable>
        </View>
      </View>

      <Text style={styles.companyName}>{displayCompany}</Text>
      <Text style={styles.positionName}>{displayPosition}</Text>
      <Text style={styles.jobDate}>{new Date(job.date).toLocaleDateString()}</Text>

      {expanded && (
        <>
          {taskOfDay && (
            <View style={styles.taskOfDay}>
              <View style={styles.todHeader}>
                <Feather name="cpu" size={12} color={Colors.gold} />
                <Text style={styles.todHeaderText}>AI Task of the Day</Text>
              </View>
              <Text style={styles.todText}>{taskOfDay}</Text>
            </View>
          )}

          {job.status === 'interview' && (
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPrepMe(job); }}
              style={styles.prepMeExpanded}
            >
              <Feather name="mic" size={14} color={Colors.accent} />
              <Text style={styles.prepMeExpandedText}>Launch 15-Min Mock Interview for {displayCompany}</Text>
              <Feather name="chevron-right" size={14} color={Colors.accent} />
            </Pressable>
          )}

          {job.status === 'offer' && (
            <View style={styles.offerBanner}>
              <Feather name="award" size={16} color={Colors.green} />
              <Text style={styles.offerBannerText}>
                Congratulations! Negotiate boldly. Your market value is higher than their first offer.
              </Text>
            </View>
          )}

          {job.notes && <Text style={styles.jobNotes}>{job.notes}</Text>}

          <View style={styles.statusStepper}>
            {STATUS_ORDER.filter(s => s !== 'rejected').map((s, i) => {
              const c = STATUS_CONFIG[s];
              const isActive = job.status === s;
              const isDone = STATUS_ORDER.indexOf(job.status) > i && job.status !== 'rejected';
              return (
                <React.Fragment key={s}>
                  <View style={[styles.stepDot, (isActive || isDone) && { backgroundColor: c.color }]}>
                    {isDone && <Feather name="check" size={10} color={Colors.bg} />}
                  </View>
                  {i < 2 && <View style={[styles.stepLine, isDone && { backgroundColor: c.color }]} />}
                </React.Fragment>
              );
            })}
          </View>
        </>
      )}
    </Pressable>
  );
}

function KanbanColumn({ status, jobs, privacy, onUpdate, onDelete, onPrepMe }: {
  status: JobApp['status'];
  jobs: JobApp[];
  privacy: { enabled: boolean; codenames: Record<string, string> };
  onUpdate: (id: string, updates: Partial<JobApp>) => void;
  onDelete: (id: string) => void;
  onPrepMe: (job: JobApp) => void;
}) {
  const config = STATUS_CONFIG[status];
  if (jobs.length === 0) return null;
  return (
    <View style={styles.column}>
      <View style={styles.columnHeader}>
        <View style={[styles.columnDot, { backgroundColor: config.color }]} />
        <Text style={[styles.columnTitle, { color: config.color }]}>{config.label}</Text>
        <View style={[styles.columnCount, { backgroundColor: config.bgColor }]}>
          <Text style={[styles.columnCountText, { color: config.color }]}>{jobs.length}</Text>
        </View>
      </View>
      {jobs.map(j => (
        <JobCard key={j.id} job={j} privacy={privacy} onUpdate={onUpdate} onDelete={onDelete} onPrepMe={onPrepMe} />
      ))}
    </View>
  );
}

export default function CareerScreen() {
  const insets = useSafeAreaInsets();
  const { data, updateJobApp, removeJobApp } = useApp();
  const [interviewJob, setInterviewJob] = useState<JobApp | null>(null);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const byStatus = (status: JobApp['status']) => data.jobApps.filter(j => j.status === status);
  const inInterviewCount = byStatus('interview').length;

  const handlePrepMe = (job: JobApp) => {
    setInterviewJob(job);
  };

  return (
    <View style={styles.container}>
      {interviewJob && (
        <MockInterviewModal
          visible={!!interviewJob}
          company={applyPrivacy(interviewJob.company, data.privacy)}
          questions={getMockInterviewQuestions(interviewJob.company)}
          onClose={() => setInterviewJob(null)}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scroll, {
          paddingTop: topPad + 16,
          paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 100,
        }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Career Kanban</Text>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/modals/addJob'); }}
            style={styles.addBtn}
          >
            <Feather name="plus" size={18} color={Colors.accent} />
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            {STATUS_ORDER.map(s => {
              const cfg = STATUS_CONFIG[s];
              return (
                <View key={s} style={styles.summaryBlock}>
                  <Text style={[styles.summaryNum, { color: cfg.color }]}>{byStatus(s).length}</Text>
                  <Text style={styles.summaryLabel}>{cfg.label}</Text>
                </View>
              );
            })}
          </View>
          {inInterviewCount > 0 && (
            <View style={styles.interviewAlert}>
              <Feather name="mic" size={13} color={Colors.gold} />
              <Text style={styles.interviewAlertText}>
                {inInterviewCount} interview{inInterviewCount > 1 ? 's' : ''} active — tap "Prep Me" for AI mock questions.
              </Text>
            </View>
          )}
        </View>

        {data.jobApps.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="briefcase" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Your PM Pipeline Awaits</Text>
            <Text style={styles.emptyText}>
              Add your first application. Treat your job search like a product — track, iterate, ship.
            </Text>
            <Pressable onPress={() => router.push('/modals/addJob')} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Add First Application</Text>
            </Pressable>
          </View>
        )}

        {STATUS_ORDER.map(s => (
          <KanbanColumn
            key={s}
            status={s}
            jobs={byStatus(s)}
            privacy={data.privacy}
            onUpdate={updateJobApp}
            onDelete={removeJobApp}
            onPrepMe={handlePrepMe}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 16 },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  pageTitle: { fontSize: 26, color: Colors.text, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  addBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.accentDim, borderWidth: 1,
    borderColor: Colors.accentBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 20,
    padding: 16, marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  summaryBlock: { alignItems: 'center' },
  summaryNum: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -1 },
  summaryLabel: { fontSize: 11, color: Colors.textMuted, fontFamily: 'Inter_500Medium' },
  interviewAlert: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.goldDim, borderRadius: 10,
    padding: 10, borderWidth: 1, borderColor: Colors.goldBorder,
  },
  interviewAlertText: { flex: 1, fontSize: 12, color: Colors.gold, fontFamily: 'Inter_400Regular', lineHeight: 17 },

  column: { marginBottom: 20 },
  columnHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  columnDot: { width: 8, height: 8, borderRadius: 4 },
  columnTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', flex: 1, textTransform: 'uppercase', letterSpacing: 0.5 },
  columnCount: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  columnCountText: { fontSize: 12, fontFamily: 'Inter_700Bold' },

  jobCard: {
    backgroundColor: Colors.bgCard, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 16,
    padding: 16, marginBottom: 8,
  },
  jobCardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1,
  },
  statusBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  jobActions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  prepMeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.accentDim, borderWidth: 1,
    borderColor: Colors.accentBorder, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  prepMeBtnText: { fontSize: 11, color: Colors.accent, fontFamily: 'Inter_700Bold' },
  advanceBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.accentDim,
    alignItems: 'center', justifyContent: 'center',
  },
  deleteBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.redDim,
    alignItems: 'center', justifyContent: 'center',
  },
  companyName: { fontSize: 17, color: Colors.text, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  positionName: { fontSize: 14, color: Colors.textSub, fontFamily: 'Inter_500Medium', marginBottom: 4 },
  jobDate: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },

  taskOfDay: {
    marginTop: 12, backgroundColor: Colors.goldDim,
    borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: 12, padding: 12,
  },
  todHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  todHeaderText: { fontSize: 11, color: Colors.gold, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  todText: { fontSize: 13, color: Colors.text, fontFamily: 'Inter_400Regular', lineHeight: 19 },

  prepMeExpanded: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 12, backgroundColor: Colors.accentDim,
    borderWidth: 1, borderColor: Colors.accentBorder,
    borderRadius: 12, padding: 12,
  },
  prepMeExpandedText: { flex: 1, fontSize: 13, color: Colors.accent, fontFamily: 'Inter_500Medium' },

  offerBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    marginTop: 12, backgroundColor: Colors.greenDim,
    borderWidth: 1, borderColor: Colors.greenBorder, borderRadius: 12, padding: 12,
  },
  offerBannerText: { flex: 1, fontSize: 13, color: Colors.green, fontFamily: 'Inter_400Regular', lineHeight: 19 },
  jobNotes: { marginTop: 10, fontSize: 13, color: Colors.textSub, fontFamily: 'Inter_400Regular', lineHeight: 19, fontStyle: 'italic' },

  statusStepper: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 14, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  stepDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.textMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.textMuted },

  emptyState: { alignItems: 'center', padding: 40, gap: 12 },
  emptyTitle: { fontSize: 20, color: Colors.text, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  emptyText: { fontSize: 14, color: Colors.textSub, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 21 },
  emptyBtn: {
    backgroundColor: Colors.accent, borderRadius: 14,
    paddingHorizontal: 24, paddingVertical: 14, marginTop: 6,
  },
  emptyBtnText: { color: Colors.bg, fontFamily: 'Inter_700Bold', fontSize: 15 },

  // Mock Interview Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.bgCard, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, paddingBottom: 40,
    maxHeight: '90%',
  },
  mockHeader: { marginBottom: 18 },
  mockBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accentDim, borderWidth: 1,
    borderColor: Colors.accentBorder, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  mockBadgeText: {
    fontSize: 10, color: Colors.accent, fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  mockCompany: { fontSize: 22, color: Colors.text, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  mockSub: { fontSize: 13, color: Colors.textSub, fontFamily: 'Inter_400Regular', lineHeight: 18 },

  questionCard: {
    flexDirection: 'row', gap: 12, marginBottom: 12,
    backgroundColor: Colors.surface, borderWidth: 1,
    borderColor: Colors.border, borderRadius: 14, padding: 14,
  },
  questionNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.accentDim, borderWidth: 1,
    borderColor: Colors.accentBorder,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  questionNumText: { fontSize: 12, color: Colors.accent, fontFamily: 'Inter_700Bold' },
  questionText: { flex: 1, fontSize: 14, color: Colors.text, fontFamily: 'Inter_400Regular', lineHeight: 20 },

  mockTip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    backgroundColor: Colors.goldDim, borderWidth: 1,
    borderColor: Colors.goldBorder, borderRadius: 10, padding: 10, marginBottom: 16,
  },
  mockTipText: { flex: 1, fontSize: 12, color: Colors.gold, fontFamily: 'Inter_400Regular', lineHeight: 17, fontStyle: 'italic' },
  closeMockBtn: {
    backgroundColor: Colors.accent, borderRadius: 14,
    padding: 14, alignItems: 'center',
  },
  closeMockBtnText: { color: Colors.bg, fontFamily: 'Inter_700Bold', fontSize: 15 },
});
