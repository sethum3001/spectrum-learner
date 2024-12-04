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

  const handleStartLearning = () => {
    router.push('/(tabs)/SocialReciprocity/preTest');
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