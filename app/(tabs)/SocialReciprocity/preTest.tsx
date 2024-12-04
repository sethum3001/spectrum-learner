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

const { width } = Dimensions.get('window');

const story =
    "Once upon a time, there was a friendly robot named Beep. Beep loved to help people. One day, Beep saw a little girl who was sad because she couldn't reach her toy on a high shelf. Beep used its extendable arm to get the toy for her. The girl was so happy, she gave Beep a big hug. From that day on, Beep and the girl became best friends, playing together and helping others in their town.";

const questions = [
    {
        question: "What was the robot's name?",
        options: ["Boop", "Beep", "Bip", "Bap"],
        correctAnswer: 1,
    },
    {
        question: "Why was the little girl sad?",
        options: [
            "She lost her toy",
            "She couldn't reach her toy",
            "Her toy was broken",
            "She had no friends",
        ],
        correctAnswer: 1,
    },
    {
        question: "How did Beep help the girl?",
        options: [
            "By singing a song",
            "By telling a joke",
            "By using its extendable arm",
            "By calling for help",
        ],
        correctAnswer: 2,
    },
];

export default function preTest() {
    const router = useRouter();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState(
        new Array(questions.length).fill(null)
    );
    const [showResult, setShowResult] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const playSound = async () => {
        if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        } else {
            const { sound: newSound } = await Audio.Sound.createAsync(
                require('../../../assets/audio/story-audio.mp3')
            );
            setSound(newSound);
            await newSound.playAsync();
            setIsPlaying(true);
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

    interface Question {
        question: string;
        options: string[];
        correctAnswer: number;
    }

    interface AnswerHandlerProps {
        questionIndex: number;
        answerIndex: number;
    }

    const handleAnswer = ({ questionIndex, answerIndex }: AnswerHandlerProps) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[questionIndex] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleContinue = () => {
        if (selectedAnswers.every((answer) => answer !== null)) {
            setShowResult(true);
            const score = calculateScore();
            if (score === questions.length) {
                setFeedbackMessage('Great job! Increasing difficulty.');
            } else if (score <= 1) {
                setFeedbackMessage('Keep trying! Decreasing difficulty.');
            } else {
                setFeedbackMessage('Good effort! Keep practicing.');
            }
        }
    };

    const calculateScore = () => {
        return questions.reduce((score, question, index) => {
            return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
        }, 0);
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
                    {questions.map((q, qIndex) => (
                        <View key={qIndex} style={styles.questionBox}>
                            <Text style={styles.questionText}>{q.question}</Text>
                            {q.options.map((option, oIndex) => (
                                <TouchableOpacity
                                    key={oIndex}
                                    style={[
                                        styles.optionButton,
                                        selectedAnswers[qIndex] === oIndex && styles.selectedOption,
                                    ]}
                                    onPress={() => handleAnswer({ questionIndex: qIndex, answerIndex: oIndex })}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        selectedAnswers.every((answer) => answer !== null) && styles.continueButtonActive,
                    ]}
                    onPress={handleContinue}
                    disabled={!selectedAnswers.every((answer) => answer !== null)}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>

                {showResult && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>
                            Great job! You got {calculateScore()} out of {questions.length} correct!
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
    questionBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    optionButton: {
        backgroundColor: '#E0F2F1',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: '#80CBC4',
    },
    optionText: {
        fontSize: 16,
        color: '#333333',
    },
    continueButton: {
        backgroundColor: '#BDBDBD',
        borderRadius: 25,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    continueButtonActive: {
        backgroundColor: '#4CAF50',
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
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
        backgroundColor: '#4CAF50',
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