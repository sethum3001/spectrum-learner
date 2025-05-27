"use client"

import { useState, useEffect, useRef } from "react"
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Animated,
} from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter, useLocalSearchParams } from "expo-router"
import Questions from "@/components/Social-Reciprocity/Questions"

const { width } = Dimensions.get("window")

export default function PreTest() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState("")
    const [score, setScore] = useState(0)
    const [questions, setQuestions] = useState([])
    const [story, setStory] = useState("")
    const [storyTitle, setStoryTitle] = useState("")
    const [paramsProcessed, setParamsProcessed] = useState(false)

    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current
    const pulseAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
        if (paramsProcessed) return

        try {
            if (!params.story || !params.questionsJson) {
                console.error("Missing route parameters")
                router.replace("/(tabs)/SocialReciprocity")
                return
            }

            const storyText = String(params.story)
            setStory(storyText)

            const titleMatch = storyText.match(/\*\*(.*?)\*\*/)
            if (titleMatch && titleMatch[1]) {
                setStoryTitle(titleMatch[1])
            }

            try {
                const parsedQuestions = JSON.parse(String(params.questionsJson))
                setQuestions(parsedQuestions)
            } catch (e) {
                console.error("Failed to parse questions:", e)
                setQuestions([])
            }

            setParamsProcessed(true)
            setIsLoading(false)

            // Entrance animations
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start()

            // Pulse animation for audio button
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ).start()
        } catch (error) {
            console.error("Error processing parameters:", error)
            router.replace("/(tabs)/SocialReciprocity")
        }
    }, [params, router, paramsProcessed])

    const playSound = async () => {
        if (sound) {
            await sound.playAsync()
            setIsPlaying(true)
        } else {
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(require("../../../assets/audio/story-audio.mp3"), {
                    shouldPlay: true,
                })
                setSound(newSound)
                setIsPlaying(true)

                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        setIsPlaying(false)
                    }
                })
            } catch (error) {
                console.error("Couldn't play audio:", error)
            }
        }
    }

    const stopSound = async () => {
        if (sound) {
            await sound.pauseAsync()
            setIsPlaying(false)
        }
    }

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync()
            }
        }
    }, [sound])

    const handleQuizCompletion = (finalScore: number) => {
        setScore(finalScore)
        setShowResult(true)

        if (finalScore === 10) {
            setFeedbackMessage("🌟 Amazing! You're a superstar! 🌟")
        } else if (finalScore <= 3) {
            setFeedbackMessage("💪 Keep trying! You're getting better! 💪")
        } else {
            setFeedbackMessage("🎉 Great job! Keep up the awesome work! 🎉")
        }
    }

    if (isLoading) {
        return (
            <LinearGradient colors={["#ABC8A2", "#E6D7FF"]} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Preparing your magical story...</Text>
            </LinearGradient>
        )
    }

    return (
        <LinearGradient colors={["#D7EFFF", "#E6D7FF", "#FFF3D7"]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Story Section */}
                <Animated.View
                    style={[
                        styles.storyContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.storyHeader}>
                        <Ionicons name="book" size={32} color="#4CAF50" />
                        <Text style={styles.storyTitle}>{storyTitle || "Your Adventure Story"}</Text>
                    </View>

                    <View style={styles.storyImageContainer}>
                        <View style={styles.storyImagePlaceholder}>
                            <Ionicons name="library" size={80} color="#ABC8A2" />
                            <Text style={styles.storyImageText}>📚 Story Time! 📚</Text>
                        </View>
                    </View>

                    <View style={styles.storyTextContainer}>
                        <Text style={styles.storyText}>{story}</Text>
                    </View>

                    <Animated.View style={[styles.audioButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
                        <TouchableOpacity
                            style={[styles.audioButton, isPlaying && styles.audioButtonPlaying]}
                            onPress={isPlaying ? stopSound : playSound}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={isPlaying ? ["#FF6B6B", "#FF8E8E"] : ["#4CAF50", "#66BB6A"]}
                                style={styles.audioButtonGradient}
                            >
                                <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#FFFFFF" />
                                <Text style={styles.audioButtonText}>{isPlaying ? "Pause Story" : "Listen to Story"}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>

                {/* Questions Section */}
                <Animated.View
                    style={[
                        styles.questionsContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.questionsHeader}>
                        <Ionicons name="help-circle" size={32} color="#FF6B6B" />
                        <Text style={styles.questionsTitle}>🎯 Fun Questions Time! 🎯</Text>
                    </View>

                    {questions && questions.length > 0 ? (
                        <Questions questions={questions} onComplete={handleQuizCompletion} />
                    ) : (
                        <View style={styles.noQuestionsContainer}>
                            <Ionicons name="sad" size={60} color="#FFD7E6" />
                            <Text style={styles.noQuestionsText}>Oops! No questions available right now.</Text>
                        </View>
                    )}
                </Animated.View>

                {/* Result Section */}
                {showResult && (
                    <Animated.View
                        style={[
                            styles.resultContainer,
                            {
                                opacity: fadeAnim,
                            },
                        ]}
                    >
                        <LinearGradient colors={["#4CAF50", "#66BB6A"]} style={styles.resultGradient}>
                            <Ionicons name="trophy" size={60} color="#FFF3D7" />
                            <Text style={styles.resultText}>
                                Fantastic! You got {score} out of {questions.length} correct! 🎉
                            </Text>
                            <Text style={styles.feedbackText}>{feedbackMessage}</Text>

                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() =>
                                    router.push({
                                        pathname: "/(tabs)/SocialReciprocity/caretakerInput",
                                        params: { accuracy: Math.round((score / questions.length) * 100) },
                                    })
                                }
                                activeOpacity={0.8}
                            >
                                <LinearGradient colors={["#FF6B6B", "#FF8E8E"]} style={styles.nextButtonGradient}>
                                    <Ionicons name="rocket" size={24} color="#FFFFFF" />
                                    <Text style={styles.nextButtonText}>Continue Adventure!</Text>
                                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                )}
            </ScrollView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    scrollContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 50,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 20,
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    storyContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    storyHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        justifyContent: "center",
    },
    storyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4CAF50",
        marginLeft: 12,
        textAlign: "center",
        flex: 1,
    },
    storyImageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    storyImagePlaceholder: {
        width: width - 80,
        height: 200,
        backgroundColor: "#F0F8FF",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#ABC8A2",
        borderStyle: "dashed",
    },
    storyImageText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ABC8A2",
        marginTop: 10,
    },
    storyTextContainer: {
        backgroundColor: "#F8F9FA",
        borderRadius: 15,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: "#4CAF50",
    },
    storyText: {
        fontSize: 18,
        lineHeight: 28,
        color: "#333333",
        fontWeight: "500",
    },
    audioButtonContainer: {
        alignItems: "center",
    },
    audioButton: {
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    audioButtonPlaying: {
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    audioButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    audioButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginLeft: 12,
    },
    questionsContainer: {
        marginBottom: 20,
    },
    questionsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 20,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionsTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FF6B6B",
        marginLeft: 12,
        textAlign: "center",
        flex: 1,
    },
    noQuestionsContainer: {
        alignItems: "center",
        padding: 40,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    noQuestionsText: {
        fontSize: 18,
        color: "#666666",
        textAlign: "center",
        marginTop: 16,
        fontWeight: "500",
    },
    resultContainer: {
        marginTop: 20,
        borderRadius: 25,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    resultGradient: {
        padding: 30,
        alignItems: "center",
    },
    resultText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginTop: 16,
        marginBottom: 12,
        textAlign: "center",
        lineHeight: 30,
    },
    feedbackText: {
        fontSize: 18,
        color: "#FFFFFF",
        marginBottom: 24,
        textAlign: "center",
        opacity: 0.9,
    },
    nextButton: {
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    nextButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    nextButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        marginHorizontal: 12,
    },
})
