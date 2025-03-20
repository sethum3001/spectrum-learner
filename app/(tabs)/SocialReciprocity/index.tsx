import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function SocialReciprocity() {
  const router = useRouter();
  const bounceAnim = React.useRef(new Animated.Value(0)).current;

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
  }, [bounceAnim]);

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

  const handleStartLearning = async () => {
    // First navigate to loading screen
    router.push('/(tabs)/SocialReciprocity/loading');

    try {
      const requestBody = {
        current_level: 1,
      };

      const response = await fetch(
        'http://social-reciprocity-lp-production.up.railway.app/api/generate_story_and_questions', {
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
      console.log('Data:', data);

      // Store data in localStorage/AsyncStorage first
      if (data.story && data.questions) {
        const parsedQuestions = parseQuestions(data.questions);

        // Save to global state or AsyncStorage here if needed

        // Use setTimeout to ensure clean navigation stack
        setTimeout(() => {
          router.replace({
            pathname: '/(tabs)/SocialReciprocity/preTest',
            params: {
              story: data.story,
              questionsJson: JSON.stringify(parsedQuestions),
            },
          });
        }, 300); // Small delay to ensure navigation completes
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

  return (
    <LinearGradient colors={['#FFFFFF', '#F0F0F0']} style={styles.container}>
      <Image
        source={require('../../../assets/images/cloud1.png')}
        style={styles.cloud1}
      />
      <Image
        source={require('../../../assets/images/cloud2.png')}
        style={styles.cloud2}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Learning Buddies</Text>
        <Text style={styles.subtitle}>Let's learn and be more fun!</Text>
      </View>
      <View style={styles.content}>
        <LottieView
          source={require('../../../assets/animations/kids-playing.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.description}>
          Welcome to Learning Buddies! Are you ready for a fun adventure in making friends and playing together?
        </Text>
        <Animated.View style={[
          styles.buttonContainer,
          {
            transform: [{
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10]
              })
            }]
          }
        ]}>
          <TouchableOpacity style={styles.button} onPress={handleStartLearning}>
            <Text style={styles.buttonText}>Let's Go!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Image
        source={require('../../../assets/images/grass.png')}
        style={styles.grass}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cloud1: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 100,
    height: 60,
  },
  cloud2: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 80,
    height: 50,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF4500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 22,
    color: '#4A4A4A',
    textAlign: 'center',
    marginTop: 10,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grass: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    resizeMode: 'stretch',
  },
});