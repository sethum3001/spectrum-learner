import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  StyleSheet, Dimensions, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Warm, kid-friendly color
  },
  scrollViewContainer: {
    marginTop: 50,
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D84315', // Playful orange
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  characterImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  speechBubble: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  speechText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  historyEntryContainer: {
    backgroundColor: '#FFEB3B', // Bright yellow for fun
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  historyScenarioText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageCountSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageCountButton: {
    backgroundColor: '#0288D1', // Bright blue
    borderRadius: 20,
    padding: 10,
    margin: 5,
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#0288D1',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simplifyButton: {
    backgroundColor: '#D84315', // Warm orange
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  imageOutlineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
  },
  imageOutline: {
    width: width / 3 - 20,
    height: width / 3 - 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0288D1',
    backgroundColor: 'rgba(0, 136, 209, 0.1)',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#0288D1',
    fontSize: 14,
  },
});

const generateScenario = (input, level = 0) => {
  const scenarios = [
    `Original: ${input}`,
    `Simplified: Less complex ${input}`,
    `Easier: Simple ${input}`,
    `Super Easy: Very simple ${input}`,
  ];
  return scenarios[Math.min(level, scenarios.length - 1)];
};

const ScenarioGenerator = () => {
  const [input, setInput] = useState('');
  const [imageCount, setImageCount] = useState(4); // Default to 4
  const [scenarioHistory, setScenarioHistory] = useState([]);
  const router = useRouter();

  const handleSubmit = () => {
    if (!input.trim()) return;

    if (imageCount < 1 || imageCount > 10) {
      alert('Please pick between 1 and 10 pictures!');
      return;
    }

    const newEntry = {
      input,
      scenario: generateScenario(input),
      simplificationLevel: 0,
      imageCount,
      timestamp: Date.now(),
    };
    setScenarioHistory([...scenarioHistory, newEntry]);
    setInput('');
  };

  const handleSimplify = (index) => {
    const updatedHistory = [...scenarioHistory];
    const entry = updatedHistory[index];
    entry.simplificationLevel = Math.min(entry.simplificationLevel + 1, 3);
    entry.scenario = generateScenario(entry.input, entry.simplificationLevel);
    setScenarioHistory(updatedHistory);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Learn Social Skills with Fun Pictures!</Text>
        <Text style={styles.description}>
          Type a situation, and I’ll show you how to handle it with pictures. You can make it easier too!
        </Text>

        <View style={styles.characterContainer}>
          {/* Replace with a real character image */}
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.characterImage} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              Tell me a situation, and I’ll show you how to fix it with pictures!
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 16, color: '#D84315', textAlign: 'center', marginBottom: 10 }}>
          How many pictures do you want?
        </Text>
        <View style={styles.imageCountSelector}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.imageCountButton,
                imageCount === num && { backgroundColor: '#D84315' }, // Highlight selected
              ]}
              onPress={() => setImageCount(num)}
            >
              <Text style={styles.imageCountText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {scenarioHistory.map((entry, index) => (
          <View key={entry.timestamp} style={styles.historyEntryContainer}>
            <Text style={styles.historyScenarioText}>{entry.scenario}</Text>

            <View style={styles.imageOutlineContainer}>
              {[...Array(entry.imageCount)].map((_, imgIndex) => (
                <View key={`${imgIndex}-${entry.timestamp}`} style={styles.imageOutline}>
                  <Text style={styles.imagePlaceholderText}>Step {imgIndex + 1}</Text>
                </View>
              ))}
            </View>

            {entry.simplificationLevel < 3 && (
              <TouchableOpacity onPress={() => handleSimplify(index)} style={styles.simplifyButton}>
                <FontAwesome5 name="lightbulb" size={18} color="#FFF" style={{ marginRight: 5 }} />
                <Text style={{ color: '#FFF', fontSize: 16 }}>Make it Easier</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="What happened? (e.g., Someone took my toy)"
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ScenarioGenerator;