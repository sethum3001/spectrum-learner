import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import LearningCard from '@/components/Common/LearningCard';

export default function Home() {
  const learningPaths = [
    {
      title: 'Social Reciprocity',
      icon: 'users' as 'users',
      color: '#FF3B3B',
      description: 'Learn how to make friends and share!',
      href: '/(tabs)/SocialReciprocity',
    },
    {
      title: 'Restricted or Repetitive Behavior and Savantism',
      icon: 'heart' as 'heart',
      color: '#2ECC71',
      description: 'Discover your special talents!',
      href: '/(tabs)/RepetitiveBehavior',
    },
    {
      title: 'Virtual Assistant',
      icon: 'message-circle' as 'message-circle',
      color: '#3498DB',
      description: 'Get help from your friendly assistant!',
      href: '/(tabs)/RepetitiveBehavior',
    },
    {
      title: 'Special Interests & Activities',
      icon: 'star' as 'star',
      color: '#F1C40F',
      description: 'Explore your favorite things!',
      href: '/(tabs)/SocialRelationships',
    },
  ];

  const fadeAnim = new Animated.Value(0);
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,  
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#ABC8A2', '#FFFFFF']} style={styles.container}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <Feather name="smile" size={40} color="#333333" style={{ marginRight: 10 }} />
            <Text style={styles.welcomeText}>Hi There!</Text>
          </View>
          <Text style={styles.subtitle}>Pick a fun activity to start learning!</Text>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Let’s Learn!</Text>
          </View>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {learningPaths.map((path, index) => (
            <LearningCard
              key={index}
              title={path.title}
              icon={path.icon}
              color={path.color}
              description={path.description}
              href={path.href}
              onPress={() => console.log(`Selected: ${path.title}`)}
            />
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center', 
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 24,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  banner: {
    backgroundColor: '#ABC8A2', 
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});