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
import { JobApp } from "@/lib/storage";

const STATUS_OPTIONS: { value: JobApp['status']; label: string; color: string }[] = [
  { value: 'applied', label: 'Applied', color: Colors.accent },
  { value: 'interview', label: 'Interview', color: Colors.gold },
  { value: 'offer', label: 'Offer', color: Colors.green },
  { value: 'rejected', label: 'Rejected', color: Colors.red },
];

export default function AddJobModal() {
  const insets = useSafeAreaInsets();
  const { addJobApp } = useApp();
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<JobApp['status']>('applied');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const onSave = async () => {
    if (!company.trim() || !position.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    await addJobApp({ company: company.trim(), position: position.trim(), status, notes: notes.trim() || undefined });
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
        <Text style={styles.headerTitle}>Add Application</Text>
        <Text style={styles.headerSub}>Track your PM pipeline</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Company</Text>
        <TextInput
          value={company}
          onChangeText={setCompany}
          placeholder="e.g. Google, Notion, Figma"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Position / Role</Text>
        <TextInput
          value={position}
          onChangeText={setPosition}
          placeholder="e.g. Product Manager, APM"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Current Status</Text>
        <View style={styles.statusGrid}>
          {STATUS_OPTIONS.map(s => (
            <Pressable
              key={s.value}
              onPress={() => setStatus(s.value)}
              style={[
                styles.statusOption,
                status === s.value && { borderColor: s.color, backgroundColor: s.color + '15' },
              ]}
            >
              <Text style={[styles.statusOptionText, status === s.value && { color: s.color }]}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Referral from John, specific round details..."
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, styles.inputMultiline]}
          multiline
          numberOfLines={3}
        />

        <View style={styles.aiTip}>
          <Feather name="cpu" size={13} color={Colors.accent} />
          <Text style={styles.aiTipText}>
            Once in "Interview" status, the AI will generate a daily prep task specific to this company.
          </Text>
        </View>

        <Pressable
          onPress={onSave}
          disabled={!company.trim() || !position.trim() || loading}
          style={[styles.saveBtn, (!company.trim() || !position.trim()) && styles.saveBtnDisabled]}
        >
          <Feather name="plus" size={16} color={Colors.bg} />
          <Text style={styles.saveBtnText}>Add to Pipeline</Text>
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
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_600SemiBold',
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  statusOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.bgCard,
  },
  statusOptionText: {
    fontSize: 14,
    color: Colors.textSub,
    fontFamily: 'Inter_600SemiBold',
  },
  aiTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.accentDim,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
  },
  aiTipText: {
    flex: 1,
    fontSize: 12,
    color: Colors.accent,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
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
