import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LearningCard  from '../../../components/Common/LearningCard'

export default function Home() {
  const learningPaths = [
    {
      title: 'Social Reciprocity',
      icon: 'users' as 'users',
      color: '#FF6B6B',
      description: 'Learn how to interact with others',
      href: '/(tabs)/RepetitiveBehavior'
    },
    {
      title: 'Restricted or Repetitive Behavior and Savantism',
      icon: 'heart' as 'heart',
      color: '#4ECDC4',
      description: 'Build meaningful connections',
      href: '/(tabs)/RepetitiveBehavior'
    },
    {
      title: 'Virtual Assistant',
      icon: 'message-circle' as 'message-circle',
      color: '#45B7D1',
      description: 'Get help when you need it',
      href: '/(tabs)/RepetitiveBehavior'
    },
    {
      title: 'Special Interests & Activities',
      icon: 'star' as 'star',
      color: '#96CEB4',
      description: 'Explore your favorite things',
      href: '/(tabs)/RepetitiveBehavior'
    },
  ];

  return (
    <LinearGradient colors={['#FFFFFF', '#F0F2F5']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello Friend!</Text>
        <Text style={styles.subtitle}>Choose your learning adventure</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {learningPaths.map((path, index) => (
          <LearningCard
            key={index}
            title={path.title}
            icon={path.icon}
            color={path.color}
            href={path.href}
            onPress={() => console.log(`Selected: ${path.title}`)}
          />
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});