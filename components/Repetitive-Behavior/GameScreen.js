"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ImageBackground, Image } from "react-native"
import { GestureHandlerRootView, Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated"
import { Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"

const { height, width } = Dimensions.get("window")

const storyStages = [
  [
    "Once upon a time, there was a brave princess who",
    "set out on a journey to save her kingdom from a wicked dragon.",
    "Along the way, she met a wise old woman who gave her a magic sword.",
  ],
  [
    "With the sword in hand, the princess faced the dragon",
    "and emerged victorious, saving her kingdom and its people.",
    "The grateful citizens celebrated her bravery with a grand feast.",
  ],
  [
    "Years passed, and the princess became a wise and just queen.",
    "She ruled her kingdom with compassion and strength,",
    "always remembering the lessons she learned on her great adventure.",
  ],
  [
    "And so, the kingdom flourished under her reign,",
    "becoming a beacon of hope and prosperity for all who lived there.",
    "The end.",
  ],
]

const DraggableSentence = ({ sentence, index, onDragEnd, isInTopSection, onRemove, onRearrange }) => {
  const translateY = useSharedValue(0)
  const translateX = useSharedValue(0)
  const scale = useSharedValue(1)
  const context = useSharedValue({ y: 0 })
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 })
  }, [])

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value }
      scale.value = withTiming(1.05, { duration: 200 })
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y
      if (isInTopSection) {
        translateX.value = event.translationX
      }
    })
    .onEnd((event) => {
      scale.value = withTiming(1, { duration: 200 })
      if (isInTopSection) {
        translateY.value = withSpring(0)
        translateX.value = withSpring(0)
        runOnJS(onRearrange)(index, event.absoluteY)
      } else {
        translateY.value = withSpring(0)
        runOnJS(onDragEnd)(index, event.absoluteY)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: isInTopSection ? translateX.value : 0 },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }))

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.sentence, animatedStyle, isInTopSection ? styles.topSentence : styles.bottomSentence]}
      >
        <LinearGradient
          colors={isInTopSection ? ["#4ECDC4", "#2196F3"] : ["#2196F3", "#1976D2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sentenceGradient}
        >
          <Text style={styles.sentenceText}>{sentence}</Text>
          {isInTopSection && (
            <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(index)}>
              <Feather name="x" color="#fff" size={16} />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  )
}

const StoryScreen = () => {
  const router = useRouter()
  const [bottomSentences, setBottomSentences] = useState([])
  const [topSentences, setTopSentences] = useState([])
  const [currentStage, setCurrentStage] = useState(0)
  const [isCallStarted, setIsCallStarted] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const topScrollViewRef = useRef(null)
  const bottomScrollViewRef = useRef(null)
  const successScale = useSharedValue(0)
  const [isLoading, setIsLoading] = useState(false)

  const startCall = () => {
    setIsCallStarted(true)
    resetStage(0)
  }

  const resetStage = (stage) => {
    const allSentences = storyStages.slice(0, stage + 1).flat()
    setBottomSentences([...allSentences].sort(() => Math.random() - 0.5))
    setTopSentences([])
  }

  const handleDragEnd = (index, yPosition) => {
    if (yPosition < height * 0.6) {
      // Move to top section
      const movedSentence = bottomSentences[index]
      setTopSentences([...topSentences, movedSentence])
      setBottomSentences(bottomSentences.filter((_, i) => i !== index))
    }
  }

  const removeSentence = (index) => {
    const removedSentence = topSentences[index]
    setTopSentences(topSentences.filter((_, i) => i !== index))
    setBottomSentences([...bottomSentences, removedSentence])
  }

  const rearrangeSentences = (fromIndex, yPosition) => {
    const toIndex = Math.min(Math.max(Math.floor((yPosition - height * 0.1) / 50), 0), topSentences.length - 1)
    if (fromIndex !== toIndex) {
      const newTopSentences = [...topSentences]
      const [reorderedItem] = newTopSentences.splice(fromIndex, 1)
      newTopSentences.splice(toIndex, 0, reorderedItem)
      setTopSentences(newTopSentences)
    }
  }

  const showSuccessAnimation = () => {
    setShowSuccess(true)
    successScale.value = withSequence(
      withTiming(1.2, { duration: 500 }),
      withTiming(1, { duration: 300 }),
      withDelay(
        1000,
        withTiming(0, { duration: 300 }, () => {
          runOnJS(setShowSuccess)(false)
        }),
      ),
    )
  }

  const checkAnswer = () => {
    const currentStageSentences = storyStages.slice(0, currentStage + 1).flat()
    const isCorrect = topSentences.every((sentence, index) => sentence === currentStageSentences[index])

    if (isCorrect) {
      showSuccessAnimation()

      if (currentStage < storyStages.length - 1) {
        setTimeout(() => {
          setShowSuccess(false)
          setIsLoading(true)

          setTimeout(() => {
            const nextStage = currentStage + 1
            setCurrentStage(nextStage)
            resetStage(nextStage)
            setIsLoading(false)
          }, 3000) // Show loading for 3 seconds
        }, 1500)
      } else {
        setTimeout(() => {
          alert("Congratulations! You've completed all stages!")
        }, 1500)
      }
    } else {
      alert("That's not quite right. Try again!")
      resetStage(currentStage)
    }
  }

  const stopAttempt = () => {
    // setIsCallStarted(false)
    // setCurrentStage(0)
    // setTopSentences([])
    // setBottomSentences([])
    router.push("/(tabs)/RepetitiveBehavior/Scorecard")
  }

  const restartAttempt = () => {
    setCurrentStage(0)
    resetStage(0)
  }

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }))

  if (!isCallStarted) {
    return (
      //<ImageBackground source={require("../../../assets/images/story-bg.jpg")} style={styles.startContainer}>
        <LinearGradient colors={["rgba(33,150,243,0.7)", "rgba(33,150,243,0.3)"]} style={styles.overlay}>
          <View style={styles.startContent}>
            <Text style={styles.startTitle}>Are you ready <Text style={styles.centerText}>adventurer?</Text></Text>
            <Text style={styles.startSubtitle}>Arrange the sentences to create a story</Text>
            <TouchableOpacity style={styles.startButton} onPress={startCall}>
              <Text style={styles.startButtonText}>Start Game</Text>
              <Feather name="play" size={24} color="#fff" style={styles.startButtonIcon} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      //</ImageBackground>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={["#1E88E5", "#4ECDC4"]} style={styles.background}>
        <View style={styles.header}>
          <View style={styles.stageIndicator}>
            <Text style={styles.stageText}>
              Stage: {currentStage + 1} / {storyStages.length}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((currentStage + 1) / storyStages.length) * 100}%` }]} />
            </View>
          </View>
          <Text style={styles.instructions}>Arrange the sentences in the correct order</Text>
        </View>

        <View style={styles.topSection}>
          <Text style={styles.sectionTitle}>Your Story</Text>
          <ScrollView
            ref={topScrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {topSentences.map((sentence, index) => (
              <DraggableSentence
                key={`top-${index}`}
                sentence={sentence}
                index={index}
                onDragEnd={() => {}}
                isInTopSection={true}
                onRemove={removeSentence}
                onRearrange={rearrangeSentences}
              />
            ))}
            {topSentences.length === 0 && (
              <View style={styles.emptyState}>
                <Feather name="arrow-up" size={24} color="#fff" />
                <Text style={styles.emptyStateText}>Drag sentences here</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.sectionTitle}>Available Sentences</Text>
          <ScrollView
            ref={bottomScrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {bottomSentences.map((sentence, index) => (
              <DraggableSentence
                key={`bottom-${index}`}
                sentence={sentence}
                index={index}
                onDragEnd={handleDragEnd}
                isInTopSection={false}
                onRemove={() => {}}
                onRearrange={() => {}}
              />
            ))}
            {bottomSentences.length === 0 && (
              <View style={styles.emptyState}>
                <Feather name="check-circle" size={24} color="#fff" />
                <Text style={styles.emptyStateText}>All sentences used!</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.checkButton]} onPress={checkAnswer}>
            <Feather name="check" color="#fff" size={24} />
            <Text style={styles.actionButtonText}>Check</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.restartButton]} onPress={restartAttempt}>
            <Feather name="rotate-ccw" color="#fff" size={24} />
            <Text style={styles.actionButtonText}>Restart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.exitButton]} onPress={stopAttempt}>
            <Feather name="x" color="#fff" size={24} />
            <Text style={styles.actionButtonText}>Exit</Text>
          </TouchableOpacity>
        </View>

        {showSuccess && (
          <Animated.View style={[styles.successOverlay, successAnimatedStyle]}>
            <View style={styles.successContent}>
              <Feather name="check-circle" size={60} color="#2196F3" />
              <Text style={styles.successText}>
                {currentStage < storyStages.length - 1
                  ? `Great job! Moving to stage ${currentStage + 2}`
                  : "Congratulations! You've completed all stages!"}
              </Text>
            </View>
          </Animated.View>
        )}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <Image source={require("../../assets/images/fun-loading.gif")} style={styles.loadingGif} />
              <Text style={styles.loadingText}>Generating next stage...</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 15,
  },
  startContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  startContent: {
    alignItems: "center",
    padding: 20,
  },
  startTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  centerText: {
    textAlign: "center",
  },
  startSubtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10,
  },
  startButtonIcon: {
    marginLeft: 5,
  },
  header: {
    marginBottom: 15,
  },
  stageIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  stageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 4,
  },
  instructions: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  topSection: {
    height: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  bottomSection: {
    height: "35%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  sentence: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sentenceGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
  },
  topSentence: {
    borderLeftWidth: 5,
    borderLeftColor: "#4ECDC4",
  },
  bottomSentence: {
    borderLeftWidth: 5,
    borderLeftColor: "#2196F3",
  },
  sentenceText: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  removeButton: {
    backgroundColor: "rgba(255, 107, 107, 0.8)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    opacity: 0.7,
  },
  emptyStateText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
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
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  checkButton: {
    backgroundColor: "#2196F3",
  },
  restartButton: {
    backgroundColor: "#64B5F6",
  },
  exitButton: {
    backgroundColor: "#0D47A1",
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  successContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 15,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(33, 150, 243, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: "80%",
  },
  loadingGif: {
    width: 150,
    height: 135,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
    textAlign: "center",
  },
})

export default StoryScreen

