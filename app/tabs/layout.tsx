import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flashcard, FlashcardFormData } from '@/types/flashcard';

interface FlashcardContextType {
  flashcards: Flashcard[];
  isLoading: boolean;
  addFlashcard: (data: FlashcardFormData) => void;
  updateFlashcard: (id: number, data: FlashcardFormData) => void;
  deleteFlashcard: (id: number) => void;
  toggleLearned: (id: number) => void;
  markAsLearned: (id: number) => void;
  markAsNotLearned: (id: number) => void;
  getMasteryPercentage: () => number;
  shuffleFlashcards: () => Flashcard[];
  getUnlearnedCards: () => Flashcard[];
  resetAllProgress: () => void;
}

const STORAGE_KEY = '@flashcards_data';

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function FlashcardProvider({ children }: { children: ReactNode }) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveFlashcards();
    }
  }, [flashcards]);

  const loadFlashcards = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFlashcards(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFlashcards = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
    } catch (error) {
      console.error('Failed to save flashcards:', error);
    }
  };

  const addFlashcard = (data: FlashcardFormData) => {
    const newCard: Flashcard = {
      id: Date.now(),
      term: data.term.trim(),
      definition: data.definition.trim(),
      learned: false,
      createdAt: Date.now(),
    };
    setFlashcards((prev) => [newCard, ...prev]);
  };

  const updateFlashcard = (id: number, data: FlashcardFormData) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === id
          ? { ...card, term: data.term.trim(), definition: data.definition.trim() }
          : card
      )
    );
  };

  const deleteFlashcard = (id: number) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== id));
  };

  const toggleLearned = (id: number) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, learned: !card.learned } : card
      )
    );
  };

  const markAsLearned = (id: number) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, learned: true } : card
      )
    );
  };

  const markAsNotLearned = (id: number) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, learned: false } : card
      )
    );
  };

  const getMasteryPercentage = () => {
    if (flashcards.length === 0) return 0;
    const learnedCount = flashcards.filter((card) => card.learned).length;
    return Math.round((learnedCount / flashcards.length) * 100);
  };

  const shuffleFlashcards = () => {
    return fisherYatesShuffle(flashcards);
  };

  const getUnlearnedCards = () => {
    return flashcards.filter((card) => !card.learned);
  };

  const resetAllProgress = () => {
    setFlashcards((prev) =>
      prev.map((card) => ({ ...card, learned: false }))
    );
  };

  return (
    <FlashcardContext.Provider
      value={{
        flashcards,
        isLoading,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        toggleLearned,
        markAsLearned,
        markAsNotLearned,
        getMasteryPercentage,
        shuffleFlashcards,
        getUnlearnedCards,
        resetAllProgress,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
}
