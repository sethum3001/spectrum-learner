import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuestionsProps {
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
    onComplete: (score: number) => void;
}

const Questions: React.FC<QuestionsProps> = ({ questions, onComplete }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(null));

    const handleAnswer = (questionIndex: number, answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[questionIndex] = answerIndex;
        setSelectedAnswers(newAnswers);

        // Check if all questions are answered
        if (newAnswers.every((answer) => answer !== null)) {
            const score = calculateScore(newAnswers);
            onComplete(score);
        }
    };

    const calculateScore = (answers: number[]) => {
        return questions.reduce((score, question, index) => {
            return score + (answers[index] === question.correctAnswer ? 1 : 0);
        }, 0);
    };

    return (
        <View>
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
                            onPress={() => handleAnswer(qIndex, oIndex)}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default Questions;