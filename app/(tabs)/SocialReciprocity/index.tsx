import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SocialReciprocity() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push('/(tabs)/SocialReciprocity/PreTest');
  };

  return (
    <LinearGradient colors={['#FF6B6B', '#FFD93D']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Social Reciprocity</Text>
        <Text style={styles.subtitle}>Learn how to interact with others</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          Welcome to the Social Reciprocity learning path! Here, you'll learn how to interact with others in a fun and engaging way.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleStartLearning}>
          <Text style={styles.buttonText}>Start Learning</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  description: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});