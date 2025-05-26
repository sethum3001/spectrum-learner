import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView,
    Animated, Easing, Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        marginTop: 50,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#4A4A4A',
        textAlign: 'center',
        marginBottom: 10,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E6D7FF',
        borderRadius: 4,
        flex: 1,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ABC8A2',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A4A4A',
    },
    questionSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 25,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 3,
        borderColor: '#E6D7FF',
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    questionNumber: {
        backgroundColor: '#ABC8A2',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    questionNumberText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    question: {
        fontSize: 20,
        color: '#4A4A4A',
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '600',
    },
    optionsContainer: {
        marginTop: 20,
    },
    optionButton: {
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        padding: 18,
        marginVertical: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#E6D7FF',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionText: {
        fontSize: 16,
        color: '#4A4A4A',
        fontWeight: '500',
        flex: 1,
        textAlign: 'center',
    },
    optionIcon: {
        marginLeft: 10,
    },
    correct: {
        backgroundColor: '#ABC8A2',
        borderColor: '#8FB085',
    },
    correctText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    incorrect: {
        backgroundColor: '#FFD7E6',
        borderColor: '#FFB3C6',
    },
    incorrectText: {
        color: '#8B4B6B',
        fontWeight: 'bold',
    },
    resultSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 3,
        borderColor: '#ABC8A2',
    },
    celebrationIcon: {
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A4A4A',
        textAlign: 'center',
        marginBottom: 15,
    },
    resultSubtitle: {
        fontSize: 16,
        color: '#6B6B6B',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    nextButton: {
        backgroundColor: '#ABC8A2',
        borderRadius: 25,
        padding: 18,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        minWidth: 200,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 8,
    },
    floatingElements: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },
    floatingIcon: {
        position: 'absolute',
    },
});

const FloatingIcon = ({ icon, color, delay = 0 }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 4000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        setTimeout(startAnimation, delay);
    }, []);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -30],
    });

    return (
        <Animated.View
            style={[
                styles.floatingIcon,
                {
                    transform: [{ translateY }],
                    top: Math.random() * 400 + 100,
                    left: Math.random() * (width - 50) + 25,
                },
            ]}
        >
            <Ionicons name={icon} size={20} color={color} />
        </Animated.View>
    );
};

const PulseAnimation = ({ children, delay = 0 }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, delay);
    }, []);

    return (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            {children}
        </Animated.View>
    );
};

const QuizScreen = () => {
    const { mcqs: mcqsString, input } = useLocalSearchParams();
    const mcqs = JSON.parse(mcqsString);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(new Array(mcqs.length).fill(null));
    const [showResult, setShowResult] = useState(false);
    const router = useRouter();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

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
                easing: Easing.out(Easing.back(1.1)),
                useNativeDriver: true,
            }),
        ]).start();
    }, [currentQuestion]);

    const handleAnswer = (selectedAnswer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = selectedAnswer;
        setAnswers(newAnswers);

        if (currentQuestion < mcqs.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
                fadeAnim.setValue(0);
                slideAnim.setValue(50);
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 600,
                        easing: Easing.out(Easing.back(1.1)),
                        useNativeDriver: true,
                    }),
                ]).start();
            }, 1500);
        } else {
            setTimeout(() => setShowResult(true), 1500);
        }
    };

    const handlePredictDifficulty = () => {
        const score = answers.filter((answer, idx) => answer === mcqs[idx].answer).length;
        const accuracy = score / mcqs.length;
        router.push({
            pathname: '/(tabs)/SocialRelationships/DifficultyScreen',
            params: { accuracy, input },
        });
    };

    const progress = ((currentQuestion + 1) / mcqs.length) * 100;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FFF3D7', '#D7EFFF', '#E6D7FF']}
                style={styles.gradientBackground}
            >
                <View style={styles.floatingElements}>
                    <FloatingIcon icon="star" color="#ABC8A2" delay={0} />
                    <FloatingIcon icon="heart" color="#FFD7E6" delay={1000} />
                    <FloatingIcon icon="trophy" color="#FFF3D7" delay={2000} />
                    <FloatingIcon icon="sparkles" color="#E6D7FF" delay={3000} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.headerSection}>
                        <Text style={styles.title}>🧠 Quiz Time! 🎯</Text>
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>Progress</Text>
                            <View style={styles.progressBar}>
                                <Animated.View
                                    style={[
                                        styles.progressFill,
                                        { width: `${progress}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                        </View>
                    </View>

                    {!showResult ? (
                        <Animated.View
                            style={[
                                styles.questionSection,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <View style={styles.questionHeader}>
                                <PulseAnimation delay={500}>
                                    <View style={styles.questionNumber}>
                                        <Text style={styles.questionNumberText}>{currentQuestion + 1}</Text>
                                    </View>
                                </PulseAnimation>
                                <Text style={styles.question}>{mcqs[currentQuestion].question}</Text>
                            </View>

                            <View style={styles.optionsContainer}>
                                {mcqs[currentQuestion].options.map((option, index) => {
                                    const isSelected = answers[currentQuestion] === option;
                                    const isCorrect = option === mcqs[currentQuestion].answer;
                                    const showResult = answers[currentQuestion] !== null;

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => handleAnswer(option)}
                                            style={[
                                                styles.optionButton,
                                                isSelected && showResult && (isCorrect ? styles.correct : styles.incorrect),
                                            ]}
                                            disabled={answers[currentQuestion] !== null}
                                        >
                                            <Text style={[
                                                styles.optionText,
                                                isSelected && showResult && (isCorrect ? styles.correctText : styles.incorrectText),
                                            ]}>
                                                {option}
                                            </Text>
                                            {isSelected && showResult && (
                                                <View style={styles.optionIcon}>
                                                    {isCorrect ? (
                                                        <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                                                    ) : (
                                                        <Ionicons name="close-circle" size={24} color="#8B4B6B" />
                                                    )}
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </Animated.View>
                    ) : (
                        <Animated.View
                            style={[
                                styles.resultSection,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <PulseAnimation>
                                <View style={styles.celebrationIcon}>
                                    <Text style={{ fontSize: 60 }}>🎉</Text>
                                </View>
                            </PulseAnimation>

                            <Text style={styles.resultTitle}>Amazing Work! 🌟</Text>
                            <Text style={styles.resultSubtitle}>
                                You've completed the quiz! Let's see what level you're ready for next! 🚀
                            </Text>

                            <TouchableOpacity onPress={handlePredictDifficulty} style={styles.nextButton}>
                                <MaterialIcons name="psychology" size={20} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Discover My Level!</Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

export default QuizScreen;