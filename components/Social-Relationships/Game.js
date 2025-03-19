/* import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet, 
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyEntryContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  historyScenarioText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  simplificationLevelText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  imageCountInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  imageCountLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  imageCountInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    padding: 5,
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    width: width / 3 - 20,
    height: width / 3 - 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
  simplifyButton: {
    backgroundColor: '#28a745',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  simplifyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4ECDC4',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

// Mock scenario generation function with simplification levels
const generateScenario = (input, simplificationLevel = 0) => {
  // In a real app, this would be an API call or AI-generated content
  const scenarios = [
    `Original Scenario: ${input}`,
    `Simplified Scenario (Level 1): Simplified version of ${input}`,
    `Simplified Scenario (Level 2): More simplified version of ${input}`,
    `Simplified Scenario (Level 3): Extremely simplified version of ${input}`
  ];
  return scenarios[Math.min(simplificationLevel, scenarios.length - 1)];
};

const ScenarioGenerator = () => {
  const [input, setInput] = useState('');
  const [imageCount, setImageCount] = useState('4');
  const [scenarioHistory, setScenarioHistory] = useState([]);
  const scrollViewRef = useRef(null);
  const router = useRouter();

  const handleSubmit = () => {
    // Validate image count input
    const parsedImageCount = parseInt(imageCount);
    if (isNaN(parsedImageCount) || parsedImageCount < 1 || parsedImageCount > 10) {
      Alert.alert(
        'Invalid Image Count', 
        'Please enter a number between 1 and 10'
      );
      return;
    }

    if (input.trim() === '') return;

    // Generate scenario and create a new history entry
    const scenario = generateScenario(input);
    const newEntry = {
      input,
      scenario,
      imageCount: parsedImageCount,
      simplificationLevel: 0,
      timestamp: Date.now()
    };

    // Update scenario history
    setScenarioHistory([...scenarioHistory, newEntry]);
    
    // Reset input
    setInput('');
    setImageCount('');
  };

  const handleSimplify = (index) => {
    // Create a copy of the scenario history
    const updatedHistory = [...scenarioHistory];
    const entryToSimplify = updatedHistory[index];

    // Increase simplification level
    const newSimplificationLevel = Math.min(
      (entryToSimplify.simplificationLevel || 0) + 1, 
      3
    );

    // Generate simplified scenario
    const simplifiedScenario = generateScenario(
      entryToSimplify.input, 
      newSimplificationLevel
    );

    // Update the entry
    entryToSimplify.scenario = simplifiedScenario;
    entryToSimplify.simplificationLevel = newSimplificationLevel;

    // Update the history
    setScenarioHistory(updatedHistory);
  };

  const renderHistoryEntry = (entry, index) => {
    return (
      <View key={entry.timestamp} style={styles.historyEntryContainer}>
        <Text style={styles.historyScenarioText}>{entry.scenario}</Text>
        <Text style={styles.simplificationLevelText}>
          Simplification Level: {entry.simplificationLevel}
        </Text>
        <View style={styles.imageGrid}>
          {[...Array(entry.imageCount)].map((_, imgIndex) => (
            <Image 
              key={`${imgIndex}-${entry.timestamp}`}
              source={{ 
                uri: `https://via.placeholder.com/150x150.png?text=Image+${imgIndex + 1}` 
              }}
              style={styles.image}
            />
          ))}
        </View>
        {entry.simplificationLevel < 3 && (
          <TouchableOpacity 
            onPress={() => handleSimplify(index)} 
            style={styles.simplifyButton}
          >
            <Text style={styles.simplifyButtonText}>Simplify More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentContainer}>
          <View style={styles.imageCountInputContainer}>
            <Text style={styles.imageCountLabel}>Number of Images:</Text>
            <TextInput 
              style={styles.imageCountInput}
              value={imageCount}
              onChangeText={setImageCount}
              keyboardType="numeric"
              placeholder="4"
            />
          </View>

          <View style={styles.historyContainer}>
            <ScrollView>
              {scenarioHistory.map(renderHistoryEntry).reverse()}
            </ScrollView>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Describe a scenario..."
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => router.push('/(tabs)/SocialRelationships/question')}
      >
        <Ionicons name="arrow-forward-circle" size={32} color="#fff" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ScenarioGenerator; */

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
    backgroundColor: '#E3F2FD', // Soft blue
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 20,
  },
  historyEntryContainer: {
    backgroundColor: '#FFEB3B', 
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
  },
  imageCountInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  imageCountLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#00796B',
    fontWeight: 'bold',
  },
  imageCountInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#00796B',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 10,
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
    backgroundColor: '#D84315',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  floatingButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  floatingButton: {
    backgroundColor: '#FF7043',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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
    marginBottom: 10,
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
    `Simplified (Level 1): Less complex ${input}`,
    `Simplified (Level 2): Easier version ${input}`,
    `Simplified (Level 3): Very simple ${input}`
  ];
  return scenarios[Math.min(level, scenarios.length - 1)];
};

const ScenarioGenerator = () => {
  const [input, setInput] = useState('');
  const [imageCount, setImageCount] = useState('4');
  const [scenarioHistory, setScenarioHistory] = useState([]);
  const router = useRouter();
  
  const handleSubmit = () => {
    if (!input.trim()) return;

    const parsedImageCount = parseInt(imageCount);
    if (isNaN(parsedImageCount) || parsedImageCount < 1 || parsedImageCount > 10) {
      alert('Please enter a number between 1 and 10');
      return;
    }

    const newEntry = {
      input,
      scenario: generateScenario(input),
      simplificationLevel: 0,
      imageCount: parsedImageCount,
      timestamp: Date.now()
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
        
        <View style={styles.imageCountInputContainer}>
          <Text style={styles.imageCountLabel}>Number of Images:</Text>
          <TextInput 
            style={styles.imageCountInput}
            value={imageCount}
            onChangeText={setImageCount}
            keyboardType="numeric"
            placeholder="4"
          />
        </View>

        {scenarioHistory.map((entry, index) => (
          <View key={entry.timestamp} style={styles.historyEntryContainer}>
            <Text style={styles.historyScenarioText}>{entry.scenario}</Text>

            {/* Image Outline */}
            <View style={styles.imageOutlineContainer}>
              {[...Array(entry.imageCount)].map((_, imgIndex) => (
                <View key={`${imgIndex}-${entry.timestamp}`} style={styles.imageOutline}>
                  <Text style={styles.imagePlaceholderText}>Image {imgIndex + 1}</Text>
                </View>
              ))}
            </View>

            {entry.simplificationLevel < 3 && (
              <TouchableOpacity onPress={() => handleSimplify(index)} style={styles.simplifyButton}>
                <FontAwesome5 name="magic" size={18} color="#FFF" style={{ marginRight: 5 }} />
                <Text style={{ color: 'white', fontSize: 16 }}>Simplify More</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            value={input} 
            onChangeText={setInput} 
            placeholder="Describe a scenario..." 
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
