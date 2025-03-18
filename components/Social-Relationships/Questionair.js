import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

const questions = [
  {
    question: "How would you feel if a friend shared their toy with you?",
    options: [
      { emotion: "Happy", image: "/placeholder.svg?height=200&width=200&text=Happy" },
      { emotion: "Sad", image: "/placeholder.svg?height=200&width=200&text=Sad" },
      { emotion: "Angry", image: "/placeholder.svg?height=200&width=200&text=Angry" },
      { emotion: "Surprised", image: "/placeholder.svg?height=200&width=200&text=Surprised" }
    ],
    correctAnswer: "Happy"
  },
  {
    question: "If someone is crying, what might they be feeling?",
    options: [
      { emotion: "Excited", image: "/placeholder.svg?height=200&width=200&text=Excited" },
      { emotion: "Sad", image: "/placeholder.svg?height=200&width=200&text=Sad" },
      { emotion: "Sleepy", image: "/placeholder.svg?height=200&width=200&text=Sleepy" },
      { emotion: "Hungry", image: "/placeholder.svg?height=200&width=200&text=Hungry" }
    ],
    correctAnswer: "Sad"
  },
  {
    question: "What would you say if you accidentally bumped into someone?",
    options: [
      { emotion: "Sorry", image: "/placeholder.svg?height=200&width=200&text=Sorry" },
      { emotion: "Thanks", image: "/placeholder.svg?height=200&width=200&text=Thanks" },
      { emotion: "Hello", image: "/placeholder.svg?height=200&width=200&text=Hello" },
      { emotion: "Goodbye", image: "/placeholder.svg?height=200&width=200&text=Goodbye" }
    ],
    correctAnswer: "Sorry"
  },
  {
    question: "If someone gives you a gift, what should you say?",
    options: [
      { emotion: "Please", image: "/placeholder.svg?height=200&width=200&text=Please" },
      { emotion: "Thanks", image: "/placeholder.svg?height=200&width=200&text=Thanks" },
      { emotion: "Oops", image: "/placeholder.svg?height=200&width=200&text=Oops" },
      { emotion: "Maybe", image: "/placeholder.svg?height=200&width=200&text=Maybe" }
    ],
    correctAnswer: "Thanks"
  },
  {
    question: "How might you feel if someone took your toy without asking?",
    options: [
      { emotion: "Happy", image: "/placeholder.svg?height=200&width=200&text=Happy" },
      { emotion: "Angry", image: "/placeholder.svg?height=200&width=200&text=Angry" },
      { emotion: "Sleepy", image: "/placeholder.svg?height=200&width=200&text=Sleepy" },
      { emotion: "Proud", image: "/placeholder.svg?height=200&width=200&text=Proud" }
    ],
    correctAnswer: "Angry"
  },
  {
    question: "What emotion might you feel when trying something new?",
    options: [
      { emotion: "Nervous", image: "/placeholder.svg?height=200&width=200&text=Nervous" },
      { emotion: "Bored", image: "/placeholder.svg?height=200&width=200&text=Bored" },
      { emotion: "Angry", image: "/placeholder.svg?height=200&width=200&text=Angry" },
      { emotion: "Tired", image: "/placeholder.svg?height=200&width=200&text=Tired" }
    ],
    correctAnswer: "Nervous"
  },
  {
    question: "How might you feel if you got a good grade on a test?",
    options: [
      { emotion: "Sad", image: "/placeholder.svg?height=200&width=200&text=Sad" },
      { emotion: "Proud", image: "/placeholder.svg?height=200&width=200&text=Proud" },
      { emotion: "Scared", image: "/placeholder.svg?height=200&width=200&text=Scared" },
      { emotion: "Angry", image: "/placeholder.svg?height=200&width=200&text=Angry" }
    ],
    correctAnswer: "Proud"
  },
  {
    question: "What emotion might you feel if you saw a big dog?",
    options: [
      { emotion: "Excited", image: "/placeholder.svg?height=200&width=200&text=Excited" },
      { emotion: "Bored", image: "/placeholder.svg?height=200&width=200&text=Bored" },
      { emotion: "Scared", image: "/placeholder.svg?height=200&width=200&text=Scared" },
      { emotion: "Proud", image: "/placeholder.svg?height=200&width=200&text=Proud" }
    ],
    correctAnswer: "Scared"
  }

];

const SocialQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
  };

  const score = answers.filter((answer, index) => answer === questions[index].correctAnswer).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showResult ? (
        <>
          <Text style={styles.title}>Social Situation Quiz</Text>
          <Text style={styles.question}>{questions[currentQuestion].question}</Text>
          <View style={styles.options}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => handleAnswer(option.emotion)} 
                style={[styles.optionButton,
                  answers[currentQuestion] === option.emotion && {
                    backgroundColor: option.emotion === questions[currentQuestion].correctAnswer 
                      ? '#28a745' : '#dc3545'
                  }
                ]}
              >
                <Image source={{ uri: option.image }} style={styles.optionImage} />
                <Text style={styles.optionText}>{option.emotion}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.progress}>Question {currentQuestion + 1} of {questions.length}</Text>
          <TouchableOpacity onPress={() => setShowResult(true)} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Complete Quiz</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.result}>
          <Text style={styles.title}>Quiz Completed!</Text>
          <View style={[styles.resultBox, 
            score >= 6 ? styles.highScore : score >= 4 ? styles.mediumScore : styles.lowScore]}>
            <Text style={styles.score}>Your score: {score} out of {questions.length}</Text>
          </View>
          {questions.map((question, index) => (
            <View key={index} style={[styles.questionResult, 
              answers[index] === question.correctAnswer ? styles.correctBox : styles.incorrectBox]}>
              <Text style={styles.questionText}>{question.question}</Text>
              <Text style={answers[index] === question.correctAnswer ? styles.correct : styles.incorrect}>
                Your answer: {answers[index] || 'Not answered'}
              </Text>
              <Text style={styles.correctAnswer}>Correct answer: {question.correctAnswer}</Text>
            </View>
          ))}
          <TouchableOpacity onPress={restartQuiz} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderColor: '#007bff',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%', // Ensures consistent width
    aspectRatio: 1, // Makes height proportional to width
    maxHeight: 150, // Prevents excessive height differences
  },
  correctAnswerSelected: {
    backgroundColor: '#28a745',
  },
  incorrectAnswerSelected: {
    backgroundColor: '#dc3545',
  },
  optionImage: {
    width: '80%', // Ensures images scale consistently
    height: 80, // Keeps image sizes uniform
    resizeMode: 'contain',
    marginBottom: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    flexShrink: 1, // Prevents text from expanding too much
  },
  progress: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  completeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  result: {
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionResult: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  correct: {
    color: '#28a745',
  },
  incorrect: {
    color: '#dc3545',
  },
  restartButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
  },
  questionResult: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow effect
  },
  
  correctBox: {
    backgroundColor: '#d4edda', // Light green background
    borderLeftWidth: 6,
    borderLeftColor: '#28a745', // Green side border for correct answers
  },
  
  incorrectBox: {
    backgroundColor: '#f8d7da', // Light red background
    borderLeftWidth: 6,
    borderLeftColor: '#dc3545', // Red side border for incorrect answers
  },
  
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  answerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  
  correct: {
    color: '#28a745', // Green for correct answers
    fontWeight: 'bold',
  },
  
  incorrect: {
    color: '#dc3545', // Red for incorrect answers
    fontWeight: 'bold',
  },
  
  correctAnswer: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  
  restartButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default SocialQuiz;
