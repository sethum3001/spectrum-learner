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
        console.log('Stored attempts from AsyncStorage:', storedAttempts);

        if (storedAttempts) {
          const parsedAttempts = JSON.parse(storedAttempts) as QuizAttempt[];
          console.log('Parsed attempts:', parsedAttempts);
          setQuizAttempts(parsedAttempts);
        } else {
          console.log('No quiz attempts found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error loading quiz attempts:', error);
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
              <Text style={styles.attemptDate}>Date: {item.date}</Text>
              <Text style={styles.attemptScore}>Score: {item.score} / {item.total}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', marginTop: 50 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  noAttempts: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
  attemptItem: { padding: 10, backgroundColor: '#e9ecef', marginVertical: 5, borderRadius: 5 },
  attemptDate: { fontSize: 16, fontWeight: 'bold' },
  attemptScore: { fontSize: 16, color: '#333' },
});

export default Evaluation;