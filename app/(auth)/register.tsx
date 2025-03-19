import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const theme = {
  primary: '#ABC8A2', 
  background: '#FFFFFF', 
  text: '#1A2417', 
  secondaryText: '#666666', 
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childGender, setChildGender] = useState('');
  const [caretakerName, setCaretakerName] = useState('');

  const handleRegister = () => {
    router.push('/log-in');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/girl-with-tab.png')} 
          style={styles.illustration}
        />
      </View>

      <View style={styles.bottomSection}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.title}>CREATE NEW ACCOUNT</Text>

          <View style={styles.socialButtonsContainer}>
            <Pressable style={[styles.socialButton, { backgroundColor: '#3b5998' }]}>
              <FontAwesome name="facebook" size={24} color="#FFFFFF" />
            </Pressable>
            <Pressable style={[styles.socialButton, { backgroundColor: '#1da1f2' }]}>
              <FontAwesome name="twitter" size={24} color="#FFFFFF" />
            </Pressable>
            <Pressable style={[styles.socialButton, { backgroundColor: '#db4437' }]}>
              <FontAwesome name="google" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
          <Text style={styles.dividerText}>or use your email account</Text>

          <TextInput
            style={styles.input}
            placeholder="USERNAME"
            placeholderTextColor={theme.secondaryText}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor={theme.secondaryText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            placeholderTextColor={theme.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="CHILD'S NAME"
            placeholderTextColor={theme.secondaryText}
            value={childName}
            onChangeText={setChildName}
          />
          <TextInput
            style={styles.input}
            placeholder="CHILD'S AGE"
            placeholderTextColor={theme.secondaryText}
            value={childAge}
            onChangeText={setChildAge}
            keyboardType="numeric"
          />

          <Text style={styles.label}>CHILD'S GENDER</Text>
          <View style={styles.genderContainer}>
            <Pressable
              style={[styles.genderButton, childGender === 'male' && styles.genderButtonSelected]}
              onPress={() => setChildGender('male')}
            >
              <Text style={[styles.genderButtonText, childGender === 'male' && { color: '#FFFFFF' }]}>Male</Text>
            </Pressable>
            <Pressable
              style={[styles.genderButton, childGender === 'female' && styles.genderButtonSelected]}
              onPress={() => setChildGender('female')}
            >
              <Text style={[styles.genderButtonText, childGender === 'female' && { color: '#FFFFFF' }]}>Female</Text>
            </Pressable>
            <Pressable
              style={[styles.genderButton, childGender === 'other' && styles.genderButtonSelected]}
              onPress={() => setChildGender('other')}
            >
              <Text style={[styles.genderButtonText, childGender === 'other' && { color: '#FFFFFF' }]}>Other</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="CARETAKER'S NAME"
            placeholderTextColor={theme.secondaryText}
            value={caretakerName}
            onChangeText={setCaretakerName}
          />

          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </Pressable>

          <Text style={styles.footerText}>
            ALREADY HAVE AN ACCOUNT?{' '}
            <Text style={styles.linkText} onPress={() => router.push('/log-in')}>
              LOGIN HERE
            </Text>
          </Text>
        </ScrollView>
      </View>

      {/* Back arrow */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  topSection: {
    height: '35%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    marginTop: 30,
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: theme.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  formContainer: {
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dividerText: {
    textAlign: 'center',
    color: theme.secondaryText,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  genderButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: theme.primary,
  },
  genderButtonText: {
    color: theme.text,
  },
  button: {
    backgroundColor: theme.text,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    color: theme.secondaryText,
    marginTop: 20,
  },
  linkText: {
    color: theme.primary,
    textDecorationLine: 'underline',
  },
});

export default Register;