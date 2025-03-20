import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import LearningCard from '@/components/Common/LearningCard';

export default function Home() {
  const learningPaths: {
    title: string;
    icon: 'users' | 'refresh-cw' | 'message-circle' | 'star';
    color: string;
    description: string;
    href: string;
  }[] = [
    {
      title: 'Social Reciprocity',
      icon: 'users',
      color: '#E6D7FF', // Pastel purple
      description: 'Learn how to make friends and share!',
      href: '/(tabs)/SocialReciprocity',
    },
    {
      title: 'Restricted or Repetitive Behavior',
      icon: 'refresh-cw',
      color: '#D7EFFF', // Pastel blue
      description: 'Discover your special talents!',
      href: '/(tabs)/RepetitiveBehavior',
    },
    {
      title: 'Virtual Assistant',
      icon: 'message-circle',
      color: '#FFF3D7', // Pastel yellow
      description: 'Get help from your friendly assistant!',
      href: '/(tabs)/VirtualAssistant',
    },
    {
      title: 'Special Interests',
      icon: 'star',
      color: '#FFD7E6', // Pastel pink
      description: 'Explore your favorite things!',
      href: '/(tabs)/SocialRelationships',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#ABC8A2', '#FFFFFF']} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.greetingText}>Hello, Little Learner!</Text>
          <View style={styles.profileIconContainer}>
            <Feather name="user" size={30} color="white" />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Pick a Fun Learning Path!</Text>
          <View style={styles.grid}>
            {learningPaths.map((path, index) => (
              <View style={styles.cardContainer} key={index}>
                <LearningCard
                  title={path.title}
                  icon={path.icon}
                  color={path.color}
                  href={path.href}
                  description={path.description}
                  onPress={() => console.log(`Selected: ${path.title}`)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  greetingText: {
    color: '#2E2E5D', // Dark purple for contrast
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileIconContainer: {
    backgroundColor: '#2E2E5D',
    borderRadius: 20,
    padding: 5,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    color: '#2E2E5D',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardContainer: {
    width: '48%',
    marginBottom: 20,
  },
});