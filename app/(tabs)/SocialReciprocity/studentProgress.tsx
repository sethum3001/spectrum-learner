import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  const [bounceAnim] = React.useState(new Animated.Value(0));

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

  const handleContinue = () => {
    router.push('/(tabs)/Home');
  };

  return (
    <LinearGradient
      colors={['#FFF9C4', '#FFECB3', '#FFE0B2']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.Image
          source={require('../../../assets/images/student-avatar.png')}
          style={[styles.avatar, bouncingStyle]}
        />
        <Text style={styles.welcomeText}>Great job, Superstar!</Text>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Current Level:</Text>
          <Text style={styles.levelNumber}>3</Text>
        </View>
        <Text style={styles.encouragementText}>
          You're making amazing progress on your learning adventure!
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

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue Learning</Text>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 10,
    textAlign: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginRight: 10,
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  encouragementText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  learningPathContainer: {
    width: '100%',
    marginBottom: 20,
  },
  learningPathTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 10,
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
  continueButton: {
    backgroundColor: '#FF5722',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
});

