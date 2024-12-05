import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WordJumble() {
  const router = useRouter();
  const words = [
    'Story', 'Theme', 'Character', 'Fantasy', 'Plot', 'Setting',
    'Conflict', 'Resolution', 'Protagonist', 'Antagonist', 'Dialogue',
    'Narrative', 'Genre', 'Climax', 'Foreshadowing', 'Symbolism',
    'Metaphor', 'Irony', 'Suspense', 'Mystery', 'Adventure'
  ];

  const [jumbledWords, setJumbledWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    setJumbledWords(shuffleArray([...words]));
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const toggleWordSelection = (word) => {
    setSelectedWords(prev => 
      prev.includes(word)
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  const handleContinue = () => {
    setGameCompleted(true);
  };

  const handleFinish = () => {
    router.push('/(tabs)/RepetitiveBehavior/game');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Let's get started :)</Text>
        {!gameCompleted ? (
          <>
            <View style={styles.wordGrid}>
              {jumbledWords.map((word, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.wordButton,
                    selectedWords.includes(word) && styles.selectedWordButton
                  ]}
                  onPress={() => toggleWordSelection(word)}
                >
                  <Text style={[
                    styles.wordButtonText,
                    selectedWords.includes(word) && styles.selectedWordButtonText
                  ]}>
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.selectedWordsContainer}>
              <Text style={styles.selectedWordsTitle}>Selected Words:</Text>
              <View style={styles.selectedWordsList}>
                {selectedWords.map((word, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.selectedWordChip}
                    onPress={() => toggleWordSelection(word)}
                  >
                    <Text style={styles.selectedWordChipText}>{word}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.continueButton, selectedWords.length === 0 && styles.disabledButton]}
              onPress={handleContinue}
              disabled={selectedWords.length === 0}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.completionContainer}>
            <Text style={styles.completionText}>Great job! You selected:</Text>
            {selectedWords.map((word, index) => (
              <Text key={index} style={styles.selectedWord}>{word}</Text>
            ))}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Ionicons name="checkmark-circle" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100, // Extra padding at the bottom to account for the floating button
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wordButton: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedWordButton: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  wordButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedWordButtonText: {
    color: '#fff',
  },
  selectedWordsContainer: {
    marginBottom: 20,
  },
  selectedWordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  selectedWordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedWordChip: {
    backgroundColor: '#e0e7ff',
    padding: 8,
    margin: 4,
    borderRadius: 16,
  },
  selectedWordChipText: {
    color: '#2563eb',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#4ECDC4',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#a0aec0',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completionContainer: {
    marginTop: 20,
  },
  completionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  selectedWord: {
    fontSize: 16,
    color: '#4ECDC4',
    marginBottom: 5,
  },
  finishButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2ECC71',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});