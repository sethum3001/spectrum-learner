"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"

const { width } = Dimensions.get("window")

interface LearningPathItemProps {
  icon: keyof typeof Ionicons.glyphMap
  text: string
  color: string
  delay: number
}

const LearningPathItem: React.FC<LearningPathItemProps> = ({ icon, text, color, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()
    }, delay)
  }, [delay])

  return (
    <Animated.View
      style={[
        styles.learningPathItem,
        { backgroundColor: color },
        {
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        },
      ]}
    >
      <Ionicons name={icon} size={28} color="#FFFFFF" />
      <Text style={styles.learningPathText}>{text}</Text>
    </Animated.View>
  )
}

export default function StudentProgressScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const newLevel = params.newLevel || 1

  const bounceAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current
  const confettiAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()

    // Continuous bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Confetti animation
    Animated.loop(
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ).start()
  }, [])

  function parseQuestions(questionsStr: string) {
    const lines = questionsStr.split("\n").filter((line) => line.trim().length > 0)
    const questions = []
    let currentQuestion: { question: string; options: string[]; correctAnswer: number | null } | null = null

    for (const line of lines) {
      if (/^\d+\./.test(line)) {
        if (currentQuestion) {
          questions.push(currentQuestion)
        }
        const questionText = line.replace(/^\d+\.\s*/, "").trim()
        currentQuestion = {
          question: questionText,
          options: [],
          correctAnswer: null,
        }
      } else if (/^[A-D]\./.test(line)) {
        const optionText = line.replace(/^[A-D]\.\s*/, "").trim()
        if (currentQuestion) {
          currentQuestion.options.push(optionText)
        }
      } else if (line.startsWith("Correct Answer:")) {
        const answerLetter = line.replace("Correct Answer:", "").trim()
        const answerIndex = answerLetter.charCodeAt(0) - "A".charCodeAt(0)
        if (currentQuestion) {
          currentQuestion.correctAnswer = answerIndex
        }
      }
    }
    if (currentQuestion) {
      questions.push(currentQuestion)
    }
    return questions
  }

  const handleContinueLearning = async () => {
    router.push("/(tabs)/SocialReciprocity/loading")

    try {
      const requestBody = {
        current_level: newLevel,
      }

      const response = await fetch(
        "http://social-reciprocity-lp-production.up.railway.app/api/generate_story_and_questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch data from the server")
      }

      const data = await response.json()

      if (data.story && data.questions) {
        const parsedQuestions = parseQuestions(data.questions)

        setTimeout(() => {
          router.replace({
            pathname: "/(tabs)/SocialReciprocity/preTest",
            params: {
              story: data.story,
              questionsJson: JSON.stringify(parsedQuestions),
            },
          })
        }, 300)
      } else {
        console.error("Incomplete data from the server:", data)
        setTimeout(() => {
          router.replace("/(tabs)/SocialReciprocity")
        }, 300)
      }
    } catch (error) {
      console.error("Error:", error)
      setTimeout(() => {
        router.replace("/(tabs)/SocialReciprocity")
      }, 300)
    }
  }

  const handleGoToProfile = () => {
    router.push("/(tabs)/Home/profile")
  }

  return (
    <LinearGradient colors={["#ABC8A2", "#E6D7FF", "#D7EFFF", "#FFF3D7"]} style={styles.container}>
      {/* Floating Confetti */}
      {["🎉", "⭐", "🌟", "🎈", "🎊"].map((emoji, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.confetti,
            {
              left: (index * width) / 5,
              transform: [
                {
                  translateY: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 800],
                  }),
                },
                {
                  rotate: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          {emoji}
        </Animated.Text>
      ))}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Avatar Section */}
        <Animated.View
          style={[
            styles.avatarSection,
            {
              transform: [
                { scale: scaleAnim },
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient colors={["#4CAF50", "#66BB6A"]} style={styles.avatarGradient}>
              <Text style={styles.avatarEmoji}>🌟</Text>
            </LinearGradient>
            <View style={styles.crownContainer}>
              <Text style={styles.crown}>👑</Text>
            </View>
          </View>
        </Animated.View>

        {/* Welcome Message */}
        <Animated.View style={[styles.welcomeContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.welcomeText}>🎉 Amazing Work, Superstar! 🎉</Text>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level</Text>
            <View style={styles.levelBadge}>
              <LinearGradient colors={["#FF6B6B", "#FF8E8E"]} style={styles.levelBadgeGradient}>
                <Text style={styles.levelNumber}>{newLevel}</Text>
              </LinearGradient>
            </View>
          </View>
          <Text style={styles.encouragementText}>You're crushing this learning adventure! 🚀</Text>
        </Animated.View>

        {/* Learning Path */}
        <View style={styles.learningPathContainer}>
          <Text style={styles.learningPathTitle}>🌈 Your Learning Journey 🌈</Text>
          <View style={styles.learningPathGrid}>
            <LearningPathItem icon="happy-outline" text="Social Skills" color="#ABC8A2" delay={200} />
            <LearningPathItem icon="people-outline" text="Friendship" color="#E6D7FF" delay={400} />
            <LearningPathItem icon="bulb-outline" text="Problem Solving" color="#D7EFFF" delay={600} />
            <LearningPathItem icon="heart-outline" text="Empathy" color="#FFD7E6" delay={800} />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleContinueLearning} activeOpacity={0.8}>
            <LinearGradient colors={["#4CAF50", "#66BB6A"]} style={styles.buttonGradient}>
              <Ionicons name="rocket" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Next Adventure!</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleGoToProfile} activeOpacity={0.8}>
            <LinearGradient colors={["#FF6B6B", "#FF8E8E"]} style={styles.buttonGradient}>
              <Ionicons name="home" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Back to Profile</Text>
              <Ionicons name="person-circle" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Achievement Badges */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>🏆 Today's Achievements 🏆</Text>
          <View style={styles.badgesContainer}>
            {["🎯", "📚", "🤝", "💡"].map((badge, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.achievementBadge,
                  {
                    transform: [
                      {
                        scale: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.badgeEmoji}>{badge}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  confetti: {
    position: "absolute",
    fontSize: 24,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 60,
  },
  crownContainer: {
    position: "absolute",
    top: -20,
    alignSelf: "center",
  },
  crown: {
    fontSize: 40,
  },
  welcomeContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 24,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 16,
    textAlign: "center",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  levelText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666666",
    marginRight: 12,
  },
  levelBadge: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  levelBadgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  encouragementText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    fontWeight: "500",
  },
  learningPathContainer: {
    width: "100%",
    marginBottom: 30,
  },
  learningPathTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  learningPathGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  learningPathItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  learningPathText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  achievementsContainer: {
    width: "100%",
    alignItems: "center",
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  badgesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  achievementBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeEmoji: {
    fontSize: 28,
  },
})
