"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

const { height, width } = Dimensions.get("window");

// Fallback hardcoded story stages
const fallbackStoryStages = [
  [
    "Once upon a time, there was a brave princess who",
    "set out on a journey to save her kingdom from a wicked dragon.",
    "Along the way, she met a wise old woman who gave her a magic sword.",
  ],
  [
    "With the sword in hand, the princess faced the dragon",
    "and emerged victorious, saving her kingdom and its people.",
    "The grateful citizens celebrated her bravery with a grand feast.",
  ],
  [
    "Years passed, and the princess became a wise and just queen.",
    "She ruled her kingdom with compassion and strength,",
    "always remembering the lessons she learned on her great adventure.",
  ],
  [
    "And so, the kingdom flourished under her reign,",
    "becoming a beacon of hope and prosperity for all who lived there.",
    "The end.",
  ],
];

const DraggableSentence = ({
  sentence,
  index,
  onDragEnd,
  isInTopSection,
  onRemove,
  onRearrange,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const context = useSharedValue({ y: 0 });
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
      scale.value = withTiming(1.05, { duration: 200 });
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      if (isInTopSection) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      scale.value = withTiming(1, { duration: 200 });
      if (isInTopSection) {
        translateY.value = withSpring(0);
        translateX.value = withSpring(0);
        runOnJS(onRearrange)(index, event.absoluteY);
      } else {
        translateY.value = withSpring(0);
        runOnJS(onDragEnd)(index, event.absoluteY);
      }
    })
    .minDistance(10)
    .activateAfterLongPress(300);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: isInTopSection ? translateX.value : 0 },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.sentence,
          animatedStyle,
          isInTopSection ? styles.topSentence : styles.bottomSentence,
        ]}
      >
        <LinearGradient
          colors={
            isInTopSection ? ["#4ECDC4", "#2196F3"] : ["#2196F3", "#1976D2"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sentenceGradient}
        >
          <Text style={styles.sentenceText}>{sentence}</Text>
          {isInTopSection && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(index)}
            >
              <Feather name="x" color="#fff" size={16} />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </Animated.View>
    </GestureDetector>
  );
};

const StoryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse selected words from PromptSelector
  const selectedThemes = params.selectedThemes
    ? JSON.parse(params.selectedThemes)
    : ["magical forest"];
  const selectedCharacters = params.selectedCharacters
    ? JSON.parse(params.selectedCharacters)
    : ["a curious squirrel and a wise owl"];
  const selectedSettings = params.selectedSettings
    ? JSON.parse(params.selectedSettings)
    : ["ancient woodland"];

  const [bottomSentences, setBottomSentences] = useState([]);
  const [topSentences, setTopSentences] = useState([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const topScrollViewRef = useRef(null);
  const bottomScrollViewRef = useRef(null);
  const successScale = useSharedValue(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  // New state for dynamic story
  const [storyStages, setStoryStages] = useState([]);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [fetchedStory, setFetchedStory] = useState("");
  const [storyPermutations, setStoryPermutations] = useState([]);
  const [allStorySentences, setAllStorySentences] = useState([]);
  const [evaluationResults, setEvaluationResults] = useState([]);
  const [storyContinuations, setStoryContinuations] = useState([]);
  const [currentStoryVersion, setCurrentStoryVersion] = useState(0);

  // Scroll enhancement utilities
  const enhanceScrolling = () => {
    if (topScrollViewRef.current) {
      topScrollViewRef.current.flashScrollIndicators();
    }
    if (bottomScrollViewRef.current) {
      bottomScrollViewRef.current.flashScrollIndicators();
    }
  };

  const scrollToTop = (scrollViewRef) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const scrollToBottom = (scrollViewRef) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Function to create dynamic request data from selected words
  const createStoryRequestData = () => {
    // Randomly select from user's choices or use defaults
    const theme =
      selectedThemes.length > 0
        ? selectedThemes[Math.floor(Math.random() * selectedThemes.length)]
        : "magical forest";
    const character =
      selectedCharacters.length > 0
        ? selectedCharacters[
            Math.floor(Math.random() * selectedCharacters.length)
          ]
        : "a curious squirrel and a wise owl";
    const setting =
      selectedSettings.length > 0
        ? selectedSettings[Math.floor(Math.random() * selectedSettings.length)]
        : "ancient woodland";

    console.log("🎭 DYNAMIC STORY REQUEST - Using selected words:");
    console.log(
      `📍 Selected Themes: [${selectedThemes.join(", ")}] → Using: "${theme}"`
    );
    console.log(
      `👥 Selected Characters: [${selectedCharacters.join(
        ", "
      )}] → Using: "${character}"`
    );
    console.log(
      `🏞️ Selected Settings: [${selectedSettings.join(
        ", "
      )}] → Using: "${setting}"`
    );

    return {
      theme: theme,
      characters: character,
      setting: setting,
    };
  };

  // Function to evaluate permutation using API
  const evaluatePermutation = async (childPermutation) => {
    try {
      // Create baseline permutation (random permutation of all sentences)
      const baselinePermutation = [...allStorySentences].sort(
        () => Math.random() - 0.5
      );

      // Use fetched story permutations as valid permutations, or create some if none exist
      let validPermutations = [];
      if (storyPermutations.length > 0) {
        validPermutations = storyPermutations.map((perm) => perm.sentences);
        console.log(
          `🎯 Using ${validPermutations.length} generated permutations as valid references`
        );
      } else {
        // Create a few valid permutations if none exist
        validPermutations = [
          allStorySentences, // Original order
          [...allStorySentences].reverse(), // Reversed order
          [...allStorySentences].sort(() => Math.random() - 0.5), // Random order
        ];
        console.log(
          "⚠️ No generated permutations available, using fallback permutations"
        );
      }

      // Clear, detailed logging for debugging
      console.log("=".repeat(80));
      console.log("🔍 EVALUATION DEBUG - PERMUTATION ANALYSIS");
      console.log("=".repeat(80));
      console.log(`📍 Current Stage: ${currentStage + 1}`);
      console.log(`📖 Story Version: ${currentStoryVersion + 1}`);
      console.log(
        `📊 Total sentences in current story: ${allStorySentences.length}`
      );

      console.log("\n👦 CHILD PERMUTATION (User's Arrangement):");
      childPermutation.forEach((sentence, index) => {
        console.log(`  ${index + 1}. "${sentence}"`);
      });

      console.log("\n📊 BASELINE PERMUTATION (Random Reference):");
      baselinePermutation.forEach((sentence, index) => {
        console.log(`  ${index + 1}. "${sentence}"`);
      });

      console.log(
        `\n✅ VALID PERMUTATIONS (${validPermutations.length} total):`
      );
      validPermutations.forEach((permutation, permIndex) => {
        console.log(`  Permutation ${permIndex + 1}:`);
        permutation.forEach((sentence, sentIndex) => {
          console.log(`    ${sentIndex + 1}. "${sentence}"`);
        });
        console.log("");
      });

      const requestData = {
        baseline_permutation: baselinePermutation,
        valid_permutations: validPermutations,
        child_permutation: childPermutation,
        validity_weight: 0.7,
        creativity_weight: 0.3,
      };

      console.log("📤 EVALUATION API REQUEST DATA:");
      console.log(JSON.stringify(requestData, null, 2));

      console.log("\n🚀 Sending evaluation request to API...");
      const response = await axios.post(
        "https://rp-creativewriting-production.up.railway.app/evaluate-permutation",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("\n📥 EVALUATION API RESPONSE:");
      console.log(JSON.stringify(response.data, null, 2));

      if (response.data) {
        const evaluationResult = {
          timestamp: new Date().toISOString(),
          stage: currentStage + 1,
          story_version: currentStoryVersion + 1,
          child_permutation: childPermutation,
          validity_score: response.data.validity_score || 0,
          creativity_score: response.data.creativity_score || 0,
          final_score: response.data.final_score || 0,
          permutations_used: validPermutations.length,
          baseline_permutation: baselinePermutation,
        };

        console.log("\n🎯 EVALUATION SCORES:");
        console.log(
          `  Validity Score: ${evaluationResult.validity_score} (Weight: 0.7)`
        );
        console.log(
          `  Creativity Score: ${evaluationResult.creativity_score} (Weight: 0.3)`
        );
        console.log(`  Final Score: ${evaluationResult.final_score}`);
        console.log(`  Stage: ${evaluationResult.stage}`);
        console.log(`  Story Version: ${evaluationResult.story_version}`);
        console.log(
          `  Permutations Used: ${evaluationResult.permutations_used}`
        );
        console.log(`  Timestamp: ${evaluationResult.timestamp}`);

        setEvaluationResults((prev) => [...prev, evaluationResult]);
        console.log("\n💾 Evaluation result saved to state");
        console.log("=".repeat(80));

        return evaluationResult;
      }
    } catch (error) {
      console.error("❌ Error evaluating permutation:", error);
      console.log("=".repeat(80));
      // Return default scores if API fails
      return {
        timestamp: new Date().toISOString(),
        stage: currentStage + 1,
        story_version: currentStoryVersion + 1,
        child_permutation: childPermutation,
        validity_score: 0,
        creativity_score: 0,
        final_score: 0,
        permutations_used: 0,
        baseline_permutation: [],
      };
    }
  };

  // Function to get story continuation from API
  const getStoryContinuation = async (validityScore, creativityScore) => {
    try {
      // Create dynamic continuation prompt using user selections
      const storyParams = createStoryRequestData();
      const continuationPrompt = `Continue this ${storyParams.theme} adventure featuring ${storyParams.characters} in the ${storyParams.setting} with new challenges and discoveries`;

      const requestData = {
        previous_story: fetchedStory,
        creativity_score: creativityScore,
        validity_score: validityScore,
        continuation_prompt: continuationPrompt,
      };

      console.log(
        "🔄 STORY CONTINUATION - Requesting new story with user preferences"
      );
      console.log("=".repeat(60));
      console.log("📤 Continuation Request Data:");
      console.log(JSON.stringify(requestData, null, 2));

      const response = await axios.post(
        "https://rp-creativewriting-production.up.railway.app/continue-story",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("📥 Continuation API Response:");
      console.log(JSON.stringify(response.data, null, 2));

      if (response.data && response.data.story_continuation) {
        const continuationData = {
          story: response.data.story_continuation,
          complexity_level: response.data.complexity_level || 1,
          narrative_context: response.data.narrative_context || {},
          timestamp: new Date().toISOString(),
          version: currentStoryVersion + 1,
        };

        setStoryContinuations((prev) => [...prev, continuationData]);
        console.log("✅ Story continuation saved");
        console.log("=".repeat(60));

        return continuationData;
      } else {
        throw new Error("No story continuation in response");
      }
    } catch (error) {
      console.error("❌ Error getting story continuation:", error);
      return null;
    }
  };

  // Function to reset to first stage with new story
  const resetToFirstStageWithNewStory = async () => {
    console.log("🔄 RESETTING TO FIRST STAGE - Fetching new story");

    // Clear current child's arrangement completely
    setTopSentences([]);
    setBottomSentences([]);

    // Reset stage and story version
    setCurrentStage(0);
    setCurrentStoryVersion((prev) => prev + 1);

    // Clear previous story data
    setStoryStages([]);
    setAllStorySentences([]);
    setStoryPermutations([]);

    console.log("🧹 Cleared all previous story data and child arrangements");

    // Fetch a completely new story
    await fetchStory();

    console.log("✅ Fresh story fetched, now resetting stage for new gameplay");

    // After fetching new story, properly reset the stage with new sentences
    setTimeout(() => {
      resetStage(0);
    }, 100); // Small delay to ensure state has updated
  };

  // Function to fetch story permutations from API
  const fetchStoryPermutations = async (story) => {
    try {
      const requestData = {
        story: story,
        max_permutations: 5,
        time_limit: 20,
      };

      console.log("🔄 PERMUTATION GENERATION - Starting");
      console.log("=".repeat(50));
      console.log("📤 Permutation Request Data:");
      console.log(JSON.stringify(requestData, null, 2));

      const response = await axios.post(
        "https://rp-creativewriting-production.up.railway.app/permutations",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("📥 Permutations API Response:");
      console.log(JSON.stringify(response.data, null, 2));

      if (response.data && response.data.permutations) {
        // Process each permutation into sentences
        const processedPermutations = response.data.permutations.map(
          (permutation, index) => {
            const sentences = permutation
              .split(/[.!?]+/)
              .filter((sentence) => sentence.trim().length > 0)
              .map(
                (sentence) =>
                  sentence.trim() +
                  (sentence.trim().endsWith(".") ||
                  sentence.trim().endsWith("!") ||
                  sentence.trim().endsWith("?")
                    ? ""
                    : ".")
              );

            return {
              id: index,
              story: permutation,
              sentences: sentences,
            };
          }
        );

        setStoryPermutations(processedPermutations);

        console.log("✅ PERMUTATION PROCESSING COMPLETE");
        console.log(
          `📊 Total permutations generated: ${processedPermutations.length}`
        );
        console.log("📋 Processed Permutations:");
        processedPermutations.forEach((perm, index) => {
          console.log(
            `  Permutation ${index + 1} (${perm.sentences.length} sentences):`
          );
          perm.sentences.forEach((sentence, sentIndex) => {
            console.log(`    ${sentIndex + 1}. "${sentence}"`);
          });
          console.log("");
        });
        console.log("=".repeat(50));
      } else {
        throw new Error("No permutations in response");
      }
    } catch (error) {
      console.error("❌ Error fetching story permutations:", error);
      console.log(
        "⚠️ Continuing without permutations for this story iteration"
      );
      console.log("=".repeat(50));
      // Continue without permutations if this fails
    }
  };

  // Function to process API story into sentences and create stages
  const processApiStory = async (apiStory, isContinuation = false) => {
    console.log("📖 STORY PROCESSING - Starting");
    console.log("=".repeat(50));

    // Split the API story into sentences
    const sentences = apiStory
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0)
      .map(
        (sentence) =>
          sentence.trim() +
          (sentence.trim().endsWith(".") ||
          sentence.trim().endsWith("!") ||
          sentence.trim().endsWith("?")
            ? ""
            : ".")
      );

    console.log("📝 Story Text:");
    console.log(`"${apiStory}"`);
    console.log(`🔄 Is Continuation: ${isContinuation}`);

    console.log(`\n🔢 Total sentences extracted: ${sentences.length}`);
    console.log("📋 All Story Sentences:");
    sentences.forEach((sentence, index) => {
      console.log(`  ${index + 1}. "${sentence}"`);
    });

    if (!isContinuation) {
      // First story - reset everything
      setFetchedStory(apiStory);
      setAllStorySentences(sentences);
      setCurrentStoryVersion(0);

      console.log(
        "🆕 New story setup complete - clearing any existing arrangements"
      );
      // Clear any existing arrangements when processing a new story
      setTopSentences([]);
      setBottomSentences([]);
    } else {
      // Continuation - update the fetched story and sentences
      setFetchedStory(apiStory);
      setAllStorySentences(sentences);
      setCurrentStoryVersion((prev) => prev + 1);
    }

    // For the first stage, use ALL sentences from the story
    // Create only one stage with all sentences for now
    const newStoryStages = [sentences]; // All sentences in first stage

    // Use the processed story stages for gameplay
    if (newStoryStages.length > 0) {
      setStoryStages(newStoryStages);
      console.log("\n✅ Story stages created successfully");
      console.log(`📊 Number of stages: ${newStoryStages.length}`);
      console.log(`📊 Sentences in first stage: ${newStoryStages[0].length}`);
    } else {
      // Fallback to hardcoded stages if processing fails
      setStoryStages(fallbackStoryStages);
      setAllStorySentences(fallbackStoryStages.flat()); // Store fallback sentences
      console.log("⚠️ Using fallback story stages");
    }

    console.log("=".repeat(50));

    // ✅ FIXED: Fetch permutations for BOTH initial stories AND continuations
    console.log(
      `🔄 Fetching permutations for ${
        isContinuation ? "continuation" : "initial"
      } story...`
    );
    await fetchStoryPermutations(apiStory);
  };

  // Function to fetch story from API
  const fetchStory = async () => {
    try {
      setIsLoadingStory(true);
      setStoryError("");

      // Use dynamic request data based on user selections
      const requestData = createStoryRequestData();

      console.log(
        "🚀 Fetching story from API with user-selected parameters..."
      );
      console.log("📤 Request Data:", JSON.stringify(requestData, null, 2));

      const response = await axios.post(
        "https://rp-creativewriting-production.up.railway.app/short-permutable-story",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.story) {
        processApiStory(response.data.story);
      } else {
        throw new Error("No story in response");
      }
    } catch (error) {
      console.error("Error fetching story:", error);
      setStoryError("Failed to fetch story. Using sample story.");

      // Keep fallback story stages
      setStoryStages(fallbackStoryStages);
      setAllStorySentences(fallbackStoryStages.flat()); // Store fallback sentences
    } finally {
      setIsLoadingStory(false);
    }
  };

  // Fetch story when component mounts
  useEffect(() => {
    fetchStory();
  }, []);

  // Enhance scrolling whenever sentences change
  useEffect(() => {
    const timer = setTimeout(() => {
      enhanceScrolling();
      
      // Auto-scroll to show new content when sentences are added
      if (topSentences.length > 0 && topScrollViewRef.current) {
        topScrollViewRef.current.scrollToEnd({ animated: true });
      }
      if (bottomSentences.length > 0 && bottomScrollViewRef.current) {
        bottomScrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [topSentences, bottomSentences]);

  const startCall = () => {
    if (storyStages.length > 0) {
      setIsCallStarted(true);
      resetStage(0);
    }
  };

  const resetStage = (stage) => {
    if (storyStages.length > 0) {
      // ✅ ALWAYS use ALL sentences from the current story for every stage
      const allSentences = allStorySentences;

      console.log("🎮 STAGE RESET - Setting up gameplay");
      console.log(`📍 Resetting to stage: ${stage + 1}`);
      console.log(`📊 Total sentences available: ${allSentences.length}`);
      console.log("📋 All sentences for this stage:");
      allSentences.forEach((sentence, index) => {
        console.log(`  ${index + 1}. "${sentence}"`);
      });

      // Ensure top section is completely cleared before setting new bottom sentences
      setTopSentences([]);

      // Shuffle the sentences randomly for bottom section
      const shuffledSentences = [...allSentences].sort(
        () => Math.random() - 0.5
      );
      setBottomSentences(shuffledSentences);

      console.log("✅ Stage reset complete - all sentences shuffled and ready");
      console.log(
        "🧹 Top section cleared, bottom section populated with new sentences"
      );
    } else {
      console.log("⚠️ No story stages available for reset");
    }
  };

  const handleDragEnd = (index, yPosition) => {
    if (yPosition < height * 0.6) {
      // Move to top section
      const movedSentence = bottomSentences[index];
      setTopSentences([...topSentences, movedSentence]);
      setBottomSentences(bottomSentences.filter((_, i) => i !== index));
    }
  };

  const removeSentence = (index) => {
    const removedSentence = topSentences[index];
    setTopSentences(topSentences.filter((_, i) => i !== index));
    setBottomSentences([...bottomSentences, removedSentence]);
  };

  const rearrangeSentences = (fromIndex, yPosition) => {
    const toIndex = Math.min(
      Math.max(Math.floor((yPosition - height * 0.1) / 50), 0),
      topSentences.length - 1
    );
    if (fromIndex !== toIndex) {
      const newTopSentences = [...topSentences];
      const [reorderedItem] = newTopSentences.splice(fromIndex, 1);
      newTopSentences.splice(toIndex, 0, reorderedItem);
      setTopSentences(newTopSentences);
    }
  };

  const showSuccessAnimation = () => {
    setShowSuccess(true);
    successScale.value = withSequence(
      withTiming(1.2, { duration: 500 }),
      withTiming(1, { duration: 300 }),
      withDelay(
        1000,
        withTiming(0, { duration: 300 }, () => {
          runOnJS(setShowSuccess)(false);
        })
      )
    );
  };

  const showFeedbackMessage = (message, isSuccess = true) => {
    setFeedbackMessage(message);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  const getCreativeFeedback = (
    validityScore,
    creativityScore,
    isSuccess = true
  ) => {
    if (isSuccess) {
      if (creativityScore === 0) {
        return "🎯 Your arrangement works perfectly! The story flows well - ready for the next adventure?";
      } else if (creativityScore < 0.3) {
        return "✨ Nice work! Your story arrangement shows good understanding. Let's see what happens next!";
      } else {
        return "🌟 Brilliant storytelling! Your creative arrangement brings the tale to life beautifully!";
      }
    } else {
      const messages = [
        "🤔 Hmm, that arrangement doesn't quite capture the story's flow. Let's try a fresh tale!",
        "📖 The story pieces need a different order. Time for a new magical adventure!",
        "✨ Those sentences want to tell a different story. Let's find a new one together!",
        "🎭 The tale isn't flowing quite right. Ready for a brand new adventure?",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  };

  const checkAnswer = async () => {
    if (storyStages.length === 0) return;

    console.log("🎮 GAME CHECK ANSWER - Starting Evaluation");
    console.log("-".repeat(60));

    // Start evaluation loading
    setIsEvaluating(true);

    // For evaluation, always use ALL sentences from the current story
    const currentStageSentences = allStorySentences;

    console.log(`📍 Current Stage: ${currentStage + 1}`);
    console.log("🎯 All Available Sentences for Arrangement:");
    currentStageSentences.forEach((sentence, index) => {
      console.log(`  ${index + 1}. "${sentence}"`);
    });

    console.log("\n👦 User's Arrangement (Top Sentences):");
    topSentences.forEach((sentence, index) => {
      console.log(`  ${index + 1}. "${sentence}"`);
    });

    console.log(
      `\n📊 Total sentences in user arrangement: ${topSentences.length}`
    );
    console.log(
      `📊 Total sentences available: ${currentStageSentences.length}`
    );

    // Evaluate the child's permutation using the API
    console.log("\n🔄 Starting API evaluation...");
    const evaluationResult = await evaluatePermutation(topSentences);

    // Stop evaluation loading
    setIsEvaluating(false);

    // Check validity score for progression logic
    const validityScore = evaluationResult.validity_score;
    const creativityScore = evaluationResult.creativity_score;

    console.log(`\n🎯 Validity Score: ${validityScore}`);
    console.log(`🎯 Creativity Score: ${creativityScore}`);
    console.log(`🎯 Threshold for progression: >= 0.25`);

    if (validityScore >= 0.25) {
      console.log(
        "✅ Validity score >= 0.25 - Progressing to next stage with story continuation"
      );

      // Show success animation and feedback
      showSuccessAnimation();
      const successMessage = getCreativeFeedback(
        validityScore,
        creativityScore,
        true
      );
      showFeedbackMessage(successMessage, true);

      setTimeout(async () => {
        setShowSuccess(false);
        setIsGeneratingStory(true);

        // Get story continuation
        const continuationData = await getStoryContinuation(
          validityScore,
          creativityScore
        );

        if (continuationData && continuationData.story) {
          console.log("📖 Processing story continuation for next stage");

          // Process the continuation and add to existing story
          await processApiStory(continuationData.story, true);

          // Stay on current stage but reset it with new story content
          resetStage(currentStage);

          setIsGeneratingStory(false);

          // Show continuation success message
          showFeedbackMessage(
            "📖 Your adventure continues with new magical challenges!",
            true
          );
        } else {
          console.log(
            "❌ Failed to get story continuation, staying on current stage"
          );
          setIsGeneratingStory(false);

          showFeedbackMessage(
            "⚡ The story magic is recharging - try arranging again to continue!",
            false
          );
        }
      }, 1500);
    } else {
      console.log(
        "❌ Validity score < 0.25 - Resetting to stage 1 with new story"
      );

      const failureMessage = getCreativeFeedback(
        validityScore,
        creativityScore,
        false
      );
      showFeedbackMessage(failureMessage, false);

      setTimeout(async () => {
        setIsGeneratingStory(true);

        console.log("🧹 Starting complete reset process...");
        await resetToFirstStageWithNewStory();

        setIsGeneratingStory(false);

        console.log(
          "✅ Reset complete - new story ready for child interaction"
        );
        showFeedbackMessage(
          "🔄 A brand new magical tale awaits your storytelling skills!",
          true
        );
      }, 2000);
    }

    console.log("-".repeat(60));
  };

  const stopAttempt = () => {
    // setIsCallStarted(false)
    // setCurrentStage(0)
    // setTopSentences([])
    // setBottomSentences([])
    router.push("/(tabs)/RepetitiveBehavior/Scorecard");
  };

  const restartAttempt = () => {
    setCurrentStage(0);
    resetStage(0);
  };

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }));

  // Show loading screen while fetching story
  if (isLoadingStory) {
    return (
      <LinearGradient colors={["#1E88E5", "#4ECDC4"]} style={styles.container}>
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Image
              source={require("../../assets/images/fun-loading.gif")}
              style={styles.loadingGif}
            />
            <Text style={styles.loadingText}>
              Creating your magical story...
            </Text>
            <Text style={styles.loadingSubtext}>
              Please wait while we generate your adventure
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (!isCallStarted) {
    return (
      <LinearGradient
        colors={["rgba(33,150,243,0.7)", "rgba(33,150,243,0.3)"]}
        style={styles.overlay}
      >
        <View style={styles.startContent}>
          <Text style={styles.startTitle}>
            Are you ready <Text style={styles.centerText}>adventurer?</Text>
          </Text>
          <Text style={styles.startSubtitle}>
            Arrange the sentences to create a story
          </Text>

          {/* Show selected story parameters */}
          <View style={styles.storyParametersContainer}>
            <Text style={styles.parametersTitle}>Your Story Elements:</Text>

            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>🎭 Themes:</Text>
              <Text style={styles.parameterValue}>
                {selectedThemes.join(", ")}
              </Text>
            </View>

            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>👥 Characters:</Text>
              <Text style={styles.parameterValue}>
                {selectedCharacters.join(", ")}
              </Text>
            </View>

            <View style={styles.parameterRow}>
              <Text style={styles.parameterLabel}>🏞️ Settings:</Text>
              <Text style={styles.parameterValue}>
                {selectedSettings.join(", ")}
              </Text>
            </View>
          </View>

          {/* Show fetched story preview if available */}
          {fetchedStory && (
            <View style={styles.storyPreview}>
              <Text style={styles.storyPreviewTitle}>
                Your Generated Story:
              </Text>
              <ScrollView
                style={styles.storyPreviewScroll}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.storyPreviewText}>{fetchedStory}</Text>
              </ScrollView>
            </View>
          )}

          {storyError && (
            <Text style={styles.warningText}>⚠️ {storyError}</Text>
          )}

          {/* Debug: Show evaluation results if any exist */}
          {evaluationResults.length > 0 && (
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => {
                console.log("🏆 EVALUATION RESULTS SUMMARY");
                console.log("=".repeat(60));

                evaluationResults.forEach((result, index) => {
                  console.log(`📊 Result ${index + 1}:`);
                  console.log(`  Stage: ${result.stage}`);
                  console.log(`  Timestamp: ${result.timestamp}`);
                  console.log(`  Validity Score: ${result.validity_score}`);
                  console.log(`  Creativity Score: ${result.creativity_score}`);
                  console.log(`  Final Score: ${result.final_score}`);
                  console.log(`  Child Permutation:`);
                  result.child_permutation.forEach((sentence, sentIndex) => {
                    console.log(`    ${sentIndex + 1}. "${sentence}"`);
                  });
                  console.log("");
                });

                console.log("=".repeat(60));

                // Show detailed alert
                const detailedResults = evaluationResults
                  .map(
                    (result) =>
                      `Stage ${result.stage}:\n` +
                      `  Validity: ${result.validity_score.toFixed(3)}\n` +
                      `  Creativity: ${result.creativity_score.toFixed(3)}\n` +
                      `  Final: ${result.final_score.toFixed(3)}`
                  )
                  .join("\n\n");

                alert(`📊 Detailed Evaluation Results:\n\n${detailedResults}`);
              }}
            >
              <Text style={styles.debugButtonText}>
                View Scores ({evaluationResults.length})
              </Text>
            </TouchableOpacity>
          )}

          {/* Debug: Show story continuations if any exist */}
          {storyContinuations.length > 0 && (
            <TouchableOpacity
              style={[
                styles.debugButton,
                { backgroundColor: "rgba(76, 175, 80, 0.8)" },
              ]}
              onPress={() => {
                console.log("📚 STORY CONTINUATIONS SUMMARY");
                console.log("=".repeat(60));

                storyContinuations.forEach((continuation, index) => {
                  console.log(`📖 Continuation ${index + 1}:`);
                  console.log(`  Version: ${continuation.version}`);
                  console.log(`  Timestamp: ${continuation.timestamp}`);
                  console.log(
                    `  Complexity Level: ${continuation.complexity_level}`
                  );
                  console.log(`  Story: "${continuation.story}"`);
                  console.log("");
                });

                console.log("=".repeat(60));

                const continuationSummary = storyContinuations
                  .map(
                    (cont, index) =>
                      `Chapter ${index + 1} (v${cont.version}):\n` +
                      `Complexity: ${cont.complexity_level}\n` +
                      `"${cont.story.substring(0, 100)}..."`
                  )
                  .join("\n\n");

                alert(`📚 Story Continuations:\n\n${continuationSummary}`);
              }}
            >
              <Text style={styles.debugButtonText}>
                Story Chapters ({storyContinuations.length})
              </Text>
            </TouchableOpacity>
          )}

          {/* Show current story version */}
          {currentStoryVersion > 0 && (
            <View style={styles.versionIndicator}>
              <Text style={styles.versionText}>
                📖 Story Version: {currentStoryVersion + 1}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.startButton,
              storyStages.length === 0 && styles.disabledButton,
            ]}
            onPress={startCall}
            disabled={storyStages.length === 0}
          >
            <Text style={styles.startButtonText}>Start Game</Text>
            <Feather
              name="play"
              size={24}
              color="#fff"
              style={styles.startButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={["#1E88E5", "#4ECDC4"]} style={styles.background}>
        <View style={styles.header}>
          <View style={styles.stageIndicator}>
            <Text style={styles.stageText}>
              Stage: {currentStage + 1} / {storyStages.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((currentStage + 1) / storyStages.length) * 100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
          <Text style={styles.instructions}>
            Arrange the sentences in the correct order
          </Text>
        </View>

        <View style={styles.topSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Story</Text>
            <View style={styles.scrollControls}>
              <TouchableOpacity
                style={styles.scrollButton}
                onPress={() => scrollToTop(topScrollViewRef)}
              >
                <Feather name="chevron-up" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scrollButton}
                onPress={() => scrollToBottom(topScrollViewRef)}
              >
                <Feather name="chevron-down" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            ref={topScrollViewRef}
            showsVerticalScrollIndicator={true}
            indicatorStyle="white"
            contentContainerStyle={styles.topScrollContent}
            nestedScrollEnabled={true}
            scrollEventThrottle={16}
            bounces={true}
            alwaysBounceVertical={true}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
            decelerationRate="normal"
            maximumZoomScale={1}
            minimumZoomScale={1}
            scrollEnabled={true}
            directionalLockEnabled={true}
          >
            {topSentences.map((sentence, index) => (
              <DraggableSentence
                key={`top-${index}`}
                sentence={sentence}
                index={index}
                onDragEnd={() => {}}
                isInTopSection={true}
                onRemove={removeSentence}
                onRearrange={rearrangeSentences}
              />
            ))}
            {topSentences.length === 0 && (
              <View style={styles.emptyState}>
                <Feather name="arrow-up" size={24} color="#fff" />
                <Text style={styles.emptyStateText}>Drag sentences here</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Sentences</Text>
            <View style={styles.scrollControls}>
              <TouchableOpacity
                style={styles.scrollButton}
                onPress={() => scrollToTop(bottomScrollViewRef)}
              >
                <Feather name="chevron-up" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scrollButton}
                onPress={() => scrollToBottom(bottomScrollViewRef)}
              >
                <Feather name="chevron-down" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            ref={bottomScrollViewRef}
            showsVerticalScrollIndicator={true}
            indicatorStyle="white"
            contentContainerStyle={styles.bottomScrollContent}
            nestedScrollEnabled={true}
            scrollEventThrottle={16}
            bounces={true}
            alwaysBounceVertical={true}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false}
            decelerationRate="normal"
            maximumZoomScale={1}
            minimumZoomScale={1}
            scrollEnabled={true}
            directionalLockEnabled={true}
          >
            {bottomSentences.map((sentence, index) => (
              <DraggableSentence
                key={`bottom-${index}`}
                sentence={sentence}
                index={index}
                onDragEnd={handleDragEnd}
                isInTopSection={false}
                onRemove={() => {}}
                onRearrange={() => {}}
              />
            ))}
            {bottomSentences.length === 0 && (
              <View style={styles.emptyState}>
                <Feather name="check-circle" size={24} color="#fff" />
                <Text style={styles.emptyStateText}>All sentences used!</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.checkButton]}
            onPress={checkAnswer}
          >
            <Feather name="check" color="#fff" size={24} />
            <Text style={styles.actionButtonText}>Check</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.restartButton]}
            onPress={restartAttempt}
          >
            <Feather name="rotate-ccw" color="#fff" size={24} />
            <Text style={styles.actionButtonText}>Restart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.exitButton]}
            onPress={stopAttempt}
          >
            <Feather name="x" color="#fff" size={24} />
            <Text style={styles.actionButtonText}>Exit</Text>
          </TouchableOpacity>
        </View>

        {showSuccess && (
          <Animated.View style={[styles.successOverlay, successAnimatedStyle]}>
            <View style={styles.successContent}>
              <Feather name="check-circle" size={60} color="#2196F3" />
              <Text style={styles.successText}>
                🌟 Excellent storytelling! Your adventure continues...
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Feedback Message Overlay */}
        {showFeedback && (
          <View style={styles.feedbackOverlay}>
            <View
              style={[
                styles.feedbackContent,
                feedbackMessage.includes("🤔")
                  ? styles.feedbackError
                  : styles.feedbackSuccess,
              ]}
            >
              <Text style={styles.feedbackText}>{feedbackMessage}</Text>
            </View>
          </View>
        )}

        {/* Evaluation Loading */}
        {isEvaluating && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <Image
                source={require("../../assets/images/fun-loading.gif")}
                style={styles.loadingGif}
              />
              <Text style={styles.loadingText}>
                Checking your story arrangement...
              </Text>
              <Text style={styles.loadingSubtext}>
                Analyzing creativity and flow
              </Text>
            </View>
          </View>
        )}

        {/* Story Generation Loading */}
        {isGeneratingStory && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <Image
                source={require("../../assets/images/fun-loading.gif")}
                style={styles.loadingGif}
              />
              <Text style={styles.loadingText}>Weaving new story magic...</Text>
              <Text style={styles.loadingSubtext}>
                Creating your next adventure
              </Text>
            </View>
          </View>
        )}

        {/* General Loading (fallback) */}
        {isLoading && !isEvaluating && !isGeneratingStory && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <Image
                source={require("../../assets/images/fun-loading.gif")}
                style={styles.loadingGif}
              />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 15,
  },
  startContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  startContent: {
    alignItems: "center",
    padding: 20,
    width: "90%",
  },
  startTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  centerText: {
    textAlign: "center",
  },
  startSubtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // New styles for story preview
  storyPreview: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    width: "100%",
    maxHeight: 200,
  },
  storyPreviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 10,
    textAlign: "center",
  },
  storyPreviewScroll: {
    maxHeight: 120,
  },
  storyPreviewText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    textAlign: "center",
  },
  warningText: {
    fontSize: 14,
    color: "#FFF3CD",
    textAlign: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    borderRadius: 10,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#2196F3",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10,
  },
  startButtonIcon: {
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  debugButton: {
    backgroundColor: "rgba(255, 193, 7, 0.8)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  debugButtonText: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  versionIndicator: {
    backgroundColor: "rgba(156, 39, 176, 0.8)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  versionText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  header: {
    marginBottom: 15,
  },
  stageIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  stageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 4,
  },
  instructions: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scrollControls: {
    flexDirection: "row",
    gap: 5,
  },
  scrollButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  topSection: {
    flex: 0.45,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    minHeight: 200,
  },
  bottomSection: {
    flex: 0.35,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
    minHeight: 150,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  topScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 5,
    paddingHorizontal: 2,
    minHeight: 200,
  },
  bottomScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 5,
    paddingHorizontal: 2,
    minHeight: 150,
  },
  sentence: {
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 50,
  },
  sentenceGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
  },
  topSentence: {
    borderLeftWidth: 5,
    borderLeftColor: "#4ECDC4",
  },
  bottomSentence: {
    borderLeftWidth: 5,
    borderLeftColor: "#2196F3",
  },
  sentenceText: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  removeButton: {
    backgroundColor: "rgba(255, 107, 107, 0.8)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    opacity: 0.7,
  },
  emptyStateText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  checkButton: {
    backgroundColor: "#2196F3",
  },
  restartButton: {
    backgroundColor: "#64B5F6",
  },
  exitButton: {
    backgroundColor: "#0D47A1",
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  successContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 15,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(33, 150, 243, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: "80%",
  },
  loadingGif: {
    width: 150,
    height: 135,
    marginBottom: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#2196F3",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  feedbackOverlay: {
    position: "absolute",
    top: "15%",
    left: "10%",
    right: "10%",
    zIndex: 20,
    alignItems: "center",
  },
  feedbackContent: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    minWidth: "80%",
  },
  feedbackSuccess: {
    backgroundColor: "rgba(76, 175, 80, 0.95)",
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  feedbackError: {
    backgroundColor: "rgba(255, 152, 0, 0.95)",
    borderColor: "#FF9800",
    borderWidth: 2,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  feedbackOverlay: {
    position: "absolute",
    top: "15%",
    left: "10%",
    right: "10%",
    zIndex: 20,
    alignItems: "center",
  },
  feedbackContent: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    minWidth: "80%",
  },
  feedbackSuccess: {
    backgroundColor: "rgba(76, 175, 80, 0.95)",
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  feedbackError: {
    backgroundColor: "rgba(255, 152, 0, 0.95)",
    borderColor: "#FF9800",
    borderWidth: 2,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#2196F3",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  // Story parameters display styles
  storyParametersContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    margin: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parametersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E88E5",
    textAlign: "center",
    marginBottom: 12,
  },
  parameterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  parameterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    minWidth: 80,
  },
  parameterValue: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    flexWrap: "wrap",
  },
});

export default StoryScreen;
