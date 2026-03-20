import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { generateProductivityAudit, AuditReport } from "@/lib/aiEngine";

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const color = score >= 80 ? Colors.green : score >= 60 ? Colors.gold : score >= 40 ? Colors.orange : Colors.red;
  return (
    <View style={styles.gaugeWrap}>
      <View style={[styles.gaugeBg, { borderColor: color + '30' }]}>
        <View style={[styles.gaugeInner, { borderColor: color }]}>
          <Text style={[styles.gaugeScore, { color }]}>{score}</Text>
          <Text style={styles.gaugeLabel}>/ 100</Text>
        </View>
      </View>
      <View style={[styles.gradeBadge, { backgroundColor: color + '20', borderColor: color + '50' }]}>
        <Text style={[styles.gradeText, { color }]}>{grade}</Text>
      </View>
    </View>
  );
}

function ReportSection({ title, icon, color, items }: {
  title: string; icon: string; color: string; items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Feather name={icon as any} size={14} color={color} />
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={[styles.sectionItem, { borderLeftColor: color }]}>
          <Text style={styles.sectionItemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function AuditModal() {
  const insets = useSafeAreaInsets();
  const { data, saveAuditReport } = useApp();
  const [report, setReport] = useState<AuditReport | null>(data.lastAuditReport);
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const runAudit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const result = generateProductivityAudit({
      badmintonLogs: data.badmintonLogs,
      smokeFreeStart: data.smokeFreeStart,
      jobApps: data.jobApps.map(j => ({ company: j.company, status: j.status, date: j.date })),
      tasks: data.tasks.map(t => ({ title: t.title, completed: t.completed, createdAt: t.createdAt })),
    });
    setReport(result);
    await saveAuditReport(result);
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={20} color={Colors.textSub} />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.aiTag}>
            <Feather name="cpu" size={12} color={Colors.accent} />
            <Text style={styles.aiTagText}>AI Quality Auditor</Text>
          </View>
          <Text style={styles.headerTitle}>Productivity Health Report</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {!report && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Feather name="cpu" size={40} color={Colors.accent} />
            </View>
            <Text style={styles.emptyTitle}>Life System Audit</Text>
            <Text style={styles.emptyText}>
              The AI scans your habit logs, cessation data, job pipeline, and tasks to generate a "Productivity Health Score" and identify bugs in your routine.
            </Text>
            <View style={styles.dataScan}>
              <Text style={styles.dataScanLabel}>Data sources:</Text>
              <Text style={styles.dataScanItem}>Badminton logs: {data.badmintonLogs.length} entries</Text>
              <Text style={styles.dataScanItem}>Smoke-free: {data.smokeFreeStart ? 'Tracking' : 'Not set'}</Text>
              <Text style={styles.dataScanItem}>Job apps: {data.jobApps.length} entries</Text>
              <Text style={styles.dataScanItem}>Tasks: {data.tasks.length} entries</Text>
            </View>
          </View>
        )}

        {loading && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingTitle}>Analyzing your life system...</Text>
            <Text style={styles.loadingText}>Scanning habit patterns, cessation metrics, career pipeline...</Text>
          </View>
        )}

        {report && !loading && (
          <>
            <ScoreGauge score={report.score} grade={report.grade} />

            <View style={styles.summaryCard}>
              <Feather name="cpu" size={14} color={Colors.accent} />
              <Text style={styles.summaryText}>{report.summary}</Text>
            </View>

            <ReportSection
              title="System Strengths"
              icon="check-circle"
              color={Colors.green}
              items={report.strengths}
            />

            <ReportSection
              title="Routine Bugs Found"
              icon="alert-triangle"
              color={Colors.red}
              items={report.bugs}
            />

            <ReportSection
              title="Recommended Patches"
              icon="tool"
              color={Colors.gold}
              items={report.patches}
            />

            {data.lastAuditDate && (
              <Text style={styles.auditDate}>
                Last audit: {new Date(data.lastAuditDate).toLocaleString()}
              </Text>
            )}
          </>
        )}

        <Pressable onPress={runAudit} disabled={loading} style={styles.runBtn}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.bg} />
          ) : (
            <>
              <Feather name="cpu" size={16} color={Colors.bg} />
              <Text style={styles.runBtnText}>{report ? 'Re-run Audit' : 'Generate Report'}</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  headerContent: { gap: 6 },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentDim,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
  },
  aiTagText: {
    fontSize: 11,
    color: Colors.accent,
    fontFamily: 'Inter_600SemiBold',
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },

  emptyState: { alignItems: 'center', gap: 12, marginBottom: 24 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentDim,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 22,
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
  dataScan: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    gap: 4,
  },
  dataScanLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  dataScanItem: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
  },

  loadingState: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: 40,
  },
  loadingTitle: {
    fontSize: 18,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 19,
  },

  gaugeWrap: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  gaugeBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
  },
  gaugeScore: {
    fontSize: 40,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -2,
  },
  gaugeLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: 'Inter_500Medium',
  },
  gradeBadge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  gradeText: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.accentDim,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
  },
  summaryText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'Inter_400Regular',
    lineHeight: 21,
  },

  section: { marginBottom: 18 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionItem: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 6,
    marginBottom: 6,
  },
  sectionItemText: {
    fontSize: 14,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },

  auditDate: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 16,
  },

  runBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  runBtnText: {
    color: Colors.bg,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
