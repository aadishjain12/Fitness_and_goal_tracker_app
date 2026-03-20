import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
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
import { CustomTask } from "@/lib/storage";

const PRIORITY_OPTIONS: { value: CustomTask['priority']; label: string; color: string; desc: string }[] = [
  { value: 'high', label: 'High', color: Colors.red, desc: 'Do today' },
  { value: 'medium', label: 'Medium', color: Colors.gold, desc: 'This week' },
  { value: 'low', label: 'Low', color: Colors.accent, desc: 'Someday' },
];

const CATEGORY_SUGGESTIONS = ['PM Study', 'Exercise', 'Career', 'Health', 'Personal', 'Learning', 'Admin'];

export default function AddTaskModal() {
  const insets = useSafeAreaInsets();
  const { addTask } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CustomTask['priority']>('medium');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const onSave = async () => {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    await addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category: category.trim() || undefined,
    });
    setLoading(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={20} color={Colors.textSub} />
        </Pressable>
        <Text style={styles.headerTitle}>New Task</Text>
        <Text style={styles.headerSub}>Track your objectives</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Read PM book chapter, Apply to 3 roles..."
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          autoFocus
        />

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Additional context or notes..."
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, styles.inputMultiline]}
          multiline
          numberOfLines={2}
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityGrid}>
          {PRIORITY_OPTIONS.map(p => (
            <Pressable
              key={p.value}
              onPress={() => setPriority(p.value)}
              style={[
                styles.priorityOption,
                priority === p.value && { borderColor: p.color, backgroundColor: p.color + '15' },
              ]}
            >
              <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
              <View>
                <Text style={[styles.priorityLabel, priority === p.value && { color: p.color }]}>
                  {p.label}
                </Text>
                <Text style={styles.priorityDesc}>{p.desc}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Category (Optional)</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Career, Health, Learning..."
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />
        <View style={styles.categoryChips}>
          {CATEGORY_SUGGESTIONS.map(cat => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.catChip, category === cat && styles.catChipActive]}
            >
              <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={onSave}
          disabled={!title.trim() || loading}
          style={[styles.saveBtn, !title.trim() && styles.saveBtnDisabled]}
        >
          <Feather name="plus" size={16} color={Colors.bg} />
          <Text style={styles.saveBtnText}>Add Task</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 4,
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
  headerSub: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  label: {
    fontSize: 12,
    color: Colors.textSub,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    marginBottom: 18,
  },
  inputMultiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  priorityGrid: {
    gap: 8,
    marginBottom: 18,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    backgroundColor: Colors.bgCard,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  priorityLabel: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  priorityDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
    marginTop: -10,
  },
  catChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.bgCard,
  },
  catChipActive: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleDim,
  },
  catChipText: {
    fontSize: 12,
    color: Colors.textSub,
    fontFamily: 'Inter_500Medium',
  },
  catChipTextActive: { color: Colors.purple },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: {
    color: Colors.bg,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
