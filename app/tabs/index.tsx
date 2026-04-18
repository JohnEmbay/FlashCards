import { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  X,
  Save,
  BookOpen,
} from "lucide-react-native";

import { useFlashcards } from "@/context/FlashcardContext";
import Colors from "@/constants/colors";
import { Flashcard } from "@/types/flashcard";

export default function MyCardsScreen() {
  const {
    flashcards,
    isLoading,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    toggleLearned,
    getMasteryPercentage,
  } = useFlashcards();

  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTerm, setEditTerm] = useState("");
  const [editDefinition, setEditDefinition] = useState("");

  const handleAddCard = () => {
    if (!term.trim() || !definition.trim()) {
      Alert.alert("Validation Error", "Please fill in both term and definition");
      return;
    }
    addFlashcard({ term, definition });
    setTerm("");
    setDefinition("");
  };

  const startEditing = (card: Flashcard) => {
    setEditingId(card.id);
    setEditTerm(card.term);
    setEditDefinition(card.definition);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTerm("");
    setEditDefinition("");
  };

  const saveEdit = () => {
    if (!editTerm.trim() || !editDefinition.trim()) {
      Alert.alert("Validation Error", "Please fill in both term and definition");
      return;
    }
    if (editingId) {
      updateFlashcard(editingId, { term: editTerm, definition: editDefinition });
      setEditingId(null);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteFlashcard(id),
      },
    ]);
  };

  const masteryPercentage = getMasteryPercentage();

  const renderCard = useCallback(
    ({ item }: { item: Flashcard }) => (
      <View style={styles.cardContainer} testID="flashcard-item">
        {editingId === item.id ? (
          <View style={styles.editCard}>
            <TextInput
              style={styles.editInput}
              value={editTerm}
              onChangeText={setEditTerm}
              placeholder="Term"
              placeholderTextColor={Colors.light.muted}
            />
            <TextInput
              style={styles.editInput}
              value={editDefinition}
              onChangeText={setEditDefinition}
              placeholder="Definition"
              placeholderTextColor={Colors.light.muted}
              multiline
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={cancelEditing}
              >
                <X size={18} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.saveButton]}
                onPress={saveEdit}
              >
                <Save size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTerm}>{item.term}</Text>
                <TouchableOpacity
                  style={styles.learnedBadge}
                  onPress={() => toggleLearned(item.id)}
                >
                  {item.learned ? (
                    <CheckCircle2 size={20} color={Colors.light.success} />
                  ) : (
                    <Circle size={20} color={Colors.light.muted} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.cardDefinition}>{item.definition}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => startEditing(item)}
              >
                <Edit3 size={18} color={Colors.light.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDelete(item.id)}
              >
                <Trash2 size={18} color={Colors.light.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    ),
    [editingId, editTerm, editDefinition]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {/* Mastery Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Mastery</Text>
            <Text style={styles.progressValue}>{masteryPercentage}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${masteryPercentage}%` },
              ]}
            />
          </View>
        </View>

        {/* Add Card Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <BookOpen size={20} color={Colors.light.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={term}
              onChangeText={setTerm}
              placeholder="Enter term (word)"
              placeholderTextColor={Colors.light.muted}
            />
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={definition}
            onChangeText={setDefinition}
            placeholder="Enter definition"
            placeholderTextColor={Colors.light.muted}
            multiline
            numberOfLines={2}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddCard}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add Flashcard</Text>
          </TouchableOpacity>
        </View>

        {/* Cards List */}
        {flashcards.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={64} color={Colors.light.cardBorder} />
            <Text style={styles.emptyTitle}>No flashcards yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first card above to start learning!
            </Text>
          </View>
        ) : (
          <FlatList
            data={flashcards}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  progressContainer: {
    backgroundColor: Colors.light.card,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.light.cardBorder,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.light.success,
    borderRadius: 4,
  },
  formContainer: {
    backgroundColor: Colors.light.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    marginBottom: 12,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    minHeight: 60,
    textAlignVertical: "top",
    paddingTop: 12,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  cardContent: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTerm: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    flex: 1,
    marginRight: 8,
  },
  learnedBadge: {
    padding: 4,
  },
  cardDefinition: {
    fontSize: 14,
    color: Colors.light.muted,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  editCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  editInput: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: Colors.light.muted,
  },
  saveButton: {
    backgroundColor: Colors.light.success,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: "center",
  },
});
