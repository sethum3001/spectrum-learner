import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function Help() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Help & Support</Text>

        <Text style={styles.introText}>
          Welcome to the Help Page! Find answers to common questions about using the app to support your child’s learning.
        </Text>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What does this app do?</Text>
            <Text style={styles.faqAnswer}>
              This app offers learning paths to help kids with Autism Spectrum Disorder (ASD) build skills like communication, social interaction, and focus through fun activities.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I start using the app?</Text>
            <Text style={styles.faqAnswer}>
              Log in, then pick a learning path from the main screen. Follow the steps to begin activities designed for your child.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What are the learning paths?</Text>
            <Text style={styles.faqAnswer}>
              Paths include topics like Social Skills, Daily Routines, and Special Interests. Each one helps your child learn in a way that suits them.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I pick the best path for my child?</Text>
            <Text style={styles.faqAnswer}>
              Choose a path based on what your child needs help with or enjoys. You can change paths anytime.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I see my child’s progress?</Text>
            <Text style={styles.faqAnswer}>
              Yes! Check the profile section to see what your child has done and how they’re improving.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What if the app stops working?</Text>
            <Text style={styles.faqAnswer}>
              Close the app and open it again. If that doesn’t work, restart your device or contact us for help.
            </Text>
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Need More Help?</Text>
          <Text style={styles.contactText}>
            Contact our team if you have more questions or need extra support.
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => Linking.openURL('mailto:support@learningpathsapp.com')}
          >
            <Feather name="mail" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Email Support</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2417',
    textAlign: 'center',
    marginBottom: 15,
  },
  introText: {
    fontSize: 16,
    color: '#1A2417',
    textAlign: 'center',
    marginBottom: 20,
  },
  faqSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ABC8A2',
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  contactSection: {
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1A2417',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});