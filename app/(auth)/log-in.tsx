import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const theme = {
  primary: '#ABC8A2',
  background: '#FFFFFF',
  text: '#1A2417',
  secondaryText: '#666666',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    router.push('/(tabs)/Home/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/girl-with-book.png')}
          style={styles.illustration}
        />
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.title}>LOGIN TO YOUR ACCOUNT</Text>
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
        <Text style={styles.dividerText}>or use your email</Text>
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
        <View style={styles.optionsContainer}>
          <Pressable style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>REMEMBER ME</Text>
          </Pressable>
          <Text style={styles.linkText} onPress={() => router.push('/log-in')}>
            FORGOT PASSWORD?
          </Text>
        </View>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
        <Text style={styles.footerText}>
          DON'T HAVE AN ACCOUNT?{' '}
          <Text style={styles.linkText} onPress={() => router.push('/register')}>
            REGISTER HERE
          </Text>
        </Text>
      </View>
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
    padding: 20,
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: theme.primary,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: theme.primary,
  },
  checkboxLabel: {
    color: theme.secondaryText,
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

export default Login;