import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Trophy,
  Target,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Brain,
} from "lucide-react-native";

import { useFlashcards } from "@/context/FlashcardContext";
import Colors from "@/constants/colors";

export default function ProgressScreen() {
  const {
    flashcards,
    isLoading,
    getMasteryPercentage,
    getUnlearnedCards,
    resetAllProgress,
  } = useFlashcards();

  const masteryPercentage = getMasteryPercentage();
  const unlearnedCards = getUnlearnedCards();
  const learnedCount = flashcards.filter((card) => card.learned).length;
  const totalCount = flashcards.length;

  const handleReset = () => {
    Alert.alert(
      "Reset Progress",
      "This will mark all cards as unlearned. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => resetAllProgress(),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Trophy size={32} color={Colors.light.primary} />
          </View>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <Text style={styles.headerSubtitle}>
            Track your learning journey
          </Text>
        </View>

        {/* Main Mastery Card */}
        <View style={styles.masteryCard}>
          <View style={styles.masteryCircle}>
            <View style={styles.masteryInner}>
              <Text style={styles.masteryPercent}>{masteryPercentage}%</Text>
              <Text style={styles.masteryLabel}>Mastery</Text>
            </View>
          </View>
          <View style={styles.masteryBarContainer}>
            <View style={styles.masteryBarBackground}>
              <View
                style={[
                  styles.masteryBarFill,
                  { width: `${masteryPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.masteryDescription}>
              {masteryPercentage === 100
                ? "Perfect! You've mastered all cards!"
                : masteryPercentage >= 75
                ? "Great progress! Keep it up!"
                : masteryPercentage >= 50
                ? "You're halfway there!"
                : masteryPercentage > 0
                ? "Just getting started!"
                : "Start studying to see progress"}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View
              style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}
            >
              <BookOpen size={24} color={Colors.light.primaryDark} />
            </View>
            <Text style={styles.statValue}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[styles.statIcon, { backgroundColor: "#D1FAE5" }]}
            >
              <CheckCircle2 size={24} color={Colors.light.success} />
            </View>
            <Text style={styles.statValue}>{learnedCount}</Text>
            <Text style={styles.statLabel}>Learned</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}
            >
              <XCircle size={24} color={Colors.light.error} />
            </View>
            <Text style={styles.statValue}>{unlearnedCards.length}</Text>
            <Text style={styles.statLabel}>To Review</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[styles.statIcon, { backgroundColor: "#DBEAFE" }]}
            >
              <Target size={24} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>
              {totalCount > 0
                ? Math.round((learnedCount / totalCount) * 10)
                : 0}
              /10
            </Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {/* Learning Streak Section */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Brain size={24} color={Colors.light.primary} />
            <Text style={styles.streakTitle}>Study Tip</Text>
          </View>
          <Text style={styles.streakText}>
            Spaced repetition is key to long-term retention. Review cards
            regularly, especially those marked as "Not Learned".
          </Text>
        </View>

        {/* Reset Button */}
        {totalCount > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <RotateCcw size={20} color={Colors.light.error} />
            <Text style={styles.resetButtonText}>Reset All Progress</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.muted,
  },
  masteryCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: "center",
  },
  masteryCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: Colors.light.primary,
  },
  masteryInner: {
    alignItems: "center",
  },
  masteryPercent: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.light.primaryDark,
  },
  masteryLabel: {
    fontSize: 14,
    color: Colors.light.muted,
    fontWeight: "600",
  },
  masteryBarContainer: {
    width: "100%",
  },
  masteryBarBackground: {
    height: 12,
    backgroundColor: Colors.light.cardBorder,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
  },
  masteryBarFill: {
    height: "100%",
    backgroundColor: Colors.light.success,
    borderRadius: 6,
  },
  masteryDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.muted,
    fontWeight: "500",
  },
  streakCard: {
    backgroundColor: Colors.light.navy,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  streakText: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 22,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.error,
  },
});
