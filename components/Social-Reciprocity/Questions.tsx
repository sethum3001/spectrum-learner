import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    {
        question: "What did the girl give Beep?",
        options: ["A toy", "A hug", "A high five", "A gift"],
        correctAnswer: 1,
    },
    {
        question: "What did Beep and the girl do together?",
        options: [
            "Played games",
            "Helped others in their town",
            "Built a robot",
            "Went to school",
        ],
        correctAnswer: 1,
    },
    {
        question: "What color was Beep?",
        options: ["Red", "Blue", "Silver", "Green"],
        correctAnswer: 2,
    },
    {
        question: "What was Beep's special ability?",
        options: [
            "Flying",
            "Singing",
            "Extendable arm",
            "Cooking",
        ],
        correctAnswer: 2,
    },
    {
        question: "What did the girl learn from Beep?",
        options: [
            "How to help others",
            "How to build a robot",
            "How to sing",
            "How to play games",
        ],
        correctAnswer: 0,
    },
    {
        question: "Where did Beep and the girl live?",
        options: [
            "In a city",
            "In a village",
            "In a forest",
            "In a spaceship",
        ],
        correctAnswer: 1,
    },
    {
        question: "What was the girl's favorite toy?",
        options: [
            "A doll",
            "A car",
            "A teddy bear",
            "A robot",
        ],
        correctAnswer: 3,
    },
];

interface QuestionsProps {
    onComplete: (score: number) => void;
}

const Questions: React.FC<QuestionsProps> = ({ onComplete }) => {
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
            {questions.slice(0, 10).map((q, qIndex) => (
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