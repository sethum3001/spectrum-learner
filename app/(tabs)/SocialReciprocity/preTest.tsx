import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Questions from '@/components/Social-Reciprocity/Questions';

const { width } = Dimensions.get('window');

const story =
    "Once upon a time, there was a friendly robot named Beep. Beep loved to help people. One day, Beep saw a little girl who was sad because she couldn't reach her toy on a high shelf. Beep used its extendable arm to get the toy for her. The girl was so happy, she gave Beep a big hug. From that day on, Beep and the girl became best friends, playing together and helping others in their town.";

export default function PreTest() {
    const router = useRouter();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [score, setScore] = useState(0);

    const playSound = async () => {
        if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        } else {
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

    return (
        <LinearGradient colors={['#F0F8FF', '#E6E6FA']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.storyContainer}>
                    <Text style={styles.storyTitle}>Beep's Big Day</Text>
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
                    <Questions onComplete={handleQuizCompletion} />
                </View>

                {showResult && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>
                            Great job! You got {score} out of 10 correct!
                        </Text>
                        <Text style={styles.feedbackText}>{feedbackMessage}</Text>
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => router.push('/(tabs)/SocialReciprocity/caretakerInput')}
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
    storyContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    storyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
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