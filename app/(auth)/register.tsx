import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childGender, setChildGender] = useState('');
  const [caretakerName, setCaretakerName] = useState('');

  const handleRegister = () => {
    // Here you would typically send the registration data to your backend
    // For now, we'll just navigate to the login page
    router.push('/log-in');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Child's Name"
          value={childName}
          onChangeText={setChildName}
        />
        <TextInput
          style={styles.input}
          placeholder="Child's Age"
          value={childAge}
          onChangeText={setChildAge}
          keyboardType="numeric"
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={childGender}
            onValueChange={(itemValue: string) => setChildGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Child's Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Caretaker's Name"
          value={caretakerName}
          onChangeText={setCaretakerName}
        />
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Register;

