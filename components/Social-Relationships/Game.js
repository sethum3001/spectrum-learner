import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator,
  Animated, Easing
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7EFFF',
  },
  gradientBackground: {
    flex: 1,
  },
  scrollViewContainer: {
    marginTop: 50,
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  magicWand: {
    position: 'absolute',
    top: -10,
    right: 20,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  characterImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF3D7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  speechBubbleContainer: {
    position: 'relative',
    maxWidth: width - 60,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#E6D7FF',
  },
  speechTail: {
    position: 'absolute',
    top: -10,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  speechText: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#ABC8A2',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: '#E6D7FF',
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    borderRadius: 15,
    color: '#4A4A4A',
  },
  sendButton: {
    marginLeft: 5,
    padding: 15,
    backgroundColor: '#ABC8A2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButton: {
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  simplifyButton: {
    backgroundColor: '#FFD7E6',
  },
  nextButton: {
    backgroundColor: '#ABC8A2',
  },
  buttonText: {
    color: '#4A4A4A',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  imageSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  imageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginLeft: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: (width - 80) / 2,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scenarioImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
  },
  imageNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 40,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  loaderText: {
    marginTop: 20,
    color: '#4A4A4A',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingIcon: {
    position: 'absolute',
  },
});

const FloatingIcon = ({ icon, color, delay = 0 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    setTimeout(startAnimation, delay);
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.floatingIcon,
        {
          transform: [{ translateY }, { rotate }],
          top: Math.random() * height * 0.6 + 100,
          left: Math.random() * width * 0.8 + 20,
        },
      ]}
    >
      <Ionicons name={icon} size={24} color={color} />
    </Animated.View>
  );
};

const PulseLoader = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <ActivityIndicator size="large" color="#ABC8A2" />
    </Animated.View>
  );
};

const ScenarioGenerator = () => {
  const [input, setInput] = useState('');
  const [scenarioData, setScenarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        'https://social-relationship.up.railway.app/process_scenario?accuracy=0.7&child_id=child_001',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caretaker_input: input,
            current_difficulty: 2,
          }),
        }
      );
      const data = await response.json();
      setScenarioData(data);
    } catch (error) {
      console.error('Error fetching scenario:', error);
      alert('Something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://social-relationship.up.railway.app/visualize_scenario_for_asd',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenario: input }),
        }
      );
      const data = await response.json();
      setScenarioData({ ...scenarioData, steps: data.steps });
    } catch (error) {
      console.error('Error simplifying scenario:', error);
      alert('Failed to simplify. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    router.push({
      pathname: '/(tabs)/SocialRelationships/QuizScreen',
      params: { mcqs: JSON.stringify(scenarioData.mcqs), input }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={['#D7EFFF', '#E6D7FF', '#FFF3D7']}
        style={styles.gradientBackground}
      >
        <View style={styles.floatingElements}>
          <FloatingIcon icon="heart" color="#FFD7E6" delay={0} />
          <FloatingIcon icon="star" color="#FFF3D7" delay={1000} />
          <FloatingIcon icon="happy" color="#ABC8A2" delay={2000} />
          <FloatingIcon icon="sparkles" color="#E6D7FF" delay={3000} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={{ position: 'relative' }}>
              <Text style={styles.title}>🌟 Learning Adventure! 🌟</Text>
              <Animated.View style={styles.magicWand}>
                <MaterialIcons name="auto-fix-high" size={24} color="#FFD7E6" />
              </Animated.View>
            </View>
            <Text style={styles.subtitle}>Let's explore together with pictures and fun!</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.characterContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.characterImageContainer}>
              <Text style={{ fontSize: 40 }}>🤖</Text>
            </View>
            <View style={styles.speechBubbleContainer}>
              <View style={styles.speechTail} />
              <View style={styles.speechBubble}>
                <Text style={styles.speechText}>
                  Hi there! 👋 Tell me about something you want to learn, and I'll create amazing pictures to help you understand it better! ✨
                </Text>
              </View>
            </View>
          </Animated.View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <PulseLoader />
              <Text style={styles.loaderText}>🎨 Creating your magical learning pictures...</Text>
              <Text style={[styles.loaderText, { fontSize: 14, marginTop: 10 }]}>
                This might take a moment! ⏰
              </Text>
            </View>
          ) : scenarioData ? (
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.imageSection}>
                <View style={styles.imageHeader}>
                  <MaterialIcons name="photo-library" size={24} color="#ABC8A2" />
                  <Text style={styles.imageHeaderText}>Your Learning Pictures! 📚</Text>
                </View>
                <View style={styles.imageContainer}>
                  {scenarioData.steps.map((url, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Image source={{ uri: url }} style={styles.scenarioImage} />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.imageNumber}>Step {index + 1}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSimplify}
                style={[styles.actionButton, styles.simplifyButton]}
                disabled={loading}
              >
                <FontAwesome5 name="lightbulb" size={20} color="#4A4A4A" />
                <Text style={styles.buttonText}>Make it Even Easier! 💡</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                style={[styles.actionButton, styles.nextButton]}
                disabled={loading}
              >
                <MaterialIcons name="quiz" size={20} color="#4A4A4A" />
                <Text style={styles.buttonText}>Take the Fun Quiz! 🎯</Text>
                <Ionicons name="arrow-forward" size={20} color="#4A4A4A" />
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.inputSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.inputLabel}>🎭 What would you like to learn about?</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  placeholder="e.g., How to make friends at school 🏫"
                  placeholderTextColor="#999"
                  editable={!loading}
                  multiline
                />
                <TouchableOpacity onPress={handleSubmit} style={styles.sendButton} disabled={loading}>
                  <Ionicons name="send" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default ScenarioGenerator;