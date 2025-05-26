import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator,
  Animated as RNAnimated, Easing, Modal,
  State
} from 'react-native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

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
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
  },
  imageWrapperTwo: {
    width: (width - 80) / 2,
    height: 180,
  },
  imageWrapperFour: {
    width: (width - 90) / 2,
    height: 140,
  },
  scenarioImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  imageNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  zoomIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 6,
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
  zoomModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomImage: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 20,
  },
  zoomHeader: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  zoomTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 10,
  },
  zoomInstructions: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  transitionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(171, 200, 162, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  transitionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

const FloatingIcon = ({ icon, color, delay = 0 }) => {
  const animatedValue = useRef(new RNAnimated.Value(0)).current;
  const rotateValue = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          RNAnimated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      RNAnimated.loop(
        RNAnimated.timing(rotateValue, {
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
    <RNAnimated.View
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
    </RNAnimated.View>
  );
};

const PulseLoader = () => {
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <RNAnimated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <ActivityIndicator size="large" color="#ABC8A2" />
    </RNAnimated.View>
  );
};

const ZoomableImage = ({ uri, index, isSimplified }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: () => {
      runOnJS(setIsZoomed)(true);
    },
    onActive: (event) => {
      scale.value = Math.max(1, Math.min(event.scale, 3));
    },
    onEnd: () => {
      if (scale.value < 1.2) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        runOnJS(setIsZoomed)(false);
      }
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      if (scale.value > 1) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      }
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const resetZoom = () => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    setIsZoomed(false);
  };

  return (
    <PanGestureHandler onGestureEvent={panHandler}>
      <Animated.View>
        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.View style={animatedStyle}>
            <Image source={{ uri }} style={styles.scenarioImage} resizeMode="cover" />
          </Animated.View>
        </PinchGestureHandler>
        {isZoomed && (
          <TouchableOpacity
            style={[styles.closeButton, { position: 'absolute', top: 10, right: 10 }]}
            onPress={resetZoom}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

const ZoomModal = ({ visible, imageUri, imageIndex, onClose }) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      RNAnimated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = Math.max(0.5, Math.min(event.scale, 4));
    },
    onEnd: () => {
      if (scale.value < 0.8) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const resetZoom = () => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <RNAnimated.View style={[styles.zoomModal, { opacity: fadeAnim }]}>
        <View style={styles.zoomHeader}>
          <Text style={styles.zoomTitle}>Step {imageIndex + 1} 🔍</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.zoomContainer}>
          <PanGestureHandler onGestureEvent={panHandler}>
            <Animated.View>
              <PinchGestureHandler onGestureEvent={pinchHandler}>
                <Animated.View style={animatedStyle}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.zoomImage}
                    resizeMode="contain"
                  />
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </View>

        <View style={styles.zoomInstructions}>
          <Text style={styles.instructionText}>🤏 Pinch to zoom in/out</Text>
          <Text style={styles.instructionText}>👆 Drag to move around</Text>
          <TouchableOpacity onPress={resetZoom}>
            <Text style={[styles.instructionText, { backgroundColor: '#ABC8A2' }]}>
              🔄 Reset Zoom
            </Text>
          </TouchableOpacity>
        </View>
      </RNAnimated.View>
    </Modal>
  );
};

const ScenarioGenerator = () => {
  const [input, setInput] = useState('');
  const [scenarioData, setScenarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSimplified, setIsSimplified] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const router = useRouter();

  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;
  const transitionAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
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
    setIsSimplified(false);
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
      console.log('API Response:', data);
      if (data && data.steps && Array.isArray(data.steps)) {
        const initialSteps = data.steps.slice(0, 2);
        setScenarioData({ ...data, steps: initialSteps, allSteps: data.steps });
      } else {
        console.error('Invalid data structure:', data);
        alert('Received invalid data from the server. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching scenario:', error);
      alert('Something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async () => {
    setLoading(true);
    setShowTransition(true);

    RNAnimated.timing(transitionAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

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

      setTimeout(() => {
        const simplifiedSteps = data.steps.slice(0, 4);
        setScenarioData({
          ...scenarioData,
          steps: simplifiedSteps,
          allSteps: data.steps
        });
        setIsSimplified(true);
        setShowTransition(false);

        RNAnimated.timing(transitionAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1500);
    } catch (error) {
      console.error('Error simplifying scenario:', error);
      alert('Failed to simplify. Please try again!');
      setShowTransition(false);
      RNAnimated.timing(transitionAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
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

  const openZoomModal = (imageUri, index) => {
    setSelectedImage({ uri: imageUri, index });
    setZoomModalVisible(true);
  };

  const closeZoomModal = () => {
    setZoomModalVisible(false);
    setSelectedImage(null);
  };

  const getImageWrapperStyle = () => {
    return isSimplified ? styles.imageWrapperFour : styles.imageWrapperTwo;
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
          <RNAnimated.View
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
              <RNAnimated.View style={styles.magicWand}>
                <MaterialIcons name="auto-fix-high" size={24} color="#FFD7E6" />
              </RNAnimated.View>
            </View>
            <Text style={styles.subtitle}>Let's explore together with pictures and fun!</Text>
          </RNAnimated.View>

          <RNAnimated.View
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
                  Hi there! 👋 Tell me about something you want to learn, and I'll teach you how to do it properly! ✨ You can zoom in on any picture to see more details! 🔍
                </Text>
              </View>
            </View>
          </RNAnimated.View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <PulseLoader />
              <Text style={styles.loaderText}>🎨 Creating your magical learning story...</Text>
              <Text style={[styles.loaderText, { fontSize: 14, marginTop: 10 }]}>
                This might take a moment! ⏰
              </Text>
            </View>
          ) : scenarioData ? (
            <RNAnimated.View style={{ opacity: fadeAnim, position: 'relative' }}>
              <View style={styles.imageSection}>
                <View style={styles.imageHeader}>
                  <MaterialIcons name="photo-library" size={24} color="#ABC8A2" />
                  <Text style={styles.imageHeaderText}>
                    Follow me buddy! 📚 {isSimplified ? '(Detailed View)' : '(Quick View)'}
                  </Text>
                </View>

                <View style={styles.imageContainer}>
                  {scenarioData.steps.map((url, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.imageWrapper, getImageWrapperStyle()]}
                      onPress={() => openZoomModal(url, index)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: url }} style={styles.scenarioImage} />
                      <View style={styles.imageOverlay}>
                        <Text style={styles.imageNumber}>Step {index + 1}</Text>
                      </View>
                      <View style={styles.zoomIcon}>
                        <Ionicons name="search" size={16} color="#4A4A4A" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ alignItems: 'center', marginTop: 15 }}>
                  <Text style={{
                    color: '#6B6B6B',
                    fontSize: 14,
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}>
                    💡 Tap any image to zoom in and explore!
                    {!isSimplified && ' Use "Make it Easier" for more detailed steps!'}
                  </Text>
                </View>
              </View>

              {showTransition && (
                <RNAnimated.View
                  style={[
                    styles.transitionOverlay,
                    {
                      opacity: transitionAnim,
                    }
                  ]}
                >
                  <MaterialIcons name="auto-fix-high" size={50} color="#FFFFFF" />
                  <Text style={styles.transitionText}>
                    ✨ Creating more detailed steps for you! ✨
                  </Text>
                </RNAnimated.View>
              )}

              {!isSimplified && (
                <TouchableOpacity
                  onPress={handleSimplify}
                  style={[styles.actionButton, styles.simplifyButton]}
                  disabled={loading}
                >
                  <FontAwesome5 name="lightbulb" size={20} color="#4A4A4A" />
                  <Text style={styles.buttonText}>Make it Even Easier! 💡</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleNext}
                style={[styles.actionButton, styles.nextButton]}
                disabled={loading}
              >
                <MaterialIcons name="quiz" size={20} color="#4A4A4A" />
                <Text style={styles.buttonText}>Take the Fun Quiz! 🎯</Text>
                <Ionicons name="arrow-forward" size={20} color="#4A4A4A" />
              </TouchableOpacity>
            </RNAnimated.View>
          ) : (
            <RNAnimated.View
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
            </RNAnimated.View>
          )}
        </ScrollView>

        <ZoomModal
          visible={zoomModalVisible}
          imageUri={selectedImage?.uri}
          imageIndex={selectedImage?.index}
          onClose={closeZoomModal}
        />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default ScenarioGenerator;