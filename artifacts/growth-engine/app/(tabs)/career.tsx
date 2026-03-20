import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { JobApp } from "@/lib/storage";
import { getKanbanTaskOfDay } from "@/lib/aiEngine";

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: Colors.accent, bgColor: Colors.accentDim, icon: 'send' as const },
  interview: { label: 'Interview', color: Colors.gold, bgColor: Colors.goldDim, icon: 'user' as const },
  offer: { label: 'Offer', color: Colors.green, bgColor: Colors.greenDim, icon: 'award' as const },
  rejected: { label: 'Rejected', color: Colors.red, bgColor: Colors.redDim, icon: 'x-circle' as const },
};

const STATUS_ORDER: JobApp['status'][] = ['applied', 'interview', 'offer', 'rejected'];

function JobCard({ job, onUpdate, onDelete }: {
  job: JobApp;
  onUpdate: (id: string, updates: Partial<JobApp>) => void;
  onDelete: (id: string) => void;
}) {
  const config = STATUS_CONFIG[job.status];
  const [expanded, setExpanded] = useState(false);
  const taskOfDay = job.status === 'interview' ? getKanbanTaskOfDay(job.company, job.position) : null;

  const advanceStatus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const idx = STATUS_ORDER.indexOf(job.status);
    if (idx < STATUS_ORDER.length - 1) {
      onUpdate(job.id, { status: STATUS_ORDER[idx + 1] });
    }
  };

  const handleDelete = () => {
    Alert.alert('Remove Application', `Remove ${job.company} from your pipeline?`, [
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

      <Text style={styles.companyName}>{job.company}</Text>
      <Text style={styles.positionName}>{job.position}</Text>
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

          {job.status === 'offer' && (
            <View style={styles.offerBanner}>
              <Feather name="award" size={16} color={Colors.green} />
              <Text style={styles.offerBannerText}>
                Congratulations! Negotiate boldly. Your market value is higher than their first offer.
              </Text>
            </View>
          )}

          {job.notes && (
            <Text style={styles.jobNotes}>{job.notes}</Text>
          )}

          <View style={styles.statusStepper}>
            {STATUS_ORDER.filter(s => s !== 'rejected').map((s, i) => {
              const c = STATUS_CONFIG[s];
              const isActive = job.status === s;
              const isDone = STATUS_ORDER.indexOf(job.status) > i && job.status !== 'rejected';
              return (
                <React.Fragment key={s}>
                  <View style={[
                    styles.stepDot,
                    (isActive || isDone) && { backgroundColor: c.color },
                  ]}>
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

function KanbanColumn({ status, jobs, onUpdate, onDelete }: {
  status: JobApp['status'];
  jobs: JobApp[];
  onUpdate: (id: string, updates: Partial<JobApp>) => void;
  onDelete: (id: string) => void;
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
        <JobCard key={j.id} job={j} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </View>
  );
}

export default function CareerScreen() {
  const insets = useSafeAreaInsets();
  const { data, updateJobApp, removeJobApp } = useApp();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const byStatus = (status: JobApp['status']) => data.jobApps.filter(j => j.status === status);

  const inInterviewCount = byStatus('interview').length;
  const offerCount = byStatus('offer').length;

  return (
    <View style={styles.container}>
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

        {/* Pipeline Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            {STATUS_ORDER.map(s => {
              const cfg = STATUS_CONFIG[s];
              const count = byStatus(s).length;
              return (
                <View key={s} style={styles.summaryBlock}>
                  <Text style={[styles.summaryNum, { color: cfg.color }]}>{count}</Text>
                  <Text style={styles.summaryLabel}>{cfg.label}</Text>
                </View>
              );
            })}
          </View>
          {inInterviewCount > 0 && (
            <View style={styles.interviewAlert}>
              <Feather name="cpu" size={13} color={Colors.gold} />
              <Text style={styles.interviewAlertText}>
                {inInterviewCount} interview{inInterviewCount > 1 ? 's' : ''} active — check the AI task of the day for each.
              </Text>
            </View>
          )}
        </View>

        {/* Empty State */}
        {data.jobApps.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="briefcase" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Your PM Pipeline Awaits</Text>
            <Text style={styles.emptyText}>
              Add your first application. Treat your job search like a product — track, iterate, ship.
            </Text>
            <Pressable
              onPress={() => router.push('/modals/addJob')}
              style={styles.emptyBtn}
            >
              <Text style={styles.emptyBtnText}>Add First Application</Text>
            </Pressable>
          </View>
        )}

        {/* Kanban Columns */}
        {STATUS_ORDER.map(s => (
          <KanbanColumn
            key={s}
            status={s}
            jobs={byStatus(s)}
            onUpdate={updateJobApp}
            onDelete={removeJobApp}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 26,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.accentDim,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  summaryBlock: { alignItems: 'center' },
  summaryNum: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'Inter_500Medium',
  },
  interviewAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.goldDim,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  interviewAlertText: {
    flex: 1,
    fontSize: 12,
    color: Colors.gold,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },
  column: { marginBottom: 20 },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  columnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  columnTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  columnCount: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  columnCountText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  jobCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  jobCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  jobActions: { flexDirection: 'row', gap: 8 },
  advanceBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.redDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 17,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  positionName: {
    fontSize: 14,
    color: Colors.textSub,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  jobDate: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  taskOfDay: {
    marginTop: 12,
    backgroundColor: Colors.goldDim,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 12,
    padding: 12,
  },
  todHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  todHeaderText: {
    fontSize: 11,
    color: Colors.gold,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  todText: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: 'Inter_400Regular',
    lineHeight: 19,
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    backgroundColor: Colors.greenDim,
    borderWidth: 1,
    borderColor: Colors.greenBorder,
    borderRadius: 12,
    padding: 12,
  },
  offerBannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.green,
    fontFamily: 'Inter_400Regular',
    lineHeight: 19,
  },
  jobNotes: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  statusStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 21,
  },
  emptyBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 6,
  },
  emptyBtnText: {
    color: Colors.bg,
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
});
