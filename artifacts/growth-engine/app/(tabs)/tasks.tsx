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
import { CustomTask } from "@/lib/storage";

const PRIORITY_CONFIG = {
  high: { color: Colors.red, label: 'High', bg: Colors.redDim },
  medium: { color: Colors.gold, label: 'Medium', bg: Colors.goldDim },
  low: { color: Colors.accent, label: 'Low', bg: Colors.accentDim },
};

type FilterType = 'all' | 'active' | 'completed';

function TaskItem({ task, onToggle, onDelete }: {
  task: CustomTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const pc = PRIORITY_CONFIG[task.priority];

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(task.id);
  };

  const handleDelete = () => {
    Alert.alert('Remove Task', `Remove "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onDelete(task.id) },
    ]);
  };

  return (
    <View style={[styles.taskItem, task.completed && styles.taskItemDone]}>
      <Pressable onPress={handleToggle} style={styles.taskCheckArea}>
        <View style={[
          styles.taskCheck,
          task.completed && styles.taskCheckDone,
          { borderColor: task.completed ? Colors.green : pc.color },
        ]}>
          {task.completed && <Feather name="check" size={12} color={Colors.bg} />}
        </View>
      </Pressable>

      <View style={styles.taskContent}>
        <View style={styles.taskTopRow}>
          <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>
            {task.title}
          </Text>
          <View style={[styles.priorityTag, { backgroundColor: pc.bg, borderColor: pc.color + '40' }]}>
            <Text style={[styles.priorityText, { color: pc.color }]}>{pc.label}</Text>
          </View>
        </View>

        {task.description ? (
          <Text style={[styles.taskDesc, task.completed && styles.taskDescDone]}>
            {task.description}
          </Text>
        ) : null}

        {task.category ? (
          <Text style={styles.taskCategory}>{task.category}</Text>
        ) : null}

        <Text style={styles.taskDate}>
          {task.completed && task.completedAt
            ? `Completed ${new Date(task.completedAt).toLocaleDateString()}`
            : `Added ${new Date(task.createdAt).toLocaleDateString()}`}
        </Text>
      </View>

      <Pressable onPress={handleDelete} style={styles.taskDelete}>
        <Feather name="trash-2" size={14} color={Colors.textMuted} />
      </Pressable>
    </View>
  );
}

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const { data, toggleTask, removeTask } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const filtered = data.tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  }).sort((a, b) => {
    const pOrder = { high: 0, medium: 1, low: 2 };
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return pOrder[a.priority] - pOrder[b.priority];
  });

  const total = data.tasks.length;
  const done = data.tasks.filter(t => t.completed).length;
  const progress = total > 0 ? done / total : 0;

  const aiInsight = () => {
    const highPending = data.tasks.filter(t => t.priority === 'high' && !t.completed).length;
    if (highPending > 3) return `${highPending} high-priority tasks pending. Apply the 2-minute rule: if it takes less than 2 minutes, do it now.`;
    if (progress > 0.8) return `Excellent — ${Math.round(progress * 100)}% complete. You're in execution mode. Keep shipping.`;
    if (done === 0) return `Zero tasks completed. Pick the smallest, most impactful task and execute it right now.`;
    return `${done}/${total} tasks done. Focus on high-priority items first — the rest can wait.`;
  };

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
          <Text style={styles.pageTitle}>Task Tracker</Text>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/modals/addTask'); }}
            style={styles.addBtn}
          >
            <Feather name="plus" size={18} color={Colors.accent} />
          </Pressable>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>{done}/{total} Complete</Text>
              <Text style={styles.progressSub}>{Math.round(progress * 100)}% completion rate</Text>
            </View>
            <Text style={[styles.progressPercent, { color: progress >= 0.7 ? Colors.green : progress >= 0.4 ? Colors.gold : Colors.red }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, {
              width: `${progress * 100}%` as any,
              backgroundColor: progress >= 0.7 ? Colors.green : progress >= 0.4 ? Colors.gold : Colors.accent,
            }]} />
          </View>
          {total > 0 && (
            <View style={styles.aiInsightRow}>
              <Feather name="cpu" size={12} color={Colors.accent} />
              <Text style={styles.aiInsightText}>{aiInsight()}</Text>
            </View>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {(['all', 'active', 'completed'] as FilterType[]).map(f => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Empty State */}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>
              {filter === 'completed' ? 'No completed tasks yet' :
               filter === 'active' ? 'All caught up!' :
               'No tasks yet'}
            </Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Add tasks to track your goals, study sessions, and daily objectives.'
                : filter === 'active'
                ? 'All tasks are completed. Add new objectives to stay sharp.'
                : 'Complete your first task to see it here.'}
            </Text>
            {filter !== 'completed' && (
              <Pressable onPress={() => router.push('/modals/addTask')} style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Add Task</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Task List */}
        {filtered.map(t => (
          <TaskItem
            key={t.id}
            task={t}
            onToggle={toggleTask}
            onDelete={removeTask}
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
  progressCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
  },
  progressSub: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  progressPercent: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  aiInsightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: Colors.accentDim,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
  },
  aiInsightText: {
    flex: 1,
    fontSize: 12,
    color: Colors.accent,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: {
    backgroundColor: Colors.accentDim,
    borderColor: Colors.accentBorder,
  },
  filterText: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_500Medium',
  },
  filterTextActive: { color: Colors.accent },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    alignItems: 'flex-start',
    gap: 10,
  },
  taskItemDone: {
    opacity: 0.6,
  },
  taskCheckArea: { paddingTop: 1 },
  taskCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckDone: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  taskContent: { flex: 1 },
  taskTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 21,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  priorityTag: {
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  taskDesc: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
    marginBottom: 4,
  },
  taskDescDone: { color: Colors.textMuted },
  taskCategory: {
    fontSize: 11,
    color: Colors.purple,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  taskDelete: {
    padding: 4,
    paddingTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 19,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 6,
  },
  emptyBtnText: {
    color: Colors.bg,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
});
