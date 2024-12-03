import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, router } from 'expo-router';

const AuthIndex = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.button} 
          onPress={() => router.push('/log-in')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Link href="/register" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthIndex;

