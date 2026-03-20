import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { getBounceBackStrategy } from "@/lib/aiEngine";

export default function BounceBackModal() {
  const insets = useSafeAreaInsets();
  const { reason } = useLocalSearchParams<{ reason: string }>();
  const strategy = getBounceBackStrategy(reason || '');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={20} color={Colors.textSub} />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={styles.aiTag}>
            <Feather name="cpu" size={12} color={Colors.accent} />
            <Text style={styles.aiTagText}>AI Bounce-Back Strategy</Text>
          </View>
          <Text style={styles.headerTitle}>{strategy.title}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {reason && (
          <View style={styles.reasonCard}>
            <Feather name="alert-circle" size={14} color={Colors.red} />
            <Text style={styles.reasonText}>Missed because: <Text style={{ color: Colors.text }}>{reason}</Text></Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Your Recovery Protocol</Text>

        {strategy.steps.map((step, i) => (
          <View key={i} style={styles.stepCard}>
            <View style={styles.stepNumWrap}>
              <Text style={styles.stepNum}>{i + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          </View>
        ))}

        <View style={styles.stoicCard}>
          <View style={styles.stoicHeader}>
            <Feather name="book-open" size={14} color={Colors.gold} />
            <Text style={styles.stoicLabel}>Stoic Principle</Text>
          </View>
          <Text style={styles.stoicText}>{strategy.stoicPrinciple}</Text>
        </View>

        <View style={styles.commitCard}>
          <Text style={styles.commitTitle}>The Mission</Text>
          <Text style={styles.commitText}>
            Missing one day doesn't break a habit — it's your response to missing it that does.
            Execute step 1 of your protocol right now, before you close this screen.
          </Text>
        </View>

        <Pressable onPress={() => router.back()} style={styles.doneBtn}>
          <Feather name="check" size={16} color={Colors.bg} />
          <Text style={styles.doneBtnText}>I Commit to the Strategy</Text>
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
    marginBottom: 12,
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
    fontSize: 22,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.redDim,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.red + '30',
  },
  reasonText: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  stepCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    alignItems: 'flex-start',
  },
  stepNumWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accentDim,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNum: {
    fontSize: 13,
    color: Colors.accent,
    fontFamily: 'Inter_700Bold',
  },
  stepContent: { flex: 1 },
  stepText: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'Inter_400Regular',
    lineHeight: 21,
  },
  stoicCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  stoicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  stoicLabel: {
    fontSize: 11,
    color: Colors.gold,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stoicText: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  commitCard: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  commitTitle: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  commitText: {
    fontSize: 13,
    color: Colors.textSub,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
  },
  doneBtnText: {
    color: Colors.bg,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
