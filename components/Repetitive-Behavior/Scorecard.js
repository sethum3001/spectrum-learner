import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const attemptData = [
  { attemptNo: 1, date: '2023-05-01', stagesProgressed: 3, score: 75 },
  { attemptNo: 2, date: '2023-05-03', stagesProgressed: 4, score: 82 },
  { attemptNo: 3, date: '2023-05-05', stagesProgressed: 5, score: 90 },
  { attemptNo: 4, date: '2023-05-07', stagesProgressed: 5, score: 95 },
];

const SocialReportaryIndex = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Creative Writing Progress</Text>
      <View style={styles.cardContainer}>
        {attemptData.map((attempt) => (
          <View key={attempt.attemptNo} style={styles.card}>
            <Text style={styles.cardText}>Attempt No: {attempt.attemptNo}</Text>
            <Text style={styles.cardText}>Date: {attempt.date}</Text>
            <Text style={styles.cardText}>Stages Progressed: {attempt.stagesProgressed}</Text>
            <Text style={styles.cardText}>Score: {attempt.score}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4ECDC4', // Updated color
  },
  cardContainer: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#4ECDC4', // Updated color
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: 'white', // Updated color
  },
});

export default SocialReportaryIndex;