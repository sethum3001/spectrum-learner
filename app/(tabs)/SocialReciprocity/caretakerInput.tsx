"use client"

import { useState, useRef, useEffect } from "react"
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    Dimensions,
} from "react-native"
import Slider from "@react-native-community/slider"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"

const { width } = Dimensions.get("window")

const emotions = [
    {
        name: "Happiness",
        icon: "happy-outline",
        emoji: "😊",
        color: "#FFF3D7",
        description: "How happy did the child seem during the activity?",
    },
    {
        name: "Time Spent",
        icon: "time-outline",
        emoji: "⏳",
        color: "#D7EFFF",
        description: "How much time did the child spend engaged?",
    },
    {
        name: "Sadness",
        icon: "sad-outline",
        emoji: "😢",
        color: "#E6D7FF",
        description: "Did the child show any signs of sadness?",
    },
    {
        name: "Engagement",
        icon: "flash-outline",
        emoji: "🎯",
        color: "#FFD7E6",
        description: "How engaged was the child throughout?",
    },
]

interface EmotionValues {
    [key: string]: number
}

export default function CaretakerInputScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()
    const accuracy = params.accuracy || 0

    const [emotionValues, setEmotionValues] = useState<EmotionValues>(
        emotions.reduce((acc, emotion) => ({ ...acc, [emotion.name]: 50 }), {} as EmotionValues),
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(50)).current
    const scaleAnim = useRef(new Animated.Value(0)).current
    const progressAnim = useRef(new Animated.Value(0)).current
    const pulseAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
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
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start()

        // Progress animation
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
        }).start()

        // Pulse animation for submit button
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
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
    }, [])

    const handleSliderChange = (emotion: string, value: number) => {
        setEmotionValues((prev: EmotionValues) => ({ ...prev, [emotion]: value }))
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const requestBody = {
                accuracy,
                sadness: emotionValues["Sadness"],
                happiness: emotionValues["Happiness"],
                engagement: emotionValues["Engagement"],
                time_spent: emotionValues["Time Spent"],
                current_level: 1,
            }

            const response = await fetch("http://social-reciprocity-lp-production.up.railway.app/api/adjust_level", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                throw new Error("Failed to adjust level")
            }

            const data = await response.json()

            router.push({
                pathname: "/(tabs)/SocialReciprocity/studentProgress",
                params: { newLevel: data.new_level },
            })
        } catch (error) {
            console.error("Error adjusting level:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getSliderColor = (emotion: string) => {
        const emotionData = emotions.find((e) => e.name === emotion)
        return emotionData?.color || "#ABC8A2"
    }

    const getEmotionIcon = (emotion: string) => {
        const emotionData = emotions.find((e) => e.name === emotion)
        return emotionData?.icon || "help-circle-outline"
    }

    const getEmotionEmoji = (emotion: string) => {
        const emotionData = emotions.find((e) => e.name === emotion)
        return emotionData?.emoji || "🤔"
    }

    return (
        <LinearGradient colors={["#ABC8A2", "#E6D7FF", "#D7EFFF", "#FFF3D7"]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.heroContainer}>
                        <View style={styles.heroIconContainer}>
                            <Ionicons name="people" size={60} color="#FFFFFF" />
                        </View>
                        <Text style={styles.title}>Caretaker's Corner</Text>
                        <Text style={styles.subtitle}>Help us understand the child's experience! 🌟</Text>
                    </View>
                </Animated.View>

                {/* Progress Bar */}
                <Animated.View style={[styles.progressContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.progressText}>Assessment Progress</Text>
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0%", "100%"],
                                    }),
                                },
                            ]}
                        />
                    </View>
                </Animated.View>

                {/* Instructions Card */}
                <Animated.View
                    style={[
                        styles.instructionsContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <LinearGradient colors={["#FFFFFF", "#F8F9FA"]} style={styles.instructionsGradient}>
                        <View style={styles.instructionsHeader}>
                            <Ionicons name="information-circle" size={28} color="#4CAF50" />
                            <Text style={styles.instructionsTitle}>How to Use This Assessment</Text>
                        </View>
                        <View style={styles.instructionsList}>
                            {[
                                "🎯 Observe the child's emotions during the activity",
                                "📊 Move each slider to rate intensity (0-100)",
                                "✅ Submit when you're ready to continue",
                            ].map((instruction, index) => (
                                <View key={index} style={styles.instructionItem}>
                                    <Text style={styles.instructionText}>{instruction}</Text>
                                </View>
                            ))}
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Emotion Assessment Cards */}
                <Animated.View style={[styles.emotionsSection, { opacity: fadeAnim }]}>
                    {emotions.map((emotion, index) => (
                        <Animated.View
                            key={emotion.name}
                            style={[
                                styles.emotionCard,
                                {
                                    transform: [
                                        {
                                            translateY: slideAnim.interpolate({
                                                inputRange: [0, 50],
                                                outputRange: [0, 50 + index * 20],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <LinearGradient colors={[emotion.color, "#FFFFFF"]} style={styles.emotionGradient}>
                                <View style={styles.emotionHeader}>
                                    <View style={styles.emotionIconContainer}>
                                        <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
                                        <Ionicons
                                            name={emotion.icon as keyof typeof Ionicons.glyphMap}
                                            size={24}
                                            color="#FFFFFF"
                                            style={styles.emotionIcon}
                                        />
                                    </View>
                                    <View style={styles.emotionTitleContainer}>
                                        <Text style={styles.emotionName}>{emotion.name}</Text>
                                        <Text style={styles.emotionDescription}>{emotion.description}</Text>
                                    </View>
                                </View>

                                <View style={styles.sliderContainer}>
                                    <View style={styles.sliderLabels}>
                                        <Text style={styles.sliderLabel}>Low</Text>
                                        <Text style={styles.sliderValue}>{emotionValues[emotion.name]}</Text>
                                        <Text style={styles.sliderLabel}>High</Text>
                                    </View>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={0}
                                        maximumValue={100}
                                        step={1}
                                        value={emotionValues[emotion.name]}
                                        onValueChange={(value) => handleSliderChange(emotion.name, value)}
                                        minimumTrackTintColor={emotion.color}
                                        maximumTrackTintColor="#E0E0E0"
                                        thumbTintColor={emotion.color}
                                    />
                                    <View style={styles.sliderIndicators}>
                                        {[0, 25, 50, 75, 100].map((mark) => (
                                            <View
                                                key={mark}
                                                style={[
                                                    styles.sliderMark,
                                                    emotionValues[emotion.name] >= mark && { backgroundColor: emotion.color },
                                                ]}
                                            />
                                        ))}
                                    </View>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    ))}
                </Animated.View>

                {/* Submit Button */}
                <Animated.View
                    style={[
                        styles.submitContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: pulseAnim }],
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={isSubmitting ? ["#A5D6A7", "#C8E6C9"] : ["#4CAF50", "#66BB6A"]}
                            style={styles.submitGradient}
                        >
                            {isSubmitting ? (
                                <>
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                    <Text style={styles.submitText}>Processing...</Text>
                                </>
                            ) : (
                                <>
                                    <Ionicons name="checkmark-circle" size={28} color="#FFFFFF" />
                                    <Text style={styles.submitText}>Complete Assessment</Text>
                                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* Fun Footer */}
                <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                    <Text style={styles.footerText}>Thank you for helping us understand! 💝</Text>
                    <View style={styles.footerEmojis}>
                        <Text style={styles.footerEmoji}>🌟</Text>
                        <Text style={styles.footerEmoji}>🎈</Text>
                        <Text style={styles.footerEmoji}>🌈</Text>
                    </View>
                </Animated.View>
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
    header: {
        alignItems: "center",
        marginBottom: 24,
    },
    heroContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 25,
        padding: 24,
        alignItems: "center",
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    heroIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4CAF50",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666666",
        textAlign: "center",
        fontWeight: "500",
    },
    progressContainer: {
        marginBottom: 20,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 15,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    progressText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4CAF50",
        textAlign: "center",
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: "#E0E0E0",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#4CAF50",
        borderRadius: 4,
    },
    instructionsContainer: {
        marginBottom: 24,
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    instructionsGradient: {
        padding: 20,
    },
    instructionsHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    instructionsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4CAF50",
        marginLeft: 12,
        flex: 1,
    },
    instructionsList: {
        gap: 12,
    },
    instructionItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    instructionText: {
        fontSize: 16,
        color: "#333333",
        fontWeight: "500",
        lineHeight: 22,
    },
    emotionsSection: {
        gap: 20,
        marginBottom: 24,
    },
    emotionCard: {
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    emotionGradient: {
        padding: 20,
    },
    emotionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    emotionIconContainer: {
        position: "relative",
        marginRight: 16,
    },
    emotionEmoji: {
        fontSize: 40,
    },
    emotionIcon: {
        position: "absolute",
        bottom: -5,
        right: -5,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 12,
        padding: 2,
    },
    emotionTitleContainer: {
        flex: 1,
    },
    emotionName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 4,
    },
    emotionDescription: {
        fontSize: 14,
        color: "#666666",
        lineHeight: 20,
    },
    sliderContainer: {
        marginTop: 8,
    },
    sliderLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    sliderLabel: {
        fontSize: 14,
        color: "#666666",
        fontWeight: "500",
    },
    sliderValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4CAF50",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 60,
        textAlign: "center",
    },
    slider: {
        height: 40,
        marginHorizontal: 0,
    },
    sliderThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    sliderIndicators: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
        paddingHorizontal: 12,
    },
    sliderMark: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#E0E0E0",
    },
    submitContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    submitButton: {
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        width: "100%",
    },
    disabledButton: {
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    submitGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 30,
        gap: 12,
    },
    submitText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "bold",
    },
    footer: {
        alignItems: "center",
        padding: 20,
    },
    footerText: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 12,
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    footerEmojis: {
        flexDirection: "row",
        gap: 16,
    },
    footerEmoji: {
        fontSize: 24,
    },
})
