"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function WordJumble() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Categorized words for story generation
  const categorizedWords = {
    themes: [
      "Fantasy",
      "Mystery",
      "Adventure",
      "Magic",
      "Friendship",
      "Discovery",
      "Quest",
      "Wonder",
      "Enchantment",
      "Journey",
    ],
    characters: [
      "Curious squirrel",
      "Wise owl",
      "Brave rabbit",
      "Clever fox",
      "Kind bear",
      "Playful dragon",
      "Magical fairy",
      "Noble knight",
      "Talking tree",
      "Flying unicorn",
    ],
    settings: [
      "Magical forest",
      "Ancient woodland",
      "Mystical garden",
      "Enchanted castle",
      "Secret meadow",
      "Crystal cave",
      "Floating island",
      "Hidden valley",
      "Starlit grove",
      "Rainbow bridge",
    ],
  };

  // Flatten all words for display
  const allWords = [
    ...categorizedWords.themes,
    ...categorizedWords.characters,
    ...categorizedWords.settings,
  ];

  const [jumbledWords, setJumbledWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    setJumbledWords(shuffleArray([...allWords]));

    // Start the bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const toggleWordSelection = (word) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  // Function to categorize selected words
  const categorizeSelectedWords = () => {
    const selectedThemes = selectedWords.filter((word) =>
      categorizedWords.themes.includes(word)
    );
    const selectedCharacters = selectedWords.filter((word) =>
      categorizedWords.characters.includes(word)
    );
    const selectedSettings = selectedWords.filter((word) =>
      categorizedWords.settings.includes(word)
    );

    return {
      themes: selectedThemes.length > 0 ? selectedThemes : ["magical forest"], // fallback
      characters:
        selectedCharacters.length > 0
          ? selectedCharacters
          : ["a curious squirrel and a wise owl"], // fallback
      settings:
        selectedSettings.length > 0 ? selectedSettings : ["ancient woodland"], // fallback
    };
  };

  // Function to get word category for display
  const getWordCategory = (word) => {
    if (categorizedWords.themes.includes(word)) return "theme";
    if (categorizedWords.characters.includes(word)) return "character";
    if (categorizedWords.settings.includes(word)) return "setting";
    return "";
  };

  const handleContinue = () => {
    setGameCompleted(true);
  };

  const handleFinish = () => {
    const categorizedSelections = categorizeSelectedWords();

    console.log("🎭 NAVIGATION - Passing selected words to GameScreen:");
    console.log("📍 Themes:", categorizedSelections.themes);
    console.log("👥 Characters:", categorizedSelections.characters);
    console.log("🏞️ Settings:", categorizedSelections.settings);

    // Navigate to game with selected story parameters
    router.push({
      pathname: "/(tabs)/RepetitiveBehavior/game",
      params: {
        selectedThemes: JSON.stringify(categorizedSelections.themes),
        selectedCharacters: JSON.stringify(categorizedSelections.characters),
        selectedSettings: JSON.stringify(categorizedSelections.settings),
      },
    });
  };

  return (
    <LinearGradient colors={["#FFFFFF", "#E6F4FF"]} style={styles.container}>
      <Image
        source={require("../../assets/images/cloud1.png")}
        style={styles.cloud1}
      />
      <Image
        source={require("../../assets/images/cloud2.png")}
        style={styles.cloud2}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Let's make a story</Text>
            <Text style={styles.subtitle}>Build our own adventure!</Text>
          </View>

          {!gameCompleted ? (
            <View style={styles.content}>
              <Text style={styles.description}>
                Choose themes, characters, and settings for your story!
              </Text>

              <View style={styles.wordGrid}>
                {jumbledWords.map((word, index) => {
                  const category = getWordCategory(word);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.wordButton,
                        selectedWords.includes(word) &&
                          styles.selectedWordButton,
                        category === "theme" && styles.themeButton,
                        category === "character" && styles.characterButton,
                        category === "setting" && styles.settingButton,
                      ]}
                      onPress={() => toggleWordSelection(word)}
                    >
                      <Text
                        style={[
                          styles.wordButtonText,
                          selectedWords.includes(word) &&
                            styles.selectedWordButtonText,
                        ]}
                      >
                        {word}
                      </Text>
                      <Text style={styles.categoryLabel}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.selectedWordsContainer}>
                <Text style={styles.selectedWordsTitle}>Your Collection:</Text>
                <View style={styles.selectedWordsList}>
                  {selectedWords.map((word, index) => {
                    const category = getWordCategory(word);
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.selectedWordChip,
                          category === "theme" && styles.themeChip,
                          category === "character" && styles.characterChip,
                          category === "setting" && styles.settingChip,
                        ]}
                        onPress={() => toggleWordSelection(word)}
                      >
                        <Text style={styles.selectedWordChipText}>{word}</Text>
                        <Text style={styles.chipCategoryLabel}>{category}</Text>
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color="#1E88E5"
                          style={styles.chipIcon}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <Animated.View
                style={[
                  styles.buttonContainer,
                  {
                    transform: [
                      {
                        translateY: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    selectedWords.length === 0 && styles.disabledButton,
                  ]}
                  onPress={handleContinue}
                  disabled={selectedWords.length === 0}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          ) : (
            <View style={styles.content}>
              <Text style={styles.completionText}>
                Great job! You selected:
              </Text>
              <View style={styles.completionWordsList}>
                {selectedWords.map((word, index) => (
                  <View key={index} style={styles.completionWordChip}>
                    <Text style={styles.completionWordText}>{word}</Text>
                  </View>
                ))}
              </View>

              <Animated.View
                style={[
                  styles.buttonContainer,
                  {
                    transform: [
                      {
                        translateY: bounceAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.finishButtonLarge}
                  onPress={handleFinish}
                >
                  <Text style={styles.finishButtonText}>Let's Go!</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </ScrollView>

        {!gameCompleted && (
          <TouchableOpacity
            style={styles.finishButtonFloat}
            onPress={handleFinish}
          >
            <Ionicons name="checkmark-circle" size={32} color="#fff" />
          </TouchableOpacity>
        )}
      </SafeAreaView>

      {/* <Image source={require("../../assets/images/grass.png")} style={styles.grass} /> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  cloud1: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 100,
    height: 60,
  },
  cloud2: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 80,
    height: 50,
  },
  grass: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 50,
    resizeMode: "stretch",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1E88E5",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 22,
    color: "#4A4A4A",
    textAlign: "center",
    marginTop: 10,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  wordGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  wordButton: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    margin: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#BBDEFB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedWordButton: {
    backgroundColor: "#2196F3",
    borderColor: "#1976D2",
  },
  wordButtonText: {
    fontSize: 16,
    color: "#1E88E5",
    fontWeight: "600",
  },
  selectedWordButtonText: {
    color: "#fff",
  },
  selectedWordsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  selectedWordsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  selectedWordsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  selectedWordChip: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  selectedWordChipText: {
    color: "#1E88E5",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
  chipIcon: {
    marginLeft: 2,
  },
  // Category-specific button styles
  themeButton: {
    borderColor: "#FF6B6B",
    borderWidth: 2,
  },
  characterButton: {
    borderColor: "#4ECDC4",
    borderWidth: 2,
  },
  settingButton: {
    borderColor: "#45B7D1",
    borderWidth: 2,
  },
  categoryLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 2,
  },
  // Category-specific chip styles
  themeChip: {
    backgroundColor: "#FFE5E5",
    borderColor: "#FF6B6B",
    borderWidth: 1,
  },
  characterChip: {
    backgroundColor: "#E5F9F6",
    borderColor: "#4ECDC4",
    borderWidth: 1,
  },
  settingChip: {
    backgroundColor: "#E5F4FF",
    borderColor: "#45B7D1",
    borderWidth: 1,
  },
  chipCategoryLabel: {
    fontSize: 8,
    color: "#999",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginLeft: 5,
  },
  buttonContainer: {
    marginTop: 15,
  },
  continueButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#90CAF9",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  completionText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E88E5",
    textAlign: "center",
  },
  completionWordsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  completionWordChip: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completionWordText: {
    color: "#1E88E5",
    fontSize: 18,
    fontWeight: "600",
  },
  finishButtonLarge: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  finishButtonFloat: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2196F3",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
