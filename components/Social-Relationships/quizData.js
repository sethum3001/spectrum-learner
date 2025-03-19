import AsyncStorage from '@react-native-async-storage/async-storage';

let attempts = 0;
let scores = [];

// Load stored attempts and scores from AsyncStorage
export const loadAttempts = async () => {
  try {
    const storedAttempts = await AsyncStorage.getItem('quizAttempts');
    if (storedAttempts) {
      const parsedAttempts = JSON.parse(storedAttempts);
      attempts = parsedAttempts.length;
      scores = parsedAttempts;
    }
  } catch (error) {
    console.error('Error loading attempts:', error);
  }
};

// Save a new quiz attempt
export const saveAttempt = async (score, total) => {
  try {
    const newAttempt = {
      date: new Date().toLocaleString(),
      score: score,
      total: total,
    };

    scores.push(newAttempt);
    attempts = scores.length;

    await AsyncStorage.setItem('quizAttempts', JSON.stringify(scores));
  } catch (error) {
    console.error('Error saving attempt:', error);
  }
};

// Get total number of attempts
export const getAttempts = () => attempts;

// Get all stored scores
export const getScores = () => scores;
