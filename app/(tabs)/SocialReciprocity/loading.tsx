"use client"

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

const Loading = () => {
    const spinValue = useRef(new Animated.Value(0)).current
    const scaleValue = useRef(new Animated.Value(1)).current
    const bounceValue = useRef(new Animated.Value(0)).current
    const fadeValue = useRef(new Animated.Value(0)).current

    useEffect(() => {
        // Spinning animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }),
        ).start()

        // Pulsing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        ).start()

        // Bouncing dots animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceValue, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceValue, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        ).start()

        // Fade in animation
        Animated.timing(fadeValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start()
    }, [])

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    })

    const bounce = bounceValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    })

    return (
        <LinearGradient colors={["#ABC8A2", "#E6D7FF", "#D7EFFF"]} style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeValue }]}>
                {/* Animated Loading Icon */}
                <View style={styles.iconContainer}>
                    <Animated.View
                        style={[
                            styles.outerCircle,
                            {
                                transform: [{ rotate: spin }, { scale: scaleValue }],
                            },
                        ]}
                    >
                        <Ionicons name="book" size={60} color="#FFFFFF" />
                    </Animated.View>
                </View>

                {/* Fun Characters */}
                <View style={styles.charactersContainer}>
                    {["🌟", "📚", "🎨", "🎵"].map((emoji, index) => (
                        <Animated.Text
                            key={index}
                            style={[
                                styles.character,
                                {
                                    transform: [
                                        {
                                            translateY: bounceValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -15 - index * 5],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            {emoji}
                        </Animated.Text>
                    ))}
                </View>

                {/* Loading Text */}
                <View style={styles.textContainer}>
                    <Text style={styles.mainText}>Creating Your Adventure!</Text>
                    <View style={styles.subTextContainer}>
                        <Text style={styles.subText}>Preparing a fun story and exciting questions</Text>
                        <View style={styles.dotsContainer}>
                            {[0, 1, 2].map((index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        {
                                            transform: [
                                                {
                                                    translateY: bounceValue.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -10],
                                                    }),
                                                },
                                            ],
                                            opacity: bounceValue.interpolate({
                                                inputRange: [0, 0.5, 1],
                                                outputRange: [0.3, 1, 0.3],
                                            }),
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Progress Indicators */}
                <View style={styles.progressContainer}>
                    {["Story", "Questions", "Fun!"].map((step, index) => (
                        <Animated.View
                            key={step}
                            style={[
                                styles.progressStep,
                                {
                                    opacity: fadeValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 1],
                                    }),
                                    transform: [
                                        {
                                            scale: scaleValue.interpolate({
                                                inputRange: [1, 1.2],
                                                outputRange: [1, index === 1 ? 1.1 : 1],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <View style={[styles.stepIcon, { backgroundColor: getStepColor(index) }]}>
                                <Ionicons name={getStepIcon(index)} size={20} color="#FFFFFF" />
                            </View>
                            <Text style={styles.stepText}>{step}</Text>
                        </Animated.View>
                    ))}
                </View>
            </Animated.View>
        </LinearGradient>
    )
}

const getStepColor = (index: number) => {
    const colors = ["#FFF3D7", "#FFD7E6", "#ABC8A2"]
    return colors[index]
}

const getStepIcon = (index: number) => {
    const icons = ["book-outline", "help-circle-outline", "happy-outline"]
    return icons[index] as keyof typeof Ionicons.glyphMap
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        alignItems: "center",
        padding: 20,
    },
    iconContainer: {
        marginBottom: 30,
    },
    outerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    charactersContainer: {
        flexDirection: "row",
        marginBottom: 30,
        justifyContent: "space-around",
        width: width * 0.6,
    },
    character: {
        fontSize: 32,
        marginHorizontal: 8,
    },
    textContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    mainText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 10,
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    subTextContainer: {
        alignItems: "center",
    },
    subText: {
        fontSize: 18,
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 10,
        opacity: 0.9,
    },
    dotsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FFFFFF",
        marginHorizontal: 4,
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: width * 0.8,
    },
    progressStep: {
        alignItems: "center",
        flex: 1,
    },
    stepIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    stepText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
    },
})

export default Loading
