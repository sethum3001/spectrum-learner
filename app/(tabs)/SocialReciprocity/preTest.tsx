import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Questions from '@/components/Social-Reciprocity/Questions';

const { width } = Dimensions.get('window');

export default function PreTest() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [story, setStory] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [paramsProcessed, setParamsProcessed] = useState(false);

    // Validate and process params - ONLY ONCE
    // Add this in your useEffect where you process params
    useEffect(() => {
        // Skip if we've already processed params
        if (paramsProcessed) return;

        try {
            // Check if we have all required params
            if (!params.story || !params.questionsJson) {
                console.error('Missing route parameters');
                router.replace('/(tabs)/SocialReciprocity');
                return;
            }

            const storyText = String(params.story);
            setStory(storyText);

            // Extract title if available
            const titleMatch = storyText.match(/\*\*(.*?)\*\*/);
            if (titleMatch && titleMatch[1]) {
                setStoryTitle(titleMatch[1]);
            }

            try {
                const parsedQuestions = JSON.parse(String(params.questionsJson));
                setQuestions(parsedQuestions);
            } catch (e) {
                console.error('Failed to parse questions:', e);
                setQuestions([]);
            }

            // Mark params as processed to avoid repeated processing
            setParamsProcessed(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Error processing parameters:', error);
            router.replace('/(tabs)/SocialReciprocity');
        }
    }, [params, router, paramsProcessed]);

    const playSound = async () => {
        if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        } else {
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    require('../../../assets/audio/story-audio.mp3'),
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);

                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        setIsPlaying(false);
                    }
                });
            } catch (error) {
                console.error("Couldn't play audio:", error);
            }
        }
    };

    const stopSound = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const handleQuizCompletion = (finalScore: number) => {
        setScore(finalScore);
        setShowResult(true);

        if (finalScore === 10) {
            setFeedbackMessage('Great job! Increasing difficulty.');
        } else if (finalScore <= 3) {
            setFeedbackMessage('Keep trying! Decreasing difficulty.');
        } else {
            setFeedbackMessage('Good effort! Keep practicing.');
        }
    };

    // Show loading indicator while data is being prepared
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading your story and questions...</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#F0F8FF', '#E6E6FA']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.storyContainer}>
                    <Text style={styles.storyTitle}>{storyTitle}</Text>
                    <Image
                        source={require('../../../assets/images/robot-story.png')}
                        style={styles.storyImage}
                    />
                    <Text style={styles.storyText}>{story}</Text>
                    <TouchableOpacity
                        style={styles.audioButton}
                        onPress={isPlaying ? stopSound : playSound}
                    >
                        <Ionicons
                            name={isPlaying ? 'pause-circle' : 'play-circle'}
                            size={50}
                            color="#4CAF50"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.questionsContainer}>
                    <Text style={styles.questionsTitle}>Let's Answer Some Questions!</Text>
                    {questions && questions.length > 0 ? (
                        <Questions questions={questions} onComplete={handleQuizCompletion} />
                    ) : (
                        <Text style={styles.noQuestionsText}>No questions available.</Text>
                    )}
                </View>

                {showResult && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>
                            Great job! You got {score} out of 10 correct!
                        </Text>
                        <Text style={styles.feedbackText}>{feedbackMessage}</Text>
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() =>
                                router.push({
                                    pathname: '/(tabs)/SocialReciprocity/caretakerInput',
                                    params: { accuracy: Math.round((score / questions.length) * 100) }, 
                                })
                            }
                        >
                            <Text style={styles.nextButtonText}>Start Learning</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
    scrollContent: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#4CAF50',
    },
    storyContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    storyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
        alignItems: 'center',
    },
    storyImage: {
        width: width - 80,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    storyText: {
        fontSize: 18,
        lineHeight: 26,
        color: '#333333',
        marginBottom: 20,
    },
    audioButton: {
        marginTop: 10,
    },
    questionsContainer: {
        marginBottom: 20,
    },
    questionsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 15,
    },
    noQuestionsText: {
        fontSize: 16,
        color: '#FF6347',
        textAlign: 'center',
        padding: 20,
    },
    resultContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 20,
        textAlign: 'center',
    },
    feedbackText: {
        fontSize: 18,
        color: '#333333',
        marginBottom: 20,
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: '#1A2417',
        borderRadius: 25,
        padding: 15,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});