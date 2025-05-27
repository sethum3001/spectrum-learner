"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")

interface ChildData {
  child_id: string
  difficulty: number
}

interface ProgressData {
  _id: string
  child_id: string
  question_accuracy: number
  question_time: number
  emotional_feedback: {
    sadness: number
    happiness: number
    engagement: number
  }
  current_level: number
}

const Profile = () => {
  const [childData, setChildData] = useState<ChildData | null>(null)
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0.8))

  // Static user information
  const staticUser = {
    name: "Rashi Amarasiri",
    age: 8,
    grade: "3rd Grade",
    avatar: "https://thumbs.dreamstime.com/b/vector-illustration-isolated-white-background-user-profile-avatar-black-line-icon-user-profile-avatar-black-solid-icon-121102166.jpg?w=768",
    favoriteSubject: "Math & Science",
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [loading])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [childResponse, progressResponse] = await Promise.all([
        fetch("https://social-relationship.up.railway.app/get_child/child_001"),
        fetch("https://social-reciprocity-lp-production.up.railway.app/api/get_progress/123"),
      ])

      if (!childResponse.ok || !progressResponse.ok) {
        throw new Error("Failed to fetch data")
      }

      const childResult = await childResponse.json()
      const progressResult = await progressResponse.json()

      setChildData(childResult)
      setProgressData(progressResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return "#ABC8A2" // Easy - Calming Green
    if (difficulty <= 6) return "#FFF3D7" // Medium - Warm Yellow
    return "#FFD7E6" // Hard - Soft Pink
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 3) return "Beginner"
    if (difficulty <= 6) return "Intermediate"
    return "Advanced"
  }

  const getEmotionColor = (emotion: string, value: number) => {
    const colors = {
      happiness: "#FFF3D7",
      engagement: "#D7EFFF",
      sadness: "#E6D7FF",
    }
    return colors[emotion as keyof typeof colors] || "#ABC8A2"
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#ABC8A2", "#E6D7FF", "#FFFFFF"]} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading your amazing profile! 🌟</Text>
            <View style={styles.loadingDots}>
              <Text style={styles.dot}>🎈</Text>
              <Text style={styles.dot}>🎨</Text>
              <Text style={styles.dot}>🌈</Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#FFD7E6", "#FFFFFF"]} style={styles.gradient}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>😔</Text>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={fetchData}>
              <Text style={styles.retryButtonText}>Try Again 🔄</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#ABC8A2", "#E6D7FF", "#D7EFFF", "#FFFFFF"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>My Learning Profile 🌟</Text>
              <Feather name="star" size={24} color="#FFF3D7" />
            </View>

            {/* Profile Section */}
            <View style={styles.profileCard}>
              <LinearGradient colors={["#FFFFFF", "#FFF3D7"]} style={styles.profileGradient}>
                <Image source={{ uri: staticUser.avatar }} style={styles.avatar} />
                <Text style={styles.userName}>{staticUser.name}</Text>
                <Text style={styles.userDetails}>
                  Age: {staticUser.age} • {staticUser.grade}
                </Text>
                <Text style={styles.favoriteSubject}>💖 Loves: {staticUser.favoriteSubject}</Text>
              </LinearGradient>
            </View>

            {/* Learning Stats */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>🎯 Learning Progress</Text>
              <View style={styles.statsGrid}>
                {/* Difficulty Level */}
                <View style={[styles.statCard, { backgroundColor: getDifficultyColor(childData?.difficulty || 0) }]}>
                  <Text style={styles.statEmoji}>🎮</Text>
                  <Text style={styles.statValue}>{childData?.difficulty || 0}</Text>
                  <Text style={styles.statLabel}>Difficulty Level</Text>
                  <Text style={styles.statSubLabel}>{getDifficultyLabel(childData?.difficulty || 0)}</Text>
                </View>

                {/* Current Level */}
                <View style={[styles.statCard, { backgroundColor: "#D7EFFF" }]}>
                  <Text style={styles.statEmoji}>🏆</Text>
                  <Text style={styles.statValue}>{progressData?.current_level || 0}</Text>
                  <Text style={styles.statLabel}>Social Level</Text>
                  <Text style={styles.statSubLabel}>Keep growing!</Text>
                </View>

                {/* Accuracy */}
                <View style={[styles.statCard, { backgroundColor: "#E6D7FF" }]}>
                  <Text style={styles.statEmoji}>🎯</Text>
                  <Text style={styles.statValue}>{progressData?.question_accuracy?.toFixed(0) || 0}%</Text>
                  <Text style={styles.statLabel}>Accuracy</Text>
                  <Text style={styles.statSubLabel}>Amazing!</Text>
                </View>

                {/* Response Time */}
                <View style={[styles.statCard, { backgroundColor: "#FFD7E6" }]}>
                  <Text style={styles.statEmoji}>⚡</Text>
                  <Text style={styles.statValue}>{progressData?.question_time?.toFixed(0) || 0}%</Text>
                  <Text style={styles.statLabel}>Avg. Time Spent%</Text>
                  <Text style={styles.statSubLabel}>Lightning fast!</Text>
                </View>
              </View>
            </View>

            {/* Emotional Feedback */}
            <View style={styles.emotionSection}>
              <Text style={styles.sectionTitle}>😊 How You're Feeling</Text>
              <View style={styles.emotionContainer}>
                {progressData?.emotional_feedback &&
                  Object.entries(progressData.emotional_feedback).map(([emotion, value]) => (
                    <View
                      key={emotion}
                      style={[styles.emotionCard, { backgroundColor: getEmotionColor(emotion, value) }]}
                    >
                      <Text style={styles.emotionEmoji}>
                        {emotion === "happiness" ? "😄" : emotion === "engagement" ? "🤩" : "😢"}
                      </Text>
                      <Text style={styles.emotionValue}>{value.toFixed(0)}%</Text>
                      <Text style={styles.emotionLabel}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</Text>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${value}%` }]} />
                      </View>
                    </View>
                  ))}
              </View>
            </View>

            {/* Achievement Badges */}
            <View style={styles.achievementSection}>
              <Text style={styles.sectionTitle}>🏅 Your Achievements</Text>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeEmoji}>🌟</Text>
                  <Text style={styles.badgeText}>Star Learner</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeEmoji}>🚀</Text>
                  <Text style={styles.badgeText}>Quick Thinker</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeEmoji}>💎</Text>
                  <Text style={styles.badgeText}>Accuracy Master</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeEmoji}>🎨</Text>
                  <Text style={styles.badgeText}>Creative Mind</Text>
                </View>
              </View>
            </View>

            {/* Fun Facts */}
            <View style={styles.funFactsSection}>
              <Text style={styles.sectionTitle}>🎉 Fun Learning Facts</Text>
              <View style={styles.funFactCard}>
                <Text style={styles.funFactText}>
                  🎯 You've answered questions with {progressData?.question_accuracy?.toFixed(0)}% accuracy!
                </Text>
                <Text style={styles.funFactText}>
                  ⚡ Your average thinking time is {progressData?.question_time?.toFixed(0)} seconds!
                </Text>
                <Text style={styles.funFactText}>
                  🏆 You're currently at level {progressData?.current_level} in social skills!
                </Text>
                <Text style={styles.funFactText}>🌈 Keep up the amazing work, {staticUser.name}!</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    textAlign: "center",
  },
  loadingDots: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: "#ABC8A2",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  profileCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileGradient: {
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 5,
  },
  favoriteSubject: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
  },
  statsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
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
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555555",
    textAlign: "center",
  },
  statSubLabel: {
    fontSize: 12,
    color: "#777777",
    fontStyle: "italic",
    marginTop: 2,
  },
  emotionSection: {
    marginBottom: 20,
  },
  emotionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emotionCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  emotionEmoji: {
    fontSize: 20,
    marginBottom: 5,
  },
  emotionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  emotionLabel: {
    fontSize: 10,
    color: "#555555",
    textAlign: "center",
    marginBottom: 5,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#333333",
    borderRadius: 2,
  },
  achievementSection: {
    marginBottom: 20,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badge: {
    width: (width - 48) / 2,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  badgeEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
  },
  funFactsSection: {
    marginBottom: 20,
  },
  funFactCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  funFactText: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 10,
    lineHeight: 20,
  },
})

export default Profile
