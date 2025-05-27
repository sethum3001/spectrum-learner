"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")

interface FAQItem {
  id: number
  question: string
  answer: string
  emoji: string
  color: string
}

const Help = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "What does this amazing app do?",
      answer:
        "This super cool app offers fun learning paths to help kids with Autism Spectrum Disorder (ASD) build awesome skills like communication, social interaction, and focus through exciting activities and games! 🎮✨",
      emoji: "🌟",
      color: "#ABC8A2",
    },
    {
      id: 2,
      question: "How do I start my learning adventure?",
      answer:
        "It's easy! Just log in, then pick a colorful learning path from the main screen. Follow the fun steps to begin activities specially designed for your child's success! 🚀",
      emoji: "🎯",
      color: "#E6D7FF",
    },
    {
      id: 3,
      question: "What are these magical learning paths?",
      answer:
        "Our paths include exciting topics like Social Skills 👫, Daily Routines 📅, and Special Interests 🎨. Each one helps your child learn in a way that's perfect for them!",
      emoji: "🛤️",
      color: "#D7EFFF",
    },
    {
      id: 4,
      question: "How do I pick the perfect path?",
      answer:
        "Choose a path based on what your child needs help with or what makes them smile! 😊 You can switch paths anytime - it's all about having fun while learning!",
      emoji: "🎪",
      color: "#FFF3D7",
    },
    {
      id: 5,
      question: "Can I track my child's amazing progress?",
      answer:
        "Absolutely! 📊 Check the colorful profile section to see all the wonderful things your child has accomplished and how they're growing every day! 🌱",
      emoji: "📈",
      color: "#FFD7E6",
    },
    {
      id: 6,
      question: "What if something goes wrong?",
      answer:
        "No worries! 😌 Try closing and reopening the app first. If that doesn't work, restart your device or reach out to our friendly support team - we're here to help! 🤝",
      emoji: "🔧",
      color: "#ABC8A2",
    },
  ]

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const quickActions = [
    { title: "Video Tutorials", emoji: "🎥", color: "#E6D7FF", action: () => { } },
    { title: "User Guide", emoji: "📚", color: "#D7EFFF", action: () => { } },
    { title: "Tips & Tricks", emoji: "💡", color: "#FFF3D7", action: () => { } },
    { title: "Community", emoji: "👥", color: "#FFD7E6", action: () => { } },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#ABC8A2", "#E6D7FF", "#D7EFFF", "#FFFFFF"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Help & Support</Text>
              <Text style={styles.subtitle}>We're here to make learning fun and easy! 🌈</Text>
            </View>

            {/* Welcome Card */}
            <View style={styles.welcomeCard}>
              <LinearGradient colors={["#FFFFFF", "#FFF3D7"]} style={styles.welcomeGradient}>
                <Text style={styles.welcomeEmoji}>🎉</Text>
                <Text style={styles.welcomeTitle}>Welcome to Help Center!</Text>
                <Text style={styles.welcomeText}>
                  Find answers to common questions and discover how to make the most of your learning journey! Let's
                  explore together! 🚀✨
                </Text>
              </LinearGradient>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>🚀 Quick Help</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <TouchableOpacity key={index} style={[styles.quickActionCard, { backgroundColor: action.color }]}>
                    <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* FAQ Section */}
            <View style={styles.faqSection}>
              <Text style={styles.sectionTitle}>❓ Frequently Asked Questions</Text>
              <Text style={styles.faqSubtitle}>Tap any question to reveal the answer! 👆</Text>

              {faqData.map((item, index) => (
                <Animated.View key={item.id} style={styles.faqItemContainer}>
                  <TouchableOpacity
                    style={[styles.faqCard, { backgroundColor: item.color }]}
                    onPress={() => toggleExpanded(item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.faqHeader}>
                      <View style={styles.faqQuestionContainer}>
                        <Text style={styles.faqEmoji}>{item.emoji}</Text>
                        <Text style={styles.faqQuestion}>{item.question}</Text>
                      </View>
                      <Feather
                        name={expandedItems.includes(item.id) ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#333333"
                      />
                    </View>

                    {expandedItems.includes(item.id) && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={styles.faqAnswer}>{item.answer}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Contact Support */}
            <View style={styles.contactSection}>
              <LinearGradient colors={["#ABC8A2", "#E6D7FF"]} style={styles.contactGradient}>
                <Text style={styles.contactEmoji}>💌</Text>
                <Text style={styles.contactTitle}>Need More Help?</Text>
                <Text style={styles.contactText}>
                  Our friendly support team is always ready to help you and your child succeed! Don't hesitate to reach
                  out! 🤗
                </Text>

                <View style={styles.contactButtons}>
                  <Pressable
                    style={[styles.contactButton, { backgroundColor: "#FFFFFF" }]}
                    onPress={() => Linking.openURL("mailto:support@learningpathsapp.com")}
                  >
                    <Feather name="mail" size={20} color="#ABC8A2" />
                    <Text style={[styles.contactButtonText, { color: "#ABC8A2" }]}>Email Support</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.contactButton, { backgroundColor: "#FFD7E6" }]}
                    onPress={() => Linking.openURL("tel:+1234567890")}
                  >
                    <Feather name="phone" size={20} color="#333333" />
                    <Text style={[styles.contactButtonText, { color: "#333333" }]}>Call Us</Text>
                  </Pressable>
                </View>
              </LinearGradient>
            </View>

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>💡 Pro Tips for Parents</Text>
              <View style={styles.tipsContainer}>
                <View style={[styles.tipCard, { backgroundColor: "#FFF3D7" }]}>
                  <Text style={styles.tipEmoji}>⏰</Text>
                  <Text style={styles.tipTitle}>Set Learning Times</Text>
                  <Text style={styles.tipText}>Create a routine with short, fun learning sessions!</Text>
                </View>

                <View style={[styles.tipCard, { backgroundColor: "#D7EFFF" }]}>
                  <Text style={styles.tipEmoji}>🎉</Text>
                  <Text style={styles.tipTitle}>Celebrate Progress</Text>
                  <Text style={styles.tipText}>Every small step forward is worth celebrating!</Text>
                </View>

                <View style={[styles.tipCard, { backgroundColor: "#FFD7E6" }]}>
                  <Text style={styles.tipEmoji}>👨‍👩‍👧‍👦</Text>
                  <Text style={styles.tipTitle}>Learn Together</Text>
                  <Text style={styles.tipText}>Join your child's learning journey for extra fun!</Text>
                </View>

                <View style={[styles.tipCard, { backgroundColor: "#E6D7FF" }]}>
                  <Text style={styles.tipEmoji}>🔄</Text>
                  <Text style={styles.tipTitle}>Be Patient</Text>
                  <Text style={styles.tipText}>Every child learns at their own perfect pace!</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#143549",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A4D4F",
    textAlign: "center",
    fontStyle: "italic",
  },
  welcomeCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  welcomeGradient: {
    padding: 20,
    alignItems: "center",
  },
  welcomeEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "#555555",
    textAlign: "center",
    lineHeight: 22,
  },
  quickActionsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: (width - 48) / 2,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  faqSection: {
    marginBottom: 25,
  },
  faqSubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 15,
    fontStyle: "italic",
  },
  faqItemContainer: {
    marginBottom: 12,
  },
  faqCard: {
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  faqEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
  },
  faqAnswerContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.5)",
  },
  faqAnswer: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
  },
  contactSection: {
    marginBottom: 25,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contactGradient: {
    padding: 20,
    alignItems: "center",
  },
  contactEmoji: {
    fontSize: 40,
    marginBottom: 15,
  },
  contactTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  contactText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  contactButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    minWidth: 120,
    justifyContent: "center",
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tipCard: {
    width: (width - 48) / 2,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tipEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 5,
  },
  tipText: {
    fontSize: 12,
    color: "#555555",
    textAlign: "center",
    lineHeight: 16,
  },
})

export default Help
