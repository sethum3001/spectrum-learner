import { Link } from "expo-router";
import { Text, View, Pressable, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome Specturm Learner
      </Text>
      <View style={styles.buttonContainer}>
        <Link href="/(auth)/log-in" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </Link>
        <Link href="/(auth)/register" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </Link>
      </View>
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
    marginBottom: 40,
    color: '#333',
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
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

