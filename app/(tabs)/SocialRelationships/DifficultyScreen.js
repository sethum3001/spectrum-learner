import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Animated, Easing, Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    contentContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
        borderWidth: 4,
        borderColor: '#ABC8A2',
        maxWidth: width - 40,
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A4A4A',
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingSubtitle: {
        fontSize: 16,
        color: '#6B6B6B',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    loaderWrapper: {
        alignItems: 'center',
        marginVertical: 20,
    },
    resultContainer: {
        alignItems: 'center',
    },
    celebrationContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    levelBadge: {
        backgroundColor: '#ABC8A2',
        borderRadius: 50,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    levelNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    resultTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#4A4A4A',
        textAlign: 'center',
        marginBottom: 10,
    },
    resultSubtitle: {
        fontSize: 18,
        color: '#6B6B6B',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    homeButton: {
        backgroundColor: '#ABC8A2',
        paddingVertical: 18,
        paddingHorizontal: 30,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
    },
    homeButtonText: {
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
    progressRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 8,
        borderColor: '#E6D7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressRingFill: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 8,
        borderColor: 'transparent',
        borderTopColor: '#ABC8A2',
    },
    loadingText: {
        fontSize: 16,
        color: '#4A4A4A',
        textAlign: 'center',
        marginTop: 15,
        fontWeight: '500',
    },
});

const FloatingIcon = ({ icon, color, delay = 0 }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 3000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 3000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            Animated.loop(
                Animated.timing(rotateValue, {
                    toValue: 1,
                    duration: 8000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        };

        setTimeout(startAnimation, delay);
    }, []);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -25],
    });

    const rotate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={[
                styles.floatingIcon,
                {
                    transform: [{ translateY }, { rotate }],
                    top: Math.random() * height * 0.7 + 50,
                    left: Math.random() * width * 0.8 + 20,
                },
            ]}
        >
            <Ionicons name={icon} size={24} color={color} />
        </Animated.View>
    );
};

const SpinningLoader = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseValue, {
                    toValue: 1.1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
            <View style={styles.progressRing}>
                <Animated.View
                    style={[
                        styles.progressRingFill,
                        { transform: [{ rotate: spin }] }
                    ]}
                />
                <MaterialIcons name="psychology" size={40} color="#ABC8A2" />
            </View>
        </Animated.View>
    );
};

const CelebrationAnimation = ({ children }) => {
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(bounceAnim, {
                toValue: 1,
                friction: 4,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ scale: bounceAnim }],
            }}
        >
            {children}
        </Animated.View>
    );
};

const DifficultyScreen = () => {
    const { accuracy, input } = useLocalSearchParams();
    const [newDifficulty, setNewDifficulty] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDifficulty = async () => {
            try {
                const response = await fetch(
                    'https://social-relationship.up.railway.app/predict_and_update_difficulty',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            child_id: 'child_001',
                            caretaker_input: input,
                            accuracy: parseFloat(accuracy),
                        }),
                    }
                );
                const data = await response.json();
                setNewDifficulty(data.new_difficulty);
            } catch (error) {
                console.error('Error predicting difficulty:', error);
                alert('Failed to predict difficulty. Please try again!');
            } finally {
                setTimeout(() => setLoading(false), 2000); // Add delay for better UX
            }
        };
        fetchDifficulty();
    }, [accuracy, input]);

    const goToHome = () => {
        router.replace('/(tabs)/Home');
    };

    const getLevelEmoji = (level) => {
        const emojis = ['🌱', '🌿', '🌳', '🌟', '🏆'];
        return emojis[Math.min(level - 1, emojis.length - 1)] || '🎯';
    };

    const getLevelMessage = (level) => {
        const messages = [
            "You're just getting started! 🌱",
            "You're growing stronger! 🌿",
            "You're becoming amazing! 🌳",
            "You're a superstar! 🌟",
            "You're a champion! 🏆"
        ];
        return messages[Math.min(level - 1, messages.length - 1)] || "You're incredible! 🎯";
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#E6D7FF', '#FFF3D7', '#D7EFFF']}
                style={styles.gradientBackground}
            >
                <View style={styles.floatingElements}>
                    <FloatingIcon icon="star" color="#ABC8A2" delay={0} />
                    <FloatingIcon icon="trophy" color="#FFF3D7" delay={1000} />
                    <FloatingIcon icon="heart" color="#FFD7E6" delay={2000} />
                    <FloatingIcon icon="sparkles" color="#E6D7FF" delay={3000} />
                    <FloatingIcon icon="rocket" color="#ABC8A2" delay={4000} />
                </View>

                <View style={styles.contentContainer}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingTitle}>🧠 Analyzing Your Progress!</Text>
                            <Text style={styles.loadingSubtitle}>
                                Our smart system is calculating your perfect learning level...
                            </Text>

                            <View style={styles.loaderWrapper}>
                                <SpinningLoader />
                                <Text style={styles.loadingText}>Almost ready! ⏰</Text>
                            </View>
                        </View>
                    ) : (
                        <CelebrationAnimation>
                            <View style={styles.resultContainer}>
                                <View style={styles.celebrationContainer}>
                                    <Text style={{ fontSize: 50, marginBottom: 20 }}>🎉</Text>

                                    <View style={styles.levelBadge}>
                                        <Text style={styles.levelNumber}>{newDifficulty}</Text>
                                    </View>

                                    <Text style={{ fontSize: 30, marginBottom: 10 }}>
                                        {getLevelEmoji(newDifficulty)}
                                    </Text>
                                </View>

                                <Text style={styles.resultTitle}>Your New Learning Level!</Text>
                                <Text style={styles.resultSubtitle}>
                                    {getLevelMessage(newDifficulty)} Keep up the fantastic work!
                                </Text>

                                <TouchableOpacity style={styles.homeButton} onPress={goToHome}>
                                    <Ionicons name="home" size={20} color="#FFFFFF" />
                                    <Text style={styles.homeButtonText}>Back to Home</Text>
                                    <MaterialIcons name="celebration" size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </CelebrationAnimation>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
};

export default DifficultyScreen;