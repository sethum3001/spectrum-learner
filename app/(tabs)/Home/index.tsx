import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function SocialReportaryIndex() {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Social Reportary</Text>
      <Link href="/(tabs)/SocialReciportary" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </Pressable>
      </Link>
      <Link href="/(tabs)/SocialReciportary" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Go to Profile</Text>
        </Pressable>
      </Link> */}
    </View>
  );
}

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
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 6,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

