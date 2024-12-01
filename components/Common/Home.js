import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

const LearningPath = ({ title, color, href }) => (
  <Link href={href} asChild>
    <Pressable style={[styles.rectangle, { backgroundColor: color }]}>
      <Text style={styles.rectangleText}>{title}</Text>
    </Pressable>
  </Link>
);

const Home =()=> {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Specturm Learner</Text>
      <Text style={styles.subtitle}>Choose your learning path:</Text>
      <View style={styles.grid}>
        <LearningPath 
          title="Social Repository" 
          color="#FFB3BA" 
          href="/(tabs)/SocialReciportary"
        />
        <LearningPath 
          title="Communication Skills" 
          color="#BAFFC9" 
          href="/learning/communication"
        />
        <LearningPath 
          title="Emotional Intelligence" 
          color="#BAE1FF" 
          href="/learning/emotional-intelligence"
        />
        <LearningPath 
          title="Social Etiquette" 
          color="#FFFFBA" 
          href="/learning/social-etiquette"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F4F8',
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    letterSpacing: 0.3,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 10,
  },
  rectangle: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    position: 'relative',
    overflow: 'hidden',
  },
  rectangleText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    padding: 10,
    letterSpacing: 0.5,
  },
});

export default Home;    