import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
}

interface QuestionsProps {
    question: Question;
    questionIndex: number;
    selectedAnswer: number | null;
    onAnswer: (questionIndex: number, answerIndex: number) => void;
}

const Questions: React.FC<QuestionsProps> = ({
    question,
    questionIndex,
    selectedAnswer,
    onAnswer,
}) => {
    return (
        <View style={styles.questionBox}>
            <Text style={styles.questionText}>{question.question}</Text>
            {question.options.map((option, oIndex) => (
                <TouchableOpacity
                    key={oIndex}
                    style={[
                        styles.optionButton,
                        selectedAnswer === oIndex && styles.selectedOption,
                    ]}
                    onPress={() => onAnswer(questionIndex, oIndex)}
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
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