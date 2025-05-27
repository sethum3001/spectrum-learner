"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface QuestionsProps {
    questions: {
        question: string
        options: string[]
        correctAnswer: number
    }[]
    onComplete: (score: number) => void
}

const { width } = Dimensions.get("window")

const Questions: React.FC<QuestionsProps> = ({ questions, onComplete }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(null))
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const slideAnim = useRef(new Animated.Value(0)).current
    const scaleAnims = useRef(questions[0]?.options.map(() => new Animated.Value(1)) || []).current
    const progressAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start()

        Animated.timing(progressAnim, {
            toValue: (currentQuestion + 1) / questions.length,
            duration: 500,
            useNativeDriver: false,
        }).start()
    }, [currentQuestion])

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers]
        newAnswers[currentQuestion] = answerIndex
        setSelectedAnswers(newAnswers)

        // Animate button press
        Animated.sequence([
            Animated.timing(scaleAnims[answerIndex], {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnims[answerIndex], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start()

        // Move to next question or complete
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1)
                slideAnim.setValue(0)
                Animated.spring(slideAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8,
                }).start()
            } else {
                const score = calculateScore(newAnswers)
                setShowResult(true)
                onComplete(score)
            }
        }, 600)
    }

    const calculateScore = (answers: number[]) => {
        return questions.reduce((score, question, index) => {
            return score + (answers[index] === question.correctAnswer ? 1 : 0)
        }, 0)
    }

    if (showResult) {
        return (
            <View style={styles.resultContainer}>
                <Ionicons name="trophy" size={80} color="#FFF3D7" />
                <Text style={styles.resultText}>Amazing Job!</Text>
                <Text style={styles.scoreText}>
                    You got {calculateScore(selectedAnswers)} out of {questions.length} correct!
                </Text>
            </View>
        )
    }

    const question = questions[currentQuestion]

    return (
        <View style={styles.container}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    Question {currentQuestion + 1} of {questions.length}
                </Text>
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
            </View>

            <Animated.View
                style={[
                    styles.questionContainer,
                    {
                        transform: [
                            {
                                translateX: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [width, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.questionHeader}>
                    <Ionicons name="help-circle" size={32} color="#ABC8A2" />
                    <Text style={styles.questionText}>{question.question}</Text>
                </View>

                <View style={styles.optionsContainer}>
                    {question.options.map((option, index) => (
                        <Animated.View key={index} style={[styles.optionWrapper, { transform: [{ scale: scaleAnims[index] }] }]}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    { backgroundColor: getOptionColor(index) },
                                    selectedAnswers[currentQuestion] === index && styles.selectedOption,
                                ]}
                                onPress={() => handleAnswer(index)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.optionContent}>
                                    <View style={styles.optionIcon}>
                                        <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                                    </View>
                                    <Text style={styles.optionText}>{option}</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </Animated.View>
        </View>
    )
}

const getOptionColor = (index: number) => {
    const colors = ["#ABC8A2", "#E6D7FF", "#D7EFFF", "#FFF3D7"]
    return colors[index % colors.length]
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    progressContainer: {
        marginBottom: 24,
    },
    progressText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4A4A4A",
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
        backgroundColor: "#ABC8A2",
        borderRadius: 4,
    },
    questionContainer: {
        flex: 1,
    },
    questionHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    questionText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333333",
        marginLeft: 12,
        flex: 1,
        lineHeight: 28,
    },
    optionsContainer: {
        flex: 1,
    },
    optionWrapper: {
        marginBottom: 16,
    },
    optionButton: {
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedOption: {
        borderWidth: 3,
        borderColor: "#4CAF50",
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    optionContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    optionLetter: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333333",
    },
    optionText: {
        fontSize: 16,
        color: "#333333",
        fontWeight: "600",
        flex: 1,
        lineHeight: 22,
    },
    resultContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        backgroundColor: "#ABC8A2",
        borderRadius: 20,
        margin: 16,
    },
    resultText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginTop: 16,
        marginBottom: 8,
    },
    scoreText: {
        fontSize: 18,
        color: "#FFFFFF",
        textAlign: "center",
    },
})

export default Questions
