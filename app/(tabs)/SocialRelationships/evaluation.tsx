import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for a quiz attempt
type QuizAttempt = {
  date: string;
  score: number;
  total: number;
};

const Evaluation = () => {
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    const loadQuizAttempts = async () => {
      try {
        const storedAttempts = await AsyncStorage.getItem('quizAttempts');
        if (storedAttempts) {
          setQuizAttempts(JSON.parse(storedAttempts) as QuizAttempt[]);
        }
      } catch (error) {
        console.error("Error loading quiz attempts:", error);
      }
    };

    loadQuizAttempts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quiz Attempts History</Text>
      {quizAttempts.length === 0 ? (
        <Text style={styles.noAttempts}>No attempts recorded yet.</Text>
      ) : (
        <FlatList
          data={quizAttempts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.attemptItem}>
              <Text>Date: {item.date}</Text>
              <Text>Score: {item.score} / {item.total}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  noAttempts: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
  attemptItem: { padding: 10, backgroundColor: '#e9ecef', marginVertical: 5, borderRadius: 5 }
});

export default Evaluation;
