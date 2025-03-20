"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

const attemptData = [
  {
    attemptNo: 1,
    date: "2023-05-01",
    stagesProgressed: 3,
    score: 75,
    icon: "pencil-outline",
    color: "#4ECDC4",
  },
  {
    attemptNo: 2,
    date: "2023-05-03",
    stagesProgressed: 4,
    score: 82,
    icon: "book-outline",
    color: "#FF9800",
  },
  {
    attemptNo: 3,
    date: "2023-05-05",
    stagesProgressed: 5,
    score: 90,
    icon: "create-outline",
    color: "#4CAF50",
  },
  {
    attemptNo: 4,
    date: "2023-05-07",
    stagesProgressed: 5,
    score: 95,
    icon: "trophy-outline",
    color: "#2196F3",
  },
]

const SocialReportaryIndex = () => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [bounceAnim] = useState(new Animated.Value(0))
  const scrollViewRef = useRef(null)
  const screenWidth = Dimensions.get("window").width

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffsetX / screenWidth)
    setCurrentIndex(index)
  }

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true })
    }
    setCurrentIndex(index)
  }

  const handleContinueLearning = () => {
    router.push("/(tabs)/RepetitiveBehavior/loading")
  }

  const handleGoToProfile = () => {
    router.push("/(tabs)/Home/profile")
  }

  const bouncingStyle = {
    transform: [
      {
        translateY: bounceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 10],
        }),
      },
    ],
  }

  const currentAttempt = attemptData[currentIndex]
  const progressPercentage = (currentAttempt.score / 100) * 100

  return (
    <LinearGradient colors={["#4ECDC4", "#FFFFFF"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Creative Writing Progress</Text>
          <Text style={styles.subtitle}>Track your writing journey!</Text>
        </View>

        <View style={styles.sliderContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollViewContent}
          >
            {attemptData.map((attempt, index) => (
              <View key={index} style={[styles.cardSlide, { width: screenWidth - 40 }]}>
                <Animated.View style={[styles.iconContainer, { backgroundColor: attempt.color }, bouncingStyle]}>
                  <Ionicons name={attempt.icon} size={50} color="#FFFFFF" />
                </Animated.View>

                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Attempt {attempt.attemptNo}</Text>
                    <Text style={styles.cardDate}>{attempt.date}</Text>
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.statItem}>
                      <Ionicons name="layers-outline" size={24} color={attempt.color} />
                      <Text style={styles.statLabel}>Stages Progressed:</Text>
                      <Text style={[styles.statValue, { color: attempt.color }]}>{attempt.stagesProgressed}</Text>
                    </View>

                    <View style={styles.statItem}>
                      <Ionicons name="star-outline" size={24} color={attempt.color} />
                      <Text style={styles.statLabel}>Score:</Text>
                      <Text style={[styles.statValue, { color: attempt.color }]}>{attempt.score}</Text>
                    </View>

                    <View style={styles.progressContainer}>
                      <Text style={styles.progressLabel}>Overall Progress</Text>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${progressPercentage}%`, backgroundColor: attempt.color },
                          ]}
                        />
                      </View>
                      <Text style={[styles.progressText, { color: attempt.color }]}>{progressPercentage}%</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.pagination}>
          {attemptData.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && { backgroundColor: attemptData[currentIndex].color },
              ]}
              onPress={() => scrollToIndex(index)}
            />
          ))}
        </View>

        <View style={styles.statsOverview}>
          <Text style={styles.statsTitle}>Writing Journey Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="time-outline" size={24} color="#4ECDC4" />
              <Text style={styles.statBoxValue}>{attemptData.length}</Text>
              <Text style={styles.statBoxLabel}>Attempts</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="trending-up-outline" size={24} color="#FF9800" />
              <Text style={styles.statBoxValue}>{Math.max(...attemptData.map((a) => a.score))}</Text>
              <Text style={styles.statBoxLabel}>Best Score</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="flag-outline" size={24} color="#4CAF50" />
              <Text style={styles.statBoxValue}>{Math.max(...attemptData.map((a) => a.stagesProgressed))}</Text>
              <Text style={styles.statBoxLabel}>Max Stages</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#4ECDC4" }]}
            onPress={handleContinueLearning}
          >
            <Text style={styles.actionButtonText}>Continue Writing</Text>
            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FF9800" }]} onPress={handleGoToProfile}>
            <Text style={styles.actionButtonText}>Back to Profile</Text>
            <Ionicons name="person-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  sliderContainer: {
    height: 320,
    marginBottom: 10,
  },
  scrollViewContent: {
    alignItems: "center",
  },
  cardSlide: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -40,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    paddingTop: 50,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  cardDate: {
    fontSize: 16,
    color: "#666666",
    marginTop: 5,
  },
  cardContent: {
    width: "100%",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statLabel: {
    fontSize: 16,
    color: "#333333",
    marginLeft: 10,
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 5,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CCCCCC",
    marginHorizontal: 5,
  },
  statsOverview: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  statBoxValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    marginVertical: 5,
  },
  statBoxLabel: {
    fontSize: 14,
    color: "#666666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 8,
  },
})

export default SocialReportaryIndex
