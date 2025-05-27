"use client"

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

export default function SocialReciprocity() {
  const router = useRouter()
  const bounceAnim = useRef(new Animated.Value(0)).current
  const floatAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(-width)).current

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 0,
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

    // Continuous animations
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
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

  const handleStartLearning = async () => {
    router.push("/(tabs)/SocialReciprocity/loading")

    try {
      const requestBody = {
        current_level: 1,
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

  return (
    <LinearGradient colors={["#ABC8A2", "#E6D7FF", "#D7EFFF", "#FFF3D7"]} style={styles.container}>
      {/* Floating Elements */}
      <Animated.View
        style={[
          styles.floatingElement,
          styles.star1,
          {
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
              { rotate: "45deg" },
            ],
          },
        ]}
      >
        <Ionicons name="star" size={30} color="#FFF3D7" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.heart1,
          {
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="heart" size={25} color="#FFD7E6" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.book1,
          {
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="book" size={28} color="#D7EFFF" />
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Learning Buddies</Text>
            <Text style={styles.subtitle}>Social Adventures Await! 🌟</Text>
          </View>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Character Section */}
          <View style={styles.characterSection}>
            <View style={styles.characterContainer}>
              <Animated.View
                style={[
                  styles.characterCircle,
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
                <Text style={styles.characterEmoji}>👫</Text>
              </Animated.View>
              <View style={styles.friendsContainer}>
                <Text style={styles.friendEmoji}>🧒</Text>
                <Text style={styles.friendEmoji}>👧</Text>
                <Text style={styles.friendEmoji}>🧑</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              🎉 Ready for an amazing adventure in making friends and playing together? Let's learn how to share, care,
              and have fun with others!
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {[
              { icon: "book-outline", text: "Fun Stories", color: "#ABC8A2" },
              { icon: "people-outline", text: "Make Friends", color: "#E6D7FF" },
              { icon: "happy-outline", text: "Play Games", color: "#FFD7E6" },
            ].map((feature, index) => (
              <Animated.View
                key={feature.text}
                style={[
                  styles.featureItem,
                  { backgroundColor: feature.color },
                  {
                    transform: [
                      {
                        scale: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, index === 1 ? 1.05 : 1.02],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons name={feature.icon as keyof typeof Ionicons.glyphMap} size={24} color="#FFFFFF" />
                <Text style={styles.featureText}>{feature.text}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Start Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                transform: [
                  {
                    translateY: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity style={styles.startButton} onPress={handleStartLearning} activeOpacity={0.8}>
              <LinearGradient colors={["#4CAF50", "#45A049"]} style={styles.buttonGradient}>
                <Ionicons name="rocket" size={28} color="#FFFFFF" />
                <Text style={styles.buttonText}>Let's Start Our Adventure!</Text>
                <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
  floatingElement: {
    position: "absolute",
    zIndex: 1,
  },
  star1: {
    top: 100,
    right: 30,
  },
  heart1: {
    top: 200,
    left: 20,
  },
  book1: {
    top: 300,
    right: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-around",
  },
  characterSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  characterContainer: {
    alignItems: "center",
  },
  characterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  characterEmoji: {
    fontSize: 60,
  },
  friendsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 150,
  },
  friendEmoji: {
    fontSize: 30,
  },
  descriptionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 18,
    color: "#333333",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  featureItem: {
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    width: width * 0.25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  startButton: {
    borderRadius: 30,
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
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginHorizontal: 12,
  },
})
