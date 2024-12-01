import { Link } from "expo-router";
import { Text, View, Pressable, StyleSheet, Animated, Image } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>
        Welcome Spectrum Learn
      </Text>
      {!showButtons && (
        <Image
          source={{ uri: 'https://example.com/school-book-icon.png' }} // Replace with a URL to a school book icon
          style={styles.educationIcon}
        />
      )}
      {showButtons && (
        <View style={styles.buttonContainer}>
          <Link href="/(auth)/log-in" asChild>
            <Pressable style={[styles.button, { backgroundColor: '#FFFFFF' }]}>
              <Feather name="users" size={24} color="#FF6B6B" style={styles.icon} />
              <Text style={[styles.buttonText, { color: '#FF6B6B' }]}>Login</Text>
            </Pressable>
          </Link>
          <Link href="/(auth)/register" asChild>
            <Pressable style={[styles.button, { backgroundColor: '#FFFFFF' }]}>
              <Feather name="heart" size={24} color="#4ECDC4" style={styles.icon} />
              <Text style={[styles.buttonText, { color: '#4ECDC4' }]}>Register</Text>
            </Pressable>
          </Link>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F4F8', // Light orange background color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content horizontally
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#FFFFFF', // White background color
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  educationIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});