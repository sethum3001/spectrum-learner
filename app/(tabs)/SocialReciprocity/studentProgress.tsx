import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface LearningPathItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
}

const LearningPathItem: React.FC<LearningPathItemProps> = ({ icon, text, color }) => (
  <View style={[styles.learningPathItem, { backgroundColor: color }]}>
    <Ionicons name={icon} size={24} color="#FFFFFF" />
    <Text style={styles.learningPathText}>{text}</Text>
  </View>
);

export default function StudentProgressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [bounceAnim] = React.useState(new Animated.Value(0));

  const newLevel = params.newLevel || 1; // Default to level 1 if no level is passed


  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const bouncingStyle = {
    transform: [
      {
        translateY: bounceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 10],
        }),
      },
    ],
  };

  function parseQuestions(questionsStr: string) {
    const lines = questionsStr.split('\n').filter(line => line.trim().length > 0);
    const questions = [];
    let currentQuestion: { question: string; options: string[]; correctAnswer: number | null } | null = null;
  
    for (const line of lines) {
      if (/^\d+\./.test(line)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        const questionText = line.replace(/^\d+\.\s*/, '').trim();
        currentQuestion = {
          question: questionText,
          options: [],
          correctAnswer: null,
        };
      } else if (/^[A-D]\./.test(line)) {
        const optionText = line.replace(/^[A-D]\.\s*/, '').trim();
        if (currentQuestion) {
          currentQuestion.options.push(optionText);
        }
      } else if (line.startsWith('Correct Answer:')) {
        const answerLetter = line.replace('Correct Answer:', '').trim();
        const answerIndex = answerLetter.charCodeAt(0) - 'A'.charCodeAt(0);
        if (currentQuestion) {
          currentQuestion.correctAnswer = answerIndex;
        }
      }
    }
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    return questions;
  }

  const handleContinueLearning = async () => {
    // Navigate to the loading screen first
    router.push('/(tabs)/SocialReciprocity/loading');

    try {
      const requestBody = {
        current_level: newLevel, // Use the current level from params
      };

      const response = await fetch(
        'http://social-reciprocity-lp-production.up.railway.app/api/generate_story_and_questions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }

      const data = await response.json();

      // Check if the response contains the story and questions
      if (data.story && data.questions) {
        const parsedQuestions = parseQuestions(data.questions);

        // Navigate to the PreTest screen with the new story and questions
        setTimeout(() => {
          router.replace({
            pathname: '/(tabs)/SocialReciprocity/preTest',
            params: {
              story: data.story,
              questionsJson: JSON.stringify(parsedQuestions),
            },
          });
        }, 300); // Small delay to ensure smooth navigation
      } else {
        console.error('Incomplete data from the server:', data);
        setTimeout(() => {
          router.replace('/(tabs)/SocialReciprocity');
        }, 300);
      }
    } catch (error) {
      console.error('Error:', error);
      setTimeout(() => {
        router.replace('/(tabs)/SocialReciprocity');
      }, 300);
    }
  };

  const handleGoToProfile = () => {
    router.push('/(tabs)/Home/profile');
  };

  return (
    <LinearGradient
      colors={['#ABC8A2', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.Image
          source={require('../../../assets/images/student-avatar.png')}
          style={[styles.avatar, bouncingStyle]}
        />
        <Text style={styles.welcomeText}>Amazing Work, Superstar!</Text>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Current Level:</Text>
          <Text style={styles.levelNumber}>{newLevel}</Text>
        </View>
        <Text style={styles.encouragementText}>
          You're doing an awesome job on your learning journey!
        </Text>

        <View style={styles.learningPathContainer}>
          <Text style={styles.learningPathTitle}>Your Learning Journey:</Text>
          <LearningPathItem
            icon="happy-outline"
            text="Social Skills"
            color="#FF9800"
          />
          <LearningPathItem
            icon="people-outline"
            text="Friendship Building"
            color="#4CAF50"
          />
          <LearningPathItem
            icon="bulb-outline"
            text="Problem Solving"
            color="#2196F3"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.continueButton]}
            onPress={handleContinueLearning}
          >
            <Text style={styles.actionButtonText}>Continue Learning</Text>
            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.profileButton]}
            onPress={handleGoToProfile}
          >
            <Text style={styles.actionButtonText}>Go Back to Profile</Text>
            <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A2417',
  },
  encouragementText: {
    fontSize: 18,
    color: '#1A2417',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  learningPathContainer: {
    width: '100%',
    marginBottom: 20,
  },
  learningPathTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  learningPathItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  learningPathText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 10,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
  },
  profileButton: {
    backgroundColor: '#FF5722',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
});