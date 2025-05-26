import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  scrollViewContainer: {
    marginTop: 50,
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D84315',
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
    backgroundColor: '#D84315',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#28A745',
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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  scenarioImage: {
    width: width / 2 - 20,
    height: width / 2 - 20,
    borderRadius: 10,
    margin: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ScenarioGenerator = () => {
  const [input, setInput] = useState('');
  const [scenarioData, setScenarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        'https://social-relationship.up.railway.app/process_scenario?accuracy=0.7&child_id=child_001',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caretaker_input: input,
            current_difficulty: 2,
          }),
        }
      );
      const data = await response.json();
      setScenarioData(data);
    } catch (error) {
      console.error('Error fetching scenario:', error);
      alert('Something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://social-relationship.up.railway.app/visualize_scenario_for_asd',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenario: input }),
        }
      );
      const data = await response.json();
      setScenarioData({ ...scenarioData, steps: data.steps });
    } catch (error) {
      console.error('Error simplifying scenario:', error);
      alert('Failed to simplify. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    router.push({ pathname: '/(tabs)/SocialRelationships/QuizScreen', params: { mcqs: JSON.stringify(scenarioData.mcqs), input } });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Explore Your Special Interests!</Text>
        <Text style={styles.description}>
          Type a situation, and I’ll show you fun pictures to learn from!
        </Text>

        <View style={styles.characterContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.characterImage} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              Tell me something fun, and I’ll make pictures for you!
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#D84315" />
            <Text style={{ marginTop: 10, color: '#555' }}>Loading your pictures...</Text>
          </View>
        ) : scenarioData ? (
          <>
            <View style={styles.imageContainer}>
              {scenarioData.steps.map((url, index) => (
                <Image key={index} source={{ uri: url }} style={styles.scenarioImage} />
              ))}
            </View>
            <TouchableOpacity onPress={handleSimplify} style={styles.simplifyButton} disabled={loading}>
              <FontAwesome5 name="lightbulb" size={18} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={styles.buttonText}>Make it Easier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.nextButton} disabled={loading}>
              <Text style={styles.buttonText}>Take the Quiz</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 5 }} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="What do you want to learn? (e.g., How to cross the road safely)"
              editable={!loading}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.sendButton} disabled={loading}>
              <Ionicons name="send" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ScenarioGenerator;