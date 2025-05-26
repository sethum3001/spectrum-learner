import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#E3F2FD',
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D84315',
        textAlign: 'center',
        marginBottom: 20,
    },
    question: {
        fontSize: 18,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    options: {
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    correct: {
        backgroundColor: '#28A745',
    },
    incorrect: {
        backgroundColor: '#DC3545',
    },
    nextButton: {
        backgroundColor: '#0288D1',
        borderRadius: 25,
        padding: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const QuizScreen = () => {
    const { mcqs: mcqsString, input } = useLocalSearchParams();
    const mcqs = JSON.parse(mcqsString);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(new Array(mcqs.length).fill(null));
    const [showResult, setShowResult] = useState(false);
    const router = useRouter();

    const handleAnswer = (selectedAnswer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = selectedAnswer;
        setAnswers(newAnswers);

        if (currentQuestion < mcqs.length - 1) {
            setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
        } else {
            setTimeout(() => setShowResult(true), 500);
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Let’s Test What You Learned!</Text>
            {!showResult ? (
                <>
                    <Text style={styles.question}>{mcqs[currentQuestion].question}</Text>
                    <View style={styles.options}>
                        {mcqs[currentQuestion].options.map((option, index) => {
                            const isSelected = answers[currentQuestion] === option;
                            const isCorrect = option === mcqs[currentQuestion].answer;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleAnswer(option)}
                                    style={[
                                        styles.optionButton,
                                        isSelected && (isCorrect ? styles.correct : styles.incorrect),
                                    ]}
                                    disabled={answers[currentQuestion] !== null}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <Text style={{ textAlign: 'center', color: '#555' }}>
                        Question {currentQuestion + 1} of {mcqs.length}
                    </Text>
                </>
            ) : (
                <TouchableOpacity onPress={handlePredictDifficulty} style={styles.nextButton}>
                    <Text style={styles.buttonText}>Predict Difficulty Level</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

export default QuizScreen;